import fs from 'node:fs';
import assert from 'node:assert/strict';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1069.css',import.meta.url),'utf8');

assert.match(main,/import'\.\/v1069\.css';/,'v10.5.22 header alignment override must load');
assert.match(css,/grid-template-areas:[\s\S]*"intro summary"[\s\S]*"actions actions"/,'parts header must reserve its own row for action buttons');
assert.match(css,/\.parts-v10518-head>\.parts-v47-head-actions\{[\s\S]*flex-wrap:wrap!important/,'top action menu must wrap instead of overflowing');
assert.match(css,/@media\(max-width:1180px\)[\s\S]*"intro"[\s\S]*"summary"[\s\S]*"actions"/,'tablet/mobile fallback layout must stack intro, summary and actions');
console.log('parts-header-alignment-v10522: ok');
