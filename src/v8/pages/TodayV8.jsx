import React from 'react';
import {AlertTriangle,ChevronRight,CircleCheckBig,PackageSearch,ScanSearch,Smartphone} from 'lucide-react';

const meta={
 'Analisar':{icon:<ScanSearch/>,tone:'blue',hint:'Diagnóstico'},
 'Comprar peças':{icon:<PackageSearch/>,tone:'amber',hint:'Compras'},
 'Reparar e testar':{icon:<Smartphone/>,tone:'violet',hint:'Oficina'},
 'Prontos para anunciar':{icon:<CircleCheckBig/>,tone:'green',hint:'Publicação'}
};

export default function TodayV8({groups,alerts,phoneDisplayName}){
  const total=groups.reduce((n,g)=>n+g.items.length,0);
  return <div className="v8-page v8-today">
    <header className="v8-page-intro">
      <div><span>FOCO DO DIA</span><h1>O que merece atenção hoje.</h1><p>{total?`${total} item(ns) distribuídos pelo fluxo operacional.`:'Tudo em dia por aqui.'}</p></div>
      <div className="v8-focus-score"><strong>{total}</strong><span>ações</span></div>
    </header>

    <section className="v8-focus-layout">
      <div className="v8-focus-feed">
        {groups.map(group=>{
          const m=meta[group.title]||meta['Analisar'];
          return <section className={`v8-focus-group tone-${m.tone}`} key={group.title}>
            <header><div className="v8-focus-icon">{m.icon}</div><div><span>{m.hint}</span><h2>{group.title}</h2></div><b>{group.items.length}</b></header>
            <div className="v8-focus-items">
              {group.items.length?group.items.map(p=><article key={p.id}>
                <span className="v8-phone-marker"><Smartphone size={15}/></span>
                <div><b>{phoneDisplayName(p,{includeCode:false})}</b><small>{p.status}</small></div>
                <ChevronRight size={15}/>
              </article>):<p>Nada pendente nesta etapa.</p>}
            </div>
          </section>
        })}
      </div>

      <aside className="v8-alert-stream">
        <header><div><span>Alertas</span><h2>Operacional</h2></div><em>{alerts.length}</em></header>
        <div>{alerts.length?alerts.slice(0,10).map((a,i)=><article key={i}>
          <AlertTriangle size={14}/><div><b>{a.title}</b><small>{a.detail}</small></div>
        </article>):<p>Nenhum alerta agora.</p>}</div>
      </aside>
    </section>
  </div>
}
