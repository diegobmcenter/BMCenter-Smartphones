import React from 'react';
import {AlertTriangle,BarChart3,CalendarDays,CircleDollarSign,Package,Tag,TrendingDown,TrendingUp,Users} from 'lucide-react';
export default function ReportsV10({forecast7,forecast30,stockExpected,profileData,supplierData,tags,channelSummary,bankSummary,monthly,discarded=[],discardLoss=0,money,formatMonth,period,setPeriod,customStart,setCustomStart,customEnd,setCustomEnd,periodLabel,rangeLabel}){
 return <div className="v10-page v10-reports-page">
  <header className="v10-hero"><div><span>ANÁLISE</span><h1>Relatórios</h1><p>Uma leitura objetiva de vendas, estoque, perfis, fornecedores e recebimentos.</p></div></header>
  <section className="v10490-report-period">
   <div className="v10490-period-label"><CalendarDays size={14}/><b>Período</b></div>
   <select value={period} onChange={e=>setPeriod(e.target.value)} aria-label="Período dos relatórios">
    <option value="today">Hoje</option><option value="last7">Últimos 7 dias</option><option value="this_month">Este mês</option><option value="previous_month">Mês passado</option><option value="last30">Últimos 30 dias</option><option value="this_year">Este ano</option><option value="all">Todo o período</option><option value="custom">Personalizado</option>
   </select>
   {period==='custom'&&<div className="v10490-custom-range"><input type="date" value={customStart} onChange={e=>setCustomStart(e.target.value)}/><span>até</span><input type="date" value={customEnd} onChange={e=>setCustomEnd(e.target.value)}/></div>}
   <span className="v10490-range-chip" title={periodLabel}>{rangeLabel}</span>
   <small>O período filtra vendas, compras, perfis, recebimentos, perdas e histórico. Previsões e estoque permanecem atuais.</small>
  </section>
  <section className="v10-report-metrics">
   <article><TrendingUp/><div><small>Previsão 7 dias</small><strong>{money(forecast7)}</strong></div></article>
   <article><BarChart3/><div><small>Previsão 30 dias</small><strong>{money(forecast30)}</strong></div></article>
   <article><Package/><div><small>Estoque previsto · atual</small><strong>{money(stockExpected)}</strong></div></article><article className="v1042-loss-metric"><TrendingDown/><div><small>Prejuízo · período</small><strong>{money(discardLoss)}</strong><span>{discarded.length} aparelho(s)</span></div></article>
  </section>
  <section className="v10-report-grid">
   <article><header><Users/><div><span>PERFIS · {periodLabel}</span><h2>Desempenho por perfil</h2></div></header><div className="v10-ranked-list">{profileData.filter(x=>x.qty).map((x,i)=><div key={x.name}><span>{i+1}</span><div><b>{x.name}</b><small>{x.qty} venda(s)</small></div><strong>{money(x.revenue)}</strong></div>)}{!profileData.some(x=>x.qty)&&<em>Sem vendas neste período.</em>}</div></article>
   <article><header><Package/><div><span>COMPRAS · {periodLabel}</span><h2>Gastos com peças</h2></div></header><div className="v10-ranked-list">{supplierData.map((x,i)=><div key={x.name}><span>{i+1}</span><div><b>{x.name}</b><small>Fornecedor</small></div><strong>{money(x.value)}</strong></div>)}{!supplierData.length&&<em>Sem gastos neste período.</em>}</div></article>
   <article><header><Tag/><div><span>ETIQUETAS · {periodLabel}</span><h2>Mais utilizadas</h2></div></header><div className="v10-tag-list">{tags.map(([name,count])=><span key={name}>{name}<b>{count}</b></span>)}{!tags.length&&<em>Sem etiquetas neste período.</em>}</div></article>
   <article><header><CircleDollarSign/><div><span>VENDAS · {periodLabel}</span><h2>Por canal</h2></div></header><div className="v10-ranked-list">{Object.entries(channelSummary).sort((a,b)=>b[1]-a[1]).map(([name,value],i)=><div key={name}><span>{i+1}</span><div><b>{name}</b><small>Valor líquido</small></div><strong>{money(value)}</strong></div>)}{!Object.keys(channelSummary).length&&<em>Sem vendas neste período.</em>}</div></article>
   <article><header><CircleDollarSign/><div><span>RECEBIMENTOS · {periodLabel}</span><h2>Por conta</h2></div></header><div className="v10-ranked-list">{Object.entries(bankSummary).sort((a,b)=>b[1]-a[1]).map(([name,value],i)=><div key={name}><span>{i+1}</span><div><b>{name}</b><small>Valor recebido</small></div><strong>{money(value)}</strong></div>)}{!Object.keys(bankSummary).length&&<em>Sem recebimentos neste período.</em>}</div></article>
  </section>
  <section className="v10-disposal-report"><header><AlertTriangle/><div><span>PERDAS · {periodLabel}</span><h2>Descarte / Sucata</h2><p>Prejuízo dos aparelhos classificados como descarte no período selecionado.</p></div><strong>{money(discardLoss)}</strong></header><div className="v10-disposal-list">{discarded.map(phone=><div key={phone.id}><div><b>{[phone.brand,phone.model].filter(Boolean).join(' ')||'Aparelho sem identificação'}</b><small>{phone.code||''}</small></div><strong>{money(phone.paid||0)}</strong></div>)}{!discarded.length&&<em>Nenhum descarte neste período.</em>}</div></section>
  <section className="v10-monthly"><header><BarChart3/><div><span>HISTÓRICO · {periodLabel}</span><h2>Resultado mensal</h2></div></header><div className="v10-monthly-table"><div className="head"><span>Mês</span><span>Vendas</span><span>Faturamento</span><span>Lucro</span></div>{Object.entries(monthly).sort(([a],[b])=>b.localeCompare(a)).map(([month,data])=><div className="row" key={month}><b>{formatMonth(month)}</b><span>{data.qty}</span><span>{money(data.revenue)}</span><strong className={data.profit>=0?'good':'bad'}>{money(data.profit)}</strong></div>)}{!Object.keys(monthly).length&&<div className="v10-empty-inline">Sem vendas neste período.</div>}</div></section>
 </div>
}
