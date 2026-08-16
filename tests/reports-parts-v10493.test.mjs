import assert from 'node:assert/strict';
import fs from 'node:fs';
import {partsOperationalCounters,partsPeriodReportMetrics} from '../src/partsOrders.js';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const view=fs.readFileSync(new URL('../src/v10/pages/ReportsV10.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10493.css',import.meta.url),'utf8');

const phones=[
 {id:'p1',status:'Em reparo',parts:[
  {id:'a',name:'Aberta',status:'Cotando',quotes:[]},
  {id:'b',name:'Cotada',status:'Cotando',quotes:[{id:'q1',supplier:'Fornecedor A',price:20}]},
  {id:'c',name:'Em pedido',status:'Comprada',orderId:'o1',quotes:[]}
 ]},
 {id:'p2',status:'Vendido',parts:[{id:'d',name:'Não deve contar',status:'Cotando',quotes:[{id:'q2',supplier:'X',price:1}]}]}
];
const orders=[
 {id:'o1',supplier:'A',freight:0,items:[{id:'i1',phoneId:'p1',partId:'c',price:30,confirmedAt:'2026-08-15T10:00:00Z'}]},
 {id:'o2',supplier:'A',freight:0,items:[{id:'i2',phoneId:'p1',partId:'x',price:10,confirmedAt:'2026-08-14T10:00:00Z',receivedAt:'2026-08-14T12:00:00Z',returnStatus:'pending'}]},
 {id:'o3',supplier:'B',freight:0,items:[{id:'i3',phoneId:'p1',partId:'y',price:10,confirmedAt:'2026-08-10T10:00:00Z',receivedAt:'2026-08-10T12:00:00Z',returnStatus:'returned',returnedToSupplierAt:'2026-08-15T10:00:00Z',returnFinancialStatus:'pending'}]},
 {id:'o4',supplier:'B',freight:0,items:[{id:'i4',phoneId:'p1',partId:'z',price:10,confirmedAt:'2026-08-09T10:00:00Z',receivedAt:'2026-08-09T12:00:00Z',returnStatus:'returned',returnedToSupplierAt:'2026-08-15T10:00:00Z',returnFinancialStatus:'received',returnPartRefund:10,returnFinancialUpdatedAt:'2026-08-15T11:00:00Z'}]}
];
const current=partsOperationalCounters(phones,orders);
assert.deepEqual(current,{open:2,quotes:1,orders:1,received:3,returns:2},'Relatórios e Central de Peças devem compartilhar exatamente os mesmos contadores operacionais');

const periodOrders=[
 {id:'pa',supplier:'TEC Cell',freight:10,items:[{id:'p1',price:100,confirmedAt:'2026-08-05T10:00:00Z',receivedAt:'2026-08-06T10:00:00Z',returnStatus:'returned',returnedToSupplierAt:'2026-08-12T10:00:00Z',returnFinancialStatus:'received',returnPartRefund:100,returnFreightRefund:0,returnFinancialUpdatedAt:'2026-08-15T10:00:00Z'}]},
 {id:'pb',supplier:'Garrido',freight:0,items:[{id:'p2',price:50,confirmedAt:'2026-07-31T10:00:00Z',receivedAt:'2026-08-01T10:00:00Z',returnStatus:'returned',returnedToSupplierAt:'2026-08-10T10:00:00Z',returnFinancialStatus:'pending',returnPartRefund:50}]}
];
const august=value=>String(value||'').slice(0,10)>='2026-08-01'&&String(value||'').slice(0,10)<='2026-08-31';
const metrics=partsPeriodReportMetrics(periodOrders,august);
assert.equal(metrics.purchasedQty,1);
assert.equal(metrics.purchasedValue,110);
assert.equal(metrics.returnsQty,2,'devoluções físicas devem respeitar a data em que voltaram ao fornecedor');
assert.equal(metrics.recoveredValue,100,'somente financeiro efetivamente liquidado entra como recuperado');
assert.equal(metrics.unrecoveredLoss,10,'frete não reembolsado deve permanecer como perda efetiva');
assert.deepEqual(metrics.supplierSpend,{'TEC Cell':110},'gasto por fornecedor deve usar compras efetivas do período, não simples cotações');

assert.match(main,/const APP_VERSION='10\.5\.3'/);
assert.match(main,/partsOperationalCounters\(phones,orders\)/,'Central de Peças deve usar o contador compartilhado');
assert.match(main,/partsPeriodReportMetrics\(partOrders,dateInRange\)/,'Relatórios devem usar métricas históricas de peças filtradas pelo período');
assert.match(view,/CENTRAL DE PEÇAS/);
assert.match(view,/Em aberto/);
assert.match(view,/Cotações/);
assert.match(view,/Pedidos/);
assert.match(view,/Devoluções/);
assert.match(view,/Peças compradas/);
assert.match(view,/Valor recuperado/);
assert.match(view,/Perda não recuperada/);
assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)!important/,'histórico no PC deve usar uma única faixa compacta de 5 métricas');
assert.match(css,/@media\(max-width:720px\)[\s\S]*repeat\(3,minmax\(0,1fr\)\)!important/,'histórico mobile deve permanecer denso');
console.log('reports-parts-v10493.test: OK');
