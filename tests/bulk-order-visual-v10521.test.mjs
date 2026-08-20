import fs from 'node:fs';
import assert from 'node:assert/strict';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1068.css',import.meta.url),'utf8');

assert.match(main,/import'\.\/v1068\.css';/,'v10.5.21 bulk visual override must load');
assert.match(css,/\.parts-v62-bulk-dialog\{[\s\S]*background:var\(--surface\)!important/,'bulk dialog must use themed surface');
assert.match(css,/\.parts-v62-bulk-dialog \.parts-v62-bulk-meta\{[\s\S]*grid-template-areas:/,'bulk meta layout must be explicitly organized');
assert.match(css,/\.v102-app\.theme-dark[\s\S]*\.parts-v62-bulk-dialog[\s\S]*background:var\(--surface\)!important/,'dark theme bulk fallback block must exist');
assert.doesNotMatch(css,/#fff/,'bulk visual layer must not force white backgrounds');
assert.doesNotMatch(css,/var\(--card/,'bulk visual layer must not use undefined --card token');
assert.doesNotMatch(css,/var\(--border/,'bulk visual layer must not use undefined --border token');
console.log('bulk-order-visual-v10521: ok');
