import React from 'react';
import {Search,Smartphone} from 'lucide-react';

export default function BatchV8({
 rows,selected,setSelected,query,setQuery,statusFilter,setStatusFilter,statuses,
 newStatus,setNewStatus,newTag,setNewTag,applyBatch,toggle,allSelected,daysSince,phoneDisplayName
}){
 return <div className="v8-page v8-batch">
  <header className="v8-page-intro"><div><span>EDIÇÃO EM MASSA</span><h1>Ações em lote</h1><p>Selecione como numa caixa de entrada e aplique a alteração apenas quando estiver pronto.</p></div><div className="v8-focus-score"><strong>{selected.length}</strong><span>selecionados</span></div></header>

  <div className="v8-batch-command">
   <label className="v8-wide-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar aparelho"/></label>
   <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>Ativos</option><option>Todos</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
  </div>

  <section className="v8-batch-surface">
   <header className="v8-batch-actionbar">
    <label><input type="checkbox" checked={allSelected} onChange={()=>setSelected(allSelected?[]:rows.map(p=>p.id))}/><span>{selected.length?`${selected.length} selecionado(s)`:'Selecionar todos'}</span></label>
    <div className={selected.length?'enabled':''}>
     <select value={newStatus} onChange={e=>setNewStatus(e.target.value)}><option value="">Status: não alterar</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
     <input value={newTag} onChange={e=>setNewTag(e.target.value)} placeholder="Adicionar etiqueta"/>
     <button className="primary" onClick={applyBatch} disabled={!selected.length}>Aplicar</button>
     {!!selected.length&&<button onClick={()=>setSelected([])}>Limpar</button>}
    </div>
   </header>
   <div className="v8-batch-list">{rows.map(p=><article className={selected.includes(p.id)?'selected':''} key={p.id} onClick={()=>toggle(p.id)}>
    <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggle(p.id)} onClick={e=>e.stopPropagation()}/>
    <span className="v8-batch-device"><Smartphone size={16}/></span>
    <div><b>{phoneDisplayName(p,{includeCode:false})}</b><small>{[p.color,p.storage].filter(Boolean).join(' · ')||'Sem detalhes'}</small></div>
    <em>{p.status}</em>
    <span>{daysSince(p.lastActivityAt||p.date)} dias</span>
   </article>)}</div>
  </section>
 </div>
}
