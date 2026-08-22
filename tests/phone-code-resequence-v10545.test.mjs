import assert from 'node:assert/strict';
import {nextPhoneCode,resequencePhoneCodes,phoneCreationTimestamp} from '../src/phoneCodes.js';

const stamp='2026-08-22T12:00:00.000Z';
const source=[
 {id:'a',code:'BM-000848',date:'2026-08-01',timeline:[{date:'2026-08-01T10:00:00Z',message:'Aparelho cadastrado'}]},
 {id:'b',code:'BM-000850',date:'2026-08-03',timeline:[{date:'2026-08-03T10:00:00Z',message:'Aparelho cadastrado'}]},
 {id:'c',code:'BM-000849',date:'2026-08-02',timeline:[{date:'2026-08-02T10:00:00Z',message:'Aparelho cadastrado'}]}
];
const result=resequencePhoneCodes(source,stamp);
assert.equal(result.changed,true);
assert.equal(result.phones.find(x=>x.id==='a').code,'BM-000001');
assert.equal(result.phones.find(x=>x.id==='c').code,'BM-000002');
assert.equal(result.phones.find(x=>x.id==='b').code,'BM-000003');
assert.equal(result.phones.find(x=>x.id==='a').legacyCode,'BM-000848');
assert.equal(result.phones.find(x=>x.id==='b').codeHistory[0].code,'BM-000850');
assert.ok(phoneCreationTimestamp(result.phones[0])>0);
assert.equal(nextPhoneCode(result.phones,3),'BM-000004');
assert.equal(nextPhoneCode(result.phones.filter(x=>x.code!=='BM-000003'),3),'BM-000004','contador persistente não pode reutilizar código apagado');
console.log('phone-code-resequence-v10545.test: OK');
