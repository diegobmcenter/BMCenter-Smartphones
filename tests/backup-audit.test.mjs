import assert from 'node:assert/strict';
import fs from 'node:fs';
import {backupFingerprint,automaticBackupBucket,shouldRefreshAutomaticBackup,auditBackupObject,BACKUP_RUNTIME_KEY} from '../src/backupAudit.js';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const cloud=fs.readFileSync(new URL('../src/cloud.js',import.meta.url),'utf8');

const sample={format:'bmcenter-complete-backup',storage:{'bmcenter-smartphones':[{'id':'1'}],'bmcenter-system-config':{themeMode:'dark'}},sessionStorage:{'bmcenter-current-page':'phones'}};
const fp1=backupFingerprint(sample),fp2=backupFingerprint({sessionStorage:{'bmcenter-current-page':'phones'},storage:{'bmcenter-system-config':{themeMode:'dark'},'bmcenter-smartphones':[{'id':'1'}]}});
assert.equal(fp1,fp2,'fingerprint precisa ser estável independentemente da ordem das chaves');
assert.notEqual(fp1,backupFingerprint({...sample,storage:{...sample.storage,'bmcenter-smartphones':[{'id':'2'}]}}),'fingerprint precisa mudar quando os dados mudam');
assert.match(automaticBackupBucket(new Date('2026-08-15T12:00:00')),/^2026-08-15$/);
assert.equal(shouldRefreshAutomaticBackup({}, {fingerprint:'a',bucket:'2026-08-15',now:1000}),true);
assert.equal(shouldRefreshAutomaticBackup({bucket:'2026-08-15',fingerprint:'a',lastSuccessAt:1},{fingerprint:'a',bucket:'2026-08-15',now:999999999}),false,'não criar duplicata se nada mudou');
assert.equal(shouldRefreshAutomaticBackup({bucket:'2026-08-14',fingerprint:'a',lastSuccessAt:1},{fingerprint:'a',bucket:'2026-08-15',now:2}),true,'novo dia precisa de checkpoint');
assert.equal(auditBackupObject(sample,{requiredKeys:['bmcenter-smartphones','bmcenter-system-config']}).ok,true);
assert.equal(auditBackupObject(sample,{requiredKeys:['bmcenter-smartphones','bmcenter-suppliers']}).ok,false);
assert.equal(BACKUP_RUNTIME_KEY,'bmcenter-backup-runtime-v1');

assert.match(main,/APP_VERSION='10\.4\.82'/);
assert.match(main,/function backupEligibleKey\(key\)[\s\S]*key\.startsWith\('bmcenter-'\)/,'novos módulos bmcenter-* devem entrar automaticamente no backup');
assert.match(main,/BACKUP_RUNTIME_KEY/,'metadados operacionais do backup devem ficar fora do próprio backup');
assert.match(main,/materializeBackupSchema\(storage\)/,'schema essencial precisa ser materializado antes de gerar backup');
assert.match(main,/auditBackupObject\(preliminary,\{requiredKeys:BACKUP_REQUIRED_KEYS\}\)/,'backup manual deve passar por auditoria de integridade');
assert.match(main,/runAutomaticCloudBackup\(\{reason:'agendador global'\}\)/,'backup automático deve rodar globalmente sem abrir a página Backup');
assert.match(main,/excludeKeys:\[SNAPKEY\]/,'backup automático deve evitar duplicar pontos de restauração dentro do próprio cofre');
assert.match(main,/createSafetyCloudBackup\('antes de restaurar arquivo local'\)/,'restauração de arquivo deve criar backup de segurança antes');
assert.match(main,/createSafetyCloudBackup\('antes de restaurar backup da nuvem'\)/,'restauração da nuvem deve criar backup de segurança antes');
assert.match(main,/createSafetyCloudBackup\('antes de limpar o sistema'\)/,'limpeza destrutiva deve criar backup de segurança antes');
assert.match(main,/preserveLocalSnapshots=normalized\?\.backupScope\?\.localSnapshotsExcluded===true/,'restaurar backup automático não pode apagar pontos de restauração locais omitidos de propósito');
assert.doesNotMatch(main,/Auto snapshot ignorado[\s\S]{0,160}localStorage\.removeItem\(SNAPKEY\)/,'falha no auto snapshot não pode apagar pontos antigos');
assert.match(main,/queueCloudSave\(FONT_SCALE_KEY,next\)/,'personalização de escala de fonte deve sincronizar e entrar no backup');
assert.doesNotMatch(main,/incluindo a biblioteca de fotos deste navegador/,'texto antigo de Photo Studio removido não pode permanecer');

assert.match(cloud,/state_key=not\.like\.\$\{encodeURIComponent\(BACKUP_PREFIX\+'\*'\)\}/,'limpeza do sistema deve preservar linhas de backup');
assert.match(cloud,/const existing=await rest\(`app_state\?select=state_key/,'reset deve inventariar chaves futuras antes de apagar');
assert.match(cloud,/kind==='automatic'&&bucket/,'backup automático deve usar chave determinística por período');
assert.match(cloud,/const verify=await rest/,'backup na nuvem deve ser relido após gravação');
assert.match(cloud,/divergência de integridade/,'verificação deve falhar em divergência de fingerprint');

console.log('backup-audit.test: OK');
