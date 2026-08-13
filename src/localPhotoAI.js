let transformersPromise=null;
const engineCache=new Map();

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

async function sourceUrlFromDataUrl(dataUrl){
 const response=await fetch(dataUrl);
 const blob=await response.blob();
 return URL.createObjectURL(blob);
}

function maskFromCanvas(sourceCanvas){
 const w=sourceCanvas.width,h=sourceCanvas.height;
 const src=sourceCanvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h);
 let hasTransparency=false;
 for(let i=3;i<src.data.length;i+=4){if(src.data[i]<250){hasTransparency=true;break}}
 const out=document.createElement('canvas');out.width=w;out.height=h;
 const ctx=out.getContext('2d');const dst=ctx.createImageData(w,h);
 for(let i=0;i<w*h;i++){
  const j=i*4;
  const r=src.data[j],g=src.data[j+1],b=src.data[j+2],a=src.data[j+3];
  const mask=hasTransparency?a:Math.max(r,g,b);
  dst.data[j]=255;dst.data[j+1]=255;dst.data[j+2]=255;dst.data[j+3]=mask;
 }
 ctx.putImageData(dst,0,0);return out;
}

async function loadISNet(onProgress){
 if(engineCache.has('isnet'))return engineCache.get('isnet');
 onProgress?.('Carregando ISNet...');
 const {pipeline}=await getTransformers();
 const promise=pipeline('background-removal','onnx-community/ISNet-ONNX',{
  dtype:'q8',
  progress_callback:p=>{
   if(p?.status==='progress'&&Number.isFinite(p.progress))onProgress?.(`ISNet · download ${Math.round(p.progress)}%`)
  }
 });
 engineCache.set('isnet',promise);
 try{return await promise}catch(error){engineCache.delete('isnet');throw error}
}

async function maskWithISNet(imageData,onProgress){
 const segmenter=await loadISNet(onProgress);
 const url=await sourceUrlFromDataUrl(imageData);
 try{
  onProgress?.('ISNet · separando aparelho e fundo...');
  const output=await segmenter([url]);
  if(!output?.[0])throw new Error('ISNet não retornou imagem segmentada.');
  const canvas=output[0].toCanvas?.();
  if(!canvas)throw new Error('ISNet retornou um formato inesperado.');
  return maskFromCanvas(canvas);
 }finally{URL.revokeObjectURL(url)}
}

async function loadBiRefNet(onProgress){
 if(engineCache.has('birefnet'))return engineCache.get('birefnet');
 onProgress?.('Carregando BiRefNet Lite...');
 const {AutoModel,AutoProcessor}=await getTransformers();
 const promise=Promise.all([
  AutoModel.from_pretrained('onnx-community/BiRefNet_lite',{
   dtype:'fp32',
   progress_callback:p=>{
    if(p?.status==='progress'&&Number.isFinite(p.progress))onProgress?.(`BiRefNet · download ${Math.round(p.progress)}%`)
   }
  }),
  AutoProcessor.from_pretrained('onnx-community/BiRefNet_lite')
 ]).then(([model,processor])=>({model,processor}));
 engineCache.set('birefnet',promise);
 try{return await promise}catch(error){engineCache.delete('birefnet');throw error}
}

async function maskWithBiRefNet(imageData,onProgress){
 const {RawImage}=await getTransformers();
 const {model,processor}=await loadBiRefNet(onProgress);
 const url=await sourceUrlFromDataUrl(imageData);
 try{
  onProgress?.('BiRefNet · separando aparelho e fundo...');
  const image=await RawImage.fromURL(url);
  const {pixel_values}=await processor(image);
  const {output_image}=await model({input_image:pixel_values});
  if(!output_image)throw new Error('BiRefNet não retornou máscara.');
  const mask=await RawImage.fromTensor(output_image[0].sigmoid().mul(255).to('uint8')).resize(image.width,image.height);
  const canvas=mask.toCanvas?.();
  if(!canvas)throw new Error('BiRefNet retornou um formato inesperado.');
  return maskFromCanvas(canvas);
 }finally{URL.revokeObjectURL(url)}
}

function normalizeMask(maskCanvas,w,h,{margin=7,threshold=82}={}){
 // A máscara da IA serve SOMENTE para escolher quais pixels da foto original permanecem.
 // Primeiro ela é redimensionada para a resolução EXATA da foto original.
 const source=document.createElement('canvas');source.width=w;source.height=h;
 const sctx=source.getContext('2d',{willReadFrequently:true});
 sctx.imageSmoothingEnabled=true;
 sctx.drawImage(maskCanvas,0,0,w,h);

 // Binarização: impede que partes do aparelho fiquem transparentes/desfiguradas.
 const image=sctx.getImageData(0,0,w,h);
 let selected=0;
 for(let i=0;i<image.data.length;i+=4){
  const a=image.data[i+3];
  const keep=a>=threshold?255:0;
  image.data[i]=255;image.data[i+1]=255;image.data[i+2]=255;image.data[i+3]=keep;
  if(keep)selected++;
 }
 sctx.putImageData(image,0,0);

 const coverage=selected/(w*h);
 if(coverage<.025||coverage>.985){
  throw new Error(`Máscara insegura (${Math.round(coverage*100)}% da foto). A foto original foi preservada e o resultado não foi salvo.`);
 }

 // Margem de segurança: expande para FORA do objeto, nunca para dentro.
 const dilated=document.createElement('canvas');dilated.width=w;dilated.height=h;
 const dctx=dilated.getContext('2d');
 dctx.imageSmoothingEnabled=false;
 for(let y=-margin;y<=margin;y++){
  for(let x=-margin;x<=margin;x++){
   if(x*x+y*y<=margin*margin)dctx.drawImage(source,x,y);
  }
 }

 // Feather mínimo só na borda externa.
 const feather=document.createElement('canvas');feather.width=w;feather.height=h;
 const fctx=feather.getContext('2d');
 fctx.filter='blur(0.8px)';
 fctx.drawImage(dilated,0,0);
 fctx.filter='none';
 return feather;
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
 const g=ctx.createLinearGradient(0,0,w,h);
 g.addColorStop(0,a);g.addColorStop(.68,b);g.addColorStop(1,c);
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);

 const seed=hashText(scene?.id||'');
 const lx=seed%2?w*.25:w*.75;
 const glow=ctx.createRadialGradient(lx,h*.15,0,lx,h*.15,Math.max(w,h)*.62);
 glow.addColorStop(0,'rgba(255,255,255,.48)');
 glow.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);

 const floorY=h*.80;
 const fg=ctx.createLinearGradient(0,floorY,0,h);
 fg.addColorStop(0,'rgba(255,255,255,.04)');
 fg.addColorStop(1,'rgba(0,0,0,.17)');
 ctx.fillStyle=fg;ctx.fillRect(0,floorY,w,h-floorY);
 ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(0,floorY,w,2);
}

async function compose(imageData,maskCanvas,{scene,intensity,onProgress}){
 const original=await imageFromDataUrl(imageData);
 const w=original.naturalWidth||original.width;
 const h=original.naturalHeight||original.height;
 if(!w||!h)throw new Error('A foto original não possui resolução válida.');

 onProgress?.('Protegendo formato e detalhes do aparelho...');
 const mask=normalizeMask(maskCanvas,w,h,{
  margin:intensity==='Destaque'?9:7,
  threshold:intensity==='Destaque'?72:82
 });

 // Recorte = pixels EXATOS da original na mesma coordenada.
 // Nenhuma IA desenha ou reescala o aparelho.
 const cut=document.createElement('canvas');cut.width=w;cut.height=h;
 const cctx=cut.getContext('2d',{alpha:true});
 cctx.drawImage(original,0,0,w,h);
 cctx.globalCompositeOperation='destination-in';
 cctx.drawImage(mask,0,0,w,h);
 cctx.globalCompositeOperation='source-over';

 // Saída tem EXATAMENTE as dimensões da original.
 const out=document.createElement('canvas');out.width=w;out.height=h;
 const ctx=out.getContext('2d',{alpha:false});
 drawScene(ctx,w,h,scene);

 // Sombra suave sem modificar os pixels do aparelho.
 ctx.save();
 ctx.shadowColor='rgba(0,0,0,.18)';
 ctx.shadowBlur=Math.max(6,Math.round(Math.min(w,h)*.006));
 ctx.shadowOffsetY=Math.max(2,Math.round(h*.003));
 ctx.drawImage(cut,0,0);
 ctx.restore();

 // Segunda passada sem sombra garante pixels originais no corpo do produto.
 ctx.drawImage(cut,0,0);

 onProgress?.('Finalizando sem redimensionar o aparelho...');
 return out.toDataURL('image/jpeg',.99);
}

export const LOCAL_AI_ENGINES=[
 {id:'isnet',name:'ISNet · Rápido',description:'Modelo local quantizado; menor download e menor uso de memória.'},
 {id:'birefnet',name:'BiRefNet Lite · Qualidade',description:'Modelo local maior; prioriza qualidade de máscara e bordas.'}
];

export async function preparePhotoLocally(imageData,{scene={},intensity='Natural',engine='isnet',onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');
 try{
  const mask=engine==='birefnet'?await maskWithBiRefNet(imageData,onProgress):await maskWithISNet(imageData,onProgress);
  return await compose(imageData,mask,{scene,intensity,onProgress});
 }catch(error){
  console.error('BMCenter Photo AI',engine,error);
  throw new Error(`${engine==='birefnet'?'BiRefNet':'ISNet'}: ${String(error?.message||error||'erro desconhecido')}`);
 }
}

export function clearLocalAIModelCache(){engineCache.clear()}
