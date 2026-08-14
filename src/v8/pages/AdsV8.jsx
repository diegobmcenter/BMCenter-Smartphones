import React from 'react';
import {FileEdit,Search,Smartphone} from 'lucide-react';

export default function AdsV8({
 filtered,profiles,noAds,setShowNoAds,query,setQuery,money,showProductCode,
 publicationLabel,cyclePublication,setSelectedPhone,setSelectedAd,setView
}){
 return <div className="v8-publication-center">
  <div className="v8-publication-tools">
   <label><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar aparelho ou anúncio"/></label>
   <select defaultValue="recent"><option value="recent">Mais recentes</option><option>Nome</option><option>Maior valor</option></select>
  </div>

  <section className="v8-publication-surface">
   <header><span>Aparelho</span><span>Canais</span><span>Progresso</span><span/></header>
   <div>{filtered.map(({phone,ad})=>{
    const published=profiles.filter(p=>ad.publications[p.id]?.status==='published').length;
    const pct=profiles.length?Math.round(published/profiles.length*100):0;
    return <article className="v8-publication-row" key={ad.id}>
     <div className="v8-publication-device">
      <div><Smartphone size={20}/></div>
      <section><b>{phone.brand} {phone.model}</b>{showProductCode()&&phone.code&&<small>{phone.code}</small>}<span>{money(phone.expected)}</span></section>
     </div>
     <div className="v8-channel-strip">{profiles.map(profile=>{const pub=ad.publications[profile.id]||{status:'not_published'};return <button key={profile.id} className={pub.status} onClick={()=>cyclePublication(phone.id,ad.id,profile.id)} title={`${profile.name}: ${publicationLabel(pub.status)}`}><i>{String(profile.name||'?').slice(0,2).toUpperCase()}</i><span><b>{profile.name}</b><small>{publicationLabel(pub.status)}</small></span></button>})}</div>
     <div className="v8-progress-cell"><div><b>{pct}%</b><span>{published}/{profiles.length}</span></div><i><u style={{width:`${pct}%`}}/></i></div>
     <div className="v8-publication-actions"><button onClick={()=>{setSelectedPhone(phone.id);setSelectedAd(ad.id)}}>Detalhes</button><button className="primary" onClick={()=>{setSelectedPhone(phone.id);setSelectedAd(ad.id);setView('editor')}}><FileEdit size={14}/> Editar</button></div>
    </article>
   })}</div>
  </section>
  {!!noAds.length&&<button className="v8-unpublished" onClick={()=>setShowNoAds(true)}><Smartphone size={16}/><span>{noAds.length} aparelho(s) aguardando anúncio</span><b>Ver aparelhos</b></button>}
 </div>
}
