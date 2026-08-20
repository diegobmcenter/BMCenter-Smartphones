import assert from 'node:assert/strict';
import fs from 'node:fs';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10529.css',import.meta.url),'utf8');

assert.match(main,/RKEY='bmcenter-parts-standalone-returns'/,'devoluções avulsas independentes precisam de armazenamento próprio');
assert.match(main,/openBulkOrder\('single'\)/,'Novo pedido precisa abrir o construtor em modo individual');
assert.match(main,/> Novo pedido<\/button>/,'cabeçalho precisa exibir botão Novo pedido');
assert.match(main,/bulkOrderMode==='single'\?'Criar pedido'/,'modo individual precisa concluir como Criar pedido');
assert.match(main,/Nova devolução avulsa/,'aba Devoluções precisa expor entrada para nova devolução avulsa');
assert.match(main,/DEVOLUÇÃO AVULSA INDEPENDENTE/,'devolução independente precisa ter formulário próprio');
assert.match(main,/undoSnapshot/,'devolução independente precisa preservar snapshot para desfazer');
assert.match(main,/undoStandaloneReturn/,'devolução independente precisa ter ação de desfazer');
assert.match(main,/visibleStandaloneReturnRows/,'devoluções independentes precisam participar dos filtros e da listagem');
assert.match(main,/overviewStandaloneReturnRows/,'devoluções independentes pendentes precisam entrar no resumo da Central');
assert.match(css,/\.parts-v10529-return-command/,'atalho de devolução precisa de layout próprio');
assert.match(css,/\.parts-v10529-return-dialog/,'formulário de devolução precisa de layout responsivo próprio');
assert.match(css,/@media\(max-width:640px\)/,'formulário de devolução precisa de tratamento mobile');

console.log('manual-order-standalone-returns-v10529.test: OK');
