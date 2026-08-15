import assert from 'node:assert/strict';
import fs from 'node:fs';
import {workflowStageForPhone} from '../src/workflow.js';

const css66=fs.readFileSync(new URL('../src/v10466.css',import.meta.url),'utf8');
const css67=fs.readFileSync(new URL('../src/v10467.css',import.meta.url),'utf8');
const css=css66+'\n'+css67;
const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const frame=fs.readFileSync(new URL('../src/v102/AppFrameV102.jsx',import.meta.url),'utf8');

// Hoje: status atual é soberano e as etapas são exclusivas.
assert.equal(workflowStageForPhone({status:'Pronto',parts:[{status:'Comprar'}]}),'ready');
assert.equal(workflowStageForPhone({status:'Pronto'},{hasAds:true}),'');
assert.equal(workflowStageForPhone({status:'Em reparo'}),'repair');
assert.equal(workflowStageForPhone({status:'Em testes'}),'repair');
assert.equal(workflowStageForPhone({status:'Aguardando peças'}),'parts');
assert.equal(workflowStageForPhone({status:'Aguardando análise'}),'analyze');

// Navegação Android / histórico interno.
assert.match(main,/bmcenterAnchor:true/);
assert.match(main,/history\.pushState\(\{bmcenterApp:true,bmcenterPage:initialPage,bmcenterAnchor:false\}/);
assert.match(main,/bmcenterModal/);

// Orçamento de densidade visual mobile.
assert.match(css,/\.v102-device-row\{[\s\S]*?grid-template-areas:[\s\S]*?"star name status"/);
assert.match(css,/\.v102-row-actions>button[\s\S]*?width:30px/);
assert.match(css,/\.parts-v50-filters\{[\s\S]*?grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/);
assert.match(css,/\.parts-v47-row\{[\s\S]*?padding:7px/);
assert.match(css,/\.parts-v62-bulk-dialog \.parts-v49-bulk-list\{[\s\S]*?repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css,/\.batch-phone-fields\{[\s\S]*?repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css,/env\(safe-area-inset-bottom\)/);
assert.match(frame,/bmcenter-reading-mode/);
assert.match(frame,/--bmcenter-screen-dim/);

assert.match(css67,/grid-template-areas:\s*\n\s*"supplier supplier freight"\s*\n\s*"date received notes"/);
assert.match(css67,/parts-v49-bulk-filters[\s\S]*?145px/);
assert.match(css67,/v102-smartphones-hero \.v102-page-actions[\s\S]*?repeat\(3,minmax\(0,1fr\)\)/);
console.log('mobile-layout.test: OK');
