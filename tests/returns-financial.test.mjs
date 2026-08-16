import assert from 'node:assert/strict';
import fs from 'node:fs';
import {effectivePartCost,returnRefundTotal,returnRecoveredAmount,returnPartRefundDraft,normalizePartsOrder,syncOrdersIntoPhones} from '../src/partsOrders.js';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10484.css',import.meta.url),'utf8');

const gross={effectiveCost:110,purchasePrice:100,freightShare:10};
assert.equal(effectivePartCost({...gross,returnStatus:'pending',returnFinancialStatus:'',returnPartRefund:100}),110,'separar para devolver não pode reduzir custo');
assert.equal(effectivePartCost({...gross,returnStatus:'returned',returnFinancialStatus:'pending',returnPartRefund:100}),110,'financeiro pendente não pode reduzir custo');
assert.equal(returnRefundTotal({...gross,returnPartRefund:100,returnFreightRefund:0}),100);
assert.equal(returnRecoveredAmount({...gross,returnStatus:'returned',returnFinancialStatus:'received',returnPartRefund:100,returnFreightRefund:0}),100);
assert.equal(effectivePartCost({...gross,returnStatus:'returned',returnFinancialStatus:'received',returnPartRefund:100,returnFreightRefund:0}),10,'reembolso parcial deve preservar frete não recuperado');
assert.equal(effectivePartCost({...gross,returnStatus:'returned',returnFinancialStatus:'supplier_credit',returnPartRefund:100,returnFreightRefund:10}),0,'crédito confirmado integral deve zerar custo da peça');
assert.equal(returnPartRefundDraft({...gross,returnStatus:'pending',returnPartRefund:0}),100,'devolução nova deve pré-preencher o valor original da peça');
assert.equal(returnPartRefundDraft({...gross,returnStatus:'returned',returnPartRefund:65}),65,'edição financeira deve preservar reembolso parcial já salvo');
assert.equal(returnPartRefundDraft({...gross,returnStatus:'returned',returnPartRefund:0}),0,'edição financeira deve preservar zero salvo intencionalmente');

const order=normalizePartsOrder({id:'o1',supplier:'Fornecedor',freight:10,items:[
 {id:'i1',phoneId:'p1',partId:'x1',partName:'Tela',price:100,confirmedAt:'2026-08-15T10:00:00Z',receivedAt:'2026-08-15T11:00:00Z',returnStatus:'returned',returnedToSupplierAt:'2026-08-15T12:00:00Z',returnFinancialStatus:'received',returnPartRefund:100,returnFreightRefund:0,returnRefundMethod:'Pix',returnRefundDate:'2026-08-15'}
]});
assert.equal(order.total,110,'pedido original deve manter total histórico');
assert.equal(order.returnedRecovered,100,'pedido deve somar valor efetivamente recuperado');
assert.equal(order.netCost,10,'pedido deve expor custo líquido após recuperação');
const phones=syncOrdersIntoPhones([{id:'p1',status:'Em reparo',paid:500,parts:[{id:'x1',name:'Tela',status:'Recebida'}]}],[order]);
assert.equal(phones[0].parts[0].returnFinancialStatus,'received');
assert.equal(phones[0].parts[0].returnRefundMethod,'Pix');
assert.equal(effectivePartCost(phones[0].parts[0]),10,'aparelho deve receber custo líquido da peça');
assert.equal(phones[0].status,'Em reparo','devolução não pode mudar status operacional do aparelho');

assert.match(main,/const APP_VERSION='10\.4\.90'/);
assert.match(main,/partRefund:numberText\(returnPartRefundDraft\(item\)\)/,'modal deve usar o preço original como rascunho em devolução nova');
assert.match(main,/DEVOLUÇÃO FINANCEIRA/,'devolução deve abrir janela financeira');
assert.match(main,/Reembolso\/crédito pendente/,'deve ser possível registrar devolução com financeiro pendente');
assert.match(main,/Crédito confirmado no fornecedor/,'deve suportar crédito confirmado');
assert.match(main,/Financeiro pendente/,'fila deve destacar pendências financeiras');
assert.match(main,/Custo líquido/,'fila/pedido deve mostrar custo líquido');
assert.match(css,/\.parts-v84-refund-dialog/,'modal financeiro precisa de layout próprio');
assert.match(css,/\.parts-v84-return-card/,'cards de devolução precisam da camada v10.4.84');
console.log('returns-financial.test: OK');
