let removerModulePromise=null;
let personWorker=null;
let personRequestId=0;
const personPending=new Map();

function imageFromSource(source){
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>resolve(img);
  img.onerror=()=>reject(new Error('Não foi possível abrir a foto.'));
  img.src=source;
 });
}

function hashText(text){
 let h=2166136261;
 for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return Math.abs(h>>>0);
}

function dataUrlToBlob(dataUrl){
 const [head,data]=String(dataUrl||'').split(',');
 const mime=(head.match(/data:([^;]+)/)||[])[1]||'image/jpeg';
 const binary=atob(data||'');
 const bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 return new Blob([bytes],{type:mime});
}

function getPersonWorker(){
 if(personWorker)return personWorker;
 personWorker=new Worker(new URL('./personSegmenter.worker.js',import.meta.url),{type:'module'});
 personWorker.onmessage=event=>{
  const {type,reqId}=event.data||{};
  const job=personPending.get(reqId);if(!job)return;
  personPending.delete(reqId);
  if(type==='PERSON_RESULT')job.resolve(event.data);
  else job.reject(new Error(event.data?.error||'falha ao identificar mão e braço'));
 };
 personWorker.onerror=error=>{
  for(const [,job] of personPending)job.reject(new Error(error?.message||'falha ao iniciar a proteção de mão e braço'));
  personPending.clear();personWorker?.terminate();personWorker=null;
 };
 return personWorker;
}

async function requestPersonMask(imageData){
 if(typeof Worker==='undefined'||typeof createImageBitmap!=='function')throw new Error('navegador sem suporte ao recorte local');
 let bitmap=await createImageBitmap(dataUrlToBlob(imageData));
 const maxSide=640;
 if(Math.max(bitmap.width,bitmap.height)>maxSide){
  const scale=maxSide/Math.max(bitmap.width,bitmap.height);
  const resized=await createImageBitmap(bitmap,0,0,bitmap.width,bitmap.height,{
   resizeWidth:Math.max(1,Math.round(bitmap.width*scale)),resizeHeight:Math.max(1,Math.round(bitmap.height*scale)),resizeQuality:'high'
  });
  bitmap.close?.();bitmap=resized;
 }
 const reqId=++personRequestId;
 const promise=new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{personPending.delete(reqId);reject(new Error('a proteção de mão e braço demorou demais'))},120000);
  personPending.set(reqId,{resolve:value=>{clearTimeout(timer);resolve(value)},reject:error=>{clearTimeout(timer);reject(error)}});
 });
 getPersonWorker().postMessage({type:'SEGMENT_PERSON',reqId,bitmap},[bitmap]);
 return promise;
}

function normalizeStroke(stroke){
 const points=(stroke?.point||[]).map(point=>({
  x:Math.max(0,Math.min(1,Number(point.x))),
  y:Math.max(0,Math.min(1,Number(point.y)))
 })).filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y));
 return points.length?{brushMode:Number(stroke?.brushMode)||1,points}:null;
}

function dilateBinary(source,w,h,radius=1){
 const result=new Uint8Array(source);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(source[y*w+x]){
  for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
   if(dx*dx+dy*dy>radius*radius)continue;
   const nx=x+dx,ny=y+dy;
   if(nx>=0&&nx<w&&ny>=0&&ny<h)result[ny*w+nx]=1;
  }
 }
 return result;
}

function erodeBinary(source,w,h,radius=1){
 const result=new Uint8Array(source.length);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  let keep=source[y*w+x]===1;
  for(let dy=-radius;keep&&dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
   if(dx*dx+dy*dy>radius*radius)continue;
   const nx=x+dx,ny=y+dy;
   if(nx<0||nx>=w||ny<0||ny>=h||!source[ny*w+nx]){keep=false;break}
  }
  if(keep)result[y*w+x]=1;
 }
 return result;
}

function closeBinary(source,w,h,radius=1){
 return erodeBinary(dilateBinary(source,w,h,radius),w,h,Math.max(1,radius));
}

function openBinary(source,w,h,radius=1){
 return dilateBinary(erodeBinary(source,w,h,radius),w,h,radius);
}

function fillInteriorHoles(binary,w,h){
 const visited=new Uint8Array(w*h),queue=new Int32Array(w*h);
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

function keepLargestComponent(source,w,h){
 const seen=new Uint8Array(source.length),queue=new Int32Array(source.length);
 let best=[],total=0;
 for(let start=0;start<source.length;start++){
  if(!source[start]||seen[start])continue;
  let head=0,tail=0;queue[tail++]=start;seen[start]=1;const component=[];
  while(head<tail){
   const i=queue[head++],x=i%w,y=(i/w)|0;component.push(i);total++;
   const add=n=>{if(n>=0&&n<source.length&&source[n]&&!seen[n]){seen[n]=1;queue[tail++]=n}};
   if(x>0)add(i-1);if(x<w-1)add(i+1);if(y>0)add(i-w);if(y<h-1)add(i+w);
  }
  if(component.length>best.length)best=component;
 }
 const binary=new Uint8Array(source.length);
 for(const i of best)binary[i]=1;
 return{binary,count:best.length,total,retention:total?best.length/total:0};
}

function keepAnchoredComponents(source,anchor,w,h){
 const seen=new Uint8Array(source.length),queue=new Int32Array(source.length),result=new Uint8Array(source.length);
 let anchoredPixels=0;
 for(let start=0;start<source.length;start++){
  if(!source[start]||seen[start])continue;
  let head=0,tail=0,anchors=0;queue[tail++]=start;seen[start]=1;const component=[];
  while(head<tail){
   const i=queue[head++],x=i%w,y=(i/w)|0;component.push(i);if(anchor[i])anchors++;
   const add=n=>{if(n>=0&&n<source.length&&source[n]&&!seen[n]){seen[n]=1;queue[tail++]=n}};
   if(x>0)add(i-1);if(x<w-1)add(i+1);if(y>0)add(i-w);if(y<h-1)add(i+w);
  }
  if(anchors>=3){for(const i of component)result[i]=1;anchoredPixels+=anchors}
 }
 return{binary:result,anchoredPixels};
}

function countForeground(binary){let count=0;for(const value of binary)count+=value?1:0;return count}

function foregroundCorners(binary,w,h){
 const bw=Math.max(2,Math.round(w*.07)),bh=Math.max(2,Math.round(h*.07));
 const regions=[[0,0],[w-bw,0],[0,h-bh],[w-bw,h-bh]];
 let filled=0;
 for(const [sx,sy] of regions){
  let count=0;
  for(let y=sy;y<sy+bh;y++)for(let x=sx;x<sx+bw;x++)count+=binary[y*w+x]?1:0;
  if(count/(bw*bh)>.62)filled++;
 }
 return filled;
}

function paintStrokes(binary,w,h,strokes){
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const image=ctx.createImageData(w,h);
 for(let i=0;i<binary.length;i++)image.data[i*4+3]=binary[i]?255:0;
 ctx.putImageData(image,0,0);
 ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=Math.max(10,Math.round(Math.min(w,h)*.065));
 for(const stroke of (strokes||[]).map(normalizeStroke).filter(Boolean)){
  ctx.globalCompositeOperation=stroke.brushMode===0?'destination-out':'source-over';
  ctx.strokeStyle='#fff';ctx.fillStyle='#fff';ctx.beginPath();
  stroke.points.forEach((point,index)=>{
   const x=point.x*w,y=point.y*h;
   if(index===0){ctx.moveTo(x,y);ctx.arc(x,y,ctx.lineWidth*.5,0,Math.PI*2);ctx.moveTo(x,y)}else ctx.lineTo(x,y);
  });
  ctx.stroke();ctx.fill();
 }
 const adjusted=ctx.getImageData(0,0,w,h).data;
 for(let i=0;i<binary.length;i++)binary[i]=adjusted[i*4+3]>=128?1:0;
}

async function calculateForegroundMask(imageData,targetW,targetH,strokes,onProgress){
 onProgress?.('Identificando o celular, a mão e o braço...');
 removerModulePromise||=import('modern-rembg');
 const {removeBackground}=await removerModulePromise;
 const started=performance.now();
 const personPromise=requestPersonMask(imageData);
 const [blob,personInfo]=await Promise.all([
  removeBackground(imageData,{output:'mask',resolution:320,proxy:false}),
  personPromise
 ]);
 const maskUrl=URL.createObjectURL(blob);
 try{
  const maskImage=await imageFromSource(maskUrl);
  const scale=Math.min(1,640/Math.max(targetW,targetH));
  const w=Math.max(1,Math.round(targetW*scale)),h=Math.max(1,Math.round(targetH*scale));
  const low=document.createElement('canvas');low.width=w;low.height=h;
  const ctx=low.getContext('2d',{willReadFrequently:true});
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(maskImage,0,0,w,h);
  const pixels=ctx.getImageData(0,0,w,h).data;
  let binary=new Uint8Array(w*h),personCandidate=new Uint8Array(w*h),skinDetected=new Uint8Array(w*h);
  // A low threshold is deliberately conservative: uncertain edge pixels stay
  // with the original phone/hand instead of cutting pieces out of them.
  const {mask:personMask,skinMask,width:personW,height:personH}=personInfo;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const i=y*w+x;
   const px=Math.min(personW-1,Math.floor(x*personW/w)),py=Math.min(personH-1,Math.floor(y*personH/h));
   binary[i]=pixels[i*4+3]>=24?1:0;
   personCandidate[i]=personMask[py*personW+px]>=72?1:0;
   skinDetected[i]=skinMask[py*personW+px]>=70?1:0;
  }
  // Only human components that contain skin already touching the salient
  // foreground are added. This restores the complete wrist/sleeve while
  // rejecting plants, upholstery and people elsewhere in the old scene.
  personCandidate=closeBinary(openBinary(personCandidate,w,h,1),w,h,2);
  const nearOriginalForeground=dilateBinary(binary,w,h,4);
  const skinAnchor=new Uint8Array(binary.length);
  for(let i=0;i<skinAnchor.length;i++)skinAnchor[i]=skinDetected[i]&&nearOriginalForeground[i]?1:0;
  const protectedPerson=keepAnchoredComponents(personCandidate,skinAnchor,w,h);
  if(protectedPerson.anchoredPixels/binary.length<.0005)throw new Error('a mão não foi identificada com segurança; a foto não foi marcada como pronta');
  // Phone and hand are one protected subject regardless of whether the arm
  // touches the photo border. The previous border condition caused hands
  // completely inside the frame to be detected and then discarded.
  for(let i=0;i<binary.length;i++)if(protectedPerson.binary[i])binary[i]=1;
  paintStrokes(binary,w,h,strokes);
  binary=closeBinary(binary,w,h,3);
  binary=openBinary(binary,w,h,2);
  const component=keepLargestComponent(binary,w,h);
  binary=component.binary;
  if(component.retention<.78)throw new Error('o fundo antigo ficou ligado ao objeto e o recorte foi recusado');
  let protectedSkin=0,retainedSkin=0;
  for(let i=0;i<binary.length;i++)if(protectedPerson.binary[i]&&skinDetected[i]){
   protectedSkin++;
   if(binary[i])retainedSkin++;
  }
  if(protectedSkin<Math.max(12,Math.round(binary.length*.0005))||retainedSkin/protectedSkin<.88){
   throw new Error('a mão foi detectada, mas não permaneceu inteira no recorte; a foto não foi marcada como pronta');
  }
  const beforeFill=countForeground(binary);
  fillInteriorHoles(binary,w,h);
  const afterFill=countForeground(binary),coverage=afterFill/binary.length;
  const repaired=(afterFill-beforeFill)/binary.length;
  if(coverage<.025||coverage>.88||repaired>.13||foregroundCorners(binary,w,h)>=3){
   throw new Error('o resultado apresentou risco de buracos ou excesso do fundo antigo e foi recusado');
  }
  // One outward pixel protects thin phone borders and fingertips. We never
  // erode or rescale the original subject.
  binary=dilateBinary(binary,w,h,2);
  const safeLow=document.createElement('canvas');safeLow.width=w;safeLow.height=h;
  const safeCtx=safeLow.getContext('2d');
  const safeImage=safeCtx.createImageData(w,h);
  for(let i=0;i<binary.length;i++){
   const p=i*4;safeImage.data[p]=255;safeImage.data[p+1]=255;safeImage.data[p+2]=255;safeImage.data[p+3]=binary[i]?255:0;
  }
  safeCtx.putImageData(safeImage,0,0);
  const mask=document.createElement('canvas');mask.width=targetW;mask.height=targetH;
  const finalCtx=mask.getContext('2d');finalCtx.imageSmoothingEnabled=true;finalCtx.imageSmoothingQuality='high';
  finalCtx.drawImage(safeLow,0,0,targetW,targetH);
  onProgress?.(`Celular e mão preservados em ${Math.round(performance.now()-started)} ms.`);
  return mask;
 }finally{URL.revokeObjectURL(maskUrl)}
}

const SCENE_PHOTOS=[
 '/photo-scenes/clean-room.jpg',
 '/photo-scenes/neutral-arch.jpg',
 '/photo-scenes/dark-lounge.jpg',
 '/photo-scenes/bright-living.jpg',
 '/photo-scenes/blurred-office.jpg',
 '/photo-scenes/home-office.jpg',
 '/photo-scenes/dark-gallery.jpg',
 '/photo-scenes/soft-living.jpg'
];
const sceneImageCache=new Map();

function scenePhotoFor(style){
 const key=String(style||'').toLowerCase();
 if(/preto|escuro|grafite|carbon|dark/.test(key))return SCENE_PHOTOS[2];
 if(/azul|tech|android|apple/.test(key))return SCENE_PHOTOS[4];
 if(/madeira|carvalho|nogueira|quente|golden/.test(key))return SCENE_PHOTOS[7];
 if(/home office|marketplace|catálogo|produto/.test(key))return SCENE_PHOTOS[5];
 if(/mármore|travertino|pedra|concreto|cimento|slate/.test(key))return SCENE_PHOTOS[1];
 if(/bege|areia|creme|champagne|natural/.test(key))return SCENE_PHOTOS[3];
 if(/loft|editorial|vitrine|urban|luxury/.test(key))return SCENE_PHOTOS[6];
 return SCENE_PHOTOS[0];
}

async function loadSceneImage(path){
 if(!sceneImageCache.has(path))sceneImageCache.set(path,imageFromSource(path));
 return sceneImageCache.get(path);
}

async function drawScenario(ctx,w,h,scene){
 const style=scene?.style||'Branco Clean',path=scenePhotoFor(style);
 const image=await loadSceneImage(path);
 const iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;
 const scale=Math.max(w/iw,h/ih)*1.04;
 const sw=w/scale,sh=h/scale;
 const seed=hashText(`${style}:${scene?.signature||0}`);
 const travelX=Math.max(0,iw-sw),travelY=Math.max(0,ih-sh);
 const sx=travelX*(.42+(seed%19)/100),sy=travelY*(.40+((seed>>5)%17)/100);
 ctx.save();
 ctx.filter=`blur(${Math.max(1,Math.min(6,Math.round(Math.min(w,h)*.0024)))}px) saturate(.92) brightness(1.02)`;
 ctx.drawImage(image,sx,sy,sw,sh,0,0,w,h);
 ctx.restore();
 ctx.fillStyle=/preto|escuro|grafite|dark|carbon/i.test(style)?'rgba(6,12,20,.16)':'rgba(255,255,255,.08)';
 ctx.fillRect(0,0,w,h);
}

async function compose(imageData,scene,strokes,onProgress){
 const original=await imageFromSource(imageData);
 const w=original.naturalWidth||original.width,h=original.naturalHeight||original.height;
 const mask=await calculateForegroundMask(imageData,w,h,strokes,onProgress);
 const cut=document.createElement('canvas');cut.width=w;cut.height=h;
 const cutCtx=cut.getContext('2d',{alpha:true});
 // The output uses untouched pixels at their exact original coordinates.
 // Only the alpha mask and environment are new.
 cutCtx.drawImage(original,0,0);
 cutCtx.globalCompositeOperation='destination-in';cutCtx.drawImage(mask,0,0);
 cutCtx.globalCompositeOperation='source-over';
 const out=document.createElement('canvas');out.width=w;out.height=h;
 const ctx=out.getContext('2d',{alpha:false});
 await drawScenario(ctx,w,h,scene);ctx.drawImage(cut,0,0);
 onProgress?.('Finalizando em qualidade máxima...');
 return out.toDataURL('image/jpeg',.995);
}

export const LOCAL_AI_ENGINES=[
 {id:'foreground-v1',name:'Recorte de primeiro plano',description:'Preserva automaticamente o conjunto formado pelo celular, mão e braço.'}
];

export async function preparePhotoLocally(imageData,{scene={},strokes=null,onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');
 try{return await compose(imageData,scene,strokes,onProgress)}
 catch(error){
  console.error('BMCenter foreground remover',error);
  throw new Error(`Recorte local: ${String(error?.message||error||'erro desconhecido')}`);
 }
}

export function clearLocalAIModelCache(){
 removerModulePromise=null;
 if(personWorker)personWorker.terminate();personWorker=null;
 for(const [,job] of personPending)job.reject(new Error('recorte reiniciado'));
 personPending.clear();
}
