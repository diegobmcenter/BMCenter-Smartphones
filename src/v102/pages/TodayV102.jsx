import React from 'react';
import {AlertTriangle,CheckCircle2,PackageSearch,ScanSearch,Smartphone,Wrench} from 'lucide-react';
const icons={'Analisar':<ScanSearch/>,'Comprar peças':<PackageSearch/>,'Reparar e testar':<Wrench/>,'Prontos para anunciar':<CheckCircle2/>};
export default function TodayV102({groups,alerts,actions=[],phoneDisplayName,onOpenPhone}){
 const total=actions.length;
 const urgent=actions.filter(item=>item.priority>=90).length;
 return <div className="v102-page v105-today"><header className="v102-hero"><div><span>HOJE</span><h1>O que precisa da sua atenção.</h1><p>Fila inteligente organizada por prioridade operacional.</p></div><div className="v102-total-pill"><strong>{total}</strong><span>ações</span></div></header>
  <section className="v105-stage-strip">{groups.map((group,index)=><article key={group.title}><i>{icons[group.title]||<Smartphone/>}</i><div><small>ETAPA {index+1}</small><b>{group.title}</b></div><strong>{group.items.length}</strong></article>)}</section>
  <section className="v105-action-center"><header><div><span>PRIORIDADES AUTOMÁTICAS</span><h2>Fila do dia</h2></div><p><b>{urgent}</b> urgente(s) · <b>{total}</b> no total</p></header><div className="v105-action-list">{actions.length?actions.slice(0,18).map((item,index)=><article className={`${item.priority>=90?'urgent':item.priority>=80?'attention':''}${item.phoneId?' actionable':''}`} key={item.id} role={item.phoneId?'button':undefined} tabIndex={item.phoneId?0:undefined} onClick={()=>item.phoneId&&onOpenPhone?.(item.phoneId)} onKeyDown={e=>{if(item.phoneId&&(e.key==='Enter'||e.key===' ')){e.preventDefault();onOpenPhone?.(item.phoneId)}}}><span>{index+1}</span><div><b>{item.title}</b><small>{item.detail}</small></div><em>{item.priority>=90?'Urgente':item.priority>=80?'Prioridade':'Acompanhar'}</em></article>):<div className="v102-ok-inline">✓ Nenhuma ação automática pendente.</div>}</div></section>
  <section className="v102-alert-strip v105-alert-strip"><div><AlertTriangle size={17}/><b>Alertas operacionais</b><span>{alerts.length}</span></div>{alerts.length?<div className="v102-alert-items">{alerts.slice(0,4).map((a,i)=><article key={i}><b>{a.title}</b><small>{a.detail}</small></article>)}</div>:<div className="v102-ok-inline">✓ Nenhum alerta agora.</div>}</section>
 </div>
}
