import React from 'react';
import {Search,Settings,Smartphone} from 'lucide-react';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function AdsOverviewView({
  filtered,profiles,noAds,setShowNoAds,query,setQuery,money,showProductCode,
  publicationLabel,cyclePublication,setSelectedPhone,setSelectedAd,setView
}){
  return <>
    <div className="v62-ads-toolbar">
      <label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar anúncio ou aparelho"/></label>
      <button><Settings size={14}/> Filtros</button>
      <select defaultValue="recent"><option value="recent">Mais recentes</option><option>Nome do aparelho</option><option>Maior valor</option></select>
    </div>

    <div className="v62-ad-grid">
      {filtered.map(({phone,ad})=>{
        const published=profiles.filter(p=>ad.publications[p.id]?.status==='published').length;
        const pct=profiles.length?Math.round(published/profiles.length*100):0;
        return <article className="v62-ad-card" key={ad.id}>
          <div className="v62-ad-device">
            <div className="v62-ad-photo">{phone.photos?.[0]?<img src={phone.photos[0].dataUrl} alt=""/>:<Smartphone size={26}/>}</div>
            <div>
              <h3>{phone.brand} {phone.model}</h3>
              {showProductCode()&&phone.code&&<small>{phone.code}</small>}
              <p>{[phone.color,phone.storage].filter(Boolean).join(' · ')||'Sem detalhes'}</p>
              <strong>{money(phone.expected)}</strong>
            </div>
          </div>

          <div className="v62-ad-publications">
            <span>Publicações</span>
            <div className="v62-ad-chips">
              {profiles.map(profile=>{
                const pub=ad.publications[profile.id]||{status:'not_published'};
                return <button key={profile.id} className={pub.status} onClick={()=>cyclePublication(phone.id,ad.id,profile.id)}>
                  <i>{String(profile.name||'?').slice(0,2).toUpperCase()}</i>
                  <b>{profile.name}</b>
                  <em>{publicationLabel(pub.status)}</em>
                </button>
              })}
            </div>
          </div>

          <div className="v62-ad-progress">
            <div><b>{pct}%</b><span>{published}/{profiles.length}</span></div>
            <i><u style={{width:`${pct}%`}}/></i>
          </div>

          <footer className="v62-card-footer">
            <button onClick={()=>{setSelectedPhone(phone.id);setSelectedAd(ad.id)}}>Detalhes</button>
            <button className="primary" onClick={()=>{setSelectedPhone(phone.id);setSelectedAd(ad.id);setView('editor')}}>Editar anúncio</button>
          </footer>
        </article>
      })}
      {!filtered.length&&<EmptyState icon={<Search size={28}/>} title="Nenhum anúncio encontrado"/>}
    </div>

    {!!noAds.length&&<button className="v62-awaiting" onClick={()=>setShowNoAds(true)}><Smartphone size={17}/><span>{noAds.length} aparelho{noAds.length!==1?'s':''} aguardando anúncio</span><b>Ver</b></button>}
  </>
}
