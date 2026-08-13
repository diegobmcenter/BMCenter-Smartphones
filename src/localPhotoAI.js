let segmenterPromise=null;

const WASM_ROOT='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm';
const MODEL_URL='https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite';

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
  onProgress?.('Carregando MediaPipe MagicTouch...');
  const {FilesetResolver,InteractiveSegmenter}=await import('@mediapipe/tasks-vision');
  const vision=await FilesetResolver.forVisionTasks(WASM_ROOT);
  try{
   return await InteractiveSegmenter.createFromOptions(vision,{
    baseOptions:{modelAssetPath:MODEL_URL,delegate:'GPU'},
    outputCategoryMask:true,
    outputConfidenceMasks:false
   });
  }catch(gpuError){
   console.warn('MagicTouch GPU indisponível; usando CPU.',gpuError);
   return InteractiveSegmenter.createFromOptions(vision,{
    baseOptions:{modelAssetPath:MODEL_URL,delegate:'CPU'},
    outputCategoryMask:true,
    outputConfidenceMasks:false
   });
  }
 })();
 try{return await segmenterPromise}catch(error){segmenterPromise=null;throw error}
}

function getMaskArray(mask){
 if(!mask)throw new Error('MagicTouch não retornou máscara.');
 if(typeof mask.getAsUint8Array==='function')return mask.getAsUint8Array();
 if(typeof mask.getAsFloat32Array==='function'){
  const f=mask.getAsFloat32Array();const u=new Uint8Array(f.length);
  for(let i=0;i<f.length;i++)u[i]=f[i]>=.5?1:0;
  return u;
 }
 throw new Error('Formato de máscara do MagicTouch não reconhecido.');
}

function buildSafeMask(categoryMask,targetW,targetH){
 const mw=categoryMask.width,mh=categoryMask.height;
 const data=getMaskArray(categoryMask);
 const low=document.createElement('canvas');low.width=mw;low.height=mh;
 const lctx=low.getContext('2d',{willReadFrequently:true});
 const id=lctx.createImageData(mw,mh);
 let foreground=0;
 for(let i=0;i<mw*mh;i++){
  const keep=data[i]>0;
  if(keep)foreground++;
  const j=i*4;
  id.data[j]=255;id.data[j+1]=255;id.data[j+2]=255;id.data[j+3]=keep?255:0;
 }
 lctx.putImageData(id,0,0);
 const coverage=foreground/(mw*mh);
 if(coverage<.02||coverage>.97)throw new Error(`Recorte inseguro (${Math.round(coverage*100)}%). Toque no aparelho para corrigir o recorte.`);

 const scaled=document.createElement('canvas');scaled.width=targetW;scaled.height=targetH;
 const sctx=scaled.getContext('2d');sctx.imageSmoothingEnabled=false;
 sctx.drawImage(low,0,0,targetW,targetH);

 // Expansão apenas para fora: protege bordas do smartphone.
 const radius=Math.max(2,Math.min(8,Math.round(Math.min(targetW,targetH)*.0025)));
 const expanded=document.createElement('canvas');expanded.width=targetW;expanded.height=targetH;
 const ectx=expanded.getContext('2d');ectx.imageSmoothingEnabled=false;
 for(let y=-radius;y<=radius;y++)for(let x=-radius;x<=radius;x++){
  if(x*x+y*y<=radius*radius)ectx.drawImage(scaled,x,y);
 }
 return expanded;
}

function palette(scene){
 const seed=hashText(`${scene?.style||''}:${scene?.signature||0}`);
 const list=[
  ['#f7f7f5','#e1e6ea','#b6c3cd'],['#f8f1e8','#e2d2bf','#bca17d'],
  ['#121820','#27313d','#53677c'],['#181513','#332b25','#9a785a'],
  ['#eef3f1','#d3dfdb','#9bb8ae'],['#f1efeb','#d9d4ca','#aaa292'],
  ['#f7f8fa','#dce2e9','#aeb9c7'],['#f8f3eb','#e8d8c4','#c3a37e']
 ];
 return list[seed%list.length];
}

function drawScene(ctx,w,h,scene){
 const [a,b,c]=palette(scene);
 const g=ctx.createLinearGradient(0,0,w,h);
 g.addColorStop(0,a);g.addColorStop(.65,b);g.addColorStop(1,c);
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const seed=hashText(scene?.id||'');
 const lx=seed%2?w*.22:w*.78;
 const glow=ctx.createRadialGradient(lx,h*.16,0,lx,h*.16,Math.max(w,h)*.58);
 glow.addColorStop(0,'rgba(255,255,255,.55)');glow.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 const floorY=h*.80;
 const fg=ctx.createLinearGradient(0,floorY,0,h);
 fg.addColorStop(0,'rgba(255,255,255,.04)');fg.addColorStop(1,'rgba(0,0,0,.16)');
 ctx.fillStyle=fg;ctx.fillRect(0,floorY,w,h-floorY);
 ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(0,floorY,w,2);
}

async function segment(image,point,onProgress){
 const segmenter=await getSegmenter(onProgress);
 const safePoint={
  x:Math.max(.01,Math.min(.99,Number(point?.x??.5))),
  y:Math.max(.01,Math.min(.99,Number(point?.y??.5)))
 };
 onProgress?.(`MagicTouch · recortando a partir do ponto ${Math.round(safePoint.x*100)}%, ${Math.round(safePoint.y*100)}%...`);
 return await new Promise((resolve,reject)=>{
  try{
   segmenter.segment(image,{keypoint:safePoint},result=>resolve(result));
  }catch(error){reject(error)}
 });
}

async function composeOriginal(image,categoryMask,{scene,onProgress}){
 const w=image.naturalWidth||image.width,h=image.naturalHeight||image.height;
 const mask=buildSafeMask(categoryMask,w,h);

 const cut=document.createElement('canvas');cut.width=w;cut.height=h;
 const cctx=cut.getContext('2d',{alpha:true});
 cctx.drawImage(image,0,0); // EXATAMENTE a original, 1:1
 cctx.globalCompositeOperation='destination-in';
 cctx.drawImage(mask,0,0);
 cctx.globalCompositeOperation='source-over';

 const out=document.createElement('canvas');out.width=w;out.height=h;
 const ctx=out.getContext('2d',{alpha:false});
 drawScene(ctx,w,h,scene);
 ctx.drawImage(cut,0,0); // nenhum resize do aparelho

 onProgress?.('Compondo cenário sem redesenhar o aparelho...');
 return out.toDataURL('image/jpeg',.995);
}

export const LOCAL_AI_ENGINES=[
 {id:'magictouch',name:'MagicTouch · Google MediaPipe',description:'Segmentação interativa local. Toque no aparelho se o recorte automático não ficar correto.'}
];

export async function preparePhotoLocally(imageData,{scene={},point=null,onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');
 const image=await imageFromDataUrl(imageData);
 try{
  const result=await segment(image,point||{x:.5,y:.5},onProgress);
  const mask=result?.categoryMask;
  if(!mask)throw new Error('MagicTouch não retornou a máscara do aparelho.');
  const output=await composeOriginal(image,mask,{scene,onProgress});
  try{mask.close?.()}catch{}
  return output;
 }catch(error){
  console.error('BMCenter MagicTouch',error);
  throw new Error(`MagicTouch: ${String(error?.message||error||'erro desconhecido')}`);
 }
}

export function clearLocalAIModelCache(){segmenterPromise=null}
