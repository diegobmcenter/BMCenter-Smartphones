const url=(import.meta.env.VITE_SUPABASE_URL||'').replace(/\/$/,'');
const anon=import.meta.env.VITE_SUPABASE_ANON_KEY||'';
const SESSION_KEY='bmcenter-cloud-session';
const clientId=sessionStorage.getItem('bmcenter-client-id')||crypto.randomUUID();
sessionStorage.setItem('bmcenter-client-id',clientId);
let writeTimers=new Map();
let applyingRemote=false;
let currentSession=null;
const RESET_KEY='__bmcenter_cloud_reset__';

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
 const dataRows=(rows||[]).filter(row=>row.state_key!==RESET_KEY);
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
    if(row.state_key===RESET_KEY){
     applyingRemote=true;
     const resetKeys=Array.isArray(row.state_value?.keys)?row.state_value.keys:[];
     resetKeys.forEach(key=>localStorage.removeItem(key));
     applyingRemote=false;
     onRemoteChange?.('__BM_RESET__');
     continue;
    }
    applyingRemote=true;
    localStorage.setItem(row.state_key,JSON.stringify(row.state_value));
    applyingRemote=false;
    onRemoteChange?.(row.state_key)
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
  await rest(`app_state?user_id=eq.${user.id}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
  const marker={
   user_id:user.id,
   state_key:RESET_KEY,
   state_value:{keys,deleted_at:new Date().toISOString()},
   updated_by:clientId,
   updated_at:new Date().toISOString()
  };
  await rest('app_state?on_conflict=user_id,state_key',{
   method:'POST',
   headers:{Prefer:'resolution=merge-duplicates,return=minimal'},
   body:JSON.stringify(marker)
  });
  keys.forEach(key=>localStorage.removeItem(key));
 }finally{
  applyingRemote=false;
 }
}
