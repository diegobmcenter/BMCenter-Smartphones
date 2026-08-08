import React from 'react';
import {Eye,FileText,MoreHorizontal,Plus,Search,Settings,Star,Smartphone,WalletCards,X} from 'lucide-react';

export default function SmartphonesV10({
 filtered,statuses,statusFilter,setStatusFilter,allTags,tagFilter,setTagFilter,
 query,setQuery,onlyFavorites,setOnlyFavorites,visibleColumns,profiles,showProductCode,
 phoneTotalCost,money,toggleFavorite,changeStatus,setDetail,setEdit,setColumnEditor,
 setBatchCreate,blankPhone,items,actionPhone,setActionPhone,setSalePhone,persist
}){
 const show=id=>visibleColumns.some(c=>c.id===id);
 return <div className="v10-page v10-inventory">
  <header className="v10-hero">
   <div><span>INVENTÁRIO</span><h1>Smartphones</h1><p>{filtered.length} aparelho(s) nesta visão.</p></div>
   <div className="v10-page-actions">
    <button onClick={()=>setColumnEditor(true)}><Settings size={16}/> Exibição</button>
    <button onClick={()=>setBatchCreate(true)}><Plus size={16}/> Em massa</button>
    <button className="primary" onClick={()=>setEdit(blankPhone(items.length+1))}><Plus size={16}/> Novo aparelho</button>
   </div>
  </header>

  <section className="v10-filterbar">
   <label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar modelo ou etiqueta"/></label>
   <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="Todos">Todos os status</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
   <select value={tagFilter} onChange={e=>setTagFilter(e.target.value)}><option value="Todas">Todas as etiquetas</option>{allTags.map(t=><option key={t}>{t}</option>)}</select>
   <button className={onlyFavorites?'active':''} onClick={()=>setOnlyFavorites(v=>!v)}><Star size={15}/> Favoritos</button>
  </section>

  <section className="v10-phone-grid">
   {filtered.map(x=>{
    const cost=phoneTotalCost(x),profit=Number(x.expected||0)-cost;
    const published=profiles.filter(profile=>(x.ads||[]).some(ad=>ad?.publications?.[profile.id]?.status==='published'));
    return <article className="v10-phone-card" key={x.id}>
      <div className="v10-phone-media">
        {x.photos?.[0]?<img src={x.photos[0].dataUrl} alt=""/>:<Smartphone size={34}/>}
        <button className={x.favorite?'active':''} onClick={()=>toggleFavorite(x)} title="Favorito"><Star size={15}/></button>
      </div>
      <div className="v10-phone-info">
        <div className="v10-phone-heading">
          <div><h3>{x.brand} {x.model}</h3><p>{[x.color,x.storage,x.ram&&`${x.ram} RAM`].filter(Boolean).join(' · ')||'Sem detalhes cadastrados'}</p></div>
          {showProductCode()&&show('code')&&<small>{x.code}</small>}
        </div>

        <div className="v10-status-row">
          {show('status')&&<select value={x.status} onChange={e=>changeStatus(x.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select>}
          <div className="v10-published">{published.length?published.slice(0,3).map(p=><span key={p.id}>{String(p.name).slice(0,2).toUpperCase()}</span>):<em>Sem anúncio</em>}</div>
        </div>

        <div className="v10-money-row">
          <div><span>Custo</span><b>{money(cost)}</b></div>
          <div><span>Venda prevista</span><b>{money(x.expected)}</b></div>
          <div><span>Lucro previsto</span><b className={profit>=0?'good':'bad'}>{money(profit)}</b></div>
        </div>

        <footer>
          <button onClick={()=>setDetail(x)}><Eye size={15}/> Abrir</button>
          <button onClick={()=>setEdit(x)}><FileText size={15}/> Editar</button>
          <div className="v10-menu-anchor">
            <button onClick={()=>setActionPhone(cur=>cur?.phone?.id===x.id?null:{phone:x})}><MoreHorizontal size={17}/></button>
            {actionPhone?.phone?.id===x.id&&<div className="v10-context">
              <button onClick={()=>{setSalePhone(x);setActionPhone(null)}}><WalletCards size={15}/> Registrar venda</button>
              <button className="danger" onClick={()=>{if(confirm('Excluir aparelho?'))persist(items.filter(i=>i.id!==x.id));setActionPhone(null)}}><X size={15}/> Excluir aparelho</button>
            </div>}
          </div>
        </footer>
      </div>
    </article>
   })}
  </section>
 </div>
}
