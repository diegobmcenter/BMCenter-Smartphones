import assert from 'node:assert/strict';
import fs from 'node:fs';
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10491.css',import.meta.url),'utf8');
assert.match(main,/import'\.\/v10490\.css';import'\.\/v10491\.css';/,'v10491.css deve ser importado após v10490.css');
assert.match(main,/const APP_VERSION='10\.5\.4'/,'versão 10.5.1 não encontrada');
assert.match(css,/@media\(min-width:721px\)\{[\s\S]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)!important/,'KPIs desktop devem usar 4 colunas');
assert.match(css,/min-height:68px!important/,'KPIs desktop devem ser compactos, sem altura exagerada');
console.log('reports-desktop-density-v10491.test: OK');
