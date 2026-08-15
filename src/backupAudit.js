export const BACKUP_RUNTIME_KEY='bmcenter-backup-runtime-v1';
export const AUTO_BACKUP_REFRESH_MS=3*60*60*1000;
export const AUTO_BACKUP_CHECK_MS=15*60*1000;

function stable(value){
 if(Array.isArray(value))return value.map(stable);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));
 return value;
}

export function backupFingerprint(backup){
 const payload=stable({storage:backup?.storage||{},sessionStorage:backup?.sessionStorage||{}});
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

export function auditBackupObject(backup,{requiredKeys=[]}={}){
 const errors=[],warnings=[];
 if(!backup||typeof backup!=='object')errors.push('backup ausente');
 if(!backup?.storage||typeof backup.storage!=='object'||Array.isArray(backup.storage))errors.push('storage inválido');
 if(!backup?.sessionStorage||typeof backup.sessionStorage!=='object'||Array.isArray(backup.sessionStorage))warnings.push('sessionStorage ausente');
 const storage=backup?.storage||{};
 const missingRequired=requiredKeys.filter(key=>!Object.prototype.hasOwnProperty.call(storage,key));
 if(missingRequired.length)errors.push(`chaves essenciais ausentes: ${missingRequired.join(', ')}`);
 try{JSON.stringify(backup)}catch(error){errors.push(`backup não serializável: ${error?.message||error}`)}
 const fingerprint=backupFingerprint(backup);
 return{ok:errors.length===0,errors,warnings,missingRequired,fingerprint,totalKeys:Object.keys(storage).length,totalSessionKeys:Object.keys(backup?.sessionStorage||{}).length};
}
