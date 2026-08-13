const DB_NAME='bmcenter-photo-studio-v1';
const STORE='assets';

function openDb(){
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window))return reject(new Error('Este navegador não oferece armazenamento local de imagens.'));
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:'id'});store.createIndex('phoneId','phoneId',{unique:false})}};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Falha ao abrir a biblioteca de fotos.'));
 });
}
function tx(mode,callback){return openDb().then(db=>new Promise((resolve,reject)=>{const t=db.transaction(STORE,mode),store=t.objectStore(STORE);let result;try{result=callback(store)}catch(error){reject(error);return}t.oncomplete=()=>resolve(result);t.onerror=()=>reject(t.error||new Error('Falha ao acessar as fotos.'));t.onabort=()=>reject(t.error||new Error('Operação cancelada.'))}))}
export async function putPhotoAsset(asset){await tx('readwrite',store=>store.put(asset));return asset}
export async function getPhotoAsset(id){if(!id)return null;const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}
export async function deletePhotoAsset(id){if(!id)return;await tx('readwrite',store=>store.delete(id))}
export async function exportAllPhotoAssets(){const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error)})}
export async function importPhotoAssets(records,{replace=false}={}){const db=await openDb();return new Promise((resolve,reject)=>{const t=db.transaction(STORE,'readwrite'),store=t.objectStore(STORE);if(replace)store.clear();for(const item of Array.isArray(records)?records:[])if(item?.id&&item?.dataUrl)store.put(item);t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error)})}

export function dataUrlToBlob(dataUrl){const [head,data]=String(dataUrl||'').split(',');const mime=(head.match(/data:([^;]+)/)||[])[1]||'image/jpeg';const bin=atob(data||'');const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new Blob([bytes],{type:mime})}
export function dataUrlToFile(dataUrl,name='foto.jpg'){const blob=dataUrlToBlob(dataUrl);return new File([blob],name,{type:blob.type||'image/jpeg'})}
export function downloadDataUrl(dataUrl,name){const a=document.createElement('a');a.href=dataUrl;a.download=name;a.click()}

export async function resizeImageFile(file,{maxSide=1600,quality=.9}={}){
 const source=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file)});
 const image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Imagem inválida.'));img.src=source});
 const scale=Math.min(1,maxSide/Math.max(image.naturalWidth,image.naturalHeight));const width=Math.max(1,Math.round(image.naturalWidth*scale)),height=Math.max(1,Math.round(image.naturalHeight*scale));
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);return canvas.toDataURL('image/jpeg',quality)
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
 const files=items.map((item,index)=>dataUrlToFile(item.dataUrl,item.name||`foto-${index+1}.jpg`));
 if(navigator.share&&navigator.canShare?.({files})){await navigator.share({title,files});return true}
 files.forEach((file,index)=>{const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000+index*100)});return false
}
