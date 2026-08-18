import fs from 'node:fs';
import assert from 'node:assert/strict';
import {normalizePartsOrder,removePartsOrderLinks,syncOrdersIntoPhones,effectivePartCost} from '../src/partsOrders.js';

const quotePhone={id:'p1',status:'Em reparo',parts:[{id:'bio',name:'Biometria',status:'Cotando',quotes:[{id:'q1',supplier:'Shopee',price:27}],selectedQuoteId:'q1'}]};
const draft=normalizePartsOrder({id:'o1',supplier:'Shopee',items:[{id:'i1',phoneId:'p1',partId:'bio',partName:'Biometria',quoteId:'q1',price:27,confirmedAt:'',receivedAt:''}]});
const linked=syncOrdersIntoPhones([quotePhone],[draft]);
assert.equal(linked[0].parts[0].orderId,'o1','rascunho precisa estar vinculado ao pedido enquanto preparado');
const cleared=removePartsOrderLinks(linked,draft,[]);
assert.equal(cleared[0].parts[0].orderId,'','desfazer preparação precisa remover vínculo do pedido');
assert.equal(cleared[0].parts[0].selectedQuoteId,'q1','cotação selecionada deve ser preservada ao desfazer pedido aberto');
assert.equal(cleared[0].parts[0].status,'Cotando','peça deve voltar para cotação após desfazer preparação');
assert.equal(effectivePartCost(cleared[0].parts[0]),0,'pedido aberto desfeito não pode compor custo');

const bulkPhone={id:'p2',status:'Em reparo',parts:[{id:'x',name:'Botão power',status:'Cotando',orderId:'o2',orderItemId:'i2'}]};
const bulkDraft=normalizePartsOrder({id:'o2',source:'bulk',supplier:'Shopee',items:[{id:'i2',phoneId:'p2',partId:'x',partName:'Botão power',price:19.8,bulkCreatedPart:true,confirmedAt:'',receivedAt:''}]});
const bulkCleared=removePartsOrderLinks([bulkPhone],bulkDraft,[]);
assert.equal(bulkCleared[0].parts.length,0,'item criado exclusivamente pelo pedido em massa deve ser removido ao desfazer o rascunho');

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
assert.match(main,/function undoDraftOrderPreparation\(/,'pedidos em rascunho precisam ter ação própria de desfazer preparação');
assert.match(main,/Peça removida do pedido e devolvida à etapa anterior/,'desfazer individual em pedido aberto deve ser suportado');
assert.match(main,/Desfazer pedido<\/button>/,'pedido aberto completo precisa exibir botão Desfazer pedido');
assert.match(main,/!item\.confirmedAt&&<><button[^>]*>.*?Confirmar<\/button><button className="parts-v10514-undo-button"/s,'peça não confirmada precisa exibir Confirmar e Desfazer lado a lado');
assert.match(main,/!expanded&&<button[^>]*className="parts-v10514-undo-summary"/,'pedido aberto recolhido precisa mostrar Desfazer sem exigir expansão');

console.log('parts-undo-open-v10515.test: OK');
