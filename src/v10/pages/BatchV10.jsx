import React from 'react';
import {CheckSquare,Search,Smartphone} from 'lucide-react';

export default function BatchV10({
 rows,selected,setSelected,query,setQuery,statusFilter,setStatusFilter,statuses,
 newStatus,setNewStatus,newTag,setNewTag,applyBatch,toggle,allSelected,daysSince,phoneDisplayName
}){
 return <div className="v10-page v10-batch">
  <header className="v10-hero"><div><span>EDIÇÃO EM MASSA</span><h1>Ações em lote</h1><p>Selecione os aparelhos e aplique a alteração quando estiver pronto.</p></div><div className="v10-count-badge"><strong>{selected.length}</strong><span>selecionados</span></div></header>

  <section className="v10-batch-toolbar">
   <label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar aparelho"/></label>
   <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>Ativos</option><option>Todos</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
  </section>

  <section className="v10-batch-actions">
    <label><input type="checkbox" checked={allSelected} onChange={()=>setSelected(allSelected?[]:rows.map(p=>p.id))}/><span>{selected.length?`${selected.length} selecionado(s)`:'Selecionar todos'}</span></label>
    <div>
      <select value={newStatus} onChange={e=>setNewStatus(e.target.value)}><option value="">Status: não alterar</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
      <input value={newTag} onChange={e=>setNewTag(e.target.value)} placeholder="Adicionar etiqueta"/>
      <button className="primary" onClick={applyBatch} disabled={!selected.length}><CheckSquare size={15}/> Aplicar</button>
      {!!selected.length&&<button onClick={()=>setSelected([])}>Limpar</button>}
    </div>
  </section>

  <section className="v10-batch-grid">{rows.map(p=><article className={selected.includes(p.id)?'selected':''} key={p.id} onClick={()=>toggle(p.id)}>
    <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggle(p.id)} onClick={e=>e.stopPropagation()}/>
    <span className="v10-batch-device"><Smartphone size={17}/></span>
    <div><b>{phoneDisplayName(p,{includeCode:false})}</b><small>{[p.color,p.storage].filter(Boolean).join(' · ')||'Sem detalhes'}</small></div>
    <em>{p.status}</em>
    <span>{daysSince(p.lastActivityAt||p.date)} dias</span>
  </article>)}</section>
 </div>
}
