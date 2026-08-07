import React from 'react';
import {AlertTriangle,CheckCircle2,ChevronRight,PackageSearch,ScanSearch,Smartphone,Wrench} from 'lucide-react';

const icons={
 'Analisar':<ScanSearch/>,
 'Comprar peças':<PackageSearch/>,
 'Reparar e testar':<Wrench/>,
 'Prontos para anunciar':<CheckCircle2/>
};

export default function TodayV10({groups,alerts,phoneDisplayName}){
  const total=groups.reduce((n,g)=>n+g.items.length,0);
  return <div className="v10-page v10-today">
    <header className="v10-hero">
      <div><span>HOJE</span><h1>O que precisa da sua atenção.</h1><p>{total?`${total} ações organizadas por etapa.`:'Tudo em dia por aqui.'}</p></div>
      <div className="v10-count-badge"><strong>{total}</strong><span>ações</span></div>
    </header>

    <section className="v10-today-layout">
      <div className="v10-task-feed">
        {groups.map((group,index)=><section className="v10-task-section" key={group.title}>
          <header>
            <span className="v10-task-step">{String(index+1).padStart(2,'0')}</span>
            <i>{icons[group.title]||<Smartphone/>}</i>
            <div><h2>{group.title}</h2><p>{group.items.length} item(ns)</p></div>
          </header>
          <div className="v10-task-list">{group.items.length?group.items.map(p=><button key={p.id}>
            <span className="v10-device-icon"><Smartphone size={16}/></span>
            <div><b>{phoneDisplayName(p,{includeCode:false})}</b><small>{p.status}</small></div>
            <ChevronRight size={16}/>
          </button>):<div className="v10-task-empty">Nenhuma pendência nesta etapa.</div>}</div>
        </section>)}
      </div>

      <aside className="v10-alert-panel">
        <header><div><span>ALERTAS</span><h2>Operacional</h2></div><em>{alerts.length}</em></header>
        <div>{alerts.length?alerts.slice(0,10).map((a,i)=><article key={i}>
          <AlertTriangle size={16}/><div><b>{a.title}</b><small>{a.detail}</small></div>
        </article>):<div className="v10-positive-empty"><span>✓</span><div><b>Nenhum alerta</b><small>Operação normal agora.</small></div></div>}</div>
      </aside>
    </section>
  </div>
}
