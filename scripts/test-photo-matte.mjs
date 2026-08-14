import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';

const source=await readFile(new URL('../src/localPhotoAI.js',import.meta.url),'utf8');
assert.match(source,/modelFull\.width=targetW;modelFull\.height=targetH/,'A máscara neural não está sendo reconstruída na resolução original.');
assert.match(source,/Math\.min\(gate,Math\.max\(modelAlpha,protectedAlpha\)\)/,'A máscara suave deixou de combinar celular e mão protegida.');
assert.doesNotMatch(source,/fillInteriorHoles\(binary,w,h\);/,'A máscara final voltou a fechar todos os espaços internos.');
assert.doesNotMatch(source,/binary=dilateBinary\(binary,w,h,2\)/,'A máscara final voltou a puxar pixels para fora do aparelho.');

const realScenes=['real-bright-office.jpg','real-soft-living.jpg','real-minimal-office.jpg','real-warm-office.jpg'];
for(const name of realScenes){
 const url=new URL(`../public/photo-scenes/${name}`,import.meta.url);
 const info=await stat(url);assert.ok(info.size>100000,`${name} está ausente ou incompleta.`);
 const bytes=await readFile(url);assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8,`${name} não é um JPEG válido.`);
}
console.log('OK: matte em resolução original, vazios reais preservados e 4 cenários fotográficos validados.');
