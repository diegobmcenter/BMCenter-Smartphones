import{auditBackupObject}from'./backupAudit.js';
const url=(import.meta.env.VITE_SUPABASE_URL||'').replace(/\/$/,'');
const anon=import.meta.env.VITE_SUPABASE_ANON_KEY||'';
const SESSION_KEY='bmcenter-cloud-session';
const clientId=sessionStorage.getItem('bmcenter-client-id')||crypto.randomUUID();
sessionStorage.setItem('bmcenter-client-id',clientId);
let writeTimers=new Map();
let applyingRemote=false;
let currentSession=null;
const RESET_KEY='__bmcenter_cloud_reset__';
const BACKUP_PREFIX='__bmcenter_backup__:';
export const CLOUD_REMOTE_EVENT='bmcenter:remote-state';
function emitRemoteState(key,value,meta={}){try{window.dispatchEvent(new CustomEvent(CLOUD_REMOTE_EVENT,{detail:{key,value,...meta}}))}catch{}}

export function cloudConfigured(){return Boolean(url&&anon)}
export function getCloudStatus(){return{configured:cloudConfigured(),clientId}}

function saveSession(session){currentSession=session||null;if(session)localStorage.setItem(SESSION_KEY,JSON.stringify(session));else localStorage.removeItem(SESSION_KEY)}
function readSession(){if(currentSession)return currentSession;try{currentSession=JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{currentSession=null}return currentSession}
async function authFetch(path,options={}){const response=await fetch(`${url}/auth/v1${path}`,{...options,headers:{apikey:anon,'Content-Type':'application/json',...(options.headers||{})}});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.msg||data.message||data.error_description||'Falha na autenticação');return data}
async function refreshSession(session){if(!session?.refresh_token)return null;const data=await authFetch('/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:session.refresh_token})});saveSession(data);return data}
export async function getCloudSession(){if(!cloudConfigured())return null;let session=readSession();if(!session)return null;const expiresAt=Number(session.expires_at||0)*1000;if(expiresAt&&expiresAt<Date.now()+60000){try{session=await refreshSession(session)}catch{saveSession(null);return null}}return session}
export async function signInCloud(email,password){const data=await authFetch('/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});saveSession(data);return{...data,session:data,user:data.user}}
export async function signUpCloud(email,password){const data=await authFetch('/signup',{method:'POST',body:JSON.stringify({email,password})});if(data.access_token)saveSession(data);return{...data,session:data.access_token?data:null,user:data.user}}
export async function signOutCloud(){const session=await getCloudSession();if(session?.access_token){await fetch(`${url}/auth/v1/logout`,{method:'POST',headers:{apikey:anon,Authorization:`Bearer ${session.access_token}`}}).catch(()=>{})}saveSession(null)}
async function rest(path,options={}){let session=await getCloudSession();if(!session?.access_token)throw new Error('Sessão expirada. Entre novamente.');let response=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:anon,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json',...(options.headers||{})}});if(response.status===401){session=await refreshSession(session);response=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:anon,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json',...(options.headers||{})}})}const text=await response.text();const data=text?JSON.parse(text):null;if(!response.ok)throw new Error(data?.message||data?.hint||`Erro de nuvem ${response.status}`);return data}
function safeParse(value){try{return JSON.parse(value??'[]')}catch{return[]}}
export async function initializeCloudState(keys){
 const session=await getCloudSession();const user=session?.user;if(!user)return;
 const rows=await rest(`app_state?select=state_key,state_value,updated_at&user_id=eq.${user.id}`);
 const resetRow=(rows||[]).find(row=>row.state_key===RESET_KEY);
 if(resetRow){
  applyingRemote=true;
  const resetKeys=Array.isArray(resetRow.state_value?.keys)?resetRow.state_value.keys:keys;
  resetKeys.forEach(key=>localStorage.removeItem(key));
  applyingRemote=false;
 }
 const dataRows=(rows||[]).filter(row=>row.state_key!==RESET_KEY&&!row.state_key.startsWith(BACKUP_PREFIX));
 if(!dataRows.length){
  if(resetRow)return;
  const payload=keys.map(key=>({user_id:user.id,state_key:key,state_value:safeParse(localStorage.getItem(key)),updated_by:clientId,updated_at:new Date().toISOString()}));
  if(payload.length)await rest('app_state?on_conflict=user_id,state_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(payload)});
  return;
 }
 applyingRemote=true;
 for(const row of dataRows)localStorage.setItem(row.state_key,JSON.stringify(row.state_value));
 applyingRemote=false
}
export function queueCloudSave(key,value){if(!cloudConfigured()||applyingRemote)return;clearTimeout(writeTimers.get(key));writeTimers.set(key,setTimeout(async()=>{try{const session=await getCloudSession();const user=session?.user;if(!user)return;await rest('app_state?on_conflict=user_id,state_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:user.id,state_key:key,state_value:value,updated_by:clientId,updated_at:new Date().toISOString()})})}catch(error){console.error('Cloud save failed',error)}},220))}
export function subscribeCloudState(onRemoteChange){
 if(!cloudConfigured())return()=>{};
 let stopped=false;let timer;let lastSync=new Date().toISOString();
 async function poll(){
  if(stopped)return;
  try{
   const session=await getCloudSession();const user=session?.user;if(!user)return;
   const since=encodeURIComponent(lastSync);
   const rows=await rest(`app_state?select=state_key,state_value,updated_at,updated_by&user_id=eq.${user.id}&updated_at=gt.${since}&order=updated_at.asc`);
   for(const row of rows||[]){
    if(row.updated_at>lastSync)lastSync=row.updated_at;
    if(row.updated_by===clientId)continue;
    if(row.state_key.startsWith(BACKUP_PREFIX))continue;
    if(row.state_key===RESET_KEY){
     applyingRemote=true;
     const resetKeys=Array.isArray(row.state_value?.keys)?row.state_value.keys:[];
     resetKeys.forEach(key=>localStorage.removeItem(key));
     applyingRemote=false;
     emitRemoteState('__BM_RESET__',row.state_value,{updatedAt:row.updated_at,updatedBy:row.updated_by});
     onRemoteChange?.('__BM_RESET__',row.state_value,{updatedAt:row.updated_at,updatedBy:row.updated_by});
     continue;
    }
    applyingRemote=true;
    localStorage.setItem(row.state_key,JSON.stringify(row.state_value));
    applyingRemote=false;
    emitRemoteState(row.state_key,row.state_value,{updatedAt:row.updated_at,updatedBy:row.updated_by});
    onRemoteChange?.(row.state_key,row.state_value,{updatedAt:row.updated_at,updatedBy:row.updated_by})
   }
  }catch(error){console.warn('Cloud polling',error)}
  finally{if(!stopped)timer=setTimeout(poll,2500)}
 }
 timer=setTimeout(poll,2500);
 return()=>{stopped=true;clearTimeout(timer)}
}

export async function clearCloudState(keys=[]){
 if(!cloudConfigured())throw new Error('A nuvem não está configurada.');
 const session=await getCloudSession();const user=session?.user;
 if(!user)throw new Error('Sessão expirada. Entre novamente.');
 applyingRemote=true;
 try{
  /* Backups são o cofre de recuperação. Limpar os dados operacionais nunca pode
     apagar esse cofre junto. Primeiro inventariamos as chaves para que todos os
     outros dispositivos removam inclusive módulos criados em versões futuras. */
  const existing=await rest(`app_state?select=state_key&user_id=eq.${user.id}&state_key=not.like.${encodeURIComponent(BACKUP_PREFIX+'*')}`);
  const resetKeys=[...new Set([...(keys||[]),...(existing||[]).map(row=>row.state_key).filter(key=>key!==RESET_KEY)])];
  await rest(`app_state?user_id=eq.${user.id}&state_key=not.like.${encodeURIComponent(BACKUP_PREFIX+'*')}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
  const marker={
   user_id:user.id,
   state_key:RESET_KEY,
   state_value:{keys:resetKeys,deleted_at:new Date().toISOString()},
   updated_by:clientId,
   updated_at:new Date().toISOString()
  };
  await rest('app_state?on_conflict=user_id,state_key',{
   method:'POST',
   headers:{Prefer:'resolution=merge-duplicates,return=minimal'},
   body:JSON.stringify(marker)
  });
  resetKeys.forEach(key=>localStorage.removeItem(key));
  return resetKeys;
 }finally{
  applyingRemote=false;
 }
}

export async function pushCloudStateNow(key,value){
 if(!cloudConfigured())return;
 const session=await getCloudSession();const user=session?.user;if(!user)throw new Error('Sessão expirada.');
 clearTimeout(writeTimers.get(key));
 await rest('app_state?on_conflict=user_id,state_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:user.id,state_key:key,state_value:value,updated_by:clientId,updated_at:new Date().toISOString()})})
}
export async function createCloudBackup(backup,options={}){
 const session=await getCloudSession();const user=session?.user;if(!user)throw new Error('Sessão expirada.');
 const kind=options.kind||'manual',bucket=options.bucket||'',createdAt=new Date().toISOString(),id=crypto.randomUUID();
 const stateKey=kind==='automatic'&&bucket?`${BACKUP_PREFIX}auto:${bucket}`:`${BACKUP_PREFIX}${kind}:${createdAt}:${id}`;
 const stateValue={...backup,id,stateKey,createdAt,backupKind:kind,backupBucket:bucket||null};
 await rest('app_state?on_conflict=user_id,state_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:user.id,state_key:stateKey,state_value:stateValue,updated_by:clientId,updated_at:createdAt})});
 /* Não considerar o POST concluído como backup válido sem reler o registro. */
 const verify=await rest(`app_state?select=state_value&user_id=eq.${user.id}&state_key=eq.${encodeURIComponent(stateKey)}`);
 const stored=verify?.[0]?.state_value;
 if(!stored)throw new Error('O backup foi enviado, mas não pôde ser confirmado na nuvem.');
 const expectedFingerprint=backup?.audit?.fingerprint||'';
 if(expectedFingerprint&&stored?.audit?.fingerprint!==expectedFingerprint)throw new Error('A verificação do backup na nuvem encontrou divergência de integridade.');
 const storedAudit=auditBackupObject(stored,{requiredKeys:Array.isArray(backup?.audit?.requiredKeys)?backup.audit.requiredKeys:[]});
 if(!storedAudit.ok)throw new Error(`O backup gravado na nuvem falhou na auditoria: ${storedAudit.errors.join('; ')}`);
 const all=await rest(`app_state?select=state_key,updated_at&user_id=eq.${user.id}&state_key=like.${encodeURIComponent(BACKUP_PREFIX+'*')}&order=updated_at.desc`);
 for(const row of (all||[]).slice(10))await rest(`app_state?user_id=eq.${user.id}&state_key=eq.${encodeURIComponent(row.state_key)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
 return{id:stateKey,createdAt,kind,bucket,verified:true}
}
export async function listCloudBackups(){
 const session=await getCloudSession();const user=session?.user;if(!user)return[];
 const rows=await rest(`app_state?select=state_key,state_value,updated_at&user_id=eq.${user.id}&state_key=like.${encodeURIComponent(BACKUP_PREFIX+'*')}&order=updated_at.desc`);
 return(rows||[]).map(row=>({
  id:row.state_key,
  createdAt:row.state_value?.createdAt||row.updated_at,
  kind:row.state_value?.backupKind||'legacy',
  bucket:row.state_value?.backupBucket||null,
  appVersion:row.state_value?.appVersion||'',
  integrity:row.state_value?.audit?.ok===true&&Boolean(row.state_value?.audit?.fingerprint),
  fingerprint:row.state_value?.audit?.fingerprint||'',
  totalKeys:row.state_value?.summary?.totalKeys||0,
  summary:row.state_value?.summary?`${row.state_value.summary.smartphones||0} aparelho(s), ${row.state_value.summary.suppliers||0} fornecedor(es), ${row.state_value.summary.bankAccounts||0} conta(s) bancária(s), ${row.state_value.summary.partsOrders||0} pedido(s) de peça`:''
 }))
}
export async function restoreCloudBackup(id){
 const session=await getCloudSession();const user=session?.user;if(!user)throw new Error('Sessão expirada.');
 const rows=await rest(`app_state?select=state_value&user_id=eq.${user.id}&state_key=eq.${encodeURIComponent(id)}`);
 if(!rows?.[0]?.state_value)throw new Error('Backup não encontrado.');
 const backup=rows[0].state_value;
 const audit=auditBackupObject(backup,{requiredKeys:Array.isArray(backup?.audit?.requiredKeys)?backup.audit.requiredKeys:[]});
 if(backup?.audit?.fingerprint&&!audit.ok)throw new Error(`Backup da nuvem corrompido ou divergente: ${audit.errors.join('; ')}`);
 return backup
}
export async function deleteCloudBackup(id){
 const session=await getCloudSession();const user=session?.user;if(!user)throw new Error('Sessão expirada.');
 await rest(`app_state?user_id=eq.${user.id}&state_key=eq.${encodeURIComponent(id)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}})
}
