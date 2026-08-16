export const BACKUP_RUNTIME_KEY='bmcenter-backup-runtime-v1';
export const AUTO_BACKUP_REFRESH_MS=3*60*60*1000;
export const AUTO_BACKUP_CHECK_MS=15*60*1000;

function stable(value){
 if(Array.isArray(value))return value.map(stable);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));
 return value;
}


export function decodeStorageRaw(raw){
 try{return{value:JSON.parse(raw),encoding:'json'}}catch{return{value:raw,encoding:'raw'}}
}

export function encodeStorageValue(value,encoding='json'){
 return encoding==='raw'?String(value??''):JSON.stringify(value)
}

export function backupFingerprint(backup){
 const version=Number(backup?.formatVersion||0);
 const payload=version>=7
  ?stable({storage:backup?.storage||{},sessionStorage:backup?.sessionStorage||{},storageEncoding:backup?.storageEncoding||{},sessionStorageEncoding:backup?.sessionStorageEncoding||{}})
  :stable({storage:backup?.storage||{},sessionStorage:backup?.sessionStorage||{}});
 const text=JSON.stringify(payload);
 let hash=2166136261;
 for(let i=0;i<text.length;i++){
  hash^=text.charCodeAt(i);
  hash=Math.imul(hash,16777619);
 }
 return `${(hash>>>0).toString(16).padStart(8,'0')}:${text.length}`;
}

export function automaticBackupBucket(date=new Date()){
 const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
 return `${y}-${m}-${d}`;
}

export function shouldRefreshAutomaticBackup(meta,{fingerprint,bucket,now=Date.now(),minRefreshMs=AUTO_BACKUP_REFRESH_MS}={}){
 if(!fingerprint||!bucket)return false;
 if(!meta||typeof meta!=='object')return true;
 if(meta.bucket!==bucket)return true;
 if(meta.fingerprint===fingerprint)return false;
 const last=Number(meta.lastSuccessAt||0);
 return !last||now-last>=minRefreshMs;
}

function sameKeys(actual,declared){
 if(!Array.isArray(declared))return true;
 const a=[...actual].sort(),d=[...declared].sort();
 return a.length===d.length&&a.every((value,index)=>value===d[index]);
}

export function auditBackupObject(backup,{requiredKeys=[]}={}){
 const errors=[],warnings=[];
 if(!backup||typeof backup!=='object')errors.push('backup ausente');
 if(!backup?.storage||typeof backup.storage!=='object'||Array.isArray(backup.storage))errors.push('storage inválido');
 if(!backup?.sessionStorage||typeof backup.sessionStorage!=='object'||Array.isArray(backup.sessionStorage))warnings.push('sessionStorage ausente');
 const storage=backup?.storage||{},session=backup?.sessionStorage||{};
 const missingRequired=requiredKeys.filter(key=>!Object.prototype.hasOwnProperty.call(storage,key));
 if(missingRequired.length)errors.push(`chaves essenciais ausentes: ${missingRequired.join(', ')}`);
 try{JSON.stringify(backup)}catch(error){errors.push(`backup não serializável: ${error?.message||error}`)}
 const fingerprint=backupFingerprint(backup);
 const declaredFingerprint=String(backup?.audit?.fingerprint||'');
 if(declaredFingerprint&&declaredFingerprint!==fingerprint)errors.push('fingerprint de integridade divergente');
 if(!sameKeys(Object.keys(storage),backup?.audit?.capturedKeys))errors.push('inventário de chaves permanentes divergente');
 if(!sameKeys(Object.keys(session),backup?.audit?.capturedSessionKeys))errors.push('inventário de chaves de sessão divergente');
 if(Number(backup?.formatVersion||0)>=7){
  const storageEncoding=backup?.storageEncoding;
  const sessionEncoding=backup?.sessionStorageEncoding;
  if(!storageEncoding||typeof storageEncoding!=='object'||Array.isArray(storageEncoding))errors.push('mapa de serialização permanente ausente');
  if(!sessionEncoding||typeof sessionEncoding!=='object'||Array.isArray(sessionEncoding))errors.push('mapa de serialização de sessão ausente');
  const missingStorageEncoding=Object.keys(storage).filter(key=>!['json','raw'].includes(storageEncoding?.[key]));
  const missingSessionEncoding=Object.keys(session).filter(key=>!['json','raw'].includes(sessionEncoding?.[key]));
  if(missingStorageEncoding.length)errors.push(`serialização permanente não definida: ${missingStorageEncoding.join(', ')}`);
  if(missingSessionEncoding.length)errors.push(`serialização de sessão não definida: ${missingSessionEncoding.join(', ')}`);
 }
 return{ok:errors.length===0,errors,warnings,missingRequired,fingerprint,totalKeys:Object.keys(storage).length,totalSessionKeys:Object.keys(session).length};
}
