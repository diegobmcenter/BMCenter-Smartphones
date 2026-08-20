import assert from 'node:assert/strict';
import fs from 'node:fs';
import{syncPhonePublicationStatus,activePublicationIdsFromMap}from'../src/publicationStatus.js';

const active={perfil1:{active:true,publishedAt:'2026-08-19'}};
const inactive={perfil1:{active:false,publishedAt:'2026-08-19'}};
const mixed={perfil1:{active:false},perfil2:{active:true,publishedAt:'2026-08-19'}};

assert.deepEqual(activePublicationIdsFromMap(active),['perfil1']);
assert.deepEqual(activePublicationIdsFromMap(inactive),[]);

assert.equal(syncPhonePublicationStatus({id:'moto-g8',status:'Pronto'},active).status,'Anunciado','Moto G8 publicado não pode continuar Pronto');
assert.equal(syncPhonePublicationStatus({id:'p2',status:'Para fotografar'},active).status,'Anunciado','publicação ativa deve sincronizar status operacional pronto para anúncio');
assert.equal(syncPhonePublicationStatus({id:'p3',status:'Anúncio preparado'},active).status,'Anunciado');
assert.equal(syncPhonePublicationStatus({id:'p4',status:'Anunciado'},inactive,{returnToReadyWhenEmpty:true}).status,'Pronto','remover o último perfil de um Anunciado deve voltar para Pronto');
assert.equal(syncPhonePublicationStatus({id:'p5',status:'Anunciado'},mixed,{returnToReadyWhenEmpty:true}).status,'Anunciado','remover um perfil não pode voltar para Pronto enquanto outro continuar ativo');
assert.equal(syncPhonePublicationStatus({id:'p6',status:'Reservado'},active).status,'Reservado','publicação não deve sobrescrever Reserva');
assert.equal(syncPhonePublicationStatus({id:'p7',status:'Em reparo'},active).status,'Em reparo','publicação não deve sobrescrever estado operacional de reparo');
assert.equal(syncPhonePublicationStatus({id:'p8',status:'Vendido',sale:{soldAt:'2026-08-19'}},active).status,'Vendido','venda é estado final e não pode ser alterada pela publicação');
assert.equal(syncPhonePublicationStatus({id:'p9',status:'Anunciado'},inactive).status,'Anunciado','normalização global não deve apagar um status Anunciado manual sem um evento explícito de remoção');

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const phones=fs.readFileSync(new URL('../src/v102/pages/SmartphonesV102.jsx',import.meta.url),'utf8');
assert.match(main,/syncPhonePublicationStatus\(base,marketplaceProfiles,\{returnToReadyWhenEmpty:!active\}\)/,'Central de Anúncios precisa sincronizar ativação e remoção de perfil');
assert.match(main,/repairSoldPublicationStates\(before,load\(PKEY\)\)/,'inicialização precisa reparar aparelhos já publicados que permaneceram Pronto');
assert.match(main,/k===SKEY&&Array\.isArray\(v\)\?v\.map\(phone=>syncPhonePublicationStatus/,'gravações globais de smartphones precisam impedir novo Pronto+Publicado');
assert.match(phones,/syncPhonePublicationStatus\(base,marketplaceProfiles,\{returnToReadyWhenEmpty:currentlyActive\}\)/,'Perfis publicados na tela Smartphones precisam sincronizar o status');
assert.match(phones,/syncPhonePublicationStatus\(base,marketplaceProfiles\)/,'ajuste de data de publicação também precisa corrigir status inconsistente');
console.log('publication-status-sync-v10517.test: OK');
