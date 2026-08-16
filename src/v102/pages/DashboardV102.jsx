import React from 'react';
import {AlertTriangle,Boxes,CircleDollarSign,Clock3,Lightbulb,Smartphone,TrendingUp,WalletCards} from 'lucide-react';

export default function DashboardV102({metrics,workflow,workflowMax,attention,salesByProfile,money,active,capital={},aging=[],suggestions=[]}){
 const byLabel=Object.fromEntries(metrics.map(x=>[x.label,x]));
 const items=[
  {label:'Estoque disponível',value:byLabel['Valor em estoque']?.value||money(0),detail:`${active} aparelhos ativos`,icon:<Boxes/>,tone:'blue'},
  {label:'Capital investido',value:money(capital.total||0),detail:'preso no estoque atual',icon:<WalletCards/>,tone:'amber'},
  {label:'Lucro previsto',value:byLabel['Lucro previsto']?.value||money(0),detail:'sobre o estoque atual',icon:<TrendingUp/>,tone:'green'},
  {label:'A receber',value:byLabel['A receber']?.value||money(0),detail:'vendas pendentes',icon:<CircleDollarSign/>,tone:'amber'}
 ];
 const capitalRows=[['Análise',capital.analysis],['Aguard. peças',capital.parts],['Reparo/testes',capital.repair],['Prontos',capital.ready],['Anunciados',capital.announced]].filter(([,value])=>Number(value)>0);
 return <div className="v102-page v102-dashboard">
  <header className="v102-hero"><div><span>VISÃO GERAL</span><h1>Seu negócio, em um só lugar.</h1><p>Estoque, capital, giro e prioridades sem excesso de informação.</p></div><time>{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</time></header>
  <section className="v102-kpi-grid v105-dashboard-kpis">{items.map(x=><article key={x.label}><span className={`v102-kpi-icon ${x.tone}`}>{x.icon}</span><div><small>{x.label}</small><strong>{x.value}</strong><em>{x.detail}</em></div></article>)}</section>
  <section className="v105-capital-strip"><header><WalletCards size={15}/><b>Capital por etapa</b><strong>{money(capital.total||0)}</strong></header><div>{capitalRows.map(([label,value])=><span key={label}><small>{label}</small><b>{money(value)}</b></span>)}{!capitalRows.length&&<em>Sem capital alocado.</em>}</div></section>
  <section className="v102-dashboard-grid v105-dashboard-grid">
   <article className="v102-flow"><header><div><span>FLUXO OPERACIONAL</span><h2>Onde estão seus aparelhos</h2></div><b>{active} ativos</b></header><div>{workflow.map(([label,value])=><div className="v102-flow-row" key={label}><div><span>{label}</span><b>{value}</b></div><i><u style={{width:`${workflowMax?value/workflowMax*100:0}%`}}/></i></div>)}</div></article>
   <article className="v105-aging-card"><header><div><span>RADAR DE ESTOQUE</span><h2>Aparelhos envelhecendo</h2></div><Clock3 size={18}/></header><div className="v105-aging-list">{aging.slice(0,5).map(row=><div className={row.severity} key={row.phone.id}><i/><div><b>{[row.phone.brand,row.phone.model].filter(Boolean).join(' ')}</b><small>{row.purchaseDays}d estoque · {row.idleDays}d parado{row.publishedDays?` · ${row.publishedDays}d anunciado`:''}</small></div><strong>{money(row.invested)}</strong></div>)}{!aging.length&&<p>Nenhum aparelho ativo.</p>}</div></article>
   <article className="v105-insights-card"><header><div><span>SUGESTÕES AUTOMÁTICAS</span><h2>Onde agir primeiro</h2></div><Lightbulb size={18}/></header><div>{suggestions.map((tip,index)=><div key={`${tip.type}-${index}`}><span>{tip.type==='stock'||tip.type==='margin'?<AlertTriangle size={13}/>:<TrendingUp size={13}/>}</span><p><b>{tip.title}</b><small>{tip.detail}</small></p></div>)}{!suggestions.length&&<p className="v102-ok"><b>✓</b><span>Sem alertas estratégicos agora.</span></p>}</div></article>
   <article className="v102-sales-profile"><header><span>DESEMPENHO</span><h2>Vendas por perfil</h2></header>{salesByProfile.length?salesByProfile.slice(0,4).map((x,i)=><div key={x.profile.id}><span>{i+1}</span><div><b>{x.profile.name}</b><small>{x.quantity} venda(s)</small></div><strong>{money(x.revenue)}</strong></div>):<p>As vendas registradas aparecerão aqui.</p>}</article>
  </section>
 </div>
}
