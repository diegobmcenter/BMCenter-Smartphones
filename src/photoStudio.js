const DB_NAME='bmcenter-photo-studio-v1';
const STORE='assets';
const HANDLE_STORE='handles';

function openDb(){
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window))return reject(new Error('Este navegador não oferece armazenamento local de imagens.'));
  const req=indexedDB.open(DB_NAME,2);
  req.onupgradeneeded=()=>{
   const db=req.result;
   if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:'id'});store.createIndex('phoneId','phoneId',{unique:false})}
   if(!db.objectStoreNames.contains(HANDLE_STORE))db.createObjectStore(HANDLE_STORE,{keyPath:'id'});
  };
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Falha ao abrir a biblioteca de fotos.'));
 });
}
function tx(mode,callback){return openDb().then(db=>new Promise((resolve,reject)=>{const t=db.transaction(STORE,mode),store=t.objectStore(STORE);let result;try{result=callback(store)}catch(error){reject(error);return}t.oncomplete=()=>resolve(result);t.onerror=()=>reject(t.error||new Error('Falha ao acessar as fotos.'));t.onabort=()=>reject(t.error||new Error('Operação cancelada.'))}))}

function handleTx(mode,callback){return openDb().then(db=>new Promise((resolve,reject)=>{const tr=db.transaction(HANDLE_STORE,mode),store=tr.objectStore(HANDLE_STORE);let result;try{result=callback(store)}catch(error){reject(error);return}tr.oncomplete=()=>resolve(result);tr.onerror=()=>reject(tr.error||new Error('Falha ao acessar a pasta local.'));tr.onabort=()=>reject(tr.error||new Error('Operação cancelada.'))}))}
export function localDirectorySupported(){return typeof window!=='undefined'&&typeof window.showDirectoryPicker==='function'}
export async function saveDirectoryHandle(id,handle,name=''){if(!id||!handle)return;await handleTx('readwrite',store=>store.put({id,handle,name:name||handle.name||'',savedAt:new Date().toISOString()}))}
export async function getDirectoryHandle(id){if(!id)return null;const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(HANDLE_STORE,'readonly').objectStore(HANDLE_STORE).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}
async function ensurePermission(handle,mode='readwrite'){if(!handle)return false;const opts={mode};if((await handle.queryPermission?.(opts))==='granted')return true;return (await handle.requestPermission?.(opts))==='granted'}
export async function chooseRootPhotoDirectory(){
 if(!localDirectorySupported())throw new Error('Este navegador não permite selecionar uma pasta local persistente.');
 const handle=await window.showDirectoryPicker({mode:'readwrite'});
 if(!(await ensurePermission(handle,'readwrite')))throw new Error('Permissão para a pasta não concedida.');
 await saveDirectoryHandle('photo-root',handle,handle.name);
 return{handle,name:handle.name};
}
export async function getRootPhotoDirectory(){
 const saved=await getDirectoryHandle('photo-root');if(!saved?.handle)return null;
 const permitted=await ensurePermission(saved.handle,'readwrite').catch(()=>false);
 return permitted?saved:null;
}
export async function createPhonePhotoDirectory(phoneId,name){
 const root=await getRootPhotoDirectory();if(!root?.handle)throw new Error('Selecione primeiro a pasta raiz local.');
 const safe=String(name||'Aparelho').replace(/[\\/:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim();
 const handle=await root.handle.getDirectoryHandle(safe,{create:true});
 await saveDirectoryHandle(`phone-folder:${phoneId}`,handle,safe);
 return{handle,name:safe};
}
export async function getPhonePhotoDirectory(phoneId){
 const saved=await getDirectoryHandle(`phone-folder:${phoneId}`);if(!saved?.handle)return null;
 const permitted=await ensurePermission(saved.handle,'readwrite').catch(()=>false);
 return permitted?saved:null;
}
export async function choosePhonePhotoDirectory(phoneId){
 if(!localDirectorySupported())throw new Error('Este navegador não permite selecionar uma pasta local persistente.');
 const handle=await window.showDirectoryPicker({mode:'readwrite'});
 if(!(await ensurePermission(handle,'readwrite')))throw new Error('Permissão para a pasta não concedida.');
 await saveDirectoryHandle(`phone-folder:${phoneId}`,handle,handle.name);
 return{handle,name:handle.name};
}
export async function listDirectoryImages(phoneId,{includePrepared=false}={}){
 const saved=await getPhonePhotoDirectory(phoneId);if(!saved?.handle)return[];
 const files=[];
 for await(const [name,entry] of saved.handle.entries()){
  if(entry.kind!=='file'||!/\.(jpe?g|png|webp)$/i.test(name))continue;
  if(!includePrepared&&/^BM-IA-/i.test(name))continue;
  try{files.push(await entry.getFile())}catch{}
 }
 return files.sort((a,b)=>(a.lastModified||0)-(b.lastModified||0));
}
export async function readPhoneDirectoryImageDataUrl(phoneId,name,{maxSide=3200,quality=.98}={}){
 const saved=await getPhonePhotoDirectory(phoneId);if(!saved?.handle)throw new Error('Pasta local deste aparelho não está vinculada.');
 const handle=await saved.handle.getFileHandle(name);const file=await handle.getFile();
 return resizeImageFile(file,{maxSide,quality});
}
export async function deletePhoneDirectoryFile(phoneId,name){
 if(!name)return;const saved=await getPhonePhotoDirectory(phoneId);if(!saved?.handle)return;
 await saved.handle.removeEntry(name);
}
export async function writeImageToPhoneDirectory(phoneId,name,dataUrl){
 const saved=await getPhonePhotoDirectory(phoneId);if(!saved?.handle)throw new Error('Pasta local deste aparelho não está vinculada.');
 const clean=await sanitizeImageDataUrl(dataUrl);
 const fileHandle=await saved.handle.getFileHandle(name,{create:true});
 const writable=await fileHandle.createWritable();
 await writable.write(dataUrlToBlob(clean));await writable.close();
 return name;
}
export async function getPhotoAsset(id){if(!id)return null;const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}
export async function deletePhotoAsset(id){if(!id)return;await tx('readwrite',store=>store.delete(id))}

export function dataUrlToBlob(dataUrl){const [head,data]=String(dataUrl||'').split(',');const mime=(head.match(/data:([^;]+)/)||[])[1]||'image/jpeg';const bin=atob(data||'');const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new Blob([bytes],{type:mime})}
export function dataUrlToFile(dataUrl,name='foto.jpg'){const blob=dataUrlToBlob(dataUrl);return new File([blob],name,{type:blob.type||'image/jpeg',lastModified:0})}

async function imageFromDataUrl(source){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Imagem inválida.'));img.src=source})}
export async function sanitizeImageDataUrl(source,{maxSide=3200,quality=.98}={}){
 if(!String(source||'').startsWith('data:image/'))throw new Error('Imagem inválida para sanitização.');
 const image=await imageFromDataUrl(source);
 const scale=Math.min(1,maxSide/Math.max(image.naturalWidth,image.naturalHeight));
 const width=Math.max(1,Math.round(image.naturalWidth*scale)),height=Math.max(1,Math.round(image.naturalHeight*scale));
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d',{alpha:false,willReadFrequently:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);
 // Recriar o JPEG pixel a pixel via canvas descarta EXIF, GPS, XMP, IPTC, ICC proprietário, comentários e campos do arquivo de origem.
 return canvas.toDataURL('image/jpeg',quality);
}
export async function putPhotoAsset(asset){const clean=asset?.dataUrl?{...asset,dataUrl:await sanitizeImageDataUrl(asset.dataUrl),metadataSanitized:true,sanitizedAt:new Date().toISOString()}:asset;await tx('readwrite',store=>store.put(clean));return clean}
export async function exportAllPhotoAssets(){const db=await openDb();const records=await new Promise((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error)});return Promise.all(records.map(async item=>item?.dataUrl?{...item,dataUrl:await sanitizeImageDataUrl(item.dataUrl),metadataSanitized:true,sanitizedAt:new Date().toISOString()}:item))}
export async function importPhotoAssets(records,{replace=false}={}){const prepared=await Promise.all((Array.isArray(records)?records:[]).filter(item=>item?.id&&item?.dataUrl).map(async item=>({...item,dataUrl:await sanitizeImageDataUrl(item.dataUrl),metadataSanitized:true,sanitizedAt:new Date().toISOString()})));const db=await openDb();return new Promise((resolve,reject)=>{const t=db.transaction(STORE,'readwrite'),store=t.objectStore(STORE);if(replace)store.clear();for(const item of prepared)store.put(item);t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error)})}
export async function downloadDataUrl(dataUrl,name){const clean=await sanitizeImageDataUrl(dataUrl);const a=document.createElement('a');a.href=clean;a.download=name;a.click()}

export async function resizeImageFile(file,{maxSide=3200,quality=.98}={}){
 const source=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)});
 return sanitizeImageDataUrl(source,{maxSide,quality});
}

const SCENES=[
 ['Branco Clean','Tema local Branco Clean. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Branco Catálogo','Tema local Branco Catálogo. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Cinza Gelo','Tema local Cinza Gelo. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Cinza Premium','Tema local Cinza Premium. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Grafite Fosco','Tema local Grafite Fosco. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Preto Premium','Tema local Preto Premium. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Azul Tech','Tema local Azul Tech. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Azul Petróleo','Tema local Azul Petróleo. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Azul Gelo','Tema local Azul Gelo. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Bege Minimalista','Tema local Bege Minimalista. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Areia Clean','Tema local Areia Clean. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Creme Premium','Tema local Creme Premium. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Madeira Clara','Tema local Madeira Clara. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Carvalho Claro','Tema local Carvalho Claro. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Nogueira','Tema local Nogueira. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Madeira Escura','Tema local Madeira Escura. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Mármore Branco','Tema local Mármore Branco. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Mármore Bege','Tema local Mármore Bege. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Travertino','Tema local Travertino. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Pedra Clara','Tema local Pedra Clara. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Pedra Cinza','Tema local Pedra Cinza. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Microcimento','Tema local Microcimento. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Concreto Claro','Tema local Concreto Claro. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Concreto Escuro','Tema local Concreto Escuro. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Estúdio Claro','Tema local Estúdio Claro. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Estúdio Neutro','Tema local Estúdio Neutro. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Estúdio Escuro','Tema local Estúdio Escuro. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Catálogo Premium','Tema local Catálogo Premium. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Editorial Clean','Tema local Editorial Clean. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Editorial Dark','Tema local Editorial Dark. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Loft Claro','Tema local Loft Claro. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Loft Grafite','Tema local Loft Grafite. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Home Office','Tema local Home Office. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Sala Moderna','Tema local Sala Moderna. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Cozinha Clean','Tema local Cozinha Clean. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Vitrine Clean','Tema local Vitrine Clean. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Tech Minimal','Tema local Tech Minimal. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Tech Premium','Tema local Tech Premium. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Tech Dark','Tema local Tech Dark. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Apple Inspired','Tema local Apple Inspired. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Android Clean','Tema local Android Clean. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Marketplace Clean','Tema local Marketplace Clean. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Marketplace Premium','Tema local Marketplace Premium. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Natural Claro','Tema local Natural Claro. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Natural Quente','Tema local Natural Quente. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Natural Frio','Tema local Natural Frio. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Luz de Janela','Tema local Luz de Janela. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Luz Suave','Tema local Luz Suave. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Golden Soft','Tema local Golden Soft. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Silver Soft','Tema local Silver Soft. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Champagne','Tema local Champagne. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Carbon','Tema local Carbon. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Slate','Tema local Slate. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Nordic','Tema local Nordic. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Scandinavian','Tema local Scandinavian. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Urban Clean','Tema local Urban Clean. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Luxury Light','Tema local Luxury Light. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Luxury Dark','Tema local Luxury Dark. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Produto Branco','Tema local Produto Branco. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.'],
 ['Produto Grafite','Tema local Produto Grafite. A fotografia original permanece inteira; o cenário decorativo é aplicado ao redor da foto, sem recorte do aparelho.']
];
function hash(text){let h=2166136261;for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}
export function sceneForPhone(phone,style='Automático',offset=0){
 const baseHash=hash(phone?.id||phone?.code||phone?.model);
 let baseIndex=0;
 if(style==='Automático')baseIndex=baseHash%SCENES.length;
 else{
  const found=SCENES.findIndex(([name])=>name===style);
  baseIndex=found>=0?found:baseHash%SCENES.length;
 }
 const index=(baseIndex+Number(offset||0))%SCENES.length;
 const [tag,basePrompt]=SCENES[index];
 const signature=(hash(`${phone?.id||''}:${index}:${offset}`)%997)+1;
 return{id:`scene-${index}-${signature}`,style:tag,prompt:basePrompt,offset:Number(offset||0),signature,index}
}
export const photoStyles=['Automático',...SCENES.map(([name])=>name)];

export async function sharePhotoDataUrls(items,title='Fotos do aparelho'){
 const sanitized=await Promise.all(items.map(async(item,index)=>({dataUrl:await sanitizeImageDataUrl(item.dataUrl),name:item.name||`foto-${index+1}.jpg`})));
 const files=sanitized.map(item=>dataUrlToFile(item.dataUrl,item.name));
 if(navigator.share&&navigator.canShare?.({files})){await navigator.share({title,files});return true}
 files.forEach((file,index)=>{const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000+index*100)});return false
}
