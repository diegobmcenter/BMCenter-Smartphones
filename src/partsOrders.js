export const PARTS_ORDER_STATUSES={
 draft:'Rascunho',
 partial_ordered:'Pedido parcial',
 ordered:'Pedido realizado',
 partial_received:'Recebimento parcial',
 received:'Pedido recebido'
};

export function roundMoney(value){
 return Math.round((Number(value)||0)*100)/100
}

export function returnRefundTotal(part={}){
 return roundMoney(Number(part?.returnPartRefund||0)+Number(part?.returnFreightRefund||0))
}

export function returnPartRefundDraft(part={}){
 const status=String(part?.returnStatus||'').toLowerCase();
 // Ao iniciar uma devolução, o valor recuperado da peça parte sempre do preço original.
 // Em uma devolução já registrada, preserva o valor salvo (inclusive zero ou parcial).
 return status==='returned'?roundMoney(Number(part?.returnPartRefund||0)):roundMoney(Number(part?.price??part?.purchasePrice??0))
}

export function returnRecoveredAmount(part={}){
 const returned=String(part?.returnStatus||'').toLowerCase()==='returned';
 const financial=String(part?.returnFinancialStatus||'').toLowerCase();
 if(!returned||!['received','supplier_credit'].includes(financial))return 0;
 const gross=part?.effectiveCost!==undefined&&part?.effectiveCost!==null&&part?.effectiveCost!==''
  ?roundMoney(part.effectiveCost)
  :roundMoney(Number(part?.purchasePrice||part?.price||0)+Number(part?.freightShare||0));
 return Math.min(Math.max(0,gross),Math.max(0,returnRefundTotal(part)))
}

export function quoteForPart(part){
 const quotes=Array.isArray(part?.quotes)?part.quotes:[];
 return quotes.find(q=>q.id===part?.selectedQuoteId)||[...quotes].sort((a,b)=>Number(a.price||0)-Number(b.price||0))[0]||null
}


export function partGrossCost(part={}){
 if(part?.effectiveCost!==undefined&&part?.effectiveCost!==null&&part?.effectiveCost!=='')return roundMoney(part.effectiveCost);
 return roundMoney(Number(part?.purchasePrice??part?.price??0)+Number(part?.freightShare||0))
}

export function partsOperationalCounters(phones=[],orders=[]){
 const normalizedOrders=normalizePartsOrders(orders);
 const activePhones=(Array.isArray(phones)?phones:[]).filter(phone=>!['Vendido','Descarte/Sucata'].includes(phone?.status));
 const linkedOrderIds=new Set(normalizedOrders.map(order=>order.id));
 const rows=activePhones.flatMap(phone=>(phone.parts||[]).map(part=>{
  const validQuotes=(Array.isArray(part?.quotes)?part.quotes:[]).filter(q=>q?.supplier&&Number(q?.price)>=0);
  return{part,quotes:validQuotes}
 }));
 const openRows=rows.filter(row=>isPartOpenForProcurement(row.part,linkedOrderIds));
 const returnRows=normalizedOrders.flatMap(order=>(order.items||[]).filter(item=>item?.returnStatus));
 const pendingReturns=returnRows.filter(item=>item.returnStatus==='pending').length;
 const financialPending=returnRows.filter(item=>item.returnStatus==='returned'&&!['received','supplier_credit'].includes(item.returnFinancialStatus)).length;
 return{
  open:openRows.length,
  quotes:openRows.filter(row=>row.quotes.length).length,
  orders:normalizedOrders.filter(order=>(order.items||[]).length&&order.status!=='received').length,
  received:normalizedOrders.filter(order=>(order.items||[]).length&&order.status==='received').length,
  returns:pendingReturns+financialPending
 }
}


export function partsPeriodReportMetrics(orders=[],dateInRange=()=>true){
 const normalizedOrders=normalizePartsOrders(orders);
 const rows=normalizedOrders.flatMap(order=>(order.items||[]).map(item=>({order,item,gross:partGrossCost(item)})));
 const purchased=rows.filter(row=>row.item.confirmedAt&&dateInRange(row.item.confirmedAt||row.order.orderDate||row.order.createdAt));
 const returned=rows.filter(row=>row.item.returnStatus==='returned'&&dateInRange(row.item.returnedToSupplierAt||row.item.returnRefundDate||row.item.returnFinancialUpdatedAt));
 const settled=rows.filter(row=>row.item.returnStatus==='returned'&&['received','supplier_credit'].includes(row.item.returnFinancialStatus)&&dateInRange(row.item.returnFinancialUpdatedAt||row.item.returnRefundDate||row.item.returnedToSupplierAt));
 const supplierSpend={};
 purchased.forEach(row=>{const supplier=row.order.supplier||'Fornecedor não informado';supplierSpend[supplier]=roundMoney((supplierSpend[supplier]||0)+row.gross)});
 return{
  purchasedQty:purchased.length,
  purchasedValue:roundMoney(purchased.reduce((sum,row)=>sum+row.gross,0)),
  returnsQty:returned.length,
  recoveredValue:roundMoney(settled.reduce((sum,row)=>sum+returnRecoveredAmount(row.item),0)),
  unrecoveredLoss:roundMoney(settled.reduce((sum,row)=>sum+Math.max(0,row.gross-returnRecoveredAmount(row.item)),0)),
  supplierSpend
 }
}

export function isPartCostCommitted(part={}){
 const status=String(part?.status||'').trim().toLocaleLowerCase('pt-BR');
 const orderStatus=String(part?.orderStatus||'').trim().toLocaleLowerCase('pt-BR');
 const returnStatus=String(part?.returnStatus||'').trim().toLocaleLowerCase('pt-BR');
 // Cotação é apenas previsão e nunca compõe o custo do aparelho. O custo passa a ser
 // realizado quando existe pedido confirmado/recebido, compra direta concluída ou devolução
 // de uma peça que necessariamente já havia sido adquirida.
 if(['pending','returned'].includes(returnStatus))return true;
 if(part?.orderedAt||part?.receivedAt)return true;
 if(['pedido realizado','pedido enviado','pedido entregue','instalada','para devolver','devolvida'].includes(orderStatus))return true;
 if(['comprada','recebida','instalada','para devolver','devolvida'].includes(status))return true;
 return false
}

export function effectivePartCost(part){
 if(!isPartCostCommitted(part))return 0;
 const gross=partGrossCost(part);
 return roundMoney(Math.max(0,gross-returnRecoveredAmount({...part,effectiveCost:gross})))
}

export function isPartProcurementComplete(part={}){
 const status=String(part?.status||'').trim().toLocaleLowerCase('pt-BR');
 const orderStatus=String(part?.orderStatus||'').trim().toLocaleLowerCase('pt-BR');
 const returnStatus=String(part?.returnStatus||'').trim().toLocaleLowerCase('pt-BR');
 return Boolean(part?.receivedAt)||['pending','returned'].includes(returnStatus)||['recebida','instalada','para devolver','devolvida'].includes(status)||['pedido entregue','instalada','para devolver','devolvida'].includes(orderStatus)
}

export function isPartOpenForProcurement(part={},activeOrderIds=null){
 if(isPartProcurementComplete(part))return false;
 if(part?.orderId&&activeOrderIds instanceof Set&&activeOrderIds.has(part.orderId))return false;
 return true
}

export function deriveOrderStatus(items=[]){
 if(!items.length)return'draft';
 const confirmed=items.filter(item=>item.confirmedAt).length;
 const received=items.filter(item=>item.receivedAt).length;
 if(received===items.length)return'received';
 if(received>0)return'partial_received';
 if(confirmed===items.length)return'ordered';
 if(confirmed>0)return'partial_ordered';
 return'draft'
}

export function allocateFreight(items=[],freight=0){
 const freightCents=Math.max(0,Math.round((Number(freight)||0)*100));
 const normalized=items.map(item=>({...item,price:roundMoney(item.price)}));
 if(!normalized.length)return normalized;
 if(!freightCents)return normalized.map(item=>({...item,freightShare:0,effectiveCost:roundMoney(item.price)}));
 const priceCents=normalized.map(item=>Math.max(0,Math.round(Number(item.price||0)*100)));
 const subtotalCents=priceCents.reduce((a,b)=>a+b,0);
 let shares=new Array(normalized.length).fill(0);
 if(subtotalCents>0){
  const raw=priceCents.map(value=>freightCents*value/subtotalCents);
  shares=raw.map(value=>Math.floor(value));
  let remainder=freightCents-shares.reduce((a,b)=>a+b,0);
  const order=raw.map((value,index)=>({index,fraction:value-Math.floor(value)})).sort((a,b)=>b.fraction-a.fraction||a.index-b.index);
  for(let i=0;i<remainder;i++)shares[order[i%order.length].index]++
 }else{
  const base=Math.floor(freightCents/normalized.length),remainder=freightCents-base*normalized.length;
  shares=shares.map((_,index)=>base+(index<remainder?1:0))
 }
 return normalized.map((item,index)=>{
  const freightShare=shares[index]/100;
  return{...item,freightShare,effectiveCost:roundMoney(Number(item.price||0)+freightShare)}
 })
}

export function normalizePartsOrder(order={}){
 const freight=roundMoney(order.freight||0);
 const linkedRaw=(Array.isArray(order.items)?order.items:[]).map(item=>({...item,__orderKind:'linked',price:roundMoney(item.price||0)}));
 const externalRaw=(Array.isArray(order.externalItems)?order.externalItems:[]).map((item,index)=>{
  const quantity=Math.max(1,Math.floor(Number(item.quantity||1)||1));
  const unitPrice=roundMoney(item.unitPrice!==undefined?item.unitPrice:(Number(item.price||0)/quantity));
  return{...item,id:item.id||`external-${index+1}`,__orderKind:'external',partName:String(item.partName||item.name||'Item avulso').trim()||'Item avulso',reference:String(item.reference||''),quantity,unitPrice,price:roundMoney(unitPrice*quantity),confirmedAt:item.confirmedAt||'',receivedAt:item.receivedAt||''}
 });
 // O frete do pedido real é rateado entre TODOS os itens, inclusive avulsos. Assim a
 // parcela pertencente a cliente/uso pessoal nunca é empurrada para o custo dos aparelhos BMCenter.
 const allocated=allocateFreight([...linkedRaw,...externalRaw],freight);
 const items=allocated.filter(item=>item.__orderKind==='linked').map(({__orderKind,...item})=>item);
 const externalItems=allocated.filter(item=>item.__orderKind==='external').map(({__orderKind,...item})=>item);
 const allItems=[...items,...externalItems];
 const linkedSubtotal=roundMoney(items.reduce((sum,item)=>sum+Number(item.price||0),0));
 const externalSubtotal=roundMoney(externalItems.reduce((sum,item)=>sum+Number(item.price||0),0));
 const subtotal=roundMoney(linkedSubtotal+externalSubtotal);
 const status=deriveOrderStatus(allItems);
 const allReceived=status==='received';
 const returnedRecovered=roundMoney(items.reduce((sum,item)=>sum+returnRecoveredAmount(item),0));
 const returnedPending=roundMoney(items.reduce((sum,item)=>sum+(item.returnStatus==='returned'&&item.returnFinancialStatus==='pending'?returnRefundTotal(item):0),0));
 const linkedFreight=roundMoney(items.reduce((sum,item)=>sum+Number(item.freightShare||0),0));
 const externalFreight=roundMoney(externalItems.reduce((sum,item)=>sum+Number(item.freightShare||0),0));
 const externalReturnPending=roundMoney(externalItems.filter(item=>item.returnStatus==='pending').reduce((sum,item)=>sum+Number(item.effectiveCost||item.price||0),0));
 return{
  ...order,
  id:order.id||crypto.randomUUID(),
  supplier:String(order.supplier||'Fornecedor não definido').trim()||'Fornecedor não definido',
  status,
  orderDate:order.orderDate||'',
  expectedDate:order.expectedDate||'',
  receivedAt:allReceived?(order.receivedAt||allItems.map(item=>item.receivedAt).filter(Boolean).sort().at(-1)||''):'',
  freight,
  notes:String(order.notes||''),
  items,
  externalItems,
  linkedSubtotal,
  externalSubtotal,
  subtotal,
  linkedFreight,
  externalFreight,
  systemTotal:roundMoney(linkedSubtotal+linkedFreight),
  externalTotal:roundMoney(externalSubtotal+externalFreight),
  total:roundMoney(subtotal+freight),
  returnedRecovered,
  returnedPending,
  externalReturnPending,
  // netCost continua representando somente o custo operacional BMCenter. Itens avulsos
  // são preservados no total pago ao fornecedor, mas não entram na margem dos aparelhos.
  netCost:roundMoney(Math.max(0,linkedSubtotal+linkedFreight-returnedRecovered)),
  createdAt:order.createdAt||new Date().toISOString(),
  updatedAt:order.updatedAt||new Date().toISOString()
 }
}

export function normalizePartsOrders(value){
 return (Array.isArray(value)?value:[]).filter(Boolean).map(normalizePartsOrder)
}

export function orderStatusLabel(status){return PARTS_ORDER_STATUSES[status]||status||'Rascunho'}

export function undoPartsOrderStep(order={},itemId=null,step='auto'){
 const normalized=normalizePartsOrder(order);
 const targetId=itemId==null?'':String(itemId);
 const targets=normalized.items.filter(item=>!targetId||String(item.id)===targetId);
 if(!targets.length)return{order:normalized,changed:false,blocked:false,step:'none'};
 if(targets.some(item=>item.returnStatus))return{order:normalized,changed:false,blocked:true,step:'blocked'};
 const resolved=step==='auto'?(targets.some(item=>item.receivedAt)?'receive':'confirm'):step;
 let changed=false;
 const items=normalized.items.map(item=>{
  if(targetId&&String(item.id)!==targetId)return item;
  if(resolved==='receive'&&item.receivedAt){changed=true;return{...item,receivedAt:''}};
  if(resolved==='confirm'&&item.confirmedAt&&!item.receivedAt){changed=true;return{...item,confirmedAt:''}};
  return item
 });
 return{order:normalizePartsOrder({...normalized,items}),changed,blocked:false,step:resolved}
}

export function syncOrdersIntoPhones(phones=[],orders=[]){
 const normalizedOrders=normalizePartsOrders(orders);
 const links=new Map();
 normalizedOrders.forEach(order=>order.items.forEach(item=>links.set(`${item.phoneId}::${item.partId}`,{order,item})));
 return (Array.isArray(phones)?phones:[]).map(phone=>{
  let linkedWaiting=false,linkedReceived=false;
  const parts=(phone.parts||[]).map(part=>{
   const link=links.get(`${phone.id}::${part.id}`);
   if(!link)return part;
   const {order,item}=link;
   const received=!!item.receivedAt,confirmed=!!item.confirmedAt;
   const returnStatus=String(item.returnStatus||'');
   if(confirmed&&!received)linkedWaiting=true;
   if(received)linkedReceived=true;
   return{
    ...part,
    selectedQuoteId:item.quoteId||part.selectedQuoteId||'',
    orderId:order.id,
    orderItemId:item.id,
    purchaseSupplier:order.supplier,
    purchasePrice:roundMoney(item.price),
    freightShare:roundMoney(item.freightShare),
    effectiveCost:roundMoney(item.effectiveCost),
    orderedAt:item.confirmedAt||'',
    receivedAt:item.receivedAt||'',
    returnStatus,
    returnMarkedAt:item.returnMarkedAt||'',
    returnedToSupplierAt:item.returnedToSupplierAt||'',
    returnFinancialStatus:item.returnFinancialStatus||'',
    returnPartRefund:roundMoney(item.returnPartRefund||0),
    returnFreightRefund:roundMoney(item.returnFreightRefund||0),
    returnRefundMethod:item.returnRefundMethod||'',
    returnRefundDate:item.returnRefundDate||'',
    returnFinancialUpdatedAt:item.returnFinancialUpdatedAt||'',
    returnRecoveredAmount:returnRecoveredAmount(item),
    orderStatus:returnStatus==='pending'?'Para devolver':returnStatus==='returned'?'Devolvida':received?'Pedido entregue':confirmed?'Pedido realizado':'Não pedido',
    status:returnStatus==='pending'?'Para devolver':returnStatus==='returned'?'Devolvida':received?(part.status==='Instalada'?'Instalada':'Recebida'):confirmed?'Comprada':['Comprada','Recebida'].includes(part.status)?'Cotando':part.status
   }
  });
  // Regra v10.4.67: pedidos/peças alteram somente o estado da peça e seus custos.
  // O status operacional do APARELHO é sempre controlado pelo usuário e nunca pode
  // voltar automaticamente para "Aguardando peças" ou "Em reparo".
  return{...phone,parts,status:phone.status}
 })
}



export function bulkPhoneProductsTotal(products=[],phoneId,excludeProductId=''){
 const id=String(phoneId||'');
 const numeric=value=>{if(typeof value==='number')return Number.isFinite(value)?value:0;let text=String(value??'').trim().replace(/[^0-9,.-]/g,'');if(text.includes(','))text=text.replace(/\./g,'').replace(',','.');const number=Number(text);return Number.isFinite(number)?number:0};
 return roundMoney((Array.isArray(products)?products:[]).reduce((sum,product)=>{
  if(excludeProductId&&String(product?.id||'')===String(excludeProductId))return sum;
  const selected=(Array.isArray(product?.phoneIds)?product.phoneIds:[]).map(String).includes(id);
  if(!selected)return sum;
  const prices=product?.pricesByPhone&&typeof product.pricesByPhone==='object'?product.pricesByPhone:{};
  const raw=Object.prototype.hasOwnProperty.call(prices,id)?prices[id]:product?.unitPrice;
  return sum+numeric(raw)
 },0))
}

export function createMultiBulkPartsOrder({phones=[],products=[],supplier='',freight=0,orderDate='',expectedDate='',notes='',receivedNow=false,now=new Date().toISOString(),idFactory=()=>crypto.randomUUID()}={}){
 const cleanSupplier=String(supplier||'').trim();
 if(!cleanSupplier)throw new Error('Informe o fornecedor.');
 const normalizeName=value=>String(value||'').trim().toLocaleLowerCase('pt-BR');
 const sourceProducts=(Array.isArray(products)?products:[]).map((product,index)=>({
  ...product,
  id:product.id||`product-${index+1}`,
  type:product.type==='external'?'external':'linked',
  name:String(product.name||product.partName||'').trim(),
  unitPrice:roundMoney(product.unitPrice||0),
  quantity:Math.max(1,Math.floor(Number(product.quantity||1)||1)),
  reference:String(product.reference||''),
  phoneIds:[...new Set((Array.isArray(product.phoneIds)?product.phoneIds:[]).map(String))],
  pricesByPhone:product.pricesByPhone&&typeof product.pricesByPhone==='object'?product.pricesByPhone:{}
 }));
 const prepared=sourceProducts.filter(product=>product.name&&(product.type==='external'||product.phoneIds.length));
 if(!prepared.length)throw new Error('Adicione pelo menos um produto do BMCenter ou um item avulso.');
 const linkedProducts=prepared.filter(product=>product.type!=='external');
 const externalProducts=prepared.filter(product=>product.type==='external');
 const names=new Set();
 for(const product of linkedProducts){
  const key=normalizeName(product.name);
  if(names.has(key))throw new Error(`O produto "${product.name}" foi adicionado mais de uma vez. Una os aparelhos no mesmo produto.`);
  names.add(key)
 }
 const stamp=now||new Date().toISOString(),today=stamp.slice(0,10);
 const skipped=[],items=[];
 let added=0,reused=0;
 const assignments=new Map();
 linkedProducts.forEach(product=>product.phoneIds.forEach(phoneId=>{
  const list=assignments.get(phoneId)||[];
  list.push(product);assignments.set(phoneId,list)
 }));
 const nextPhones=(Array.isArray(phones)?phones:[]).map(phone=>{
  const selectedProducts=assignments.get(String(phone.id));
  if(!selectedProducts?.length)return phone;
  if(['Vendido','Descarte/Sucata'].includes(phone?.status)){
   selectedProducts.forEach(product=>skipped.push({phoneId:phone.id,productId:product.id,partName:product.name,reason:'Aparelho encerrado'}));
   return phone
  }
  let parts=Array.isArray(phone.parts)?[...phone.parts]:[];
  const timelineNames=[];
  for(const product of selectedProducts){
   const targetName=normalizeName(product.name);
   const locked=parts.find(part=>normalizeName(part.name)===targetName&&part.orderId&&!['Pedido entregue','Instalada'].includes(part.orderStatus||''));
   if(locked){skipped.push({phoneId:phone.id,productId:product.id,partName:product.name,reason:'Já existe esta peça em um pedido ativo'});continue}
   const reusable=parts.find(part=>normalizeName(part.name)===targetName&&!part.orderId&&!['Pedido entregue','Instalada'].includes(part.orderStatus||''));
   const rawPrice=Object.prototype.hasOwnProperty.call(product.pricesByPhone||{},phone.id)?product.pricesByPhone[phone.id]:product.unitPrice;
   const price=roundMoney(rawPrice);
   let partId,bulkCreatedPart=false;
   if(reusable){
    partId=reusable.id;
    parts=parts.map(part=>part.id===reusable.id?{...part,selectedQuoteId:'',status:'Comprada'}:part);
    reused++
   }else{
    partId=idFactory();bulkCreatedPart=true;
    parts.push({id:partId,name:product.name,status:'Comprada',quotes:[],selectedQuoteId:'',orderStatus:'Não pedido'});
    added++
   }
   items.push({id:idFactory(),phoneId:phone.id,partId,partName:product.name,phoneLabel:[phone.brand,phone.model].filter(Boolean).join(' '),quoteId:'',price,confirmedAt:stamp,receivedAt:receivedNow?stamp:'',bulkProductId:product.id,bulkCreatedPart});
   timelineNames.push(product.name)
  }
  if(!timelineNames.length)return{...phone,parts};
  return{...phone,parts,lastActivityAt:stamp,timeline:[...(phone.timeline||[]),{id:idFactory(),date:stamp,message:`Compra em massa registrada: ${timelineNames.join(', ')}`}]}
 });
 const externalItems=externalProducts.map(product=>({
  id:idFactory(),
  itemType:'external',
  bulkProductId:product.id,
  partName:product.name,
  reference:product.reference,
  quantity:product.quantity,
  unitPrice:roundMoney(product.unitPrice),
  price:roundMoney(product.unitPrice*product.quantity),
  confirmedAt:stamp,
  receivedAt:receivedNow?stamp:'',
  returnStatus:'',
  returnMarkedAt:'',
  returnedToSupplierAt:'',
  resolvedAt:''
 }));
 if(!items.length&&!externalItems.length)return{phones:nextPhones,order:null,skipped,added,reused};
 const order=normalizePartsOrder({id:idFactory(),source:'bulk',bulkVersion:2,mixedOrderVersion:1,supplier:cleanSupplier,orderDate:orderDate||today,expectedDate:expectedDate||'',freight:roundMoney(freight),notes:String(notes||''),items,externalItems,createdAt:stamp,updatedAt:stamp,receivedAt:receivedNow?stamp:''});
 return{phones:nextPhones,order,skipped,added,reused}
}

export function createBulkPartsOrder({phones=[],phoneIds=[],partName='',supplier='',unitPrice=0,pricesByPhone={},freight=0,orderDate='',expectedDate='',notes='',receivedNow=false,now=new Date().toISOString(),idFactory=()=>crypto.randomUUID()}={}){
 return createMultiBulkPartsOrder({phones,products:[{id:'single-product',name:partName,unitPrice,phoneIds,pricesByPhone}],supplier,freight,orderDate,expectedDate,notes,receivedNow,now,idFactory})
}

export function removePartsOrderLinks(phones=[],order={},remainingOrders=[]){
 const itemByKey=new Map((order?.items||[]).map(item=>[`${item.phoneId}::${item.partId}`,item]));
 const waitingByPhone=new Set((remainingOrders||[]).flatMap(other=>(other.items||[]).filter(item=>item.confirmedAt&&!item.receivedAt).map(item=>String(item.phoneId))));
 const stamp=new Date().toISOString();
 return (Array.isArray(phones)?phones:[]).map(phone=>{
  let changed=false;
  const parts=[];
  for(const part of phone.parts||[]){
   const item=itemByKey.get(`${phone.id}::${part.id}`);
   if(!item){parts.push(part);continue}
   changed=true;
   if(item.bulkCreatedPart===true&&part.status!=='Instalada')continue;
   parts.push({...part,orderId:'',orderItemId:'',purchaseSupplier:'',purchasePrice:undefined,freightShare:undefined,effectiveCost:undefined,orderedAt:'',receivedAt:'',returnStatus:'',returnMarkedAt:'',returnedToSupplierAt:'',returnFinancialStatus:'',returnPartRefund:0,returnFreightRefund:0,returnRefundMethod:'',returnRefundDate:'',returnFinancialUpdatedAt:'',returnRecoveredAmount:0,orderStatus:'Não pedido',status:part.status==='Instalada'?'Instalada':'Cotando',selectedQuoteId:item.quoteId||part.selectedQuoteId||''})
  }
  if(!changed)return phone;
  // Remover um pedido também não altera o status operacional do aparelho.
  return{...phone,parts,status:phone.status,lastActivityAt:stamp}
 })
}


/**
 * Corrige somente a regressão histórica das versões anteriores em que o módulo de
 * peças alterava silenciosamente o status do aparelho. A restauração só acontece
 * quando o status atual é um dos estados automáticos antigos e existe no histórico
 * um último status EXPLICITAMENTE escolhido pelo usuário diferente do atual.
 */
export function recoverLegacyPartOrderStatusMutations(phones=[]){
 const automaticLegacyStatuses=new Set(['Aguardando peças','Em reparo']);
 const patterns=[
  /^Status alterado para\s+(.+)$/i,
  /^Movido na operação para\s+(.+)$/i,
 ];
 return (Array.isArray(phones)?phones:[]).map(phone=>{
  const current=String(phone?.status||'').trim();
  if(!automaticLegacyStatuses.has(current))return phone;
  const timeline=[...(Array.isArray(phone?.timeline)?phone.timeline:[])].sort((a,b)=>String(b?.date||'').localeCompare(String(a?.date||'')));
  let explicit='';
  for(const event of timeline){
   const message=String(event?.message||'').trim();
   for(const pattern of patterns){
    const match=message.match(pattern);
    if(match?.[1]){explicit=String(match[1]).trim();break}
   }
   if(explicit)break
  }
  if(!explicit||explicit===current)return phone;
  return{...phone,status:explicit,lastActivityAt:phone.lastActivityAt||new Date().toISOString()}
 })
}

export function migrateLegacyPartsOrders(phones=[],orders=[],now=new Date().toISOString()){
 const existing=normalizePartsOrders(orders);
 const existingLinks=new Set(existing.flatMap(order=>order.items.map(item=>`${item.phoneId}::${item.partId}`)));
 const groups=new Map();
 (phones||[]).forEach(phone=>(phone.parts||[]).forEach(part=>{
  const key=`${phone.id}::${part.id}`;
  if(existingLinks.has(key)||part.orderId)return;
  const legacy=String(part.orderStatus||'');
  if(!['Pedido realizado','Pedido enviado','Pedido entregue'].includes(legacy))return;
  const quote=quoteForPart(part);
  const supplier=String(quote?.supplier||part.purchaseSupplier||'Compra direta');
  const groupKey=`${supplier}::${legacy==='Pedido entregue'?'received':'ordered'}`;
  if(!groups.has(groupKey))groups.set(groupKey,{supplier,received:legacy==='Pedido entregue',items:[]});
  groups.get(groupKey).items.push({
   id:crypto.randomUUID(),phoneId:phone.id,partId:part.id,partName:part.name||'Peça',phoneLabel:[phone.brand,phone.model].filter(Boolean).join(' '),quoteId:quote?.id||part.selectedQuoteId||'',price:roundMoney(quote?.price||part.purchasePrice||0),confirmedAt:now,receivedAt:legacy==='Pedido entregue'?now:''
  })
 }));
 const migrated=[...existing];
 for(const group of groups.values())migrated.push(normalizePartsOrder({id:crypto.randomUUID(),supplier:group.supplier,orderDate:now.slice(0,10),freight:0,notes:'Migrado automaticamente da v10.4.47. Revise o frete se necessário.',items:group.items,createdAt:now,updatedAt:now,receivedAt:group.received?now:''}));
 return{orders:migrated,phones:syncOrdersIntoPhones(phones,migrated),created:migrated.length-existing.length}
}
