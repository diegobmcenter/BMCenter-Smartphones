import React,{useMemo,useState} from 'react';
import {AlertTriangle,BarChart3,CalendarDays,CircleDollarSign,Gauge,Package,RotateCcw,ShoppingCart,Tag,Tags,TrendingDown,TrendingUp,Users,WalletCards} from 'lucide-react';
export default function ReportsV10({forecast7,forecast30,stockExpected,profileData,supplierData,partsCurrent={open:0,quotes:0,orders:0,returns:0},partsPeriod={purchasedQty:0,purchasedValue:0,returnsQty:0,recoveredValue:0,unrecoveredLoss:0},tags,channelSummary,bankSummary,monthly,discarded=[],discardLoss=0,profitabilitySummary={revenue:0,cost:0,profit:0,marginPct:0,roiPct:0},profitabilityRows=[],turnover=[],money,formatMonth,period,setPeriod,customStart,setCustomStart,customEnd,setCustomEnd,periodLabel,rangeLabel}){
 const[targetProfit,setTargetProfit]=useState(350),[purchaseModel,setPurchaseModel]=useState('');
 const selectedModel=useMemo(()=>turnover.find(item=>item.key===(purchaseModel||turnover[0]?.key))||turnover[0]||null,[turnover,purchaseModel]);
 const maxPurchase=selectedModel?Math.max(0,Number(selectedModel.avgSale||0)-Number(selectedModel.avgParts||0)-Number(selectedModel.avgOther||0)-Math.max(0,Number(targetProfit)||0)):0;
 return <div className="v10-page v10-reports-page">
  <header className="v10-hero"><div><span>ANÁLISE</span><h1>Relatórios</h1><p>Uma leitura objetiva de vendas, estoque, rentabilidade, giro, perfis e fornecedores.</p></div></header>
  <section className="v10490-report-period">
   <div className="v10490-period-label"><CalendarDays size={14}/><b>Período</b></div>
   <select value={period} onChange={e=>setPeriod(e.target.value)} aria-label="Período dos relatórios">
    <option value="today">Hoje</option><option value="last7">Últimos 7 dias</option><option value="this_month">Este mês</option><option value="previous_month">Mês passado</option><option value="last30">Últimos 30 dias</option><option value="this_year">Este ano</option><option value="all">Todo o período</option><option value="custom">Personalizado</option>
   </select>
   {period==='custom'&&<div className="v10490-custom-range"><input type="date" value={customStart} onChange={e=>setCustomStart(e.target.value)}/><span>até</span><input type="date" value={customEnd} onChange={e=>setCustomEnd(e.target.value)}/></div>}
   <span className="v10490-range-chip" title={periodLabel}>{rangeLabel}</span>
   <small>O período filtra vendas, compras, perfis, recebimentos, perdas e histórico. Previsões, estoque e pendências operacionais permanecem atuais.</small>
  </section>
  <section className="v10-report-metrics">
   <article><TrendingUp/><div><small>Previsão 7 dias</small><strong>{money(forecast7)}</strong></div></article>
   <article><BarChart3/><div><small>Previsão 30 dias</small><strong>{money(forecast30)}</strong></div></article>
   <article><Package/><div><small>Estoque previsto · atual</small><strong>{money(stockExpected)}</strong></div></article><article className="v1042-loss-metric"><TrendingDown/><div><small>Prejuízo · período</small><strong>{money(discardLoss)}</strong><span>{discarded.length} aparelho(s)</span></div></article>
  </section>
  <section className="v105-profit-strip"><header><WalletCards size={15}/><div><span>RENTABILIDADE REAL · {periodLabel}</span><b>Resultado líquido das vendas</b></div></header><div>
   <article><small>Receita líquida</small><strong>{money(profitabilitySummary.revenue)}</strong></article>
   <article><small>Custo real</small><strong>{money(profitabilitySummary.cost)}</strong></article>
   <article className={profitabilitySummary.profit>=0?'good':'bad'}><small>Lucro líquido</small><strong>{money(profitabilitySummary.profit)}</strong></article>
   <article><small>Margem</small><strong>{Number(profitabilitySummary.marginPct||0).toFixed(1).replace('.',',')}%</strong></article>
   <article><small>ROI</small><strong>{Number(profitabilitySummary.roiPct||0).toFixed(1).replace('.',',')}%</strong></article>
  </div></section>
  <section className="v10493-parts-overview">
   <header><Package/><div><span>CENTRAL DE PEÇAS</span><h2>Resumo de peças</h2></div></header>
   <div className="v10493-parts-group"><b className="v10493-parts-group-label">ATUAL</b><div className="v10493-parts-current">
    <article><Package/><div><small>Em aberto</small><strong>{partsCurrent.open}</strong></div></article>
    <article><Tags/><div><small>Cotações</small><strong>{partsCurrent.quotes}</strong></div></article>
    <article><ShoppingCart/><div><small>Pedidos</small><strong>{partsCurrent.orders}</strong></div></article>
    <article><RotateCcw/><div><small>Devoluções</small><strong>{partsCurrent.returns}</strong></div></article>
   </div></div>
   <div className="v10493-parts-group"><b className="v10493-parts-group-label">{periodLabel}</b><div className="v10493-parts-period">
    <article><ShoppingCart/><div><small>Peças compradas</small><strong>{partsPeriod.purchasedQty}</strong></div></article>
    <article><CircleDollarSign/><div><small>Valor comprado</small><strong>{money(partsPeriod.purchasedValue)}</strong></div></article>
    <article><RotateCcw/><div><small>Devolvidas</small><strong>{partsPeriod.returnsQty}</strong></div></article>
    <article className="good"><TrendingUp/><div><small>Valor recuperado</small><strong>{money(partsPeriod.recoveredValue)}</strong></div></article>
    <article className="bad"><TrendingDown/><div><small>Perda não recuperada</small><strong>{money(partsPeriod.unrecoveredLoss)}</strong></div></article>
   </div></div>
  </section>
  <section className="v105-intelligence-grid">
   <article className="v105-turnover-card"><header><Gauge/><div><span>GIRO POR MODELO · {periodLabel}</span><h2>O que vende melhor</h2></div></header><div className="v105-turnover-table"><div className="head"><span>Modelo</span><span>Vendas</span><span>Giro</span><span>Margem</span><span>Lucro médio</span></div>{turnover.slice(0,10).map(row=><div className="row" key={row.key}><b>{row.name}</b><span>{row.qty}</span><span>{row.avgDays.toFixed(0)}d</span><span className={row.avgMargin>=0?'good':'bad'}>{row.avgMargin.toFixed(1).replace('.',',')}%</span><strong>{money(row.avgProfit)}</strong></div>)}{!turnover.length&&<em>Sem histórico suficiente neste período.</em>}</div></article>
   <article className="v105-buy-calculator"><header><ShoppingCart/><div><span>COMPRA INTELIGENTE</span><h2>Preço máximo sugerido</h2></div></header>{selectedModel?<><div className="v105-buy-fields"><label>Modelo<select value={selectedModel.key} onChange={e=>setPurchaseModel(e.target.value)}>{turnover.map(row=><option key={row.key} value={row.key}>{row.name}</option>)}</select></label><label>Lucro desejado<div><span>R$</span><input type="number" min="0" step="10" value={targetProfit} onChange={e=>setTargetProfit(e.target.value)}/></div></label></div><div className="v105-buy-result"><small>Pagar no máximo</small><strong>{money(maxPurchase)}</strong><span>{selectedModel.qty} venda(s) usadas · giro médio {selectedModel.avgDays.toFixed(0)}d</span></div><dl><div><dt>Venda líquida média</dt><dd>{money(selectedModel.avgSale)}</dd></div><div><dt>Peças médias</dt><dd>{money(selectedModel.avgParts)}</dd></div><div><dt>Outros custos médios</dt><dd>{money(selectedModel.avgOther)}</dd></div><div><dt>Lucro alvo</dt><dd>{money(targetProfit)}</dd></div></dl></>:<em>Registre vendas para gerar uma sugestão baseada no seu próprio histórico.</em>}</article>
  </section>
  <section className="v105-phone-profit"><header><CircleDollarSign/><div><span>POR APARELHO · {periodLabel}</span><h2>Rentabilidade das vendas</h2></div></header><div className="v105-phone-profit-table"><div className="head"><span>Aparelho</span><span>Custo</span><span>Líquido</span><span>Lucro</span><span>Margem</span></div>{profitabilityRows.slice(0,12).map(row=><div className="row" key={row.phone.id}><b>{[row.phone.brand,row.phone.model].filter(Boolean).join(' ')}</b><span>{money(row.cost)}</span><span>{money(row.revenue)}</span><strong className={row.profit>=0?'good':'bad'}>{money(row.profit)}</strong><span>{row.marginPct.toFixed(1).replace('.',',')}%</span></div>)}{!profitabilityRows.length&&<em>Sem vendas neste período.</em>}</div></section>
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
