import React from 'react';
import {AlertTriangle,CheckSquare,RefreshCw,Search,Tags,X} from 'lucide-react';

export default function BatchV102({
 rows,selected,setSelected,query,setQuery,statusFilter,setStatusFilter,statuses,targetStatuses,
 newStatus,setNewStatus,newTag,setNewTag,removeTagValue,setRemoveTagValue,selectedTags,
 profiles,publicationProfileId,setPublicationProfileId,publicationMode,setPublicationMode,
 openBatchReview,confirmBatch,reviewOpen,setReviewOpen,batchPreview,canReview,lastBatchAction,undoLastBatch,clearBatchInputs,
 toggle,allSelected,daysSince,phoneDisplayName
}){
 const selectedCount=selected.length;
 return <div className="v102-page v10526-batch-page">
  <header className="v102-hero v10526-batch-hero"><div><span>EDIÇÃO EM MASSA</span><h1>Ações em lote</h1><p>Selecione aparelhos, revise o que será alterado e aplique tudo de uma vez.</p></div><div className="v102-total-pill"><strong>{selectedCount}</strong><span>selecionados</span></div></header>

  <section className="v102-toolbar v102-batch-toolbar"><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar aparelho, código ou etiqueta"/></label><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>Ativos</option><option>Todos</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></section>

  <section className="v10526-batch-command">
   <header><label className="v10526-select-all"><input type="checkbox" checked={allSelected} onChange={()=>setSelected(allSelected?[]:rows.map(p=>p.id))}/><span>Selecionar todos desta lista</span></label><div><b>{selectedCount} selecionado(s)</b>{selectedCount>0&&<button type="button" onClick={()=>setSelected([])}>Limpar seleção</button>}</div></header>
   <div className="v10526-batch-ops">
    <label><span>Status</span><select value={newStatus} onChange={e=>setNewStatus(e.target.value)}><option value="">Não alterar</option>{targetStatuses.map(s=><option key={s}>{s}</option>)}</select><small>Venda e descarte continuam fora da edição em lote.</small></label>
    <section className="v10526-tag-op"><div><Tags size={14}/><span>Etiquetas</span></div><input value={newTag} onChange={e=>setNewTag(e.target.value)} placeholder="Adicionar etiqueta"/><select value={removeTagValue} onChange={e=>setRemoveTagValue(e.target.value)} disabled={!selectedTags.length}><option value="">Não remover</option>{selectedTags.map(tag=><option key={tag}>{tag}</option>)}</select></section>
    <section className="v10526-publication-op"><div><CheckSquare size={14}/><span>Publicação por perfil</span></div><select value={publicationProfileId} onChange={e=>setPublicationProfileId(e.target.value)}><option value="">Selecionar perfil</option>{profiles.map(profile=><option key={profile.id} value={profile.id}>{profile.name}{profile.active===false?' · inativo':''}</option>)}</select><select value={publicationMode} onChange={e=>setPublicationMode(e.target.value)}><option value="">Não alterar publicação</option><option value="publish">Marcar como publicado</option><option value="remove">Remover publicação</option></select></section>
    <div className="v10526-batch-submit"><button type="button" onClick={clearBatchInputs} disabled={!newStatus&&!newTag.trim()&&!removeTagValue&&!publicationMode}>Limpar alterações</button><button className="primary" type="button" disabled={!canReview} onClick={openBatchReview}><CheckSquare size={14}/> Revisar e aplicar</button></div>
   </div>
  </section>

  {lastBatchAction&&<section className="v10526-batch-undo"><div><strong>✓ {lastBatchAction.count} aparelho(s) atualizados</strong><span>{lastBatchAction.summary}</span></div><button type="button" onClick={undoLastBatch}><RefreshCw size={13}/> Desfazer alteração</button></section>}

  <section className="v102-batch-list v10526-batch-list">{rows.map(p=><article className={selected.includes(p.id)?'selected':''} key={p.id} onClick={()=>toggle(p.id)}><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggle(p.id)} onClick={e=>e.stopPropagation()}/><div><b>{phoneDisplayName(p,{includeCode:false})}</b><small>{[p.code,p.color,p.storage].filter(Boolean).join(' · ')||'Sem detalhes'}</small></div><span className="v102-status-badge">{p.status}</span><em>{daysSince(p.lastActivityAt||p.date)} dias</em></article>)}</section>

  {reviewOpen&&<div className="v10526-review-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setReviewOpen(false)}><section className="v10526-review-dialog"><header><div><span>REVISÃO OBRIGATÓRIA</span><h2>Confirmar ação em lote</h2><p>Confira antes de alterar os aparelhos selecionados.</p></div><button className="icon-only" type="button" onClick={()=>setReviewOpen(false)}><X size={16}/></button></header><div className="v10526-review-count"><strong>{batchPreview.selectedCount}</strong><span>aparelho(s) selecionado(s)</span></div><div className="v10526-review-items">{batchPreview.items.map(item=><div key={item}><CheckSquare size={14}/><span>{item}</span></div>)}</div>{batchPreview.protectedCount>0&&<div className="v10526-review-warning"><AlertTriangle size={16}/><div><b>{batchPreview.protectedCount} aparelho(s) protegido(s)</b><span>Vendido e Descarte/Sucata serão ignorados para alteração de status e publicação. Etiquetas ainda podem ser alteradas.</span></div></div>}<footer><button type="button" onClick={()=>setReviewOpen(false)}>Cancelar</button><button className="primary" type="button" onClick={confirmBatch}><CheckSquare size={14}/> Aplicar em {batchPreview.selectedCount} aparelho(s)</button></footer></section></div>}
 </div>
}
