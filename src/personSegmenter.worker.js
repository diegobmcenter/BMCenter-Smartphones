import {FilesetResolver,ImageSegmenter} from '@mediapipe/tasks-vision';

const WASM_ROOT=new URL('/mediapipe/wasm',self.location.origin).href.replace(/\/$/,'');
const MODEL_URL=new URL('/mediapipe/models/selfie_multiclass_256x256.tflite',self.location.origin).href;
let segmenterPromise=null;

function getSegmenter(){
 if(!segmenterPromise)segmenterPromise=(async()=>{
  const fileset=await FilesetResolver.forVisionTasks(WASM_ROOT,true);
  return ImageSegmenter.createFromOptions(fileset,{
   baseOptions:{modelAssetPath:MODEL_URL,delegate:'CPU'},
   runningMode:'IMAGE',
   outputCategoryMask:false,
   outputConfidenceMasks:true
  });
 })().catch(error=>{segmenterPromise=null;throw error});
 return segmenterPromise;
}

self.onmessage=async event=>{
 const {type,reqId,bitmap}=event.data||{};
 if(type!=='SEGMENT_PERSON')return;
 try{
  if(!bitmap)throw new Error('foto não recebida');
  const segmenter=await getSegmenter();
  const result=segmenter.segment(bitmap);
  bitmap.close?.();
  const masks=result?.confidenceMasks||[];
  if(masks.length<5)throw new Error('o modelo de mão e braço não retornou as classes esperadas');
  const width=masks[0].width,height=masks[0].height;
  const skin=masks[2].getAsFloat32Array();
  const clothes=masks[4].getAsFloat32Array();
  const mask=new Uint8Array(skin.length),skinMask=new Uint8Array(skin.length);
  for(let i=0;i<mask.length;i++){
   mask[i]=Math.max(0,Math.min(255,Math.round(Math.max(skin[i],clothes[i])*255)));
   skinMask[i]=Math.max(0,Math.min(255,Math.round(skin[i]*255)));
  }
  result.close?.();
  self.postMessage({type:'PERSON_RESULT',reqId,width,height,mask,skinMask},[mask.buffer,skinMask.buffer]);
 }catch(error){
  try{bitmap?.close?.()}catch{}
  self.postMessage({type:'PERSON_ERROR',reqId,error:String(error?.message||error||'erro ao identificar mão e braço')});
 }
};
