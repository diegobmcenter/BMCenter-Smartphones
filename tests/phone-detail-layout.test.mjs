import assert from 'node:assert/strict';
import fs from 'node:fs';
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10476.css',import.meta.url),'utf8');
assert.match(main,/import'\.\/v10476\.css';/,'CSS corretivo v10.4.76 precisa permanecer carregado');
assert.match(css,/phone-detail-progress\{[\s\S]*height:auto!important;/,'etapas não podem herdar altura de 7px');
assert.match(css,/phone-detail-progress\{[\s\S]*overflow:visible!important;/,'cartões das etapas não podem ser cortados');
assert.match(css,/phone-detail-modal>\.modalbody\{[\s\S]*overflow-y:auto!important;/,'corpo da ficha precisa ter rolagem interna');
assert.match(css,/modalbody>\.actions\{[\s\S]*position:static!important;/,'rodapé da ficha não pode cobrir o conteúdo');
assert.match(main,/const APP_VERSION='10\.5\.0'/,'versão 10.4.80 não encontrada');
assert.doesNotMatch(main,/className=\"phone-detail-progress\"/,'etapas Comprado/Diagnóstico/Cotação/Pedido/Reparo/Anúncios/Venda foram removidas na v10.4.79');

console.log('phone-detail-layout.test: OK');
