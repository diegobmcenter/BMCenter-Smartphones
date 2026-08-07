import React from 'react';
import {ArrowUpRight,Boxes,CircleDollarSign,Clock3,Smartphone,TrendingUp} from 'lucide-react';

export default function DashboardV8({metrics,workflow,workflowMax,attention,salesByProfile,money,active}){
  const byLabel=Object.fromEntries(metrics.map(x=>[x.label,x]));
  const total=byLabel['Total de aparelhos'];
  const stock=byLabel['Valor em estoque'];
  const profit=byLabel['Lucro previsto'];
  const receivable=byLabel['A receber'];
  const published=byLabel['Anúncios publicados'];

  return <div className="v8-page v8-dashboard">
    <header className="v8-page-intro">
      <div><span>VISÃO GERAL</span><h1>Seu negócio, agora.</h1><p>O essencial do estoque, vendas e operação em uma única tela.</p></div>
      <time>{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</time>
    </header>

    <section className="v8-bento">
      <article className="v8-bento-primary">
        <div className="v8-bento-icon"><Boxes/></div>
        <span>Valor de venda em estoque</span>
        <strong>{stock?.value||money(0)}</strong>
        <small>{total?.detail||`${active} ativos`}</small>
        <div className="v8-bento-spark"><i/><i/><i/><i/><i/><i/></div>
      </article>

      <article className="v8-bento-profit">
        <div><span>Lucro previsto</span><strong>{profit?.value||money(0)}</strong></div>
        <TrendingUp/>
        <small>{profit?.detail||'sobre o estoque'}</small>
      </article>

      <article className="v8-bento-compact">
        <CircleDollarSign/><div><span>A receber</span><strong>{receivable?.value||money(0)}</strong></div>
      </article>

      <article className="v8-bento-compact">
        <Smartphone/><div><span>Publicações</span><strong>{published?.value||0}</strong></div>
      </article>

      <article className="v8-bento-flow">
        <header><div><span>Fluxo operacional</span><strong>{active} ativos</strong></div><ArrowUpRight size={16}/></header>
        <div className="v8-flow-list">{workflow.map(([label,value])=><div key={label}>
          <span>{label}</span><b>{value}</b><i><u style={{width:`${value/workflowMax*100}%`}}/></i>
        </div>)}</div>
      </article>

      <article className="v8-bento-attention">
        <header><div><span>Precisam de atenção</span><small>Aparelhos sem movimentação</small></div><Clock3/></header>
        <div>{attention.length?attention.slice(0,5).map(p=><div className="v8-attention-row" key={p.id}>
          <span className="v8-device-dot">●</span>
          <div><b>{[p.brand,p.model].filter(Boolean).join(' ')||'Aparelho'}</b><small>{p.status}</small></div>
          <em>{Math.max(0,Math.floor((Date.now()-new Date(p.lastActivityAt||p.date).getTime())/86400000))}d</em>
        </div>):<p>Nenhum aparelho parado.</p>}</div>
      </article>

      <article className="v8-bento-ranking">
        <header><span>Desempenho por perfil</span><small>Receita registrada</small></header>
        <div>{salesByProfile.length?salesByProfile.slice(0,4).map((x,i)=><div key={x.profile.id}>
          <span>{i+1}</span><div><b>{x.profile.name}</b><small>{x.quantity} venda(s)</small></div><strong>{money(x.revenue)}</strong>
        </div>):<p>As vendas aparecerão aqui.</p>}</div>
      </article>
    </section>
  </div>
}
