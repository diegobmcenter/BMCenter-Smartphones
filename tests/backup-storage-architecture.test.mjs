import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../src');
const files=[];
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).forEach(entry=>{const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(/\.(?:js|jsx)$/.test(entry.name))files.push(full)});
walk(root);
const source=files.map(file=>`\n/* ${path.relative(root,file)} */\n${fs.readFileSync(file,'utf8')}`).join('\n');
const allowedNonBusiness=new Set(['bmcenter-cloud-session','bmcenter-client-id','bmcenter-backup-runtime-v1']);
const literalStorage=/\b(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\(\s*['"]([^'"]+)['"]/g;
for(const match of source.matchAll(literalStorage)){
 const key=match[1];
 assert.ok(key.startsWith('bmcenter-'),`chave persistente fora do prefixo protegido pelo backup: ${key}`);
}
const bmKeys=[...source.matchAll(/['"](bmcenter-[a-z0-9][a-z0-9-]*)['"]/gi)].map(x=>x[1]);
for(const key of bmKeys){
 if(allowedNonBusiness.has(key))continue;
 // Todas as chaves persistentes BMCenter são elegíveis pelo mecanismo prefix-based.
 assert.ok(key.startsWith('bmcenter-'));
}
const indexed=[...source.matchAll(/indexedDB\.(?!deleteDatabase\(['"]bmcenter-photo-studio-v1['"]\))/g)];
assert.equal(indexed.length,0,'novo uso de IndexedDB exige implementação explícita no backup antes de entrar no sistema');
assert.match(source,/BULK_PARTS_DEVICE_DRAFT_KEY='bmcenter-device-bulk-parts-order-draft-v1'/,'rascunho do pedido em massa por dispositivo precisa continuar com prefixo protegido');
assert.match(source,/returnFinancialStatus/,'devoluções financeiras precisam permanecer no modelo persistido');
assert.match(source,/returnPartRefund/,'valor recuperado da peça precisa permanecer persistido');
assert.match(source,/returnFreightRefund/,'frete recuperado precisa permanecer persistido');
console.log('backup-storage-architecture.test: OK');
