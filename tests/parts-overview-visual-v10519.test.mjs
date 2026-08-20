import fs from 'node:fs';
import assert from 'node:assert/strict';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1066.css',import.meta.url),'utf8');
assert.match(main,/import'\.\/v1066\.css';/,'v10.5.19 visual override must load last');
assert.match(css,/\.parts-v10518-summary>button[\s\S]*background:var\(--surface2\)!important/,'summary cards must use theme surface2');
assert.match(css,/\.parts-v10518-overview-tools[\s\S]*background:var\(--surface\)!important/,'overview tools must use theme surface');
assert.match(css,/\.parts-v10518-overview-filters select[\s\S]*color:var\(--text\)!important/,'overview controls must inherit theme text');
assert.match(css,/white-space:nowrap!important/,'desktop summary labels must not wrap');
assert.doesNotMatch(css,/var\(--card/,'new visual layer must not use undefined --card token');
assert.doesNotMatch(css,/var\(--border/,'new visual layer must not use undefined --border token');
console.log('parts-overview-visual-v10519: ok');
