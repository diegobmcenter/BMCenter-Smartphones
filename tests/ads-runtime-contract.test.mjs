import fs from 'node:fs';
import assert from 'node:assert/strict';
const src=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
assert.doesNotMatch(src,/adContentSpecs\s*\(/,'não pode restar chamada para helper inexistente adContentSpecs');
assert.match(src,/function\s+formatPhoneSpecs\s*\(phone\)/,'helper central formatPhoneSpecs precisa existir');
const adsUses=(src.match(/formatPhoneSpecs\(phone\)/g)||[]).length;
assert.ok(adsUses>=3,`esperado helper + usos em Anúncios, encontrados ${adsUses}`);
assert.match(src,/const APP_VERSION='10\.5\.6'/,'versão 10.4.80 não encontrada');
console.log('ads-runtime-contract.test: OK');
