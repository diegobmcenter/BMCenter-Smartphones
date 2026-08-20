import assert from 'node:assert/strict';
import {createMultiBulkPartsOrder,normalizePartsOrder,syncOrdersIntoPhones,partsPeriodReportMetrics,partsOperationalCounters} from '../src/partsOrders.js';

let seq=0;const idFactory=()=>`mix-${++seq}`;
const phones=[{id:'p1',code:'BM-1',brand:'Motorola',model:'G24',status:'Em reparo',paid:300,parts:[]}];
const result=createMultiBulkPartsOrder({
  phones,
  supplier:'TEC Cell',
  freight:15,
  orderDate:'2026-08-20',
  receivedNow:true,
  now:'2026-08-20T10:00:00Z',
  idFactory,
  products:[
    {id:'screen',type:'linked',name:'Tela',unitPrice:100,phoneIds:['p1'],pricesByPhone:{}},
    {id:'client-battery',type:'external',name:'Bateria A14',reference:'Cliente João',quantity:2,unitPrice:25,phoneIds:[]}
  ]
});
assert.ok(result.order,'pedido misto deve ser criado');
assert.equal(result.order.items.length,1,'somente a peça BMCenter entra em items');
assert.equal(result.order.externalItems.length,1,'item de cliente fica isolado em externalItems');
assert.equal(result.order.linkedSubtotal,100);
assert.equal(result.order.externalSubtotal,50);
assert.equal(result.order.total,165,'total real do fornecedor inclui BMCenter + avulsos + frete');
assert.equal(result.order.items[0].freightShare,10,'frete do aparelho deve considerar também os itens avulsos no rateio');
assert.equal(result.order.externalItems[0].freightShare,5);
assert.equal(result.order.systemTotal,110,'somente parcela BMCenter compõe custo operacional');
assert.equal(result.order.externalTotal,55);
assert.equal(result.order.status,'received');

const synced=syncOrdersIntoPhones(result.phones,[result.order]);
assert.equal(synced[0].parts[0].effectiveCost,110,'item avulso não pode empurrar seu custo/frete para o aparelho');
assert.equal(synced[0].parts.length,1,'item avulso nunca cria peça no aparelho');

const period=partsPeriodReportMetrics([result.order],()=>true);
assert.equal(period.purchasedQty,1,'relatório operacional ignora item avulso');
assert.equal(period.purchasedValue,110,'relatório inclui apenas custo BMCenter e seu frete rateado');
assert.equal(period.supplierSpend['TEC Cell'],110);

const withExternalReturn=normalizePartsOrder({...result.order,externalItems:result.order.externalItems.map(item=>({...item,returnStatus:'pending',returnMarkedAt:'2026-08-20T11:00:00Z'}))});
assert.equal(withExternalReturn.externalReturnPending,55,'lembrete avulso guarda o valor físico separado, inclusive seu frete rateado');
assert.equal(withExternalReturn.netCost,110,'devolução avulsa não altera custo BMCenter');
assert.equal(syncOrdersIntoPhones(synced,[withExternalReturn])[0].parts[0].effectiveCost,110);

const externalOnly=normalizePartsOrder({id:'ext-only',supplier:'Pessoal',freight:3,externalItems:[{id:'e1',partName:'Cabo',reference:'Uso pessoal',quantity:1,unitPrice:10,confirmedAt:'2026-08-20T10:00:00Z'}]});
const counters=partsOperationalCounters([], [externalOnly]);
assert.equal(counters.orders,0,'pedido exclusivamente avulso não entra nos indicadores operacionais de peças BMCenter');
assert.equal(externalOnly.total,13);
console.log('mixed-parts-orders-v10528: OK');
