import assert from'node:assert/strict';
import fs from'node:fs';
import{buildAvailablePhonesReply}from'../src/salesQuickReplies.js';

const phones=[
 {id:'1',brand:'Apple',model:'iPhone 13',storage:'128',color:'Preto',batteryHealth:88,expected:2499,status:'Anunciado'},
 {id:'2',brand:'Samsung',model:'Galaxy S23',storage:'256',color:'Verde',expected:2290,status:'Pronto'}
];
const text=buildAvailablePhonesReply(phones,{location:'Maringá',showStorage:true,showColor:true,showBattery:true});
assert.match(text,/Aparelhos disponíveis/);
assert.match(text,/iPhone 13/);
assert.match(text,/128GB/);
assert.match(text,/Bateria 88%/);
assert.match(text,/Galaxy S23/);
assert.match(text,/Maringá/);

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1074.css',import.meta.url),'utf8');
assert.match(main,/Lista de disponíveis/,'Respostas rápidas deve oferecer lista de aparelhos disponíveis');
assert.match(main,/Selecionar filtrados/,'lista deve permitir selecionar todos os aparelhos filtrados');
assert.match(main,/Desmarcar filtrados/,'lista deve permitir desfazer seleção filtrada');
assert.match(main,/Reservados, vendidos e sucata ficam fora automaticamente/,'UI deve deixar claro o filtro de disponibilidade');
assert.match(main,/Preço mínimo/,'lista deve filtrar por preço');
assert.match(main,/Armazenamento/,'lista deve filtrar por armazenamento');
assert.match(main,/Informações na relação/,'lista deve permitir controlar campos exibidos');
assert.match(main,/copyAvailableList/,'lista deve possuir ação dedicada de cópia');
assert.match(css,/v10538-list-builder/,'camada visual da lista deve existir');
console.log('available-phones-reply-v10538.test: OK');
