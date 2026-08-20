import fs from 'node:fs';
import assert from 'node:assert/strict';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1075.css',import.meta.url),'utf8');
const parts=fs.readFileSync(new URL('../src/partsOrders.js',import.meta.url),'utf8');

assert.match(main,/PEDIDO EM MASSA · PEDIDO MISTO/,'modal deve explicar pedido misto');
assert.match(main,/type:'external'/,'produto avulso precisa de tipo explícito');
assert.match(main,/Cliente João, uso pessoal/,'item avulso deve aceitar referência simples');
assert.match(main,/Devoluções avulsas/,'aba Devoluções deve ter área avulsa separada');
assert.match(main,/Valor físico por fornecedor/,'devoluções precisam resumir o valor separado por fornecedor');
assert.match(main,/Itens avulsos ficam somente neste pedido e nas devoluções/,'UI deve deixar explícito que avulsos não entram nos aparelhos');
assert.match(parts,/externalItems/,'modelo do pedido deve persistir itens avulsos dentro do próprio pedido');
assert.match(parts,/linkedSubtotal/,'pedido deve manter subtotal BMCenter separado');
assert.match(parts,/externalSubtotal/,'pedido deve manter subtotal avulso separado');
assert.match(parts,/systemTotal/,'custo operacional BMCenter precisa permanecer isolado');
assert.match(css,/\.parts-v10528-external-editor/,'painel avulso precisa de layout próprio');
assert.match(css,/\.parts-v10528-return-summary/,'resumo de devolução precisa de layout próprio');
assert.doesNotMatch(css,/var\(--card/,'novo CSS não pode usar token inexistente --card');
assert.doesNotMatch(css,/var\(--border/,'novo CSS não pode usar token inexistente --border');

assert.match(css,/parts-v62-bulk-dialog \.parts-v50-product-fields\.parts-v10528-external-fields/,'campos avulsos precisam vencer o grid legado do modal');
assert.match(css,/@media\(max-width:720px\)[\s\S]*parts-v61-bulk-batches>header[\s\S]*grid-template-columns:1fr!important/,'cabeçalho do lote precisa empilhar no celular sem espremer o texto');
console.log('mixed-parts-ui-v10528: OK');
