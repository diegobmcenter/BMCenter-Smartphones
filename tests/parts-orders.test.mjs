import assert from 'node:assert/strict';
import{allocateFreight,normalizePartsOrder,syncOrdersIntoPhones,migrateLegacyPartsOrders,effectivePartCost}from'../src/partsOrders.js';

const shares=allocateFreight([{id:'a',price:10},{id:'b',price:20},{id:'c',price:30}],10);
assert.equal(shares.reduce((s,i)=>s+Math.round(i.freightShare*100),0),1000,'frete deve fechar exatamente em centavos');
assert.equal(shares.reduce((s,i)=>s+Math.round(i.effectiveCost*100),0),7000,'custo efetivo deve fechar peças + frete');

const odd=allocateFreight([{id:'a',price:1},{id:'b',price:1},{id:'c',price:1}],0.01);
assert.deepEqual(odd.map(i=>i.freightShare),[0.01,0,0],'sobra de centavo deve ser determinística');

const order=normalizePartsOrder({id:'o1',supplier:'Fornecedor A',freight:5,items:[{id:'i1',phoneId:'p1',partId:'x1',price:100,confirmedAt:'2026-08-14T00:00:00Z'}]});
assert.equal(order.total,105);assert.equal(order.status,'ordered');assert.equal(order.items[0].effectiveCost,105);
const phones=syncOrdersIntoPhones([{id:'p1',status:'Em reparo',paid:200,parts:[{id:'x1',name:'Tela',quotes:[]}]}],[order]);
assert.equal(phones[0].parts[0].effectiveCost,105);assert.equal(phones[0].status,'Aguardando peças');assert.equal(effectivePartCost(phones[0].parts[0]),105);

const edited=normalizePartsOrder({...order,freight:8,items:order.items});
const editedPhones=syncOrdersIntoPhones(phones,[edited]);
assert.equal(editedPhones[0].parts[0].effectiveCost,108,'editar frete substitui custo, não soma novamente');
assert.equal(editedPhones[0].paid,200,'frete não pode alterar valor pago pelo aparelho');

const received=normalizePartsOrder({...edited,items:edited.items.map(i=>({...i,receivedAt:'2026-08-14T01:00:00Z'}))});
const receivedPhones=syncOrdersIntoPhones(editedPhones,[received]);
assert.equal(receivedPhones[0].parts[0].orderStatus,'Pedido entregue');
assert.equal(receivedPhones[0].parts[0].effectiveCost,108,'receber novamente não duplica custo');

const legacyPhones=[{id:'p2',brand:'X',model:'Y',status:'Aguardando peças',parts:[{id:'b1',name:'Bateria',orderStatus:'Pedido entregue',selectedQuoteId:'q1',quotes:[{id:'q1',supplier:'Legacy',price:50}]}]}];
const mig=migrateLegacyPartsOrders(legacyPhones,[], '2026-08-14T02:00:00Z');
assert.equal(mig.created,1);assert.equal(mig.orders[0].supplier,'Legacy');assert.equal(mig.phones[0].parts[0].effectiveCost,50);
console.log('parts-orders.test: OK');

const zeroBase=allocateFreight([{id:'z1',price:0},{id:'z2',price:0},{id:'z3',price:0}],0.05);
assert.equal(zeroBase.reduce((s,i)=>s+Math.round(i.freightShare*100),0),5,'frete com peças zeradas também precisa fechar nos centavos');
assert.deepEqual(zeroBase.map(i=>i.freightShare),[0.02,0.02,0.01],'rateio sem subtotal deve ser determinístico');

const partial=normalizePartsOrder({id:'p-order',supplier:'Fornecedor B',freight:1,items:[
 {id:'pi1',phoneId:'pa',partId:'a',price:30,confirmedAt:'2026-08-14T00:00:00Z'},
 {id:'pi2',phoneId:'pb',partId:'b',price:70,confirmedAt:''}
]});
assert.equal(partial.status,'partial_ordered','confirmação individual deve produzir pedido parcial');
const partialReceived=normalizePartsOrder({...partial,items:partial.items.map((i,index)=>index===0?{...i,receivedAt:'2026-08-14T01:00:00Z'}:i)});
assert.equal(partialReceived.status,'partial_received','recebimento individual deve produzir recebimento parcial');
const allReceived=normalizePartsOrder({...partialReceived,items:partialReceived.items.map(i=>({...i,confirmedAt:i.confirmedAt||'2026-08-14T01:10:00Z',receivedAt:i.receivedAt||'2026-08-14T02:00:00Z'}))});
assert.equal(allReceived.status,'received','recebimento coletivo deve fechar pedido');

const repeated=syncOrdersIntoPhones(syncOrdersIntoPhones([{id:'pa',status:'Em reparo',paid:10,parts:[{id:'a',name:'Tela'}]}],[allReceived]),[allReceived]);
assert.equal(repeated[0].paid,10,'sincronizar pedido repetidamente não altera compra do aparelho');
assert.equal(repeated[0].parts[0].effectiveCost,allReceived.items[0].effectiveCost,'sincronização repetida é idempotente');
