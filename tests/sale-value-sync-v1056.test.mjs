import assert from'node:assert/strict';
import{phoneSaleDisplayValue,restoreSuggestedValueAfterSaleRemoval,soldSaleValueNeedsRepair,syncRecordedSaleValue}from'../src/saleAccounting.js';

const unsold={id:'p1',expected:250,sale:null};
assert.equal(phoneSaleDisplayValue(unsold),250,'antes da venda deve mostrar o valor sugerido');

const sold=syncRecordedSaleValue(unsold,{soldAt:'2026-08-16',value:320,marketplaceFee:0,shippingCost:0});
assert.equal(sold.expected,320,'ao registrar a venda, expected deve virar o valor real vendido');
assert.equal(sold.sale.value,320,'a venda deve preservar o valor real');
assert.equal(sold.sale.suggestedValue,250,'o valor sugerido anterior deve ser preservado para histórico/restauração');
assert.equal(phoneSaleDisplayValue(sold),320,'aparelho vendido deve mostrar o valor real da venda');
assert.equal(restoreSuggestedValueAfterSaleRemoval(sold),250,'remover venda deve permitir restaurar o sugerido anterior');

const edited=syncRecordedSaleValue(sold,{...sold.sale,value:305});
assert.equal(edited.expected,305,'editar venda deve atualizar o valor exibido do aparelho');
assert.equal(edited.sale.suggestedValue,250,'editar venda não pode perder o sugerido original');

const legacy={id:'old',expected:250,sale:{soldAt:'2026-08-10',value:320}};
assert.equal(soldSaleValueNeedsRepair(legacy),true,'registro antigo divergente deve ser detectado');
const repaired=syncRecordedSaleValue(legacy,legacy.sale);
assert.equal(repaired.expected,320,'migração deve corrigir registros vendidos antigos');
assert.equal(repaired.sale.suggestedValue,250,'migração deve preservar o valor que estava sugerido antes da correção');
assert.equal(soldSaleValueNeedsRepair(repaired),false,'registro reparado não deve continuar pendente');
console.log('sale-value-sync-v1056.test: OK');

const source=(await import('node:fs')).readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
assert.match(source,/field==='expected'.*sale\?\.soldAt\?syncRecordedSaleValue/s,'edição inline do valor de aparelho vendido deve atualizar a venda real');
assert.match(source,/bmcenter-sold-sale-value-v1056/,'deve existir migração automática para vendas antigas divergentes');
const saleModalSource=source.slice(source.indexOf('function SaleModal('),source.indexOf('function normalizeMarketplaceProfiles('));
assert.match(saleModalSource,/f\.paymentStatus==='Recebido'\?Math\.max\(0,net\)/,'venda marcada como recebida deve acompanhar automaticamente o novo valor líquido');
