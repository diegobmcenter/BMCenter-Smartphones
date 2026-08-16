import assert from 'node:assert/strict';
import fs from 'node:fs';
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10482.css',import.meta.url),'utf8');
assert.match(main,/import'\.\/v10481\.css';import'\.\/v10482\.css';/,'v10482 precisa ser a última camada visual');
assert.match(main,/const APP_VERSION='10\.4\.91'/,'versão 10.4.82 não encontrada');
for(const [selector,column,row] of [
  ['\\.v102-device-row>\\.v102-star','1','1'],
  ['\\.v102-device-row>\\.v102-device-name','2','1'],
  ['\\.v102-device-row>\\.v102-row-actions','3','1'],
  ['\\.v102-device-row>\\.v102-status','4','1']
]){
  const rule=new RegExp(`${selector}\\{[\\s\\S]*?grid-area:auto!important;[\\s\\S]*?grid-column:${column}!important;grid-row:${row}!important`);
  assert.match(css,rule,`${selector} precisa neutralizar grid-area antes de posicionar coluna/linha`);
}
assert.match(css,/\.v102-device-row>\.v102-money,[\s\S]*?grid-area:auto!important;[\s\S]*?grid-column:2\/5!important;grid-row:2!important/,'valores precisam ficar em uma segunda linha completa');
assert.match(css,/@container \(max-width:700px\)/,'deve existir defesa por container para zoom/viewport móvel');
assert.doesNotMatch(css,/grid-column:[^;]+!important;grid-row:[^;]+!important;\s*grid-area:auto!important/,'grid-area não pode voltar a anular grid-column/grid-row');
console.log('smartphones-mobile-v10482.test: OK');
