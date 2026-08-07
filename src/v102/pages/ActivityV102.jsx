import React from 'react';
import {Activity,CalendarDays,Filter,Search,Smartphone} from 'lucide-react';
export default function ActivityV102({events,query,setQuery,type,setType,days,setDays,showProductCode}){
 const today=events.filter(x=>new Date(x.event.date).toDateString()===new Date().toDateString()).length;
 const phones=new Set(events.map(x=>x.phone.id)).size;
 return <div className="v102-page"><header className="v102-hero"><div><span>HISTÓRICO</span><h1>Central de atividades</h1><p>Movimentações, cadastros e anúncios em uma linha do tempo compacta.</p></div></header>
  <section className="v102-mini-metrics"><article><Activity/><div><small>Eventos</small><b>{events.length}</b></div></article><article><CalendarDays/><div><small>Hoje</small><b>{today}</b></div></article><article><Smartphone/><div><small>Aparelhos movimentados</small><b>{phones}</b></div></article></section>
  <section className="v102-toolbar v102-activity-toolbar"><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar aparelho ou atividade"/></label><label className="select-icon"><Filter size={15}/><select value={type} onChange={e=>setType(e.target.value)}><option>Todos</option><option>Operação</option><option>Cadastro</option><option>Anúncios</option><option>Peças</option><option>Venda</option><option>Outros</option></select></label><select value={days} onChange={e=>setDays(e.target.value)}><option value="7">7 dias</option><option value="30">30 dias</option><option value="90">90 dias</option><option value="3650">Todos</option></select></section>
  <section className="v102-activity-list">{events.map((x,i)=><article key={`${x.phone.id}-${x.event.id||i}`}><time>{new Date(x.event.date).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</time><span className="v102-activity-dot"/><div><b>{showProductCode()&&x.phone.code?`${x.phone.code} · `:''}{x.phone.brand} {x.phone.model}</b><p>{x.event.message}</p></div><em>{x.type}</em></article>)}</section>
 </div>
}
