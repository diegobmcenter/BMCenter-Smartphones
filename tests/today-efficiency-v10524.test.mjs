import assert from'node:assert/strict';
import fs from'node:fs';
import{todayCompletedActivity,todayProductionQueue}from'../src/businessIntelligence.js';

const now=new Date('2026-08-20T12:00:00');
const profiles=[{id:'p1',name:'PATY',active:true},{id:'p2',name:'Perfil 2',active:true}];
const phones=[
 {id:'late',brand:'Samsung',model:'A14',status:'Aguardando peças',date:'2026-08-01',parts:[{id:'pt1',name:'Tela',status:'Comprada'}]},
 {id:'ready',brand:'Motorola',model:'G24',status:'Pronto',lastActivityAt:'2026-08-15',photoTarget:2,mediaLibrary:[{id:'m1',date:'2026-08-15'},{id:'m2',date:'2026-08-15'}],parts:[]},
 {id:'repair',brand:'Xiaomi',model:'Redmi 9',status:'Em reparo',parts:[]},
 {id:'tests',brand:'Motorola',model:'G8',status:'Em testes',parts:[],timeline:[{id:'t1',date:'2026-08-20T09:00:00',message:'Reparo concluído; aparelho enviado para testes'}]},
 {id:'sold',brand:'Apple',model:'iPhone 11',status:'Vendido',parts:[],sale:{soldAt:'2026-08-20T10:00:00',value:1200}}
];
const orders=[{id:'o1',supplier:'TEC Cell',orderDate:'2026-08-10',items:[{id:'i1',phoneId:'late',phoneLabel:'Samsung A14',partName:'Tela',confirmedAt:'2026-08-10T10:00:00',receivedAt:''}]}];
const result=todayProductionQueue(phones,profiles,orders,now);
assert.equal(result.attention.find(x=>x.phoneId==='late')?.reason,'Pedido demorando');
assert.equal(result.attention.find(x=>x.phoneId==='ready')?.reason,'Pronto sem anúncio');
assert.equal(result.actions.find(x=>x.phoneId==='late'),undefined,'aparelho em atenção não pode duplicar em ações');
assert.equal(result.waiting.find(x=>x.phoneId==='late'),undefined,'aparelho em atenção não pode duplicar em aguardando');
assert.equal(result.actions.find(x=>x.phoneId==='repair')?.quickAction,'startTests');
assert.equal(result.actions.find(x=>x.phoneId==='tests')?.quickAction,'markReady');

const done=todayCompletedActivity(phones,profiles,orders,now);
assert.ok(done.some(x=>x.phoneId==='sold'&&x.type==='sale'),'venda do dia deve aparecer em Concluído hoje');
assert.ok(done.some(x=>x.phoneId==='tests'&&/Reparo concluído/.test(x.detail)),'avanço operacional do dia deve aparecer em Concluído hoje');

const ui=fs.readFileSync(new URL('../src/v102/pages/TodayV102.jsx',import.meta.url),'utf8');
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1071.css',import.meta.url),'utf8');
assert.match(ui,/bmcenter-today-queue-progress-v1/,'retomar fila deve persistir em chave coberta pelo backup');
assert.match(ui,/Retomar de onde parei/);
assert.match(ui,/CONCLUÍDO HOJE/);
assert.match(ui,/ATENÇÃO/);
assert.match(main,/runQuickAction/);
assert.match(main,/startTests/);
assert.match(main,/markReady/);
assert.match(main,/import'\.\/v1071\.css';/);
assert.match(css,/\.v10524-attention/);
assert.match(css,/\.v10524-completed/);
assert.match(css,/\.v102-app\.theme-dark[\s\S]*\.v10524-attention/);
assert.doesNotMatch(css,/#fff/,'nova camada da tela Hoje não deve forçar branco');
console.log('today-efficiency-v10524: OK');
