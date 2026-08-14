import React from 'react';
import {Eye,FileText,MoreHorizontal,Plus,Settings,Star,Smartphone,WalletCards,X} from 'lucide-react';

export default function SmartphonesV8({
 filtered,statuses,statusFilter,setStatusFilter,allTags,tagFilter,setTagFilter,
 query,setQuery,onlyFavorites,setOnlyFavorites,visibleColumns,profiles,showProductCode,
 phoneTotalCost,money,toggleFavorite,changeStatus,setDetail,setEdit,setColumnEditor,
 setBatchCreate,blankPhone,items,actionPhone,setActionPhone,setSalePhone,persist
}){
 const show=id=>visibleColumns.some(c=>c.id===id);
 return <div className="v8-page v8-inventory">
  <header className="v8-page-intro">
   <div><span>INVENTÁRIO</span><h1>Smartphones</h1><p>{filtered.length} aparelho(s) nesta visão.</p></div>
   <div className="v8-header-actions">
    <button onClick={()=>setColumnEditor(true)}><Settings size={14}/> Exibição</button>
    <button onClick={()=>setBatchCreate(true)}><Plus size={14}/> Em massa</button>
    <button className="primary" onClick={()=>setEdit(blankPhone(items.length+1))}><Plus size={14}/> Novo aparelho</button>
   </div>
  </header>

  <div className="v8-inventory-tools">
   <label className="v8-wide-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Modelo ou etiqueta"/></label>
   <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>Todos</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
   <select value={tagFilter} onChange={e=>setTagFilter(e.target.value)}><option value="Todas">Todas</option>{allTags.map(t=><option key={t}>{t}</option>)}</select>
   <button className={onlyFavorites?'active':''} onClick={()=>setOnlyFavorites(v=>!v)}><Star size={14}/><span>Favoritos</span></button>
  </div>

  <section className="v8-inventory-surface">
   <header className="v8-list-caption"><span>Aparelho</span><span>Status</span><span>Financeiro</span><span>Publicação</span><span/></header>
   <div className="v8-inventory-list">
    {filtered.map(x=>{
      const cost=phoneTotalCost(x),profit=Number(x.expected||0)-cost;
      const published=profiles.filter(profile=>(x.ads||[]).some(ad=>ad?.publications?.[profile.id]?.status==='published'));
      return <article className="v8-inventory-row" key={x.id}>
       <div className="v8-device-cell">
        <div className="v8-device-thumb">{x.photos?.[0]?<img src={x.photos[0].dataUrl} alt=""/>:<Smartphone size={19}/>}</div>
        <div><div className="v8-row-title"><b>{x.brand} {x.model}</b>{showProductCode()&&show('code')&&<small>{x.code}</small>}</div><span>{[x.color,x.storage,x.ram&&`${x.ram} RAM`].filter(Boolean).join(' · ')||'Sem detalhes'}</span></div>
       </div>
       <div className="v8-status-cell">{show('status')&&<select value={x.status} onChange={e=>changeStatus(x.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select>}</div>
       <div className="v8-finance-cell">
        <span><small>Custo</small><b>{money(cost)}</b></span>
        <span><small>Venda</small><b>{money(x.expected)}</b></span>
        <span><small>Lucro</small><b className={profit>=0?'good':'bad'}>{money(profit)}</b></span>
       </div>
       <div className="v8-publish-cell">{published.length?<>{published.slice(0,3).map(p=><i key={p.id}>{String(p.name).slice(0,2).toUpperCase()}</i>)}<small>{published.length} publicado(s)</small></>:<em>Sem anúncio</em>}</div>
       <div className="v8-row-actions">
        <button className={x.favorite?'star active':'star'} onClick={()=>toggleFavorite(x)}><Star size={13}/></button>
        <button onClick={()=>setDetail(x)} title="Abrir"><Eye size={14}/></button>
        <button onClick={()=>setEdit(x)} title="Editar"><FileText size={14}/></button>
        <div className="v8-menu-anchor"><button onClick={()=>setActionPhone(cur=>cur?.phone?.id===x.id?null:{phone:x})}><MoreHorizontal size={15}/></button>
         {actionPhone?.phone?.id===x.id&&<div className="v8-context-menu">
          <button onClick={()=>{setSalePhone(x);setActionPhone(null)}}><WalletCards size={14}/> Registrar venda</button>
          <button className="danger" onClick={()=>{if(confirm('Excluir aparelho?'))persist(items.filter(i=>i.id!==x.id));setActionPhone(null)}}><X size={14}/> Excluir aparelho</button>
         </div>}
        </div>
       </div>
      </article>
    })}
   </div>
  </section>
 </div>
}
