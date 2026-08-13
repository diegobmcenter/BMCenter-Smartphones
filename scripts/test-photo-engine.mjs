import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,stat} from 'node:fs/promises';

const modelUrl=new URL('../public/models/silueta.onnx',import.meta.url);
const expectedSize=44173029;
const expectedSha256='75da6c8d2f8096ec743d071951be73b4a8bc7b3e51d9a6625d63644f90ffeedb';
const info=await stat(modelUrl);
assert.equal(info.size,expectedSize,'O modelo Silueta está incompleto.');
const contents=await readFile(modelUrl);
const sha256=createHash('sha256').update(contents).digest('hex');
assert.equal(sha256,expectedSha256,'O modelo Silueta foi alterado ou corrompido.');
console.log(`OK: motor local Silueta validado (${info.size} bytes; SHA-256 ${sha256}).`);
