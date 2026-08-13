let segmenterPromise=null;

const MEDIAPIPE_VERSION='0.10.35';
const WASM_ROOT=`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL='https://storage.googleapis.com/mediapipe-tasks/interactive_segmenter/ptm_512_hdt_ptm_woid.tflite';

function imageFromDataUrl(source){
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>resolve(img);
  img.onerror=()=>reject(new Error('Não foi possível abrir a foto original.'));
  img.src=source;
 });
}

function hashText(text){
 let h=2166136261;
 for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return Math.abs(h>>>0);
}

async function getSegmenter(onProgress){
 if(segmenterPromise)return segmenterPromise;
 segmenterPromise=(async()=>{
  onProgress?.('Carregando MediaPipe Interactive Segmenter...');
  const {FilesetResolver,InteractiveSegmenter}=await import('@mediapipe/tasks-vision');
  const vision=await FilesetResolver.forVisionTasks(WASM_ROOT);

  // CPU first: more compatible across Android/desktop WebGL implementations.
  return InteractiveSegmenter.createFromOptions(vision,{
   baseOptions:{modelAssetPath:MODEL_URL,delegate:'CPU'},
   outputCategoryMask:true,
   outputConfidenceMasks:false
  });
 })();
 try{return await segmenterPromise}
 catch(error){segmenterPromise=null;throw error}
}

function maskCanvasFromSnapshot(snapshot,targetW,targetH){
 const {data,width,height,targetLabel}=snapshot;
 if(!data||!width||!height)throw new Error('Máscara vazia.');

 const low=document.createElement('canvas');
 low.width=width;low.height=height;
 const ctx=low.getContext('2d',{willReadFrequently:true});
 const img=ctx.createImageData(width,height);

 let count=0;
 for(let i=0;i<width*height;i++){
  const keep=data[i]===targetLabel;
  if(keep)count++;
  const j=i*4;
  img.data[j]=255;img.data[j+1]=255;img.data[j+2]=255;img.data[j+3]=keep?255:0;
 }
 ctx.putImageData(img,0,0);

 const coverage=count/(width*height);
 if(coverage<.018||coverage>.975){
  throw new Error(`Recorte inseguro (${Math.round(coverage*100)}%). Toque em outra área do aparelho.`);
 }

 // Upscale nearest-neighbour so the object geometry is not blurred/deformed.
 const full=document.createElement('canvas');
 full.width=targetW;full.height=targetH;
 const fctx=full.getContext('2d');
 fctx.imageSmoothingEnabled=false;
 fctx.drawImage(low,0,0,targetW,targetH);

 // Conservative outward dilation: protects lens/borders without eroding the object.
 const radius=Math.max(2,Math.min(6,Math.round(Math.min(targetW,targetH)*.0018)));
 const safe=document.createElement('canvas');
 safe.width=targetW;safe.height=targetH;
 const sctx=safe.getContext('2d');
 sctx.imageSmoothingEnabled=false;
 for(let y=-radius;y<=radius;y++){
  for(let x=-radius;x<=radius;x++){
   if(x*x+y*y<=radius*radius)sctx.drawImage(full,x,y);
  }
 }
 return safe;
}

async function snapshotMask(image,point,onProgress){
 const segmenter=await getSegmenter(onProgress);
 const roi={
  keypoint:{
   x:Math.max(.01,Math.min(.99,Number(point?.x??.5))),
   y:Math.max(.01,Math.min(.99,Number(point?.y??.5)))
  }
 };

 onProgress?.(`Detectando aparelho em ${Math.round(roi.keypoint.x*100)}%, ${Math.round(roi.keypoint.y*100)}%...`);

 // IMPORTANT: MediaPipe result data is guaranteed only during the callback.
 // Copy the bytes immediately, before returning from the callback.
 return new Promise((resolve,reject)=>{
  try{
   segmenter.segment(image,roi,result=>{
    try{
     const mask=result?.categoryMask;
     if(!mask)throw new Error('MediaPipe não retornou categoryMask.');

     let data;
     if(typeof mask.getAsUint8Array==='function'){
      const src=mask.getAsUint8Array();
      data=new Uint8Array(src.length);
      data.set(src);
     }else if(typeof mask.getAsFloat32Array==='function'){
      const src=mask.getAsFloat32Array();
      data=new Uint8Array(src.length);
      for(let i=0;i<src.length;i++)data[i]=src[i]>=.5?1:0;
     }else{
      throw new Error('Formato de máscara não suportado pelo navegador.');
     }

     const width=mask.width||result.width||image.naturalWidth||image.width;
     const height=mask.height||result.height||image.naturalHeight||image.height;
     if(data.length!==width*height)throw new Error(`Máscara com tamanho inesperado (${data.length} pixels para ${width}x${height}).`);

     const px=Math.max(0,Math.min(width-1,Math.floor(roi.keypoint.x*width)));
     const py=Math.max(0,Math.min(height-1,Math.floor(roi.keypoint.y*height)));
     const targetLabel=data[py*width+px];

     resolve({data,width,height,targetLabel,point:roi.keypoint});
    }catch(error){reject(error)}
   });
  }catch(error){reject(error)}
 });
}

function palette(scene){
 const seed=hashText(`${scene?.style||''}:${scene?.signature||0}`);
 const list=[
  ['#f8f8f6','#e4e8ec','#b9c5cf'],
  ['#faf3e9','#e5d5c0','#b79872'],
  ['#121820','#293441','#596f84'],
  ['#191512','#372d25','#997456'],
  ['#eef4f1','#d2e1dc','#98b9ae'],
  ['#f3f0ea','#dad4c8','#aaa08d'],
  ['#f7f9fb','#dbe2ec','#9caabd'],
  ['#17191d','#2b3038','#737d89']
 ];
 return list[seed%list.length];
}

function drawScene(ctx,w,h,scene){
 const [a,b,c]=palette(scene);
 const g=ctx.createLinearGradient(0,0,w,h);
 g.addColorStop(0,a);g.addColorStop(.68,b);g.addColorStop(1,c);
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);

 const seed=hashText(scene?.id||'');
 const lx=seed%2?w*.23:w*.77;
 const glow=ctx.createRadialGradient(lx,h*.15,0,lx,h*.15,Math.max(w,h)*.6);
 glow.addColorStop(0,'rgba(255,255,255,.52)');
 glow.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);

 const floorY=h*.80;
 const floor=ctx.createLinearGradient(0,floorY,0,h);
 floor.addColorStop(0,'rgba(255,255,255,.035)');
 floor.addColorStop(1,'rgba(0,0,0,.16)');
 ctx.fillStyle=floor;ctx.fillRect(0,floorY,w,h-floorY);
 ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(0,floorY,w,2);
}

function composeFromOriginal(image,maskCanvas,scene,onProgress){
 const w=image.naturalWidth||image.width;
 const h=image.naturalHeight||image.height;
 if(!w||!h)throw new Error('Foto original sem dimensões válidas.');

 const cut=document.createElement('canvas');
 cut.width=w;cut.height=h;
 const cctx=cut.getContext('2d',{alpha:true});

 // Exact same original pixels at exact same coordinates.
 cctx.drawImage(image,0,0);
 cctx.globalCompositeOperation='destination-in';
 cctx.drawImage(maskCanvas,0,0);
 cctx.globalCompositeOperation='source-over';

 const out=document.createElement('canvas');
 out.width=w;out.height=h;
 const ctx=out.getContext('2d',{alpha:false});
 drawScene(ctx,w,h,scene);

 // No geometric transform on the phone.
 ctx.drawImage(cut,0,0);

 onProgress?.('Finalizando com pixels originais do aparelho...');
 return out.toDataURL('image/jpeg',.995);
}

export const LOCAL_AI_ENGINES=[
 {id:'mediapipe',name:'MediaPipe · Segmentação Interativa',description:'Modelo oficial Web do Google; usa um ponto dentro do aparelho.'}
];

export async function preparePhotoLocally(imageData,{scene={},point=null,onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');

 const image=await imageFromDataUrl(imageData);
 const w=image.naturalWidth||image.width;
 const h=image.naturalHeight||image.height;

 try{
  const snapshot=await snapshotMask(image,point||{x:.5,y:.5},onProgress);
  const mask=maskCanvasFromSnapshot(snapshot,w,h);
  return composeFromOriginal(image,mask,scene,onProgress);
 }catch(error){
  console.error('BMCenter MediaPipe Interactive Segmenter',error);
  throw new Error(`MediaPipe: ${String(error?.message||error||'erro desconhecido')}`);
 }
}

export function clearLocalAIModelCache(){segmenterPromise=null}
