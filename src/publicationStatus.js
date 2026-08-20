const AUTO_ANNOUNCE_STATUSES=new Set(['Pronto','Para fotografar','Anúncio preparado','Anunciado']);

export function activePublicationIdsFromMap(profileMap){
 if(!profileMap||typeof profileMap!=='object'||Array.isArray(profileMap))return[];
 return Object.entries(profileMap).filter(([,entry])=>entry&&entry.active!==false).map(([id])=>id);
}

export function syncPhonePublicationStatus(phone,profileMap,{returnToReadyWhenEmpty=false}={}){
 if(!phone||typeof phone!=='object')return phone;
 if(phone?.sale?.soldAt||phone.status==='Vendido'||phone.status==='Descarte/Sucata')return phone;
 const hasActive=activePublicationIdsFromMap(profileMap).length>0;
 let status=phone.status;
 if(hasActive&&AUTO_ANNOUNCE_STATUSES.has(status))status='Anunciado';
 else if(!hasActive&&returnToReadyWhenEmpty&&status==='Anunciado')status='Pronto';
 return status===phone.status?phone:{...phone,status};
}
