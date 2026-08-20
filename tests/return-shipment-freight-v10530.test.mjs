import assert from 'node:assert/strict';
import fs from 'node:fs';
import {allocateFreight,normalizePartsOrder,syncOrdersIntoPhones,effectivePartCost,returnShippingNetCost} from '../src/partsOrders.js';

const quantityRateio=allocateFreight([
  {id:'bm1',price:500,quantity:1},
  {id:'bm2',price:20,quantity:1},
  {id:'avulso',price:30,quantity:3}
],15);
assert.deepEqual(quantityRateio.map(item=>item.freightShare),[3,3,9],'R$ 15 em 5 unidades deve gerar R$ 3 por unidade, sem considerar valor do produto');

const cents=allocateFreight([{id:'a',price:999,quantity:2},{id:'b',price:1,quantity:1}],0.10);
assert.equal(cents.reduce((sum,item)=>sum+Math.round(item.freightShare*100),0),10,'rateio por unidade precisa fechar exatamente em centavos');
assert.deepEqual(cents.map(item=>item.freightShare),[0.07,0.03],'sobras de centavos devem ser distribuídas deterministicamente pelas unidades');

const returned=normalizePartsOrder({id:'return-1',supplier:'Fornecedor',freight:3,items:[{
  id:'i1',phoneId:'p1',partId:'part1',partName:'Tela',price:100,confirmedAt:'2026-08-20T10:00:00Z',receivedAt:'2026-08-20T11:00:00Z',
  returnStatus:'returned',returnFinancialStatus:'received',returnPartRefund:100,returnFreightRefund:3,
  returnShipmentId:'ship-1',returnShippingFreightShare:4,returnShippingFreightRefundShare:1
}]});
assert.equal(returnShippingNetCost(returned.items[0]),3,'frete líquido da devolução deve ser pago menos recuperado');
const synced=syncOrdersIntoPhones([{id:'p1',status:'Em reparo',parts:[{id:'part1',name:'Tela'}]}],[returned]);
assert.equal(effectivePartCost(synced[0].parts[0]),3,'após recuperar compra e frete original, deve permanecer apenas o frete líquido da devolução');
assert.equal(returned.netCost,3,'custo operacional do pedido deve incluir somente o frete líquido da devolução após reembolso integral da compra');

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10530.css',import.meta.url),'utf8');
assert.match(main,/RSHIPKEY='bmcenter-parts-return-shipments'/,'remessas de devolução precisam de armazenamento próprio');
assert.match(main,/openReturnShipment/,'devoluções devem ser agrupáveis em uma única remessa');
assert.match(main,/Frete total da devolução/,'remessa deve receber um único frete total');
assert.match(main,/Frete recuperado do fornecedor/,'remessa deve registrar frete efetivamente recuperado');
assert.match(main,/allocateFreight\(quantityRows,freight\)/,'frete da remessa deve usar o mesmo rateio por quantidade');
assert.match(main,/Desfazer remessa/,'remessa precisa manter ação de desfazer');
assert.match(css,/\.parts-v10530-shipment-dialog/,'modal de remessa precisa de layout próprio');
assert.match(css,/@media\(max-width:640px\)/,'remessa precisa funcionar no mobile');
console.log('return-shipment-freight-v10530: OK');
