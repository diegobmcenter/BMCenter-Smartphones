import assert from 'node:assert/strict';
import{effectivePartCost,isPartCostCommitted}from'../src/partsOrders.js';

const quoted={id:'q',name:'Biometria Cinza',status:'Cotando',orderStatus:'Não pedido',selectedQuoteId:'q1',quotes:[{id:'q1',supplier:'Peça avulsa',price:25.66}]};
assert.equal(isPartCostCommitted(quoted),false,'peça apenas cotada não é custo realizado');
assert.equal(effectivePartCost(quoted),0,'cotação não pode aumentar o custo do aparelho');
assert.equal(effectivePartCost({...quoted,effectiveCost:25.66}),0,'valor legado/preenchido em peça ainda Cotando também não pode virar custo');

const ordered={...quoted,status:'Comprada',orderStatus:'Pedido realizado',orderedAt:'2026-08-17T12:00:00Z',purchasePrice:25.66,effectiveCost:25.66};
assert.equal(isPartCostCommitted(ordered),true);
assert.equal(effectivePartCost(ordered),25.66,'pedido confirmado passa a compor o custo');

const direct={id:'direct',status:'Comprada',effectiveCost:18.5};
assert.equal(effectivePartCost(direct),18.5,'compra direta concluída deve compor o custo');

const returned={id:'ret',status:'Cotando',returnStatus:'returned',returnFinancialStatus:'pending',effectiveCost:50};
assert.equal(effectivePartCost(returned),50,'devolução financeira pendente preserva o custo realizado');

const bm000867={paid:12.5,parts:[
 {status:'Recebida',orderStatus:'Pedido entregue',effectiveCost:77.25},
 {status:'Recebida',orderStatus:'Pedido entregue',effectiveCost:61.80},
 {status:'Recebida',orderStatus:'Pedido entregue',effectiveCost:45},
 quoted
]};
const cost=bm000867.paid+bm000867.parts.reduce((sum,part)=>sum+effectivePartCost(part),0);
assert.equal(cost,196.55,'BM-000867 deve ignorar a cotação de R$ 25,66');
console.log('parts-cost-commit-v10513.test: OK');
