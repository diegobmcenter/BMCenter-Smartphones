import fs from 'node:fs';
import assert from 'node:assert/strict';
import {effectivePartCost,normalizePartsOrder,syncOrdersIntoPhones,undoPartsOrderStep} from '../src/partsOrders.js';

const base=normalizePartsOrder({id:'o1',supplier:'TEC Cell',freight:10,items:[
 {id:'i1',phoneId:'p1',partId:'a',partName:'Tela',price:100,confirmedAt:'2026-08-18T10:00:00Z',receivedAt:'2026-08-18T11:00:00Z'},
 {id:'i2',phoneId:'p1',partId:'b',partName:'Bateria',price:50,confirmedAt:'2026-08-18T10:00:00Z',receivedAt:'2026-08-18T11:00:00Z'}
]});
assert.equal(base.status,'received');

const oneReceipt=undoPartsOrderStep(base,'i1','auto');
assert.equal(oneReceipt.changed,true,'deve desfazer recebimento individual');
assert.equal(oneReceipt.step,'receive');
assert.equal(oneReceipt.order.status,'partial_received','pedido recebido deve voltar a parcial ao desfazer uma peça');
assert.equal(oneReceipt.order.items[0].receivedAt,'');
assert.ok(oneReceipt.order.items[0].confirmedAt,'compra permanece confirmada ao desfazer somente o recebimento');

const allReceipt=undoPartsOrderStep(base,null,'auto');
assert.equal(allReceipt.order.status,'ordered','desfazer recebimento do pedido completo deve voltar para Pedidos');
assert.ok(allReceipt.order.items.every(item=>item.confirmedAt&&!item.receivedAt));

const ordered=allReceipt.order;
const oneConfirm=undoPartsOrderStep(ordered,'i1','auto');
assert.equal(oneConfirm.step,'confirm');
assert.equal(oneConfirm.order.status,'partial_ordered','desfazer confirmação individual deve manter as demais compras');
assert.equal(oneConfirm.order.items[0].confirmedAt,'');

const allConfirm=undoPartsOrderStep(ordered,null,'auto');
assert.equal(allConfirm.order.status,'draft','desfazer confirmação do pedido completo deve voltar a rascunho');
assert.ok(allConfirm.order.items.every(item=>!item.confirmedAt&&!item.receivedAt));

const phones=[{id:'p1',status:'Em reparo',parts:[{id:'a',name:'Tela',status:'Cotando',quotes:[{id:'q1',supplier:'TEC Cell',price:100}],selectedQuoteId:'q1'},{id:'b',name:'Bateria',status:'Cotando',quotes:[]}]}];
const syncedOrdered=syncOrdersIntoPhones(phones,[ordered]);
assert.ok(effectivePartCost(syncedOrdered[0].parts[0])>0,'pedido confirmado continua compondo custo');
const syncedDraft=syncOrdersIntoPhones(syncedOrdered,[allConfirm.order]);
assert.equal(syncedDraft[0].parts[0].status,'Cotando','desfazer confirmação deve retirar status derivado Comprada');
assert.equal(syncedDraft[0].parts[0].orderStatus,'Não pedido');
assert.equal(effectivePartCost(syncedDraft[0].parts[0]),0,'desfazer confirmação deve retirar a peça do custo realizado');

const withReturn=normalizePartsOrder({...base,items:base.items.map((item,index)=>index===0?{...item,returnStatus:'pending'}:item)});
const blocked=undoPartsOrderStep(withReturn,'i1','auto');
assert.equal(blocked.blocked,true,'não pode desfazer recebimento de peça em devolução');
assert.equal(blocked.changed,false);

console.log('parts-undo-v10514.test: OK');

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
assert.match(main,/Desfazer recebimentos/,'pedido completo em Pedidos/Recebidos precisa oferecer desfazer');
assert.match(main,/undoOrderProgress\(order,item\.id\)/,'peça individual precisa oferecer desfazer');
assert.match(main,/parts-v10514-undo-summary/,'pedido recebido recolhido precisa ter ação rápida de desfazer');
