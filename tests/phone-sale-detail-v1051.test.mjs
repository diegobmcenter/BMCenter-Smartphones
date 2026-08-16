import assert from'node:assert/strict';
import fs from'node:fs';
import{lastOperationalActivityDate,operationalIdleDays,smartActionQueue}from'../src/businessIntelligence.js';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1051.css',import.meta.url),'utf8');

assert.match(main,/APP_VERSION='10\.5\.3'/);
assert.match(main,/import'\.\/v1050\.css';import'\.\/v1051\.css';/);

const purchaseStart=main.indexOf('<section className="v57-card v57-purchase-card">');
const purchaseEnd=main.indexOf('</section>',purchaseStart);
const purchase=main.slice(purchaseStart,purchaseEnd);
assert.ok(purchaseStart>0&&purchaseEnd>purchaseStart,'bloco Dados da compra não encontrado');
assert.doesNotMatch(purchase,/Previsão de venda/,'Previsão de venda deve ser removida de Dados do aparelho');
assert.match(purchase,/className="v57-status"/,'Status deve permanecer em Dados da compra');
assert.match(css,/v57-purchase-grid>label:nth-child\(8\)\{grid-column:span 6!important\}/,'Status deve aproveitar o espaço liberado no desktop');

assert.match(main,/photoTarget:10,priceHistory/,'novo aparelho deve usar meta de 10 fotos');
assert.match(main,/bmcenter-photo-target-default-v1051/,'deve existir migração da meta antiga de 6 para 10');
assert.match(main,/current===6[\s\S]*photoTarget:10/,'meta padrão antiga deve migrar para 10');
assert.match(main,/f\.photoTarget\|\|10/,'ficha deve usar fallback 10');

assert.match(main,/const publicationMap=normalizeMarketplaceProfiles\(f\)/,'ficha deve usar a fonte operacional unificada de publicações');
assert.match(main,/publishedProfileIds\(f\)/,'ficha deve ler perfis publicados do mapa operacional');
assert.match(main,/v1051-publication-overview/,'aba Anúncios deve mostrar o estado real dos perfis');
assert.doesNotMatch(main,/!f\.ads\.length&&<Empty text="Nenhum anúncio criado\."/,'ficha não deve declarar ausência de anúncio ignorando perfis publicados');
assert.match(main,/idleDays=operationalIdleDays\(item,new Date\(\),orderActivityDates\)/,'Parado há deve usar atividade operacional real');
assert.match(main,/v1051-workflow-parts/,'Peças e cotações devem usar o layout compacto novo');

assert.match(css,/sale-data-grid[\s\S]*grid-template-columns:repeat\(12,minmax\(0,1fr\)\)/,'Venda desktop deve usar grade compacta');
assert.match(css,/sale-summary-four>div\{[\s\S]*min-height:46px/,'resumo da venda não deve usar cards altos');
assert.match(css,/@media\(max-width:720px\)[\s\S]*sale-data-grid[\s\S]*repeat\(2,minmax\(0,1fr\)\)/,'Venda mobile deve continuar compacta em duas colunas');

const phone={date:'2026-08-01',lastActivityAt:'2026-08-16T10:00:00Z',timeline:[{date:'2026-08-02T12:00:00Z',message:'Cadastro atualizado'},{date:'2026-08-10T12:00:00Z',message:'Status alterado para Pronto'}],parts:[],ads:[],marketplaceProfiles:{}};
assert.equal(String(lastOperationalActivityDate(phone)).slice(0,10),'2026-08-10','Cadastro atualizado não deve zerar o tempo parado');
assert.equal(operationalIdleDays(phone,new Date('2026-08-16T12:00:00')) ,6,'Parado há deve contar dias de calendário desde a última operação');

const actionPhone={id:'p1',brand:'Samsung',model:'S23',date:'2026-08-15',status:'Pronto',expected:2000,mediaLibrary:[],timeline:[],marketplaceProfiles:{}};
const actions=smartActionQueue([actionPhone],[],[],new Date('2026-08-16T12:00:00'));
const photo=actions.find(x=>x.type==='photos');
assert.ok(photo,'fila inteligente deve solicitar fotos');
assert.match(photo.detail,/0\/10 foto\(s\)/,'fila inteligente deve usar meta padrão de 10 fotos');

console.log('phone-sale-detail-v1051.test: OK');
