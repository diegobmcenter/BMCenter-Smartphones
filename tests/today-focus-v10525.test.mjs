import assert from'node:assert/strict';
import fs from'node:fs';

const ui=fs.readFileSync(new URL('../src/v102/pages/TodayV102.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1072.css',import.meta.url),'utf8');
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');

assert.match(main,/import'\.\/v1072\.css';/,'camada visual do Modo Foco deve carregar por último');
assert.match(ui,/Modo foco/,'botão visível para entrar no modo foco deve existir');
assert.match(ui,/Sair do modo foco/,'modo foco deve permitir sair preservando a fila');
assert.match(ui,/Anterior/,'modo foco deve permitir voltar uma tarefa');
assert.match(ui,/Pular/,'modo foco deve permitir pular uma tarefa');
assert.match(ui,/v10525-focus-shell/,'modo foco deve usar uma camada dedicada em tela cheia');
assert.match(ui,/saveQueueProgress\(current\.id\)/,'sair do modo foco deve preservar a posição atual');
assert.match(ui,/bmcenter-today-queue-progress-v1/,'modo foco deve reaproveitar a chave de progresso já coberta pelo backup');
assert.doesNotMatch(ui,/bmcenter-today-focus/,'modo foco não deve criar nova chave persistente desnecessária');
assert.match(css,/position:fixed!important;inset:0!important/,'modo foco deve cobrir a interface inteira');
assert.match(css,/height:100dvh!important/,'modo foco deve respeitar a viewport móvel real');
assert.match(css,/@media\(max-width:720px\)[\s\S]*min-height:100dvh!important/,'modo foco móvel deve ocupar a tela toda');
console.log('today-focus-v10525.test: OK');
