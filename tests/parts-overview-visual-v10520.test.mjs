import fs from 'node:fs';
import assert from 'node:assert/strict';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1067.css',import.meta.url),'utf8');

assert.match(main,/import'\.\/v1067\.css';/,'v10.5.20 visual override must load');
assert.doesNotMatch(main,/import'\.\/v1065\.css';/,'legacy v10.5.18 visual layer must not remain imported');
assert.doesNotMatch(main,/import'\.\/v1066\.css';/,'partial v10.5.19 visual layer must not remain imported');
assert.match(css,/\.parts-v10518-summary>button\{[\s\S]*background:var\(--surface\)!important/,'summary cards must use theme surface');
assert.match(css,/\.parts-v10518-overview-tools\{[\s\S]*background:var\(--surface\)!important/,'overview tools must use theme surface');
assert.match(css,/\.parts-v10518-overview-filters select,[\s\S]*background:var\(--surface\)!important/,'overview controls must use theme surface');
assert.match(css,/\.v102-app\.theme-dark[\s\S]*background:var\(--surface\)!important/,'dark theme fallback block must exist');
assert.match(css,/white-space:nowrap!important/,'desktop summary labels must not wrap');
assert.doesNotMatch(css,/var\(--card/,'new visual layer must not use undefined --card token');
assert.doesNotMatch(css,/var\(--border/,'new visual layer must not use undefined --border token');
assert.doesNotMatch(css,/#fff/,'new visual layer must not force white backgrounds');
console.log('parts-overview-visual-v10520: ok');
