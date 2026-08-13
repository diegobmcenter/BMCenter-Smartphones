import {FilesetResolver,InteractiveSegmenter} from '@mediapipe/tasks-vision';

const WASM_ROOT='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';
const MODEL_URL='https://storage.googleapis.com/mediapipe-models/interactive_segmenter_v2/magic_touch/int8/1/interactive_segmentation.task';

let task=null;
let renderCanvas=null;
let initPromise=null;

async function init(){
 if(task)return task;
 if(initPromise)return initPromise;
 initPromise=(async()=>{
  const vision=await FilesetResolver.forVisionTasks(WASM_ROOT);
  renderCanvas=new OffscreenCanvas(1,1);
  try{
   task=await InteractiveSegmenter.createFromOptions(vision,{
    baseOptions:{modelAssetPath:MODEL_URL,delegate:'GPU'},
    canvas:renderCanvas
   });
  }catch(gpuError){
   console.warn('BMCenter: MediaPipe GPU indisponível, tentando CPU.',gpuError);
   task=await InteractiveSegmenter.createFromOptions(vision,{
    baseOptions:{modelAssetPath:MODEL_URL,delegate:'CPU'},
    canvas:renderCanvas
   });
  }
  return task;
 })();
 try{return await initPromise}
 catch(error){initPromise=null;task=null;throw error}
}

self.onmessage=async event=>{
 const {type,reqId,bitmap,strokes}=event.data||{};
 if(type!=='SEGMENT_IMAGE')return;
 try{
  const segmenter=await init();
  if(!bitmap)throw new Error('Imagem não recebida pelo segmentador.');

  if(renderCanvas.width!==bitmap.width)renderCanvas.width=bitmap.width;
  if(renderCanvas.height!==bitmap.height)renderCanvas.height=bitmap.height;

  segmenter.setImage(bitmap);
  bitmap.close?.();

  const strokeList=Array.isArray(strokes)&&strokes.length?strokes:[{
   brushMode:1,
   point:[{x:.50,y:.38},{x:.50,y:.50},{x:.50,y:.62}],
   isCompleted:true
  }];

  const started=performance.now();
  const mask=segmenter.segment(strokeList);
  if(!mask)throw new Error('MediaPipe não retornou máscara.');

  const width=mask.width,height=mask.height;
  let output;

  if(typeof mask.getAsFloat32Array==='function'){
   const src=mask.getAsFloat32Array();
   output=new Uint8Array(src.length);
   for(let i=0;i<src.length;i++)output[i]=Math.max(0,Math.min(255,Math.round(src[i]*255)));
  }else if(typeof mask.getAsUint8Array==='function'){
   const src=mask.getAsUint8Array();
   output=new Uint8Array(src.length);
   // Some builds expose 0/1, others 0/255.
   let max=0;for(let i=0;i<src.length;i++)if(src[i]>max)max=src[i];
   if(max<=1){for(let i=0;i<src.length;i++)output[i]=src[i]?255:0}
   else output.set(src);
  }else{
   throw new Error('Formato de máscara do MediaPipe não suportado.');
  }

  mask.close?.();

  self.postMessage({
   type:'SEGMENT_RESULT',
   reqId,
   width,
   height,
   mask:output,
   inferenceMs:performance.now()-started
  },[output.buffer]);
 }catch(error){
  try{bitmap?.close?.()}catch{}
  self.postMessage({type:'SEGMENT_ERROR',reqId,error:String(error?.message||error||'Erro desconhecido')});
 }
};
