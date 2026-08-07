import React from 'react';
import {Boxes,CircleDollarSign,Clock3,Smartphone,TrendingUp} from 'lucide-react';

export default function DashboardV102({metrics,workflow,workflowMax,attention,salesByProfile,money,active}){
 const byLabel=Object.fromEntries(metrics.map(x=>[x.label,x]));
 const items=[
  {label:'Estoque disponível',value:byLabel['Valor em estoque']?.value||money(0),detail:`${active} aparelhos ativos`,icon:<Boxes/>,tone:'blue'},
  {label:'Lucro previsto',value:byLabel['Lucro previsto']?.value||money(0),detail:'sobre o estoque atual',icon:<TrendingUp/>,tone:'green'},
  {label:'A receber',value:byLabel['A receber']?.value||money(0),detail:'vendas pendentes',icon:<CircleDollarSign/>,tone:'amber'},
  {label:'Publicações',value:byLabel['Anúncios publicados']?.value||0,detail:'anúncios publicados',icon:<Smartphone/>,tone:'violet'}
 ];
 return <div className="v102-page v102-dashboard">
  <header className="v102-hero"><div><span>VISÃO GERAL</span><h1>Seu negócio, em um só lugar.</h1><p>Estoque, fluxo de trabalho e resultado sem excesso de informação.</p></div><time>{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</time></header>
  <section className="v102-kpi-grid">{items.map(x=><article key={x.label}><span className={`v102-kpi-icon ${x.tone}`}>{x.icon}</span><div><small>{x.label}</small><strong>{x.value}</strong><em>{x.detail}</em></div></article>)}</section>
  <section className="v102-dashboard-grid">
   <article className="v102-flow"><header><div><span>FLUXO OPERACIONAL</span><h2>Onde estão seus aparelhos</h2></div><b>{active} ativos</b></header><div>{workflow.map(([label,value])=><div className="v102-flow-row" key={label}><div><span>{label}</span><b>{value}</b></div><i><u style={{width:`${workflowMax?value/workflowMax*100:0}%`}}/></i></div>)}</div></article>
   <article className="v102-attention"><header><div><span>ATENÇÃO</span><h2>Sem movimentação</h2></div><Clock3 size={18}/></header>{attention.length?<div className="v102-attention-list">{attention.slice(0,4).map(p=><div key={p.id}><span><Smartphone size={14}/></span><div><b>{[p.brand,p.model].filter(Boolean).join(' ')}</b><small>{p.status}</small></div></div>)}</div>:<div className="v102-ok"><b>✓</b><div><strong>Tudo em dia</strong><small>Nenhum aparelho parado.</small></div></div>}</article>
   <article className="v102-sales-profile"><header><span>DESEMPENHO</span><h2>Vendas por perfil</h2></header>{salesByProfile.length?salesByProfile.slice(0,4).map((x,i)=><div key={x.profile.id}><span>{i+1}</span><div><b>{x.profile.name}</b><small>{x.quantity} venda(s)</small></div><strong>{money(x.revenue)}</strong></div>):<p>As vendas registradas aparecerão aqui.</p>}</article>
  </section>
 </div>
}
