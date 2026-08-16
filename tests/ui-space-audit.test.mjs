import assert from 'node:assert/strict';
import fs from 'node:fs';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v10477.css',import.meta.url),'utf8');
const previousFinalCss=fs.readFileSync(new URL('../src/v10479.css',import.meta.url),'utf8');
const finalCss=fs.readFileSync(new URL('../src/v10482.css',import.meta.url),'utf8');

assert.match(main,/import'\.\/v10481\.css';import'\.\/v10482\.css';/,'v10482.css deve ser a última camada visual');
assert.match(main,/const APP_VERSION='10\.5\.6'/,'versão 10.4.82 não encontrada');
assert.ok(fs.readFileSync(new URL('../src/v10478.css',import.meta.url),'utf8').includes('.v102-route .v10313-main-toolbar'),'v10478 deve manter toolbar compacta');
assert.ok(previousFinalCss.includes('.v10479-device-name-button'),'v10479 deve manter ações compactas de Smartphones');
assert.ok(finalCss.includes('.v102-device-row>.v102-row-actions'),'v10482 deve posicionar ações explicitamente no mobile');
assert.doesNotMatch(main,/className="phone-detail-progress"/,'barra Comprado/Diagnóstico/Cotação/Pedido/Reparo/Anúncios/Venda deve ser removida');
assert.doesNotMatch(main,/const stages=\[/,'estrutura antiga de etapas não deve permanecer na ficha');
assert.match(main,/className="sale-data-grid"/,'venda precisa do layout compacto de dados');
assert.match(main,/className="sale-receipt-grid"/,'venda precisa do layout compacto de recebimento');
assert.match(main,/className="sale-buyer-grid"/,'venda precisa do layout compacto de comprador');
assert.match(main,/className="profile-overview-grid"/,'Perfis precisa do novo resumo gráfico');
assert.match(main,/className="profile-card-performance"/,'cards de Perfil precisam do indicador gráfico');
assert.match(main,/data-modal-title=\{title\}/,'Modal precisa expor título para dimensionamento auditado');

for(const selector of [
  '.v102-route .filter-bar',
  '.v102-route .table-wrap:not(.smartphones-table-wrap)>table',
  '.v102-app .back>.modal:not(.phone-editor-v57)',
  '.v102-app .sale-register-modal .sale-data-grid',
  '.profile-overview-grid',
  '.profiles-modern-page .facebook-profile-grid>article',
  '.ads-ref-publication-modal',
  '.parts-v47-settings',
  '.command-palette',
  '.universal-column-drawer'
]) assert.ok(css.includes(selector),`seletor da auditoria ausente: ${selector}`);

for(const title of [
  'Cadastro de vendedor','Cadastro de fornecedor','Cadastro de conta bancária','Peça em estoque',
  'Movimentar estoque','Modelo de anúncio','Agenda ·','Personalizar colunas de Smartphones',
  'Novo perfil do Facebook','Editar perfil do Facebook'
]) assert.ok(css.includes(title),`subjanela sem regra auditada: ${title}`);

const modalCalls=(main.match(/<Modal\s/g)||[]).length;
assert.ok(modalCalls>=15,`esperados ao menos 15 modais padrão auditáveis, encontrados ${modalCalls}`);

console.log('ui-space-audit.test: OK');
