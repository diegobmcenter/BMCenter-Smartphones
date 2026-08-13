let transformersPromise=null;
const engineCache=new Map();

function dataUrlToBlob(dataUrl){
 const [head,data]=String(dataUrl||'').split(',');
 const mime=(head.match(/data:([^;]+)/)||[])[1]||'image/jpeg';
 const bin=atob(data||'');
 const bytes=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
 return new Blob([bytes],{type:mime});
}

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

async function getTransformers(){
 if(!transformersPromise)transformersPromise=import('@huggingface/transformers');
 return transformersPromise;
}

async function loadISNet(onProgress){
 if(engineCache.has('isnet'))return engineCache.get('isnet');
 onProgress?.('Baixando/carregando ISNet (modo rápido)...');
 const {pipeline}=await getTransformers();
 const promise=pipeline('background-removal','onnx-community/ISNet-ONNX',{
  dtype:'q8',
  progress_callback:p=>{
   if(p?.status==='progress'&&Number.isFinite(p.progress))onProgress?.(`ISNet · modelo ${Math.round(p.progress)}%`)
  }
 });
 engineCache.set('isnet',promise);
 try{return await promise}catch(error){engineCache.delete('isnet');throw error}
}

async function loadBiRefNet(onProgress){
 if(engineCache.has('birefnet'))return engineCache.get('birefnet');
 onProgress?.('Baixando/carregando BiRefNet Lite (modo qualidade)...');
 const {AutoModel,AutoProcessor}=await getTransformers();
 const promise=Promise.all([
  AutoModel.from_pretrained('onnx-community/BiRefNet_lite-ONNX',{
   dtype:'fp16',
   progress_callback:p=>{
    if(p?.status==='progress'&&Number.isFinite(p.progress))onProgress?.(`BiRefNet · modelo ${Math.round(p.progress)}%`)
   }
  }),
  AutoProcessor.from_pretrained('onnx-community/BiRefNet_lite-ONNX')
 ]).then(([model,processor])=>({model,processor}));
 engineCache.set('birefnet',promise);
 try{return await promise}catch(error){engineCache.delete('birefnet');throw error}
}

function rawMaskToCanvas(raw){
 const canvas=document.createElement('canvas');
 canvas.width=raw.width;canvas.height=raw.height;
 const ctx=canvas.getContext('2d');
 const img=ctx.createImageData(raw.width,raw.height);
 const channels=raw.channels||1,data=raw.data;
 for(let i=0,j=0;i<raw.width*raw.height;i++,j+=4){
  const a=channels===1?data[i]:data[i*channels];
  img.data[j]=255;img.data[j+1]=255;img.data[j+2]=255;img.data[j+3]=a;
 }
 ctx.putImageData(img,0,0);
 return canvas;
}

async function maskWithISNet(blob,onProgress){
 const segmenter=await loadISNet(onProgress);
 onProgress?.('ISNet · detectando aparelho...');
 const output=await segmenter([blob]);
 const raw=output?.[0];
 if(!raw)throw new Error('ISNet não retornou máscara.');
 // BackgroundRemovalPipeline retorna RawImage com alfa/máscara.
 if(raw.channels===1)return rawMaskToCanvas(raw);
 if(raw.channels===4){
  const c=document.createElement('canvas');c.width=raw.width;c.height=raw.height;
  const ctx=c.getContext('2d');const img=ctx.createImageData(raw.width,raw.height);
  for(let i=0,j=0;i<raw.width*raw.height;i++,j+=4){
   const a=raw.data[i*4+3];
   img.data[j]=255;img.data[j+1]=255;img.data[j+2]=255;img.data[j+3]=a;
  }
  ctx.putImageData(img,0,0);return c;
 }
 return rawMaskToCanvas(raw.grayscale?raw.grayscale():raw);
}

async function maskWithBiRefNet(blob,onProgress){
 const {RawImage}=await getTransformers();
 const {model,processor}=await loadBiRefNet(onProgress);
 onProgress?.('BiRefNet · detectando aparelho...');
 const image=await RawImage.fromBlob(blob);
 const {pixel_values}=await processor(image);
 const result=await model({input_image:pixel_values});
 if(!result?.output_image)throw new Error('BiRefNet não retornou máscara.');
 let mask=RawImage.fromTensor(result.output_image[0].sigmoid().mul(255).to('uint8'));
 mask=await mask.resize(image.width,image.height);
 return rawMaskToCanvas(mask);
}

function safeExpandedMask(maskCanvas,w,h,margin=3){
 const out=document.createElement('canvas');out.width=w;out.height=h;
 const ctx=out.getContext('2d');
 ctx.imageSmoothingEnabled=true;
 // Desenha a máscara em offsets pequenos para recuperar bordas que o modelo possa cortar.
 const offsets=[];
 for(let y=-margin;y<=margin;y++)for(let x=-margin;x<=margin;x++)if(x*x+y*y<=margin*margin)offsets.push([x,y]);
 ctx.globalCompositeOperation='source-over';
 ctx.globalAlpha=1;
 for(const [x,y] of offsets)ctx.drawImage(maskCanvas,x,y,w,h);
 // suavização final
 ctx.filter='blur(0.7px)';
 ctx.drawImage(out,0,0);
 ctx.filter='none';
 return out;
}

function palette(scene){
 const seed=hashText(`${scene?.style||''}:${scene?.signature||0}`);
 const list=[
  ['#f7f7f5','#e1e6ea','#b6c3cd'],['#f8f1e8','#e2d2bf','#bca17d'],
  ['#121820','#27313d','#53677c'],['#181513','#332b25','#9a785a'],
  ['#eef3f1','#d3dfdb','#9bb8ae'],['#f1efeb','#d9d4ca','#aaa292']
 ];
 return list[seed%list.length];
}

function drawScene(ctx,w,h,scene){
 const [a,b,c]=palette(scene);
 const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,a);g.addColorStop(.68,b);g.addColorStop(1,c);
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const seed=hashText(scene?.id||'');
 const lx=seed%2?w*.25:w*.75;
 const glow=ctx.createRadialGradient(lx,h*.15,0,lx,h*.15,Math.max(w,h)*.62);
 glow.addColorStop(0,'rgba(255,255,255,.48)');glow.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 const floorY=h*.80;
 const fg=ctx.createLinearGradient(0,floorY,0,h);fg.addColorStop(0,'rgba(255,255,255,.04)');fg.addColorStop(1,'rgba(0,0,0,.17)');
 ctx.fillStyle=fg;ctx.fillRect(0,floorY,w,h-floorY);
 ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(0,floorY,w,2);
}

async function composeOriginalWithMask(imageData,maskCanvas,{scene,intensity,onProgress}){
 const original=await imageFromDataUrl(imageData);
 const ow=original.naturalWidth||original.width,oh=original.naturalHeight||original.height;
 const maxSide=3200,scale=Math.min(1,maxSide/Math.max(ow,oh));
 const w=Math.max(1,Math.round(ow*scale)),h=Math.max(1,Math.round(oh*scale));
 const mask=safeExpandedMask(maskCanvas,w,h,intensity==='Destaque'?4:3);

 const cut=document.createElement('canvas');cut.width=w;cut.height=h;
 const cctx=cut.getContext('2d');
 cctx.drawImage(original,0,0,w,h);
 cctx.globalCompositeOperation='destination-in';
 cctx.drawImage(mask,0,0,w,h);
 cctx.globalCompositeOperation='source-over';

 const out=document.createElement('canvas');out.width=w;out.height=h;
 const ctx=out.getContext('2d',{alpha:false});
 drawScene(ctx,w,h,scene);
 ctx.save();
 ctx.shadowColor='rgba(0,0,0,.30)';ctx.shadowBlur=Math.max(12,Math.round(w*.015));ctx.shadowOffsetY=Math.max(5,Math.round(h*.008));
 ctx.drawImage(cut,0,0,w,h);
 ctx.restore();
 ctx.drawImage(cut,0,0,w,h);
 onProgress?.('Finalizando em alta qualidade...');
 return out.toDataURL('image/jpeg',.98);
}

export const LOCAL_AI_ENGINES=[
 {id:'isnet',name:'ISNet · Rápido',description:'Mais leve. Download inicial ~44 MB em q8.'},
 {id:'birefnet',name:'BiRefNet Lite · Qualidade',description:'Mais pesado. Prioriza máscara e bordas.'}
];

export async function preparePhotoLocally(imageData,{scene={},intensity='Natural',engine='isnet',onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');
 const blob=dataUrlToBlob(imageData);
 let mask;
 try{
  mask=engine==='birefnet'?await maskWithBiRefNet(blob,onProgress):await maskWithISNet(blob,onProgress);
 }catch(error){
  console.error('BMCenter local segmentation',engine,error);
  const msg=String(error?.message||error||'erro desconhecido');
  throw new Error(`${engine==='birefnet'?'BiRefNet':'ISNet'} falhou: ${msg}. Na primeira execução mantenha internet ativa para baixar o modelo.`);
 }
 return composeOriginalWithMask(imageData,mask,{scene,intensity,onProgress});
}

export function clearLocalAIModelCache(){
 engineCache.clear();
}
