import assert from 'node:assert/strict';
import fs from 'node:fs';
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1057.css',import.meta.url),'utf8');
assert.match(main,/import'\.\/v1057\.css';/,'v1057.css precisa continuar carregado');
assert.match(css,/@media\(min-width:721px\)[\s\S]*batch-shared-section>\.grid[\s\S]*grid-template-columns:150px/,'topo do cadastro em massa deve ficar compacto no PC');
assert.match(css,/@media\(max-width:720px\)[\s\S]*\.batch-phone-fields[\s\S]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'campos dos aparelhos precisam manter duas colunas no mobile');
assert.match(css,/@media\(max-width:430px\)[\s\S]*grid-template-columns:1fr 1fr!important/,'viewport estreito não pode voltar a uma coluna para todos os campos');
console.log('batch-v1057-layout.test: OK');
