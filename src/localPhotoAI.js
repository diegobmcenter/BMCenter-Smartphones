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

function defaultStrokes(bitmap){
 // BMCenter photos are made with the phone held in a hand. Detect the visible
 // skin cluster, then continue the preservation stroke in the wrist/arm
 // direction until it reaches the frame. This keeps phone, fingers, hand,
 // sleeve and visible arm together as one original subject.
 let skinCenter={x:.5,y:.62},skinEdge={x:.5,y:.78},skinCount=0;
 try{
  const w=bitmap.width,h=bitmap.height,canvas=new OffscreenCanvas(w,h);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0);
  const pixels=ctx.getImageData(0,0,w,h).data;
  const step=Math.max(1,Math.floor(Math.max(w,h)/260));
  let sx=0,sy=0,sxx=0,syy=0,sxy=0,bestScore=-1;
  for(let y=Math.floor(h*.20);y<h*.86;y+=step)for(let x=Math.floor(w*.15);x<w*.85;x+=step){
   const i=(y*w+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
   const cb=128-.168736*r-.331264*g+.5*b;
   const cr=128+.5*r-.418688*g-.081312*b;
   const spread=Math.max(r,g,b)-Math.min(r,g,b);
   if(r>48&&g>30&&b>20&&spread>12&&cb>=72&&cb<=135&&cr>=133&&cr<=183&&r>g*.95&&r>b*.88){
    const nx=x/w,ny=y/h;skinCount++;sx+=nx;sy+=ny;sxx+=nx*nx;syy+=ny*ny;sxy+=nx*ny;
    const score=Math.hypot(nx-.5,(ny-.40)*1.18)+Math.max(0,ny-.5)*.45;
    if(score>bestScore){bestScore=score;skinEdge={x:nx,y:ny}}
   }
  }
  if(skinCount>12){
   skinCenter={x:sx/skinCount,y:sy/skinCount};
   const cxx=sxx/skinCount-skinCenter.x*skinCenter.x;
   const cyy=syy/skinCount-skinCenter.y*skinCenter.y;
   const cxy=sxy/skinCount-skinCenter.x*skinCenter.y;
   const theta=.5*Math.atan2(2*cxy,cxx-cyy);
   skinCenter.axis={x:Math.cos(theta),y:Math.sin(theta)};
  }
 }catch{}

 let wristX=skinEdge.x-skinCenter.x,wristY=skinEdge.y-skinCenter.y;
 const wristLength=Math.hypot(wristX,wristY)||1;wristX/=wristLength;wristY/=wristLength;
 let axis=skinCenter.axis||{x:0,y:1};
 if(axis.x*wristX+axis.y*wristY<0)axis={x:-axis.x,y:-axis.y};
 let dx=axis.x*.78+wristX*.62,dy=axis.y*.78+wristY*.62;
 if(skinCount<=12){dx=0;dy=1}
 const directionLength=Math.hypot(dx,dy)||1;dx/=directionLength;dy/=directionLength;
 const limits=[];
 if(dx<-.001)limits.push((.025-skinEdge.x)/dx);if(dx>.001)limits.push((.975-skinEdge.x)/dx);
 if(dy>.001)limits.push((.975-skinEdge.y)/dy);if(dy<-.001)limits.push((.08-skinEdge.y)/dy);
 const positive=limits.filter(value=>value>0);
 // Stop well inside the visible arm. The segmenter completes the object to the
 // frame; crossing the edge would teach it to preserve a strip of old background.
 const extend=(positive.length?Math.min(...positive):.5)*.62;
 const end={x:Math.max(.025,Math.min(.975,skinEdge.x+dx*extend)),y:Math.max(.08,Math.min(.975,skinEdge.y+dy*extend))};
 const points=[{x:.50,y:.34},{x:.50,y:.44},{x:.50,y:.54},{x:.50,y:.62}];
 if(skinCount>12)points.push(skinCenter,skinEdge);
 for(let t=.25;t<=1;t+=.25)points.push({x:skinEdge.x+(end.x-skinEdge.x)*t,y:skinEdge.y+(end.y-skinEdge.y)*t});
 return[{brushMode:1,point:points,isCompleted:true}];
}

async function requestMask(imageData,strokes,onProgress){
 if(typeof Worker==='undefined'||typeof createImageBitmap!=='function'||typeof OffscreenCanvas==='undefined'){
  throw new Error('Este navegador não oferece os recursos necessários para o recorte local. Use Chrome atualizado.');
 }
 onProgress?.('Calculando o recorte local...');
 const blob=dataUrlToBlob(imageData);
 let bitmap=await createImageBitmap(blob);
 // MagicTouch only needs a compact copy to calculate the mask. The result is
 // upscaled afterwards and applied to the untouched full-resolution original.
 const maxMaskSide=640;
 if(Math.max(bitmap.width,bitmap.height)>maxMaskSide){
  const scale=maxMaskSide/Math.max(bitmap.width,bitmap.height);
  const resized=await createImageBitmap(bitmap,0,0,bitmap.width,bitmap.height,{
   resizeWidth:Math.max(1,Math.round(bitmap.width*scale)),
   resizeHeight:Math.max(1,Math.round(bitmap.height*scale)),
   resizeQuality:'high'
  });
  bitmap.close?.();
  bitmap=resized;
 }
 const reqId=++requestCounter;
 const clean=(Array.isArray(strokes)?strokes:[]).map(normalizedStroke).filter(Boolean);
 const selectedStrokes=clean.length?clean:defaultStrokes(bitmap);
 const worker=getWorker();

 const promise=new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{
   pending.delete(reqId);
   reject(new Error('O segmentador demorou demais para iniciar. Atualize a página e tente novamente.'));
  },180000);
  pending.set(reqId,{
   resolve:value=>{clearTimeout(timeout);resolve(value)},
   reject:error=>{clearTimeout(timeout);reject(error)}
  });
 });
 worker.postMessage({type:'SEGMENT_IMAGE',reqId,bitmap,strokes:selectedStrokes},[bitmap]);
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
 // Favor preservation: dark phone edges, fingers, nails, cameras and reflections
 // stay opaque. A small original-background halo is preferable to a cut subject.
 for(let i=0;i<maskData.length;i++){if(maskData[i]>=32){binary[i]=1;fg++}}
 let coverage=fg/binary.length;
 if(coverage<.012||coverage>.94)throw new Error(`Recorte automático inseguro (${Math.round(coverage*100)}%). Use "Ajustar recorte".`);

 fillInteriorHoles(binary,mw,mh);

 const low=document.createElement('canvas');low.width=mw;low.height=mh;
 const lctx=low.getContext('2d',{willReadFrequently:true});
 const img=lctx.createImageData(mw,mh);
 for(let i=0;i<binary.length;i++){
  const j=i*4,a=binary[i]?255:0;
  img.data[j]=255;img.data[j+1]=255;img.data[j+2]=255;img.data[j+3]=a;
 }
 lctx.putImageData(img,0,0);

 // Expand only outwards at mask resolution. This repairs narrow cuts around
 // fingers and phone edges without ever shrinking or rescaling the subject.
 const lowRadius=Math.max(2,Math.round(Math.min(mw,mh)*.005));
 const expanded=document.createElement('canvas');expanded.width=mw;expanded.height=mh;
 const ectx=expanded.getContext('2d');
 for(let y=-lowRadius;y<=lowRadius;y++)for(let x=-lowRadius;x<=lowRadius;x++){
  if(x*x+y*y<=lowRadius*lowRadius)ectx.drawImage(low,x,y);
 }

 // Smooth scaling is restricted to the outer transition of the mask. The
 // phone, hand and arm still come from the untouched full-resolution photo.
 const scaled=document.createElement('canvas');scaled.width=targetW;scaled.height=targetH;
 const sctx=scaled.getContext('2d');sctx.imageSmoothingEnabled=true;sctx.imageSmoothingQuality='high';
 sctx.drawImage(expanded,0,0,targetW,targetH);

 // Final guard band in original resolution. It only adds original pixels.
 const radius=Math.max(2,Math.min(6,Math.round(Math.min(targetW,targetH)*.0018)));
 const safe=document.createElement('canvas');safe.width=targetW;safe.height=targetH;
 const c=safe.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
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
