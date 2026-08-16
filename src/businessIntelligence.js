import{effectivePartCost}from'./partsOrders.js';

const n=v=>{if(typeof v==='number')return Number.isFinite(v)?v:0;let text=String(v??'').trim().replace(/[^0-9,.-]/g,'');if(text.includes(','))text=text.replace(/\./g,'').replace(',','.');const x=Number(text);return Number.isFinite(x)?x:0};
const dayMs=86400000;
const dateKey=value=>String(value||'').slice(0,10);
const time=value=>{const t=new Date(value||0).getTime();return Number.isFinite(t)?t:0};
const daysBetween=(a,b)=>{const start=time(a),end=time(b);return start&&end?Math.max(0,Math.round((end-start)/dayMs)):0};
const closed=phone=>['Vendido','Descarte/Sucata'].includes(String(phone?.status||''));
const localDayTime=value=>{if(!value)return 0;let d;if(/^\d{4}-\d{2}-\d{2}$/.test(String(value)))d=new Date(`${value}T12:00:00`);else d=new Date(value);if(!Number.isFinite(d.getTime()))return 0;d.setHours(0,0,0,0);return d.getTime()};
const meaningfulTimeline=message=>{const text=String(message||'').trim().toLocaleLowerCase('pt-BR');if(!text)return false;return !/^(cadastro atualizado|ficha operacional atualizada)$/.test(text)};
export function lastOperationalActivityDate(phone,extraDates=[]){
 const dates=[];const add=value=>{if(value&&Number.isFinite(new Date(value).getTime()))dates.push(value)};
 add(phone?.date);
 (phone?.timeline||[]).forEach(entry=>{if(meaningfulTimeline(entry?.message))add(entry?.date)});
 (phone?.parts||[]).forEach(part=>{add(part?.updatedAt);(part?.quotes||[]).forEach(quote=>add(quote?.updatedAt));});
 (phone?.mediaLibrary||[]).forEach(media=>add(media?.date));
 (phone?.priceHistory||[]).forEach(entry=>add(entry?.date));
 const map=phone?.marketplaceProfiles&&typeof phone.marketplaceProfiles==='object'&&!Array.isArray(phone.marketplaceProfiles)?phone.marketplaceProfiles:{};
 Object.values(map).forEach(entry=>{add(entry?.updatedAt);add(entry?.publishedAt);add(entry?.endedAt)});
 (phone?.ads||[]).forEach(ad=>{add(ad?.createdAt);add(ad?.updatedAt);Object.values(ad?.publications||{}).forEach(pub=>{add(pub?.updatedAt);add(pub?.date);add(pub?.endedAt)})});
 (phone?.diagnostics||[]).forEach(entry=>{add(entry?.updatedAt);add(entry?.date)});
 if(phone?.sale){add(phone.sale.updatedAt);add(phone.sale.soldAt)};
 (extraDates||[]).forEach(add);
 return dates.sort((a,b)=>new Date(b).getTime()-new Date(a).getTime())[0]||phone?.date||'';
}
export function operationalIdleDays(phone,now=new Date(),extraDates=[]){const start=localDayTime(lastOperationalActivityDate(phone,extraDates)),end=localDayTime(now);return start&&end?Math.max(0,Math.floor((end-start)/dayMs)):0}


export function phoneOtherCosts(phone){
 const scalar=n(phone?.otherCosts);
 const list=Array.isArray(phone?.additionalCosts)?phone.additionalCosts.reduce((sum,item)=>sum+n(item?.value),0):0;
 return scalar+list;
}
export function phonePartsCost(phone){return(Array.isArray(phone?.parts)?phone.parts:[]).reduce((sum,part)=>sum+effectivePartCost(part),0)}
export function intelligencePhoneCost(phone){return n(phone?.paid)+phonePartsCost(phone)+phoneOtherCosts(phone)}
export function saleNetValueBI(sale){return sale?n(sale.value)-n(sale.marketplaceFee)-n(sale.shippingCost):0}
export function profitabilityForPhone(phone){
 const cost=intelligencePhoneCost(phone),sold=Boolean(phone?.sale?.soldAt),revenue=sold?saleNetValueBI(phone.sale):n(phone?.expected),profit=revenue-cost;
 return{cost,revenue,profit,marginPct:revenue?profit/revenue*100:0,roiPct:cost?profit/cost*100:0,purchase:n(phone?.paid),parts:phonePartsCost(phone),other:phoneOtherCosts(phone),fees:sold?n(phone.sale?.marketplaceFee):0,delivery:sold?n(phone.sale?.shippingCost):0};
}
export function modelKey(phone){return[phone?.brand,phone?.model].filter(Boolean).join(' ').trim().toLocaleLowerCase('pt-BR')}
export function modelLabel(phone){return[phone?.brand,phone?.model].filter(Boolean).join(' ').trim()||'Modelo não informado'}

function publicationDates(phone){
 const dates=[];
 const map=phone?.marketplaceProfiles&&typeof phone.marketplaceProfiles==='object'&&!Array.isArray(phone.marketplaceProfiles)?phone.marketplaceProfiles:{};
 Object.values(map).forEach(value=>{if(value?.publishedAt)dates.push(dateKey(value.publishedAt))});
 (phone?.ads||[]).forEach(ad=>Object.values(ad?.publications||{}).forEach(pub=>{if(pub?.date&&['published','removed'].includes(pub.status))dates.push(dateKey(pub.date))}));
 return dates.filter(Boolean).sort();
}
export function firstPublicationDate(phone){return publicationDates(phone)[0]||''}
export function publishedProfileIdsBI(phone,profiles=[]){
 if(phone?.sale?.soldAt||phone?.status==='Vendido')return[];
 const activeIds=new Set((profiles||[]).filter(p=>p?.active!==false).map(p=>String(p.id)));
 const ids=new Set();
 const map=phone?.marketplaceProfiles&&typeof phone.marketplaceProfiles==='object'&&!Array.isArray(phone.marketplaceProfiles)?phone.marketplaceProfiles:{};
 Object.entries(map).forEach(([id,value])=>{if(value?.active!==false&&(!activeIds.size||activeIds.has(String(id))))ids.add(String(id))});
 (phone?.ads||[]).forEach(ad=>Object.entries(ad?.publications||{}).forEach(([id,pub])=>{if(pub?.status==='published'&&(!activeIds.size||activeIds.has(String(id))))ids.add(String(id))}));
 return[...ids];
}
export function adCoverageMetrics(phones=[],profiles=[]){
 const activeProfiles=(profiles||[]).filter(p=>p?.active!==false),activePhones=(phones||[]).filter(phone=>!closed(phone));
 const required=activeProfiles.length;
 const rows=activePhones.map(phone=>{const ids=publishedProfileIdsBI(phone,activeProfiles);return{phone,published:ids.length,missing:Math.max(0,required-ids.length),ids,complete:required>0&&ids.length>=required}});
 const totalLinks=rows.reduce((sum,row)=>sum+row.published,0),possible=rows.length*required;
 return{rows,profiles:activeProfiles,totalPhones:rows.length,totalLinks,possible,coveragePct:possible?totalLinks/possible*100:0,complete:rows.filter(r=>r.complete).length,incomplete:rows.filter(r=>r.published>0&&!r.complete).length,none:rows.filter(r=>r.published===0).length,byProfile:activeProfiles.map(profile=>({profile,published:rows.filter(row=>row.ids.includes(String(profile.id))).length,missing:rows.filter(row=>!row.ids.includes(String(profile.id))).length}))};
}

export function stockAgingRows(phones=[],now=new Date()){
 const end=time(now)||Date.now();
 return(phones||[]).filter(phone=>!closed(phone)).map(phone=>{
  const purchaseDate=dateKey(phone?.date)||phone?.lastActivityAt||'',publicationDate=firstPublicationDate(phone),purchaseDays=purchaseDate?Math.max(0,Math.floor((end-time(purchaseDate))/dayMs)):0,idleDays=operationalIdleDays(phone,now),publishedDays=publicationDate?Math.max(0,Math.floor((end-time(publicationDate))/dayMs)):0;
  const severity=idleDays>=21||purchaseDays>=45?'critical':idleDays>=10||purchaseDays>=25?'attention':'normal';
  const score=(severity==='critical'?200:severity==='attention'?100:0)+idleDays+purchaseDays*.35+publishedDays*.3;
  return{phone,purchaseDays,idleDays,publishedDays,severity,score,invested:intelligencePhoneCost(phone),expected:n(phone?.expected)};
 }).sort((a,b)=>b.score-a.score);
}

export function turnoverByModel(phones=[]){
 const groups=new Map();
 (phones||[]).forEach(phone=>{const key=modelKey(phone);if(!key)return;const group=groups.get(key)||{key,name:modelLabel(phone),sold:[],active:0};if(phone?.sale?.soldAt)group.sold.push(phone);else if(!closed(phone))group.active++;groups.set(key,group)});
 return[...groups.values()].filter(group=>group.sold.length).map(group=>{
  const values=group.sold.map(phone=>{const p=profitabilityForPhone(phone);return{days:daysBetween(phone.date,phone.sale.soldAt),profit:p.profit,margin:p.marginPct,sale:p.revenue,cost:p.cost,purchase:p.purchase,parts:p.parts,other:p.other}});
  const avg=field=>values.reduce((sum,item)=>sum+n(item[field]),0)/Math.max(1,values.length);
  return{key:group.key,name:group.name,qty:values.length,active:group.active,avgDays:avg('days'),avgProfit:avg('profit'),avgMargin:avg('margin'),avgSale:avg('sale'),avgCost:avg('cost'),avgPurchase:avg('purchase'),avgParts:avg('parts'),avgOther:avg('other')};
 }).sort((a,b)=>b.qty-a.qty||a.avgDays-b.avgDays);
}
export function purchaseSuggestion(phones=[],key,targetProfit=350){
 const matches=(phones||[]).filter(phone=>phone?.sale?.soldAt&&modelKey(phone)===key);
 if(!matches.length)return null;
 const avg=fn=>matches.reduce((sum,phone)=>sum+fn(phone),0)/matches.length;
 const avgNetSale=avg(phone=>saleNetValueBI(phone.sale)),avgParts=avg(phone=>phonePartsCost(phone)),avgOther=avg(phone=>phoneOtherCosts(phone)),avgDays=avg(phone=>daysBetween(phone.date,phone.sale.soldAt)),target=Math.max(0,n(targetProfit));
 return{key,name:modelLabel(matches[0]),samples:matches.length,avgNetSale,avgParts,avgOther,avgDays,targetProfit:target,maxPurchase:Math.max(0,avgNetSale-avgParts-avgOther-target)};
}

function returnPendingActions(orders=[]){
 const result=[];
 (orders||[]).forEach(order=>(order?.items||[]).forEach(item=>{
  if(item?.returnStatus==='pending')result.push({id:`return:${order.id}:${item.id}`,phoneId:item.phoneId,priority:95,type:'return',title:`Devolver ${item.partName||'peça'}`,detail:`${item.phoneLabel||'Aparelho'} · ${order.supplier||'Fornecedor'}`,date:item.returnMarkedAt||order.updatedAt||''});
  if(item?.returnStatus==='returned'&&!['received','supplier_credit'].includes(item?.returnFinancialStatus))result.push({id:`refund:${order.id}:${item.id}`,phoneId:item.phoneId,priority:92,type:'refund',title:`Cobrar reembolso de ${item.partName||'peça'}`,detail:`${item.phoneLabel||'Aparelho'} · ${order.supplier||'Fornecedor'}`,date:item.returnedToSupplierAt||item.returnFinancialUpdatedAt||''});
 }));
 return result;
}
export function smartActionQueue(phones=[],profiles=[],orders=[],now=new Date(),options={}){
 const today=dateKey(now),defaultPhotoTarget=Math.max(1,n(options.photoTarget)||10),activeProfiles=(profiles||[]).filter(p=>p?.active!==false),actions=[];
 (phones||[]).forEach(phone=>{
  const name=modelLabel(phone),phoneId=phone.id;
  if(phone?.sale?.soldAt){const sale=phone.sale,net=saleNetValueBI(sale),received=sale.receivedAmount===undefined?(sale.paymentStatus==='Pendente'?0:net):Math.max(0,n(sale.receivedAmount)),pending=Math.max(0,net-received);if(pending>0&&sale.dueDate&&dateKey(sale.dueDate)<today)actions.push({id:`receivable:${phoneId}`,phoneId,priority:100,type:'receivable',title:`Recebimento vencido · ${name}`,detail:`Vencimento ${dateKey(sale.dueDate)} · pendente ${pending.toFixed(2)}`,date:sale.dueDate});return}
  if(closed(phone))return;
  const idle=operationalIdleDays(phone,now);
  if(phone.nextActionDate&&dateKey(phone.nextActionDate)<today)actions.push({id:`task:${phoneId}`,phoneId,priority:98,type:'task',title:`Tarefa vencida · ${name}`,detail:phone.nextAction||'Próxima ação vencida',date:phone.nextActionDate});
  if(!n(phone.expected))actions.push({id:`price:${phoneId}`,phoneId,priority:88,type:'price',title:`Definir preço · ${name}`,detail:'Valor de venda ainda não informado'});
  const photoCount=Array.isArray(phone.mediaLibrary)?phone.mediaLibrary.length:0,photoTarget=Math.max(1,n(phone.photoTarget)||defaultPhotoTarget);
  if(['Pronto','Para fotografar'].includes(phone.status)&&photoCount<photoTarget)actions.push({id:`photos:${phoneId}`,phoneId,priority:84,type:'photos',title:`Fotografar · ${name}`,detail:`${photoCount}/${photoTarget} foto(s) vinculada(s)`});
  const coverage=publishedProfileIdsBI(phone,activeProfiles).length;
  if(['Pronto','Para fotografar','Anúncio preparado','Anunciado'].includes(phone.status)&&coverage===0)actions.push({id:`ads:${phoneId}`,phoneId,priority:86,type:'ads',title:`Anunciar · ${name}`,detail:'Nenhum perfil com publicação ativa'});
  else if(['Anúncio preparado','Anunciado'].includes(phone.status)&&activeProfiles.length&&coverage<activeProfiles.length)actions.push({id:`coverage:${phoneId}`,phoneId,priority:72,type:'coverage',title:`Completar cobertura · ${name}`,detail:`Publicado em ${coverage}/${activeProfiles.length} perfil(is)`});
  if(phone.expectedSaleDate&&dateKey(phone.expectedSaleDate)<today)actions.push({id:`forecast:${phoneId}`,phoneId,priority:76,type:'forecast',title:`Previsão de venda vencida · ${name}`,detail:`Previsto para ${dateKey(phone.expectedSaleDate)}`});
  if(idle>=7)actions.push({id:`stale:${phoneId}`,phoneId,priority:Math.min(90,60+idle),type:'stale',title:`Sem movimentação · ${name}`,detail:`${idle} dia(s) sem atualização`});
 });
 actions.push(...returnPendingActions(orders));
 return actions.sort((a,b)=>b.priority-a.priority||String(a.date||'').localeCompare(String(b.date||'')));
}

export function capitalAllocation(phones=[]){
 const active=(phones||[]).filter(phone=>!closed(phone));
 const buckets={analysis:0,parts:0,repair:0,ready:0,announced:0,other:0,total:0};
 active.forEach(phone=>{const value=intelligencePhoneCost(phone);buckets.total+=value;const status=String(phone.status||'');if(status==='Aguardando análise')buckets.analysis+=value;else if(status==='Aguardando peças')buckets.parts+=value;else if(['Em reparo','Em testes','Conta Google/FRP','Preparar sistema'].includes(status))buckets.repair+=value;else if(['Pronto','Para fotografar','Anúncio preparado'].includes(status))buckets.ready+=value;else if(status==='Anunciado')buckets.announced+=value;else buckets.other+=value});
 return buckets;
}
export function businessSuggestions(phones=[],profiles=[],orders=[],now=new Date()){
 const actions=smartActionQueue(phones,profiles,orders,now),aging=stockAgingRows(phones,now),coverage=adCoverageMetrics(phones,profiles),turnover=turnoverByModel(phones),tips=[];
 if(aging.some(row=>row.severity==='critical')){const row=aging.find(x=>x.severity==='critical');tips.push({type:'stock',title:`Estoque crítico: ${modelLabel(row.phone)}`,detail:`${row.purchaseDays} dias em estoque e ${row.idleDays} sem movimentação.`})}
 if(coverage.totalPhones&&coverage.coveragePct<80)tips.push({type:'ads',title:'Cobertura de anúncios abaixo de 80%',detail:`${coverage.incomplete+coverage.none} aparelho(s) ainda não estão em todos os perfis ativos.`});
 const slow=[...turnover].filter(x=>x.qty>=2).sort((a,b)=>b.avgDays-a.avgDays)[0];if(slow&&slow.avgDays>=21)tips.push({type:'turnover',title:`Giro lento: ${slow.name}`,detail:`Média de ${slow.avgDays.toFixed(0)} dias para vender.`});
 const lowMargin=[...turnover].filter(x=>x.qty>=2).sort((a,b)=>a.avgMargin-b.avgMargin)[0];if(lowMargin&&lowMargin.avgMargin<12)tips.push({type:'margin',title:`Margem baixa: ${lowMargin.name}`,detail:`Margem média de ${lowMargin.avgMargin.toFixed(1).replace('.',',')}%.`});
 if(actions.length)tips.push({type:'actions',title:`${actions.length} ação(ões) esperando atenção`,detail:actions[0].title});
 return tips.slice(0,5);
}

export function buildOperationalTimeline(phone,orders=[],profiles=[]){
 const events=[];
 const push=(id,date,label,message,tone='blue')=>{if(date)events.push({id,date,label,message,tone})};
 (phone?.timeline||[]).forEach(entry=>push(`manual:${entry.id}`,entry.date,'Atualização',entry.message||'Registro atualizado','blue'));
 push('purchase',phone?.date,'Compra',`Aparelho comprado${n(phone?.paid)?` por ${n(phone.paid).toFixed(2)}`:''}`,'purple');
 (phone?.priceHistory||[]).forEach(entry=>push(`price:${entry.id}`,entry.date,'Preço',`Preço alterado de ${n(entry.oldValue).toFixed(2)} para ${n(entry.newValue).toFixed(2)}`,'purple'));
 (phone?.mediaLibrary||[]).forEach(item=>push(`photo:${item.id}`,item.date,'Foto',`Foto vinculada: ${item.name||'imagem'}`,'green'));
 (orders||[]).forEach(order=>(order?.items||[]).filter(item=>String(item.phoneId)===String(phone?.id)).forEach(item=>{push(`ordered:${order.id}:${item.id}`,item.confirmedAt||order.orderDate,'Peça',`Pedido: ${item.partName||'peça'} · ${order.supplier||'fornecedor'}`,'amber');push(`received:${order.id}:${item.id}`,item.receivedAt,'Peça recebida',`${item.partName||'Peça'} recebida`,'green');push(`returned:${order.id}:${item.id}`,item.returnedToSupplierAt,'Devolução',`${item.partName||'Peça'} devolvida ao fornecedor`,'amber');push(`refund:${order.id}:${item.id}`,item.returnRefundDate&&['received','supplier_credit'].includes(item.returnFinancialStatus)?item.returnRefundDate:'','Reembolso',`Recuperado ${n(item.returnRecoveredAmount||0).toFixed(2)} de ${item.partName||'peça'}`,'green')}));
 publicationDates(phone).forEach((date,index)=>push(`publication:${index}:${date}`,date,'Anúncio',`Publicação registrada${profiles?.length?' em perfil de Marketplace':''}`,'purple'));
 push('sale',phone?.sale?.soldAt,'Venda',phone?.sale?.value!==undefined?`Venda registrada por ${n(phone.sale.value).toFixed(2)}`:'Venda registrada','green');
 return events.filter(event=>event.date).sort((a,b)=>time(b.date)-time(a.date));
}
