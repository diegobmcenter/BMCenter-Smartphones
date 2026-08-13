let workerInstance=null;
let requestCounter=0;
const pending=new Map();

function imageFromDataUrl(source){
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>resolve(img);
  img.onerror=()=>reject(new Error('Não foi possível abrir a foto original.'));
  img.src=source;
 });
}

function dataUrlToBlob(dataUrl){
 const [head,data]=String(dataUrl||'').split(',');
 const mime=(head.match(/data:([^;]+)/)||[])[1]||'image/jpeg';
 const bin=atob(data||'');
 const bytes=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
 return new Blob([bytes],{type:mime});
}

function hashText(text){
 let h=2166136261;
 for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return Math.abs(h>>>0);
}

function getWorker(){
 if(workerInstance)return workerInstance;
 workerInstance=new Worker(new URL('./photoSegmenter.worker.js',import.meta.url),{type:'module'});
 workerInstance.onmessage=event=>{
  const {type,reqId}=event.data||{};
  const job=pending.get(reqId);
  if(!job)return;
  pending.delete(reqId);
  if(type==='SEGMENT_RESULT')job.resolve(event.data);
  else job.reject(new Error(event.data?.error||'Falha no MediaPipe.'));
 };
 workerInstance.onerror=error=>{
  for(const [,job] of pending)job.reject(new Error(error?.message||'Falha ao iniciar o segmentador local.'));
  pending.clear();
  workerInstance?.terminate();
  workerInstance=null;
 };
 return workerInstance;
}

function normalizedStroke(stroke){
 const mode=Number(stroke?.brushMode)||1;
 const points=(stroke?.point||[]).map(p=>({
  x:Math.max(0,Math.min(1,Number(p.x))),
  y:Math.max(0,Math.min(1,Number(p.y)))
 })).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
 if(!points.length)return null;
 // A short click becomes a valid stroke for GraphV2.
 if(points.length===1){
  const p=points[0],dx=.032;
  points.push({x:Math.max(0,Math.min(1,p.x+dx)),y:p.y});
 }
 return{brushMode:mode,point:points,isCompleted:true};
}

function defaultStrokes(){
 // Deliberately a stroke, not a single point. Current V2 model is trained for interactive brushes.
 return[{brushMode:1,point:[{x:.50,y:.36},{x:.50,y:.44},{x:.50,y:.52},{x:.50,y:.60},{x:.50,y:.66}],isCompleted:true}];
}

async function requestMask(imageData,strokes,onProgress){
 if(typeof Worker==='undefined'||typeof createImageBitmap!=='function'||typeof OffscreenCanvas==='undefined'){
  throw new Error('Este navegador não oferece os recursos necessários para o recorte local. Use Chrome atualizado.');
 }
 onProgress?.('Preparando segmentador oficial do Google...');
 const blob=dataUrlToBlob(imageData);
 const bitmap=await createImageBitmap(blob);
 const reqId=++requestCounter;
 const clean=(Array.isArray(strokes)?strokes:[]).map(normalizedStroke).filter(Boolean);
 const worker=getWorker();

 const promise=new Promise((resolve,reject)=>pending.set(reqId,{resolve,reject}));
 worker.postMessage({type:'SEGMENT_IMAGE',reqId,bitmap,strokes:clean.length?clean:defaultStrokes()},[bitmap]);
 const result=await promise;
 onProgress?.(`Recorte calculado em ${Math.round(result.inferenceMs||0)} ms.`);
 return result;
}

function fillInteriorHoles(binary,w,h){
 // Background connected to image borders stays background.
 // Any enclosed zero-island becomes foreground, protecting screen/camera reflections from "holes".
 const visited=new Uint8Array(w*h);
 const queue=new Int32Array(w*h);
 let head=0,tail=0;
 const push=i=>{if(i>=0&&i<w*h&&!visited[i]&&!binary[i]){visited[i]=1;queue[tail++]=i}};
 for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}
 for(let y=1;y<h-1;y++){push(y*w);push(y*w+w-1)}
 while(head<tail){
  const i=queue[head++],x=i%w,y=(i/w)|0;
  if(x>0)push(i-1);if(x<w-1)push(i+1);if(y>0)push(i-w);if(y<h-1)push(i+w);
 }
 for(let i=0;i<binary.length;i++)if(!binary[i]&&!visited[i])binary[i]=1;
}

function buildSafeMask(maskData,mw,mh,targetW,targetH){
 if(!maskData||maskData.length!==mw*mh)throw new Error('Máscara inválida recebida do MediaPipe.');

 const binary=new Uint8Array(maskData.length);
 let fg=0;
 // Slightly permissive threshold. Manual negative strokes remove false positives.
 for(let i=0;i<maskData.length;i++){if(maskData[i]>=112){binary[i]=1;fg++}}
 let coverage=fg/binary.length;
 if(coverage<.012||coverage>.985)throw new Error(`Recorte automático inseguro (${Math.round(coverage*100)}%). Use "Ajustar recorte".`);

 fillInteriorHoles(binary,mw,mh);

 const low=document.createElement('canvas');low.width=mw;low.height=mh;
 const lctx=low.getContext('2d',{willReadFrequently:true});
 const img=lctx.createImageData(mw,mh);
 for(let i=0;i<binary.length;i++){
  const j=i*4,a=binary[i]?255:0;
  img.data[j]=255;img.data[j+1]=255;img.data[j+2]=255;img.data[j+3]=a;
 }
 lctx.putImageData(img,0,0);

 // Nearest-neighbour upscale preserves geometry.
 const scaled=document.createElement('canvas');scaled.width=targetW;scaled.height=targetH;
 const sctx=scaled.getContext('2d');sctx.imageSmoothingEnabled=false;
 sctx.drawImage(low,0,0,targetW,targetH);

 // Only expand OUTWARD 2-4 px. Never erode inward.
 const radius=Math.max(2,Math.min(4,Math.round(Math.min(targetW,targetH)*.0012)));
 const safe=document.createElement('canvas');safe.width=targetW;safe.height=targetH;
 const c=safe.getContext('2d');c.imageSmoothingEnabled=false;
 for(let y=-radius;y<=radius;y++)for(let x=-radius;x<=radius;x++){
  if(x*x+y*y<=radius*radius)c.drawImage(scaled,x,y);
 }
 return safe;
}

function paletteFor(style){
 const key=String(style||'').toLowerCase();
 if(key.includes('preto')||key.includes('escuro')||key.includes('grafite'))return['#11151b','#242c36','#4a5969'];
 if(key.includes('madeira')||key.includes('carvalho')||key.includes('nogueira'))return['#e8d2b8','#b99068','#735035'];
 if(key.includes('mármore')||key.includes('travertino')||key.includes('pedra'))return['#f4f1eb','#d8d1c6','#aaa095'];
 if(key.includes('azul')||key.includes('tech'))return['#e8f0f8','#b8cce1','#6887a8'];
 if(key.includes('bege')||key.includes('areia')||key.includes('creme'))return['#f5ecdf','#dfcdb5','#b79d7e'];
 if(key.includes('concreto')||key.includes('cimento'))return['#e4e5e4','#b9bdbc','#7d8483'];
 return['#fafafa','#e7e9ec','#c8cdd3'];
}

function drawScenario(ctx,w,h,scene){
 const style=scene?.style||'Branco Clean';
 const [a,b,c]=paletteFor(style);
 const g=ctx.createLinearGradient(0,0,w,h);
 g.addColorStop(0,a);g.addColorStop(.68,b);g.addColorStop(1,c);
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);

 const seed=hashText(`${style}:${scene?.signature||0}`);
 const lightX=seed%2?w*.24:w*.76;
 const glow=ctx.createRadialGradient(lightX,h*.16,0,lightX,h*.16,Math.max(w,h)*.58);
 glow.addColorStop(0,'rgba(255,255,255,.58)');glow.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);

 const lower=h*.78;
 const floor=ctx.createLinearGradient(0,lower,0,h);
 floor.addColorStop(0,'rgba(255,255,255,.02)');floor.addColorStop(1,'rgba(0,0,0,.14)');
 ctx.fillStyle=floor;ctx.fillRect(0,lower,w,h-lower);

 // Theme-specific subtle material pattern, always behind the original pixels.
 ctx.save();ctx.globalAlpha=.13;
 if(/madeira|carvalho|nogueira/i.test(style)){
  ctx.strokeStyle='#5e3e28';ctx.lineWidth=Math.max(1,w*.001);
  for(let y=lower;y<h;y+=Math.max(8,h*.018)){
   ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(w*.25,y+5,w*.65,y-4,w,y+2);ctx.stroke();
  }
 }else if(/mármore|travertino|pedra/i.test(style)){
  ctx.strokeStyle='#7f7f7f';ctx.lineWidth=Math.max(1,w*.001);
  for(let i=0;i<5;i++){const y=h*(.12+i*.16);ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(w*.3,y-18,w*.65,y+24,w,y-8);ctx.stroke()}
 }else if(/concreto|cimento/i.test(style)){
  ctx.fillStyle='#555';
  for(let i=0;i<60;i++)ctx.fillRect((seed*(i+3)%997)/997*w,(seed*(i+19)%991)/991*h,1.5,1.5);
 }
 ctx.restore();
}

async function compose(imageData,maskInfo,scene,onProgress){
 const original=await imageFromDataUrl(imageData);
 const w=original.naturalWidth||original.width,h=original.naturalHeight||original.height;
 const mask=buildSafeMask(maskInfo.mask,maskInfo.width,maskInfo.height,w,h);

 const cut=document.createElement('canvas');cut.width=w;cut.height=h;
 const cctx=cut.getContext('2d',{alpha:true});
 // Exact original at exact coordinates: no resizing, no generative pixels.
 cctx.drawImage(original,0,0);
 cctx.globalCompositeOperation='destination-in';
 cctx.drawImage(mask,0,0);
 cctx.globalCompositeOperation='source-over';

 const out=document.createElement('canvas');out.width=w;out.height=h;
 const ctx=out.getContext('2d',{alpha:false});
 drawScenario(ctx,w,h,scene);
 ctx.drawImage(cut,0,0);

 onProgress?.('Finalizando em qualidade máxima...');
 return out.toDataURL('image/jpeg',.995);
}

export const LOCAL_AI_ENGINES=[
 {id:'mediapipe-v2',name:'MediaPipe MagicTouch V2',description:'Modelo oficial atual com pincéis positivos/negativos e ajuste interativo.'}
];

export async function preparePhotoLocally(imageData,{scene={},strokes=null,onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');
 try{
  const mask=await requestMask(imageData,strokes,onProgress);
  return compose(imageData,mask,scene,onProgress);
 }catch(error){
  console.error('BMCenter MediaPipe V2',error);
  throw new Error(`Recorte local: ${String(error?.message||error||'erro desconhecido')}`);
 }
}

export function clearLocalAIModelCache(){
 if(workerInstance)workerInstance.terminate();
 workerInstance=null;
 for(const [,job] of pending)job.reject(new Error('Segmentador reiniciado.'));
 pending.clear();
}
