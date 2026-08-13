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
export async function readPhoneDirectoryImageDataUrl(phoneId,name,{maxSide=2200,quality=.92}={}){
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
export async function sanitizeImageDataUrl(source,{maxSide=2200,quality=.92}={}){
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

export async function resizeImageFile(file,{maxSide=1600,quality=.9}={}){
 const source=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)});
 return sanitizeImageDataUrl(source,{maxSide,quality});
}

const SCENES=[
 ['Minimalista','Bancada de pedra clara acetinada, parede off-white suave, luz natural lateral difusa, ambiente minimalista premium, sem objetos chamativos.'],
 ['Premium','Mesa de madeira clara sofisticada, parede bege quente desfocada, iluminação de estúdio macia e elegante, atmosfera premium discreta.'],
 ['Escuro','Bancada grafite fosca, fundo cinza-carvão com gradiente suave, luz lateral fria controlada, estética tecnológica moderna.'],
 ['Residencial','Mesa de madeira natural clara, sala moderna desfocada ao fundo, luz de janela suave, ambiente residencial organizado e realista.'],
 ['Claro','Superfície branca texturizada, fundo cinza muito claro, sombra natural delicada, visual limpo de catálogo sem parecer estúdio artificial.'],
 ['Premium','Bancada de pedra cinza-clara, painel ripado de madeira desfocado, iluminação quente lateral, composição elegante e moderna.'],
 ['Minimalista','Mesa bege fosca, parede areia uniforme com leve profundidade, luz natural suave, composição extremamente limpa.'],
 ['Escuro','Mesa preta fosca, fundo azul-petróleo muito escuro desfocado, recorte de luz suave, aparência sofisticada sem neon.'],
 ['Residencial','Bancada clara próxima a uma janela, fundo de sala contemporânea suavemente desfocado, luz natural realista.'],
 ['Claro','Bancada cinza-gelo, parede branca quente, iluminação difusa superior e lateral, fotografia comercial limpa.'],
 ['Premium','Pedra travertino clara, fundo creme com planta muito discreta e desfocada, luz de fim de tarde suave, aparência premium.'],
 ['Minimalista','Superfície cinza-clara lisa, fundo branco com sombra arquitetônica suave, composição minimalista editorial.'],
 ['Escuro','Bancada chumbo acetinada, fundo preto suave com parede texturizada discreta, iluminação de produto lateral.'],
 ['Residencial','Mesa de carvalho claro, cozinha moderna desfocada ao fundo, iluminação natural neutra e organizada.'],
 ['Claro','Mesa branca fosca, fundo bege muito claro, iluminação uniforme com sombra de contato realista.'],
 ['Premium','Bancada mineral clara, fundo de escritório moderno desfocado, iluminação sofisticada e neutra.'],
 ['Minimalista','Superfície areia clara, fundo cinza quente liso, luz lateral macia e limpa, sem decoração.'],
 ['Escuro','Bancada grafite com textura fina, fundo preto-marrom suavemente desfocado, luz de recorte quente muito discreta.'],
 ['Residencial','Mesa clara, fundo de home office organizado e desfocado, luz natural suave entrando pela lateral.'],
 ['Claro','Bancada off-white, fundo azul-cinza muito claro desfocado, iluminação de catálogo natural.'],
 ['Premium','Mesa de nogueira clara, parede cinza quente elegante, luz natural difusa com sombras suaves.'],
 ['Minimalista','Bancada de microcimento claro, fundo bege uniforme, composição editorial muito limpa.'],
 ['Escuro','Superfície cinza-escura fosca, fundo chumbo com gradiente, iluminação técnica suave e realista.'],
 ['Residencial','Mesa de madeira média, fundo de sala clean desfocado, luz de janela neutra e aconchegante.']
];
function hash(text){let h=2166136261;for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}
export function sceneForPhone(phone,style='Automático',offset=0){const baseHash=hash(phone?.id||phone?.code||phone?.model),candidates=style==='Automático'?SCENES:SCENES.filter(([tag])=>tag===style);const pool=candidates.length?candidates:SCENES;const index=(baseHash+Number(offset||0))%pool.length;const [tag,basePrompt]=pool[index];const signature=(hash(`${phone?.id||''}:${offset}`)%997)+1,lights=['luz principal vindo da esquerda','luz principal vindo da direita','luz superior difusa com preenchimento lateral','luz de janela frontal-lateral'],tones=['temperatura neutra','temperatura levemente quente','temperatura levemente fria','contraste suave e natural'],composition=['fundo com profundidade curta','fundo com profundidade média','parede mais distante e suavemente desfocada','composição próxima e limpa'];const prompt=`${basePrompt} Variação exclusiva ${signature}: ${lights[baseHash%lights.length]}, ${tones[Math.floor(baseHash/7)%tones.length]}, ${composition[Math.floor(baseHash/13)%composition.length]}.`;return{id:`scene-${tag.toLowerCase()}-${signature}`,style:tag,prompt,offset:Number(offset||0),signature}}
export const photoStyles=['Automático','Claro','Escuro','Premium','Residencial','Minimalista'];

export async function sharePhotoDataUrls(items,title='Fotos do aparelho'){
 const sanitized=await Promise.all(items.map(async(item,index)=>({dataUrl:await sanitizeImageDataUrl(item.dataUrl),name:item.name||`foto-${index+1}.jpg`})));
 const files=sanitized.map(item=>dataUrlToFile(item.dataUrl,item.name));
 if(navigator.share&&navigator.canShare?.({files})){await navigator.share({title,files});return true}
 files.forEach((file,index)=>{const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000+index*100)});return false
}
