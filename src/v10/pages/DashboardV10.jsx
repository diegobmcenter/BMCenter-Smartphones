import React from 'react';
import {ArrowUpRight,Boxes,CircleDollarSign,Clock3,Smartphone,TrendingUp} from 'lucide-react';

export default function DashboardV10({metrics,workflow,workflowMax,attention,salesByProfile,money,active}){
  const byLabel=Object.fromEntries(metrics.map(x=>[x.label,x]));
  const stock=byLabel['Valor em estoque'];
  const profit=byLabel['Lucro previsto'];
  const receivable=byLabel['A receber'];
  const published=byLabel['Anúncios publicados'];

  return <div className="v10-page v10-dashboard">
    <header className="v10-hero">
      <div><span>VISÃO GERAL</span><h1>Seu negócio, em um só lugar.</h1><p>Estoque, fluxo de trabalho e resultado sem excesso de informação.</p></div>
      <time>{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</time>
    </header>

    <section className="v10-metric-row">
      <article><span className="v10-metric-icon blue"><Boxes/></span><div><small>Estoque disponível</small><strong>{stock?.value||money(0)}</strong><em>{active} aparelhos ativos</em></div></article>
      <article><span className="v10-metric-icon green"><TrendingUp/></span><div><small>Lucro previsto</small><strong>{profit?.value||money(0)}</strong><em>sobre o estoque atual</em></div></article>
      <article><span className="v10-metric-icon amber"><CircleDollarSign/></span><div><small>A receber</small><strong>{receivable?.value||money(0)}</strong><em>vendas pendentes</em></div></article>
      <article><span className="v10-metric-icon violet"><Smartphone/></span><div><small>Publicações</small><strong>{published?.value||0}</strong><em>anúncios publicados</em></div></article>
    </section>

    <section className="v10-dashboard-grid">
      <article className="v10-workflow-card">
        <header><div><span>FLUXO OPERACIONAL</span><h2>Onde estão seus aparelhos</h2></div><b>{active} ativos</b></header>
        <div className="v10-workflow-bars">{workflow.map(([label,value])=><div key={label}>
          <div><span>{label}</span><b>{value}</b></div>
          <i><u style={{width:`${workflowMax?value/workflowMax*100:0}%`}}/></i>
        </div>)}</div>
      </article>

      <article className="v10-attention-card">
        <header><div><span>ATENÇÃO</span><h2>Sem movimentação</h2></div><Clock3 size={18}/></header>
        <div className="v10-attention-list">{attention.length?attention.slice(0,5).map(p=><div key={p.id}>
          <span className="v10-phone-dot"><Smartphone size={15}/></span>
          <div><b>{[p.brand,p.model].filter(Boolean).join(' ')||'Aparelho'}</b><small>{p.status}</small></div>
          <em>{Math.max(0,Math.floor((Date.now()-new Date(p.lastActivityAt||p.date).getTime())/86400000))} dias</em>
        </div>):<div className="v10-positive-empty"><span>✓</span><div><b>Tudo em dia</b><small>Nenhum aparelho parado.</small></div></div>}</div>
      </article>

      <article className="v10-profile-card">
        <header><div><span>DESEMPENHO</span><h2>Vendas por perfil</h2></div><ArrowUpRight size={17}/></header>
        <div>{salesByProfile.length?salesByProfile.slice(0,5).map((x,i)=><div className="v10-profile-row" key={x.profile.id}>
          <span>{i+1}</span><div><b>{x.profile.name}</b><small>{x.quantity} venda(s)</small></div><strong>{money(x.revenue)}</strong>
        </div>):<div className="v10-soft-empty">As vendas registradas aparecerão aqui.</div>}</div>
      </article>
    </section>
  </div>
}
