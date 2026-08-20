import assert from'node:assert/strict';
import fs from'node:fs';
import{todayProductionQueue}from'../src/businessIntelligence.js';

const profiles=[{id:'p1',name:'PATY',active:true},{id:'p2',name:'Perfil 2',active:true}];
const media=count=>Array.from({length:count},(_,i)=>({id:`m${i}`}));
const phones=[
 {id:'a',brand:'Motorola',model:'G24',status:'Aguardando análise',parts:[]},
 {id:'b',brand:'Samsung',model:'A14',status:'Aguardando peças',parts:[{id:'pt',name:'Tela',status:'Comprada'}]},
 {id:'c',brand:'Xiaomi',model:'Mi A2',status:'Pronto',photoTarget:10,mediaLibrary:media(4),parts:[]},
 {id:'d',brand:'Samsung',model:'A03s',status:'Anúncio preparado',photoTarget:10,mediaLibrary:media(10),parts:[]},
 {id:'e',brand:'Motorola',model:'G8',status:'Anunciado',photoTarget:10,mediaLibrary:media(10),marketplaceProfiles:{p1:{active:true,publishedAt:'2026-08-19'}},parts:[]},
 {id:'f',brand:'Apple',model:'iPhone 11',status:'Anunciado',photoTarget:10,mediaLibrary:media(10),marketplaceProfiles:{p1:{active:true},p2:{active:true}},parts:[]},
 {id:'g',brand:'Samsung',model:'S21',status:'Reservado',parts:[]}
];
const orders=[{id:'o1',supplier:'TEC Cell',items:[{id:'oi1',phoneId:'b',partName:'Tela',confirmedAt:'2026-08-18',receivedAt:''}]}];
const result=todayProductionQueue(phones,profiles,orders,new Date('2026-08-19T12:00:00'));
const byPhone=id=>result.actions.find(item=>item.phoneId===id);
const waiting=id=>result.waiting.find(item=>item.phoneId===id);
assert.equal(byPhone('a')?.type,'analyze');
assert.equal(byPhone('c')?.type,'photos','Pronto sem fotos deve pedir fotos antes de anúncio');
assert.equal(byPhone('d')?.type,'ads','Fotos completas sem publicação devem pedir anúncio');
assert.equal(byPhone('e')?.type,'coverage');
assert.match(byPhone('e')?.cta||'',/Perfil 2/,'deve apontar o próximo perfil faltante');
assert.equal(byPhone('g')?.type,'sale');
assert.ok(waiting('b'),'peça comprada e ainda não recebida deve ficar em Aguardando');
assert.ok(waiting('f'),'aparelho totalmente anunciado deve ficar aguardando venda');
assert.equal(byPhone('b'),undefined,'Aguardando fornecedor não deve aparecer ao mesmo tempo em Próximas ações');

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const ui=fs.readFileSync(new URL('../src/v102/pages/TodayV102.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1070.css',import.meta.url),'utf8');
assert.match(main,/todayProductionQueue\(phones,profiles,orders/);
assert.match(main,/page==='today'\?<TodayPage navigate=\{navigate\}/);
assert.match(ui,/Iniciar minha fila/);
assert.match(ui,/PRÓXIMAS AÇÕES/);
assert.match(ui,/AGUARDANDO/);
assert.match(ui,/Pular/);
assert.match(main,/import'\.\/v1070\.css';/,'novo visual da tela Hoje precisa carregar por último');
assert.match(css,/\.v10523-work-grid/);
assert.match(css,/\.v102-app\.theme-dark[\s\S]*\.v10523-panel/,'tema escuro precisa de regra explícita');
assert.doesNotMatch(css,/#fff/,'nova tela Hoje não deve forçar fundo branco');
assert.match(css,/@media\(max-width:720px\)/);
console.log('today-production-v10523: OK');
