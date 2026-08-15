import assert from 'node:assert/strict';
import fs from 'node:fs';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const cloud=fs.readFileSync(new URL('../src/cloud.js',import.meta.url),'utf8');

assert.match(cloud,/export const CLOUD_REMOTE_EVENT='bmcenter:remote-state'/,'cloud precisa emitir eventos de alteração remota');
assert.match(cloud,/emitRemoteState\(row\.state_key,row\.state_value/,'alterações remotas normais devem ser publicadas no barramento local');

const cloudGate=main.slice(main.indexOf('function CloudGate(){'),main.indexOf('function CloudLoading'));
assert.doesNotMatch(cloudGate,/reloadPreservingContext\(\)/,'alteração remota normal não pode recarregar a aplicação');
assert.match(cloudGate,/key==='__BM_RESET__'.*location\.reload/s,'somente reset total pode recarregar a aplicação');

assert.match(main,/useRemoteStorageBridge\(SKEY,setItems/,'Smartphones deve atualizar dados remotos sem remontar a tela');
assert.match(main,/useRemoteStorageBridge\(SKEY,setPhones/,'páginas com estado de aparelhos devem possuir ponte de sincronização');
assert.match(main,/BULK_PARTS_DEVICE_DRAFT_KEY='bmcenter-device-bulk-parts-order-draft-v1'/,'pedido em massa precisa de rascunho local do dispositivo');
assert.match(main,/saveDeviceSessionDraft\(BULK_PARTS_DEVICE_DRAFT_KEY/,'rascunho do pedido em massa deve ser salvo enquanto o modal está aberto');
assert.match(main,/clearDeviceSessionDraft\(BULK_PARTS_DEVICE_DRAFT_KEY\)/,'rascunho deve ser limpo ao concluir ou descartar');
assert.match(main,/initialBulkSession\?\.open===true/,'rascunho deve restaurar o modal após refresh acidental');

console.log('concurrent-sync.test: OK');
