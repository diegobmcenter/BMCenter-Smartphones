import React,{useEffect,useState} from 'react';
import {Archive,Check,ChevronDown,Clock3,Eye,Filter,MoreHorizontal,Plus,RotateCcw,Search,Settings,Star,Trash2,UsersRound,WalletCards,X,TrendingUp} from 'lucide-react';
function capacity(value){const text=String(value??'').trim();if(!text)return'';return /gb$/i.test(text)?text:`${text}GB`}
function specs(phone){return [phone.color,capacity(phone.storage),phone.ram&&`${capacity(phone.ram)} RAM`,phone.nfc===true?'NFC':'',phone.connector||'',phone.screenProtector===true?'Película':'',phone.caseIncluded===true?'Capinha':'',phone.likeNew===true?'Estado de novo':'',phone.biometrics===true?'Biometria':''].filter(Boolean).join(' · ')||'Sem detalhes'}
function InlineMoney({label,value,onCommit,tone=''}){const[draft,setDraft]=useState(String(Number(value||0).toFixed(2)).replace('.',','));useEffect(()=>setDraft(String(Number(value||0).toFixed(2)).replace('.',',')),[value]);const commit=()=>{const normalized=Number(String(draft).replace(/\./g,'').replace(',','.'));if(Number.isFinite(normalized))onCommit(Math.max(0,normalized));else setDraft(String(Number(value||0).toFixed(2)).replace('.',','))};return <label className={`v102-inline-money ${tone}`}><span>{label}</span><div><small>R$</small><input inputMode="decimal" value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();if(e.key==='Escape'){setDraft(String(Number(value||0).toFixed(2)).replace('.',','));e.currentTarget.blur()}}}/></div></label>}

function draftDate(value){if(!value)return'Salvo anteriormente';try{return `Salvo em ${new Date(value).toLocaleString('pt-BR')}`}catch{return'Salvo anteriormente'}}
function DraftPanel({phoneDraft,batchDraft,continuePhoneDraft,continueBatchDraft,deletePhoneDraft,deleteBatchDraft}){
 const drafts=[phoneDraft&&{id:'phone',title:[phoneDraft.phone?.brand,phoneDraft.phone?.model].filter(Boolean).join(' ')||'Novo aparelho',subtitle:'Cadastro individual',savedAt:phoneDraft.savedAt,onContinue:continuePhoneDraft,onDelete:deletePhoneDraft},batchDraft&&{id:'batch',title:`Cadastro em massa · ${(batchDraft.rows||[]).filter(row=>row.brand||row.model).length||0} aparelho(s) preenchido(s)`,subtitle:'Lote de aparelhos',savedAt:batchDraft.savedAt,onContinue:continueBatchDraft,onDelete:deleteBatchDraft}].filter(Boolean);
 if(!drafts.length)return null;
 return <section className="v102-drafts-panel"><header><div><Clock3 size={16}/><div><b>Rascunhos</b><small>Continue cadastros que ainda não foram finalizados.</small></div></div><span>{drafts.length}</span></header><div className="v102-drafts-list">{drafts.map(draft=><article key={draft.id}><div className="v102-draft-icon"><Clock3 size={15}/></div><div className="v102-draft-copy"><small>{draft.subtitle}</small><b>{draft.title}</b><span>{draftDate(draft.savedAt)}</span></div><div className="v102-draft-actions"><button className="continue" onClick={draft.onContinue}>Continuar cadastro</button><button className="delete" title="Excluir rascunho" onClick={draft.onDelete}><Trash2 size={14}/></button></div></article>)}</div></section>
}

function MultiStatusFilter({statuses,value,onChange}){
 const[open,setOpen]=useState(false);
 const selected=Array.isArray(value)?value:[];
 const toggle=status=>onChange(selected.includes(status)?selected.filter(item=>item!==status):[...selected,status]);
 return <div className={`v10314-status-filter ${open?'open':''}`}>
  <button type="button" className={selected.length?'active':''} onClick={()=>setOpen(current=>!current)}>
   <span>{selected.length?`${selected.length} status selecionado(s)`:'Todos os status'}</span><ChevronDown size={14}/>
  </button>
  {open&&<div className="v10314-status-popover">
   <div className="v10314-status-popover-head"><b>Filtrar por status</b>{selected.length>0&&<button type="button" onClick={()=>onChange([])}>Limpar</button>}</div>
   <div className="v10314-status-options">{statuses.map(status=><button type="button" key={status} className={selected.includes(status)?'selected':''} onClick={()=>toggle(status)}><span className="check">{selected.includes(status)&&<Check size={12}/>}</span><span>{status}</span></button>)}</div>
   <button type="button" className="v10314-status-done" onClick={()=>setOpen(false)}>Concluído</button>
  </div>}
 </div>
}

function BinaryFilter({label,value,onChange}){return <label><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}><option value="Todos">Todos</option><option value="Sim">Sim</option><option value="Não">Não</option></select></label>}

export default function SmartphonesV102({filtered,statuses,statusFilter,setStatusFilter,allTags,tagFilter,setTagFilter,query,setQuery,onlyFavorites,setOnlyFavorites,profiles,showProductCode,phoneTotalCost,money,toggleFavorite,changeStatus,setDetail,setEdit,setColumnEditor,setBatchCreate,blankPhone,items,actionPhone,setActionPhone,setSalePhone,persist,updateFinancial,totalExpected,phoneDraft,batchDraft,continuePhoneDraft,continueBatchDraft,deletePhoneDraft,deleteBatchDraft}){
 const[showExtraFilters,setShowExtraFilters]=useState(false);
 const[showStatusFilters,setShowStatusFilters]=useState(false);
 const[profilePhone,setProfilePhone]=useState(null);
 useEffect(()=>{
  if(!actionPhone)return;
  const close=event=>{const target=event.target instanceof Element?event.target:null;if(target&&!target.closest('.v102-menu-anchor'))setActionPhone(null)};
  const key=event=>{if(event.key==='Escape')setActionPhone(null)};
  document.addEventListener('pointerdown',close);window.addEventListener('keydown',key);
  return()=>{document.removeEventListener('pointerdown',close);window.removeEventListener('keydown',key)}
 },[actionPhone,setActionPhone]);
 useEffect(()=>{
  if(!showStatusFilters&&!showExtraFilters)return;
  const close=event=>{const target=event.target instanceof Element?event.target:null;if(target&&!target.closest('.v10313-main-toolbar,.v1041-status-strip,.v10313-extra-filters')){setShowStatusFilters(false);setShowExtraFilters(false)}};
  const key=event=>{if(event.key==='Escape'){setShowStatusFilters(false);setShowExtraFilters(false)}};
  document.addEventListener('pointerdown',close);window.addEventListener('keydown',key);
  return()=>{document.removeEventListener('pointerdown',close);window.removeEventListener('keydown',key)}
 },[showStatusFilters,showExtraFilters]);
 const[extra,setExtra]=useState({ram:'Todos',storage:'Todos',connector:'Todos',nfc:'Todos',biometrics:'Todos',likeNew:'Todos',screenProtector:'Todos',caseIncluded:'Todos'});
 const uniqueValues=key=>[...new Set(items.map(phone=>String(phone?.[key]??'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true,sensitivity:'base'}));
 const ramOptions=uniqueValues('ram'),storageOptions=uniqueValues('storage'),connectorOptions=uniqueValues('connector');
 const booleanMatch=(phone,key,value)=>value==='Todos'||(value==='Sim'?phone?.[key]===true:phone?.[key]===false);
 const advancedFiltered=filtered.filter(phone=>
  (extra.ram==='Todos'||String(phone.ram??'').trim()===extra.ram)&&
  (extra.storage==='Todos'||String(phone.storage??'').trim()===extra.storage)&&
  (extra.connector==='Todos'||String(phone.connector??'').trim()===extra.connector)&&
  booleanMatch(phone,'nfc',extra.nfc)&&
  booleanMatch(phone,'biometrics',extra.biometrics)&&
  booleanMatch(phone,'likeNew',extra.likeNew)&&
  booleanMatch(phone,'screenProtector',extra.screenProtector)&&
  booleanMatch(phone,'caseIncluded',extra.caseIncluded)
 );
 const activeExtraCount=Object.values(extra).filter(value=>value!=='Todos').length;
 const setExtraFilter=(key,value)=>setExtra(current=>({...current,[key]:value}));
 const clearExtraFilters=()=>setExtra({ram:'Todos',storage:'Todos',connector:'Todos',nfc:'Todos',biometrics:'Todos',likeNew:'Todos',screenProtector:'Todos',caseIncluded:'Todos'});
 const profileMap=phone=>{
  const source=phone?.marketplaceProfiles&&typeof phone.marketplaceProfiles==='object'?{...phone.marketplaceProfiles}:{};
  try{(phone?.ads||[]).forEach(ad=>Object.entries(ad?.publications||{}).forEach(([id,pub])=>{const hadPublication=!!pub?.date&&['published','removed'].includes(pub?.status);if(hadPublication&&!source[id])source[id]={active:pub.status==='published'&&!phone?.sale?.soldAt&&phone?.status!=='Vendido',publishedAt:pub.date||'',endedAt:pub.endedAt||'',endedReason:pub.endedReason||'',updatedAt:pub.updatedAt||''}}))}catch{}
  (phone?.sale?.publicationProfiles||[]).forEach(entry=>{if(entry?.id&&!source[entry.id])source[entry.id]={active:false,publishedAt:entry.publishedAt||'',endedAt:phone?.sale?.soldAt||'',endedReason:'sold'}});
  return source;
 };
 const historicalProfilesFor=phone=>Object.entries(profileMap(phone)).filter(([,value])=>!!value&&(value.publishedAt||value.active!==undefined)).map(([id])=>id);
 const publishedProfilesFor=phone=>(phone?.sale?.soldAt||phone?.status==='Vendido')?[]:Object.entries(profileMap(phone)).filter(([,value])=>value?.active!==false).map(([id])=>id);
 const toggleProfile=(phone,profileId)=>{
  if(phone?.sale?.soldAt||phone?.status==='Vendido')return;
  const map=profileMap(phone),current=map[profileId]||{},currentlyActive=current?.active!==false&&!!map[profileId];
  const stamp=new Date().toISOString(),date=stamp.slice(0,10);
  const updated={...phone,marketplaceProfiles:{...map,[profileId]:{...current,active:!currentlyActive,publishedAt:!currentlyActive?(current.publishedAt||date):(current.publishedAt||''),updatedAt:stamp}},lastActivityAt:stamp};
  persist(items.map(item=>item.id===phone.id?updated:item));
  setProfilePhone(updated);
 };
 const updateProfileDate=(phone,profileId,publishedAt)=>{
  if(!publishedAt||phone?.sale?.soldAt||phone?.status==='Vendido')return;
  const map=profileMap(phone),current=map[profileId]||{},stamp=new Date().toISOString();
  const updated={...phone,marketplaceProfiles:{...map,[profileId]:{...current,active:true,publishedAt,updatedAt:stamp}},lastActivityAt:stamp};
  persist(items.map(item=>item.id===phone.id?updated:item));
  setProfilePhone(updated);
 };

 return <div className="v102-page"><header className="v102-hero v102-smartphones-hero"><div><span>INVENTÁRIO</span><div className="v102-title-line"><h1>Smartphones</h1><div className="v102-receivable"><TrendingUp size={16}/><div><small>Previsão ao vender o estoque</small><strong>{money(totalExpected)}</strong></div></div></div><p>{advancedFiltered.length} aparelho(s) nesta visão.</p></div><div className="v102-page-actions"><button title="Histórico de vendas" aria-label="Histórico de vendas" className={statusFilter.length===1&&statusFilter[0]==='Vendido'?'active':''} onClick={()=>setStatusFilter(statusFilter.length===1&&statusFilter[0]==='Vendido'?[]:['Vendido'])}><Clock3 size={15}/> Histórico de vendas</button><button title="Descarte/Sucata" aria-label="Descarte/Sucata" className={statusFilter.length===1&&statusFilter[0]==='Descarte/Sucata'?'active v10423-scrap-filter':''} onClick={()=>setStatusFilter(statusFilter.length===1&&statusFilter[0]==='Descarte/Sucata'?[]:['Descarte/Sucata'])}><Archive size={15}/> Descarte/Sucata</button><button title="Exibição" aria-label="Exibição" onClick={()=>setColumnEditor(true)}><Settings size={15}/> Exibição</button><button title="Cadastro em massa" aria-label="Cadastro em massa" className="v102-draft-aware-button" onClick={()=>setBatchCreate(true)}><Plus size={15}/> Em massa{batchDraft&&<span className="v102-draft-dot">1</span>}</button><button title="Novo aparelho" aria-label="Novo aparelho" className="primary v102-draft-aware-button" onClick={()=>setEdit(blankPhone())}><Plus size={15}/> Novo aparelho{phoneDraft&&<span className="v102-draft-dot light">1</span>}</button></div></header>
<DraftPanel phoneDraft={phoneDraft} batchDraft={batchDraft} continuePhoneDraft={continuePhoneDraft} continueBatchDraft={continueBatchDraft} deletePhoneDraft={deletePhoneDraft} deleteBatchDraft={deleteBatchDraft}/>
<section className="v102-toolbar v10313-main-toolbar"><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar modelo ou etiqueta"/></label><select className="v10478-tag-filter" value={tagFilter} onChange={e=>setTagFilter(e.target.value)}><option value="Todas">Todas as etiquetas</option>{allTags.map(t=><option key={t}>{t}</option>)}</select><button type="button" className={`v1041-status-trigger ${showStatusFilters||statusFilter.length?'active':''}`} onClick={()=>setShowStatusFilters(value=>!value)}><Check size={14}/><span>{statusFilter.length?`${statusFilter.length} status`:'Status'}</span><ChevronDown size={14}/></button><button className={onlyFavorites?'active':''} onClick={()=>setOnlyFavorites(v=>!v)}><Star size={14}/> Favoritos</button><button className={`v10313-more-filters ${showExtraFilters||activeExtraCount?'active':''}`} onClick={()=>setShowExtraFilters(value=>!value)}><Filter size={14}/> Mais filtros{activeExtraCount>0&&<span>{activeExtraCount}</span>}</button></section>
{showStatusFilters&&<section className="v1041-status-strip">
 <div className="v1041-status-strip-head"><div><b>Status</b><small>Selecione um ou mais status para combinar o filtro.</small></div>{statusFilter.length>0&&<button type="button" onClick={()=>setStatusFilter([])}><RotateCcw size={13}/> Limpar</button>}</div>
 <div className="v1041-status-chips">{statuses.map(status=>{const active=statusFilter.includes(status);return <button type="button" key={status} className={active?'active':''} onClick={()=>setStatusFilter(active?statusFilter.filter(item=>item!==status):[...statusFilter,status])}><span>{active&&<Check size={11}/>}</span>{status}</button>})}</div>
</section>}
{showExtraFilters&&<section className="v10313-extra-filters">
 <div className="v10313-filter-fields">
  <label><span>RAM</span><select value={extra.ram} onChange={e=>setExtraFilter('ram',e.target.value)}><option value="Todos">Todas</option>{ramOptions.map(value=><option value={value} key={value}>{capacity(value)} RAM</option>)}</select></label>
  <label><span>Armazenamento</span><select value={extra.storage} onChange={e=>setExtraFilter('storage',e.target.value)}><option value="Todos">Todos</option>{storageOptions.map(value=><option value={value} key={value}>{capacity(value)}</option>)}</select></label>
  <label><span>Conector</span><select value={extra.connector} onChange={e=>setExtraFilter('connector',e.target.value)}><option value="Todos">Todos</option>{connectorOptions.map(value=><option value={value} key={value}>{value}</option>)}</select></label>
  <BinaryFilter label="NFC" value={extra.nfc} onChange={value=>setExtraFilter('nfc',value)}/>
  <BinaryFilter label="Biometria" value={extra.biometrics} onChange={value=>setExtraFilter('biometrics',value)}/>
  <BinaryFilter label="Estado de novo" value={extra.likeNew} onChange={value=>setExtraFilter('likeNew',value)}/>
  <BinaryFilter label="Película" value={extra.screenProtector} onChange={value=>setExtraFilter('screenProtector',value)}/>
  <BinaryFilter label="Capinha" value={extra.caseIncluded} onChange={value=>setExtraFilter('caseIncluded',value)}/>
 </div>
 <div className="v10313-filter-footer"><small>{activeExtraCount?`${activeExtraCount} filtro(s) adicional(is) ativo(s)`:'Nenhum filtro adicional ativo'}</small>{activeExtraCount>0&&<button onClick={clearExtraFilters}><RotateCcw size={13}/> Limpar</button>}</div>
</section>}
<section className="v102-device-list">{advancedFiltered.map(x=>{const cost=phoneTotalCost(x),profit=Number(x.expected||0)-cost,isSold=!!(x.sale?.soldAt||x.status==='Vendido'),activePublished=publishedProfilesFor(x),historyPublished=historicalProfilesFor(x),displayProfiles=isSold?historyPublished:activePublished,published=activePublished.length;return <article key={x.id} className="v102-device-row"><button className={`v102-star ${x.favorite?'active':''}`} onClick={()=>toggleFavorite(x)}><Star size={14}/></button><div className="v102-device-name"><button type="button" className="v10479-device-name-button" onClick={()=>setEdit(x)} title="Editar ficha do aparelho"><h3>{x.brand} {x.model}</h3></button><p>{specs(x)}</p>{displayProfiles.length>0&&<div className={`v1041-published-inline ${isSold?'history':''}`}>{displayProfiles.slice(0,3).map(id=>{const profile=profiles.find(item=>item.id===id);return profile?<span key={id} title={isSold?'Perfil em que o aparelho esteve anunciado':'Perfil atualmente publicado'}>{profile.name}</span>:null})}{displayProfiles.length>3&&<span className="more">+{displayProfiles.length-3}</span>}</div>}{showProductCode()&&x.code&&<small>{x.code}</small>}</div><div className="v102-status"><select value={x.status} onChange={e=>changeStatus(x.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select><small>{isSold?(historyPublished.length?'Anúncios encerrados':'Sem histórico de anúncio'):(published?'Publicado':'Sem anúncio')}</small></div><div className="v102-money v102-money-editable"><InlineMoney label="Custo" value={cost} onCommit={v=>updateFinancial(x.id,'cost',v)}/><InlineMoney label="Valor de venda" value={x.expected} onCommit={v=>updateFinancial(x.id,'expected',v)}/><InlineMoney label="Lucro" value={profit} tone={profit>=0?'good':'bad'} onCommit={v=>updateFinancial(x.id,'profit',v)}/></div><div className="v102-row-actions"><div className="v102-menu-anchor"><button title="Mais ações" onClick={()=>setActionPhone(cur=>cur?.phone?.id===x.id?null:{phone:x})}><MoreHorizontal size={16}/></button>{actionPhone?.phone?.id===x.id&&<div className="v102-context"><button onClick={()=>{setDetail(x);setActionPhone(null)}}><Eye size={15}/> Abrir ficha</button><button onClick={()=>{setProfilePhone(x);setActionPhone(null)}}><UsersRound size={15}/> {x.sale?.soldAt||x.status==='Vendido'?'Histórico de perfis':'Perfis publicados'}</button><button onClick={()=>{setSalePhone(x);setActionPhone(null)}}><WalletCards size={15}/> {x.sale?.soldAt?'Alterar Venda':'Registrar venda'}</button><button onClick={()=>{if(confirm(`Marcar ${x.brand||''} ${x.model||''} como Descarte/Sucata?`))changeStatus(x.id,'Descarte/Sucata');setActionPhone(null)}}><Archive size={15}/> Descarte/Sucata</button><button className="danger" onClick={()=>{if(confirm('Excluir aparelho?'))persist(items.filter(i=>i.id!==x.id));setActionPhone(null)}}><X size={15}/> Excluir</button></div>}</div></div></article>})}</section>
{profilePhone&&<div className="v1040-profile-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setProfilePhone(null)}>
 <section className="v1040-profile-modal">
  {(()=>{const sold=!!(profilePhone.sale?.soldAt||profilePhone.status==='Vendido'),historyIds=historicalProfilesFor(profilePhone),visible=sold?profiles.filter(profile=>historyIds.includes(profile.id)):profiles.filter(profile=>profile.active!==false);return <><header><div><h2>{sold?'Histórico de publicação':'Perfis publicados'}</h2><p>{profilePhone.brand} {profilePhone.model}{sold&&profilePhone.sale?.soldAt?` · vendido em ${new Date(`${profilePhone.sale.soldAt}T12:00:00`).toLocaleDateString('pt-BR')}`:''}</p></div><button onClick={()=>setProfilePhone(null)}><X size={16}/></button></header>
  <div className="v1040-profile-list v1042-profile-list">{visible.map(profile=>{const active=publishedProfilesFor(profilePhone).includes(profile.id),entry=profileMap(profilePhone)[profile.id]||{},date=entry.publishedAt||'',ended=entry.endedAt||profilePhone.sale?.soldAt||'';return <article key={profile.id} className={active?'active':sold?'history':''}><button className="v1042-profile-toggle" disabled={sold} onClick={()=>toggleProfile(profilePhone,profile.id)}><span>{sold?<Check size={14}/>:active?<Check size={14}/>:<Plus size={14}/>}</span><div><b>{profile.name}</b><small>{sold?`Publicado${date?` em ${new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR')}`:''}${ended?` · encerrado ${new Date(`${ended}T12:00:00`).toLocaleDateString('pt-BR')}`:''}`:active?'Publicado':'Não publicado'}</small></div></button>{!sold&&active&&<label className="v1042-publication-date"><span>Data</span><input type="date" value={date||new Date().toISOString().slice(0,10)} max={new Date().toISOString().slice(0,10)} onChange={e=>updateProfileDate(profilePhone,profile.id,e.target.value)}/></label>}</article>})}</div>
  {!visible.length&&<p className="v1040-empty-profiles">{sold?'Nenhum histórico de publicação encontrado.':'Nenhum perfil ativo cadastrado.'}</p>}</>})()}
  <footer><button className="primary" onClick={()=>setProfilePhone(null)}>Concluído</button></footer>
 </section>
</div>}
</div>}
