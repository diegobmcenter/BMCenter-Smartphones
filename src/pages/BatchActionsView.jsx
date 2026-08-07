import React from 'react';
import {Search,Smartphone} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';

export default function BatchActionsView({
  rows,selected,setSelected,query,setQuery,statusFilter,setStatusFilter,statuses,
  newStatus,setNewStatus,newTag,setNewTag,applyBatch,toggle,allSelected,daysSince,phoneDisplayName
}){
  return <div className="v62-page v62-batch">
    <PageHeader eyebrow="EDIÇÃO RÁPIDA" title="Ações em lote" subtitle="Selecione aparelhos e aplique a mesma alteração de uma vez."/>

    <div className="v62-batch-top">
      <label className="v62-search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar aparelho"/></label>
      <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>Ativos</option><option>Todos</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
      <span>{selected.length} selecionado(s)</span>
    </div>

    <div className="v62-batch-actions">
      <label><span>Status</span><select value={newStatus} onChange={e=>setNewStatus(e.target.value)}><option value="">Não alterar</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
      <label><span>Etiqueta</span><input value={newTag} onChange={e=>setNewTag(e.target.value)}/></label>
      <button className="primary" onClick={applyBatch}>Aplicar</button>
      {!!selected.length&&<button onClick={()=>setSelected([])}>Limpar</button>}
    </div>

    <label className="v62-select-all"><input type="checkbox" checked={allSelected} onChange={()=>setSelected(allSelected?[]:rows.map(p=>p.id))}/> Selecionar todos</label>

    <div className="v62-batch-grid">
      {rows.map(p=><article key={p.id} className={selected.includes(p.id)?'selected':''} onClick={()=>toggle(p.id)}>
        <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggle(p.id)} onClick={e=>e.stopPropagation()}/>
        <span className="device"><Smartphone size={17}/></span>
        <div><b>{phoneDisplayName(p)}</b><small>{[p.color,p.storage].filter(Boolean).join(' · ')||'Sem detalhes'}</small></div>
        <em>{p.status}</em>
        <small>{daysSince(p.lastActivityAt||p.date)} dias</small>
      </article>)}
    </div>
  </div>
}
