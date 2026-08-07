import React from 'react';
import {AlertTriangle,CheckCircle2,PackageSearch,ScanSearch,Smartphone,Wrench} from 'lucide-react';
const icons={'Analisar':<ScanSearch/>,'Comprar peças':<PackageSearch/>,'Reparar e testar':<Wrench/>,'Prontos para anunciar':<CheckCircle2/>};
export default function TodayV102({groups,alerts,phoneDisplayName}){
 const total=groups.reduce((n,g)=>n+g.items.length,0);
 return <div className="v102-page"><header className="v102-hero"><div><span>HOJE</span><h1>O que precisa da sua atenção.</h1><p>{total} ações organizadas por etapa.</p></div><div className="v102-total-pill"><strong>{total}</strong><span>ações</span></div></header>
  <section className="v102-today-grid">{groups.map((group,index)=><article className="v102-stage-card" key={group.title}><header><i>{icons[group.title]||<Smartphone/>}</i><div><small>ETAPA {index+1}</small><h2>{group.title}</h2></div><b>{group.items.length}</b></header><div className="v102-stage-items">{group.items.length?group.items.map(p=><button key={p.id}><span><Smartphone size={14}/></span><div><b>{phoneDisplayName(p,{includeCode:false})}</b><small>{p.status}</small></div></button>):<p>Nenhum item nesta etapa.</p>}</div></article>)}</section>
  <section className="v102-alert-strip"><div><AlertTriangle size={17}/><b>Alertas operacionais</b><span>{alerts.length}</span></div>{alerts.length?<div className="v102-alert-items">{alerts.slice(0,4).map((a,i)=><article key={i}><b>{a.title}</b><small>{a.detail}</small></article>)}</div>:<div className="v102-ok-inline">✓ Nenhum alerta agora.</div>}</section>
 </div>
}
