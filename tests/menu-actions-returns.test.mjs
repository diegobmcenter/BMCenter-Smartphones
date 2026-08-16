import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizePartsOrder,syncOrdersIntoPhones,isPartProcurementComplete} from '../src/partsOrders.js';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const page=fs.readFileSync(new URL('../src/v102/pages/SmartphonesV102.jsx',import.meta.url),'utf8');
const frame=fs.readFileSync(new URL('../src/v102/AppFrameV102.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10479.css',import.meta.url),'utf8');

assert.match(main,/const APP_VERSION='10\.4\.81'/);
assert.match(main,/import'\.\/v10478\.css';import'\.\/v10479\.css';/);
assert.match(frame,/comfortAnchorRef/);
assert.match(frame,/document\.addEventListener\('pointerdown',close\)/,'Conforto visual deve fechar ao clicar fora');
assert.match(page,/target\.closest\('\.v102-menu-anchor'\)/,'menu ... deve fechar ao clicar fora');
assert.match(page,/v10479-device-name-button[^>]*onClick=\{\(\)=>setEdit\(x\)\}/,'nome do aparelho deve editar a ficha');
const row=page.match(/<section className="v102-device-list">([\s\S]*?)<\/section>/)?.[1]||'';
assert.ok(row,'lista de aparelhos não encontrada');
assert.doesNotMatch(row,/title="Abrir ficha"><Eye/,'olho não pode ficar exposto na linha');
assert.doesNotMatch(row,/title="Editar"><FileText/,'editar não pode ficar exposto na linha');
assert.doesNotMatch(row,/v10423-scrap-shortcut/,'descarte não pode ficar exposto na linha');
assert.match(row,/<Eye size=\{15\}\/> Abrir ficha/,'olho precisa existir no menu ...');
assert.match(row,/<Archive size=\{15\}\/> Descarte\/Sucata/,'descarte precisa existir no menu ...');

assert.match(main,/Devoluções <b>\{pendingReturns\.length\}<\/b>/,'Central de Peças precisa da aba Devoluções');
assert.match(main,/changeReturnState\(order\.id,item\.id,'pending'\)/,'item recebido precisa poder ir para devolução');
assert.match(main,/changeReturnState\(row\.order\.id,row\.item\.id,'returned'\)/,'fila precisa concluir devolução');
assert.match(css,/\.parts-v79-return-card/,'fila de devoluções precisa de layout próprio');

const order=normalizePartsOrder({id:'o1',supplier:'Fornecedor',freight:0,items:[{id:'i1',phoneId:'p1',partId:'x1',partName:'Tela',price:100,confirmedAt:'2026-08-15T10:00:00Z',receivedAt:'2026-08-15T11:00:00Z',returnStatus:'pending',returnMarkedAt:'2026-08-15T12:00:00Z'}]});
const phones=syncOrdersIntoPhones([{id:'p1',status:'Em reparo',parts:[{id:'x1',name:'Tela',status:'Recebida'}]}],[order]);
assert.equal(phones[0].parts[0].status,'Para devolver');
assert.equal(phones[0].parts[0].orderStatus,'Para devolver');
assert.equal(isPartProcurementComplete(phones[0].parts[0]),true);
console.log('menu-actions-returns.test: OK');
