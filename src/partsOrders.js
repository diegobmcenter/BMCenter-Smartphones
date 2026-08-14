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

export function quoteForPart(part){
 const quotes=Array.isArray(part?.quotes)?part.quotes:[];
 return quotes.find(q=>q.id===part?.selectedQuoteId)||[...quotes].sort((a,b)=>Number(a.price||0)-Number(b.price||0))[0]||null
}

export function effectivePartCost(part){
 if(part?.effectiveCost!==undefined&&part?.effectiveCost!==null&&part?.effectiveCost!=='')return roundMoney(part.effectiveCost);
 if(part?.purchasePrice!==undefined&&part?.purchasePrice!==null&&part?.purchasePrice!=='')return roundMoney(Number(part.purchasePrice||0)+Number(part.freightShare||0));
 return roundMoney(quoteForPart(part)?.price||0)
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
 const items=allocateFreight(Array.isArray(order.items)?order.items:[],order.freight||0);
 const subtotal=roundMoney(items.reduce((sum,item)=>sum+Number(item.price||0),0));
 const freight=roundMoney(order.freight||0);
 const status=deriveOrderStatus(items);
 const allReceived=status==='received';
 return{
  ...order,
  id:order.id||crypto.randomUUID(),
  supplier:String(order.supplier||'Fornecedor não definido').trim()||'Fornecedor não definido',
  status,
  orderDate:order.orderDate||'',
  expectedDate:order.expectedDate||'',
  receivedAt:allReceived?(order.receivedAt||items.map(item=>item.receivedAt).filter(Boolean).sort().at(-1)||''):'',
  freight,
  notes:String(order.notes||''),
  items,
  subtotal,
  total:roundMoney(subtotal+freight),
  createdAt:order.createdAt||new Date().toISOString(),
  updatedAt:order.updatedAt||new Date().toISOString()
 }
}

export function normalizePartsOrders(value){
 return (Array.isArray(value)?value:[]).filter(Boolean).map(normalizePartsOrder)
}

export function orderStatusLabel(status){return PARTS_ORDER_STATUSES[status]||status||'Rascunho'}

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
    orderStatus:received?'Pedido entregue':confirmed?'Pedido realizado':'Não pedido',
    status:received?(part.status==='Instalada'?'Instalada':'Recebida'):confirmed?'Comprada':part.status
   }
  });
  let status=phone.status;
  if(linkedWaiting&&!['Vendido','Descarte/Sucata'].includes(status))status='Aguardando peças';
  else if(!linkedWaiting&&linkedReceived&&status==='Aguardando peças')status='Em reparo';
  return{...phone,parts,status}
 })
}


export function createBulkPartsOrder({phones=[],phoneIds=[],partName='',supplier='',unitPrice=0,pricesByPhone={},freight=0,orderDate='',expectedDate='',notes='',receivedNow=false,now=new Date().toISOString(),idFactory=()=>crypto.randomUUID()}={}){
 const selectedIds=new Set((Array.isArray(phoneIds)?phoneIds:[]).map(String));
 const cleanName=String(partName||'').trim();
 const cleanSupplier=String(supplier||'').trim();
 if(!cleanName)throw new Error('Informe o nome da peça.');
 if(!cleanSupplier)throw new Error('Informe o fornecedor.');
 if(!selectedIds.size)throw new Error('Selecione pelo menos um aparelho.');
 const stamp=now||new Date().toISOString(),today=stamp.slice(0,10);
 const skipped=[],items=[];
 let added=0,reused=0;
 const normalizeName=value=>String(value||'').trim().toLocaleLowerCase('pt-BR');
 const targetName=normalizeName(cleanName);
 const nextPhones=(Array.isArray(phones)?phones:[]).map(phone=>{
  if(!selectedIds.has(String(phone.id)))return phone;
  if(['Vendido','Descarte/Sucata'].includes(phone?.status)){
   skipped.push({phoneId:phone.id,reason:'Aparelho encerrado'});return phone
  }
  const currentParts=Array.isArray(phone.parts)?phone.parts:[];
  const locked=currentParts.find(part=>normalizeName(part.name)===targetName&&part.orderId&&!['Pedido entregue','Instalada'].includes(part.orderStatus||''));
  if(locked){skipped.push({phoneId:phone.id,reason:'Já existe esta peça em um pedido ativo'});return phone}
  const reusable=currentParts.find(part=>normalizeName(part.name)===targetName&&!part.orderId&&!['Pedido entregue','Instalada'].includes(part.orderStatus||''));
  const rawPrice=Object.prototype.hasOwnProperty.call(pricesByPhone||{},phone.id)?pricesByPhone[phone.id]:unitPrice;
  const price=roundMoney(rawPrice);
  let partId;
  let parts;
  if(reusable){
   partId=reusable.id;
   parts=currentParts.map(part=>part.id===reusable.id?{...part,selectedQuoteId:'',status:'Comprada'}:part);
   reused++
  }else{
   partId=idFactory();
   const part={id:partId,name:cleanName,status:'Comprada',quotes:[],selectedQuoteId:'',orderStatus:'Não pedido'};
   parts=[...currentParts,part];added++
  }
  items.push({id:idFactory(),phoneId:phone.id,partId,partName:cleanName,phoneLabel:[phone.brand,phone.model].filter(Boolean).join(' '),quoteId:'',price,confirmedAt:stamp,receivedAt:receivedNow?stamp:''});
  return{...phone,parts,lastActivityAt:stamp,timeline:[...(phone.timeline||[]),{id:idFactory(),date:stamp,message:`Compra em massa registrada: ${cleanName}`}]}
 });
 if(!items.length)return{phones:nextPhones,order:null,skipped,added,reused};
 const order=normalizePartsOrder({id:idFactory(),supplier:cleanSupplier,orderDate:orderDate||today,expectedDate:expectedDate||'',freight:roundMoney(freight),notes:String(notes||''),items,createdAt:stamp,updatedAt:stamp,receivedAt:receivedNow?stamp:''});
 return{phones:nextPhones,order,skipped,added,reused}
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
