import React from 'react';
import {Activity,CalendarDays,Filter,History,Search,Smartphone} from 'lucide-react';

export default function ActivityV10({events,query,setQuery,type,setType,days,setDays,showProductCode}){
 const today=events.filter(x=>Math.floor((Date.now()-new Date(x.event.date).getTime())/86400000)===0).length;
 const last7=events.filter(x=>Math.floor((Date.now()-new Date(x.event.date).getTime())/86400000)<=7).length;
 const moved=new Set(events.map(x=>x.phone.id)).size;
 return <div className="v10-page v10-activity-page">
  <header className="v10-hero"><div><span>HISTÓRICO</span><h1>Central de atividades</h1><p>Acompanhe movimentações, cadastros, anúncios e alterações em uma linha do tempo organizada.</p></div></header>
  <section className="v10-activity-metrics">
   <article><History/><div><small>Eventos encontrados</small><strong>{events.length}</strong></div></article>
   <article><CalendarDays/><div><small>Hoje</small><strong>{today}</strong></div></article>
   <article><Activity/><div><small>Últimos 7 dias</small><strong>{last7}</strong></div></article>
   <article><Smartphone/><div><small>Aparelhos movimentados</small><strong>{moved}</strong></div></article>
  </section>
  <section className="v10-activity-toolbar">
   <label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar aparelho ou atividade"/></label>
   <label className="v10-select-label"><Filter size={15}/><select value={type} onChange={e=>setType(e.target.value)}><option>Todos</option><option>Cadastro</option><option>Operação</option><option>Peças</option><option>Anúncios</option><option>Venda</option><option>Outros</option></select></label>
   <select value={days} onChange={e=>setDays(e.target.value)}><option value="7">7 dias</option><option value="30">30 dias</option><option value="90">90 dias</option><option>Todos</option></select>
  </section>
  <section className="v10-timeline">
   {events.map((x,i)=><article key={`${x.phone.id}-${x.event.id||i}`}>
    <div className="v10-timeline-rail"><i/></div>
    <div className="v10-timeline-card">
     <header><span className={`v10-event-badge type-${String(x.type).toLowerCase().replace('ç','c').replace('ú','u')}`}>{x.type}</span><time>{new Date(x.event.date).toLocaleString('pt-BR')}</time></header>
     <div><b>{showProductCode()&&x.phone.code?`${x.phone.code} · `:''}{x.phone.brand} {x.phone.model}</b><p>{x.event.message}</p></div>
    </div>
   </article>)}
   {!events.length&&<div className="v10-empty-state"><History size={26}/><b>Nenhuma atividade encontrada</b><span>Ajuste os filtros para procurar em outro período.</span></div>}
  </section>
 </div>
}