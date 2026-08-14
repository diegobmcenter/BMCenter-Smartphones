import React from 'react';
import {Check,FileEdit,Search,Smartphone} from 'lucide-react';

export default function AdsV10({
 filtered,profiles,noAds,setShowNoAds,query,setQuery,money,showProductCode,
 publicationLabel,cyclePublication,setSelectedPhone,setSelectedAd,setView
}){
 return <div className="v10-publications">
  <div className="v10-publication-tools">
   <label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar aparelho ou anúncio"/></label>
   <select defaultValue="recent"><option value="recent">Mais recentes</option><option>Nome</option><option>Maior valor</option></select>
  </div>

  <section className="v10-ad-grid">
   {filtered.map(({phone,ad})=>{
    const published=profiles.filter(p=>ad.publications[p.id]?.status==='published').length;
    const pct=profiles.length?Math.round(published/profiles.length*100):0;
    return <article className="v10-ad-card" key={ad.id}>
      <header>
        <div className="v10-ad-thumb"><Smartphone size={28}/></div>
        <div><h3>{phone.brand} {phone.model}</h3>{showProductCode()&&phone.code&&<small>{phone.code}</small>}<strong>{money(phone.expected)}</strong></div>
        <div className="v10-ad-percent"><b>{pct}%</b><span>{published}/{profiles.length} canais</span></div>
      </header>

      <div className="v10-channel-list">
       {profiles.map(profile=>{
        const pub=ad.publications[profile.id]||{status:'not_published'};
        return <button key={profile.id} className={pub.status} onClick={()=>cyclePublication(phone.id,ad.id,profile.id)}>
          <i>{String(profile.name||'?').slice(0,2).toUpperCase()}</i>
          <span><b>{profile.name}</b><small>{publicationLabel(pub.status)}</small></span>
          {pub.status==='published'&&<Check size={15}/>}
        </button>
       })}
      </div>

      <div className="v10-ad-progress"><i><u style={{width:`${pct}%`}}/></i></div>
      <footer><button onClick={()=>{setSelectedPhone(phone.id);setSelectedAd(ad.id)}}>Detalhes</button><button className="primary" onClick={()=>{setSelectedPhone(phone.id);setSelectedAd(ad.id);setView('editor')}}><FileEdit size={15}/> Editar anúncio</button></footer>
    </article>
   })}
  </section>
  {!!noAds.length&&<button className="v10-unpublished" onClick={()=>setShowNoAds(true)}><Smartphone size={17}/><span><b>{noAds.length} aparelho(s)</b> aguardando anúncio</span><strong>Ver aparelhos →</strong></button>}
 </div>
}
