import assert from 'node:assert/strict';
import fs from 'node:fs';
import {backupFingerprint,automaticBackupBucket,shouldRefreshAutomaticBackup,auditBackupObject,BACKUP_RUNTIME_KEY,decodeStorageRaw,encodeStorageValue} from '../src/backupAudit.js';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const cloud=fs.readFileSync(new URL('../src/cloud.js',import.meta.url),'utf8');

assert.deepEqual(decodeStorageRaw('dark'),{value:'dark',encoding:'raw'});
assert.deepEqual(decodeStorageRaw('\"dark\"'),{value:'dark',encoding:'json'});
assert.deepEqual(decodeStorageRaw('{\"a\":1}'),{value:{a:1},encoding:'json'});
assert.equal(encodeStorageValue('dark','raw'),'dark');
assert.equal(encodeStorageValue('dark','json'),'\"dark\"');
assert.equal(encodeStorageValue({a:1},'json'),'{\"a\":1}');

const sample={format:'bmcenter-complete-backup',formatVersion:7,storage:{'bmcenter-smartphones':[{'id':'1'}],'bmcenter-system-config':{themeMode:'dark'},'bmcenter-future-module':{hello:'world'},'bmcenter-last-theme':'dark'},sessionStorage:{'bmcenter-current-page':'phones','bmcenter-device-bulk-parts-order-draft-v1':{supplier:'TEC'}},storageEncoding:{'bmcenter-smartphones':'json','bmcenter-system-config':'json','bmcenter-future-module':'json','bmcenter-last-theme':'raw'},sessionStorageEncoding:{'bmcenter-current-page':'raw','bmcenter-device-bulk-parts-order-draft-v1':'json'}};
const fp1=backupFingerprint(sample),fp2=backupFingerprint({...sample,storage:{'bmcenter-last-theme':'dark','bmcenter-future-module':{hello:'world'},'bmcenter-system-config':{themeMode:'dark'},'bmcenter-smartphones':[{'id':'1'}]}});
assert.equal(fp1,fp2,'fingerprint precisa ser estável independentemente da ordem das chaves');
assert.notEqual(fp1,backupFingerprint({...sample,storage:{...sample.storage,'bmcenter-smartphones':[{'id':'2'}]}}),'fingerprint precisa mudar quando os dados mudam');
assert.notEqual(fp1,backupFingerprint({...sample,storageEncoding:{...sample.storageEncoding,'bmcenter-last-theme':'json'}}),'fingerprint precisa proteger também a forma de serialização');
assert.match(automaticBackupBucket(new Date('2026-08-15T12:00:00')),/^2026-08-15$/);
assert.equal(shouldRefreshAutomaticBackup({}, {fingerprint:'a',bucket:'2026-08-15',now:1000}),true);
assert.equal(shouldRefreshAutomaticBackup({bucket:'2026-08-15',fingerprint:'a',lastSuccessAt:1},{fingerprint:'a',bucket:'2026-08-15',now:999999999}),false,'não criar duplicata se nada mudou');
assert.equal(shouldRefreshAutomaticBackup({bucket:'2026-08-14',fingerprint:'a',lastSuccessAt:1},{fingerprint:'a',bucket:'2026-08-15',now:2}),true,'novo dia precisa de checkpoint');
const declared={...sample,audit:{fingerprint:fp1,capturedKeys:Object.keys(sample.storage),capturedSessionKeys:Object.keys(sample.sessionStorage)}};
assert.equal(auditBackupObject(declared,{requiredKeys:['bmcenter-smartphones','bmcenter-system-config']}).ok,true);
const tampered={...declared,storage:{...declared.storage,'bmcenter-future-module':{hello:'ALTERADO'}}};
assert.equal(auditBackupObject(tampered,{requiredKeys:['bmcenter-smartphones']}).ok,false,'backup alterado depois de gerado precisa ser rejeitado');
assert.equal(auditBackupObject(sample,{requiredKeys:['bmcenter-smartphones','bmcenter-suppliers']}).ok,false);
assert.equal(BACKUP_RUNTIME_KEY,'bmcenter-backup-runtime-v1');

assert.match(main,/APP_VERSION='10\.5\.1'/);
assert.match(main,/const BACKUP_FORMAT_VERSION=7/,'formato v7 deve preservar serialização exata');
assert.match(main,/function backupEligibleKey\(key\)[\s\S]*key\.startsWith\('bmcenter-'\)/,'novos módulos bmcenter-* devem entrar automaticamente no backup');
assert.match(main,/decodeStorageRaw\(raw\)/,'backup precisa distinguir valores raw de JSON');
assert.match(main,/sessionStorageData\[key\]=decoded\.value;sessionStorageEncoding\[key\]=decoded\.encoding/,'backup precisa preservar serialização de sessão');
assert.match(main,/legacyRawKeys=new Set\(\['bmcenter-last-theme','bmcenter-last-version'\]\)/,'backups antigos devem restaurar preferências raw conhecidas corretamente');
assert.match(main,/session:\$\{key\}/,'restauração deve verificar também sessionStorage');
assert.match(main,/financialReturns:/,'auditoria deve contabilizar devoluções financeiras recentes');
assert.match(main,/devoluções e reembolsos financeiros/,'tela de backup deve declarar cobertura dos recursos recentes');
assert.match(main,/runAutomaticCloudBackup\(\{reason:'agendador global'\}\)/,'backup automático deve rodar globalmente sem abrir a página Backup');
assert.match(main,/createSafetyCloudBackup\('antes de restaurar arquivo local'\)/,'restauração de arquivo deve criar backup de segurança antes');
assert.match(main,/createSafetyCloudBackup\('antes de restaurar backup da nuvem'\)/,'restauração da nuvem deve criar backup de segurança antes');
assert.match(main,/createSafetyCloudBackup\('antes de limpar o sistema'\)/,'limpeza destrutiva deve criar backup de segurança antes');
assert.match(main,/preserveLocalSnapshots=normalized\?\.backupScope\?\.localSnapshotsExcluded===true/,'restaurar automático não pode apagar snapshots locais omitidos');
assert.match(main,/function sanitizePhoneForLeanMode\(phone\)[\s\S]*\.\.\.clean/,'sanitização deve preservar campos futuros desconhecidos do aparelho');

assert.match(cloud,/state_key=not\.like\.\$\{encodeURIComponent\(BACKUP_PREFIX\+'\*'\)\}/,'limpeza do sistema deve preservar linhas de backup');
assert.match(cloud,/const existing=await rest\(`app_state\?select=state_key/,'reset deve inventariar chaves futuras antes de apagar');
assert.match(cloud,/kind==='automatic'&&bucket/,'backup automático deve usar chave determinística por período');
assert.match(cloud,/const verify=await rest/,'backup na nuvem deve ser relido após gravação');
assert.match(cloud,/storedAudit=auditBackupObject\(stored/,'registro relido da nuvem precisa ter fingerprint recalculado');
assert.match(cloud,/Backup da nuvem corrompido ou divergente/,'restauração da nuvem precisa rejeitar conteúdo corrompido');
assert.match(cloud,/divergência de integridade/,'verificação deve falhar em divergência de fingerprint');
console.log('backup-audit.test: OK');
