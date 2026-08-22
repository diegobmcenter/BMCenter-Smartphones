export function phoneCodeNumber(code){
  const value=Number(String(code||'').replace(/\D/g,''));
  return Number.isFinite(value)&&value>0?value:0;
}

export function formatPhoneCode(number){
  const value=Math.max(1,Math.floor(Number(number)||1));
  return `BM-${String(value).padStart(6,'0')}`;
}

export function nextPhoneCode(items=[],floor=0){
  const max=(Array.isArray(items)?items:[]).reduce((current,phone)=>Math.max(current,phoneCodeNumber(phone?.code)),Math.max(0,Math.floor(Number(floor)||0)));
  return formatPhoneCode(max+1);
}

export function phoneCreationTimestamp(phone={}){
  if(phone.createdAt){const value=Date.parse(phone.createdAt);if(Number.isFinite(value))return value}
  const timeline=Array.isArray(phone.timeline)?phone.timeline:[];
  const created=timeline.find(entry=>/cadastrad|adicionad/i.test(String(entry?.message||'')))||timeline[0];
  if(created?.date){const value=Date.parse(created.date);if(Number.isFinite(value))return value}
  if(phone.date){const value=Date.parse(`${phone.date}T12:00:00`);if(Number.isFinite(value))return value}
  return 0;
}

export function resequencePhoneCodes(items=[],stamp=new Date().toISOString()){
  const source=Array.isArray(items)?items:[];
  const ordered=[...source].sort((a,b)=>{
    const codeDiff=phoneCodeNumber(a?.code)-phoneCodeNumber(b?.code);
    if(codeDiff)return codeDiff;
    const createdDiff=phoneCreationTimestamp(a)-phoneCreationTimestamp(b);
    if(createdDiff)return createdDiff;
    return String(a?.id||'').localeCompare(String(b?.id||''));
  });
  const nextCodeById=new Map(ordered.map((phone,index)=>[String(phone?.id||index),formatPhoneCode(index+1)]));
  let changed=false;
  const migrated=source.map((phone,index)=>{
    const key=String(phone?.id||index),oldCode=String(phone?.code||''),newCode=nextCodeById.get(key)||formatPhoneCode(index+1);
    if(oldCode===newCode&&phone?.createdAt)return phone;
    const history=Array.isArray(phone?.codeHistory)?[...phone.codeHistory]:[];
    if(oldCode&&oldCode!==newCode&&!history.some(entry=>entry?.code===oldCode))history.push({code:oldCode,changedAt:stamp,reason:'Ressequenciamento dos códigos internos BM'});
    const createdAt=phone?.createdAt||(Array.isArray(phone?.timeline)&&phone.timeline[0]?.date)||(phone?.date?`${phone.date}T12:00:00`:stamp);
    changed=changed||oldCode!==newCode||!phone?.createdAt;
    return {...phone,code:newCode,legacyCode:phone?.legacyCode||oldCode||'',codeHistory:history,createdAt};
  });
  return {phones:migrated,changed};
}
