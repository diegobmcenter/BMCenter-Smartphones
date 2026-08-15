import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
import{isPartProcurementComplete,isPartOpenForProcurement,effectivePartCost}from'../src/partsOrders.js';

const received={id:'r1',name:'Tela',status:'Recebida',orderStatus:'Não pedido',effectiveCost:65,quotes:[]};
assert.equal(isPartProcurementComplete(received),true,'peça avulsa recebida deve estar concluída');
assert.equal(isPartOpenForProcurement(received,new Set()),false,'peça recebida não pode aparecer em Em aberto');
assert.equal(effectivePartCost(received),65,'peça recebida continua entrando no custo do aparelho');

const installed={id:'i1',name:'Película',status:'Instalada',orderStatus:'Não pedido',effectiveCost:4};
assert.equal(isPartOpenForProcurement(installed,new Set()),false,'peça instalada não pode voltar para compras/cotação');

const waiting={id:'w1',name:'Bateria',status:'Cotando',orderStatus:'Não pedido',effectiveCost:30};
assert.equal(isPartOpenForProcurement(waiting,new Set()),true,'custo preenchido sozinho não encerra uma peça ainda em Cotando');

const purchased={id:'p1',name:'Conector',status:'Comprada',orderStatus:'Não pedido',effectiveCost:20};
assert.equal(isPartOpenForProcurement(purchased,new Set()),true,'peça apenas comprada ainda pode permanecer pendente até recebimento');

const activeOrder={id:'o1',name:'Tela',status:'Comprada',orderId:'order-1',orderStatus:'Pedido realizado'};
assert.equal(isPartOpenForProcurement(activeOrder,new Set(['order-1'])),false,'peça já vinculada a pedido ativo não pertence à fila Em aberto');

console.log('parts-central-classification.test: OK');

const main=readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
assert.match(main,/const quoteableRows=rows\.filter\(row=>isPartOpenForProcurement\(row\.part,linkedOrderIds\)\)/,'Central deve usar a classificação concluída/pendente');
assert.match(main,/x\.q&&isPartOpenForProcurement\(x\.part,linkedOrderIds\)/,'Preparação de pedidos não pode reutilizar peça concluída');
