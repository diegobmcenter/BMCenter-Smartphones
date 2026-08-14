import React from 'react';
import {Eye,FileText,Plus,Settings,Star,Smartphone,WalletCards,X} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import SearchToolbar from '../components/ui/SearchToolbar.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function SmartphonesView({
  filtered,statuses,statusFilter,setStatusFilter,allTags,tagFilter,setTagFilter,
  query,setQuery,onlyFavorites,setOnlyFavorites,visibleColumns,profiles,showProductCode,
  phoneTotalCost,money,toggleFavorite,changeStatus,setDetail,setEdit,setColumnEditor,
  setBatchCreate,blankPhone,items,actionPhone,setActionPhone,setSalePhone,persist
}){
  const show=id=>visibleColumns.some(c=>c.id===id);
  return <div className="v62-page v62-smartphones">
    <PageHeader
      eyebrow="ESTOQUE"
      title="Smartphones"
      subtitle="Uma visão rápida do que está pronto, parado e disponível para venda."
      actions={<>
        <button onClick={()=>setColumnEditor(true)}><Settings size={14}/> Exibição</button>
        <button onClick={()=>setBatchCreate(true)}><Plus size={14}/> Em massa</button>
        <button className="primary" onClick={()=>setEdit(blankPhone(items.length+1))}><Plus size={14}/> Novo aparelho</button>
      </>}
    />

    <SearchToolbar query={query} onQueryChange={setQuery} count={filtered.length} placeholder="Buscar aparelho ou etiqueta">
      <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
        <option>Todos</option>{statuses.map(s=><option key={s}>{s}</option>)}
      </select>
      <select value={tagFilter} onChange={e=>setTagFilter(e.target.value)}>
        <option value="Todas">Todas</option>{allTags.map(t=><option key={t}>{t}</option>)}
      </select>
      <button className={onlyFavorites?'active':''} onClick={()=>setOnlyFavorites(v=>!v)}><Star size={14}/> Favoritos</button>
    </SearchToolbar>

    <section className="v62-phone-grid">
      {filtered.map(x=>{
        const cost=phoneTotalCost(x);
        const profit=Number(x.expected||0)-cost;
        const published=profiles.filter(profile=>(x.ads||[]).some(ad=>ad?.publications?.[profile.id]?.status==='published'));
        return <article className="v62-phone-card" key={x.id}>
          <div className="v62-phone-photo">
            {x.photos?.[0]?<img src={x.photos[0].dataUrl} alt=""/>:<Smartphone size={30}/>}
            <button className={x.favorite?'favorite active':'favorite'} onClick={()=>toggleFavorite(x)}><Star size={13}/></button>
          </div>

          <div className="v62-phone-main">
            <div className="v62-phone-name">
              <h3>{x.brand} {x.model}</h3>
              {showProductCode()&&show('code')&&<small>{x.code}</small>}
            </div>
            <p>{[x.color,x.storage,x.ram&&`${x.ram} RAM`].filter(Boolean).join(' · ')||'Sem detalhes'}</p>

            <div className="v62-phone-status">
              {show('status')&&<select value={x.status} onChange={e=>changeStatus(x.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select>}
              <div className="v62-profile-dots">{published.length?published.slice(0,3).map(p=><span key={p.id}>{String(p.name).slice(0,2).toUpperCase()}</span>):<em>Sem anúncio</em>}</div>
            </div>

            <div className="v62-phone-money">
              {show('cost')&&<div><span>Custo</span><b>{money(cost)}</b></div>}
              {show('expected')&&<div><span>Valor de venda</span><b>{money(x.expected)}</b></div>}
              {show('profit')&&<div><span>Lucro</span><b className={profit>=0?'good':'bad'}>{money(profit)}</b></div>}
            </div>
          </div>

          <footer className="v62-card-footer">
            <button onClick={()=>setDetail(x)}><Eye size={13}/> Abrir</button>
            <button onClick={()=>setEdit(x)}><FileText size={13}/> Editar</button>
            <div className="v62-menu-wrap">
              <button onClick={()=>setActionPhone(cur=>cur?.phone?.id===x.id?null:{phone:x})}>•••</button>
              {actionPhone?.phone?.id===x.id&&<div className="v62-menu">
                <button onClick={()=>{setSalePhone(x);setActionPhone(null)}}><WalletCards size={14}/> Registrar venda</button>
                <button className="danger" onClick={()=>{if(confirm('Excluir aparelho?'))persist(items.filter(i=>i.id!==x.id));setActionPhone(null)}}><X size={14}/> Excluir</button>
              </div>}
            </div>
          </footer>
        </article>
      })}
      {!filtered.length&&<EmptyState icon={<Smartphone size={28}/>} title="Nenhum aparelho encontrado" description="Altere os filtros ou cadastre um novo aparelho."/>}
    </section>
  </div>
}
