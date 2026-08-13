import assert from 'node:assert/strict';
import {unzipSync} from 'fflate';

let downloadedBlob=null;
let downloadedName='';

URL.createObjectURL=blob=>{
 downloadedBlob=blob;
 return 'blob:photo-download-test';
};
URL.revokeObjectURL=()=>{};
globalThis.setTimeout=callback=>{callback();return 0};
globalThis.document={
 body:{appendChild(){}},
 createElement(){
  return{
   href:'',download:'',style:{},
   click(){downloadedName=this.download},
   remove(){}
  };
 }
};

const {downloadPhotoArchive}=await import('../src/photoStudio.js');
const pixel='data:image/jpeg;base64,/9j/2Q==';
const result=await downloadPhotoArchive([
 {kind:'original',name:'BM-000001-01-ORIGINAL.jpg',dataUrl:pixel},
 {kind:'prepared',name:'BM-000001-01-PREPARADA.jpg',dataUrl:pixel}
],'BM-000001 Motorola G1');

assert.equal(result.name,'BM-000001 Motorola G1.zip');
assert.equal(result.count,2);
assert.equal(downloadedName,result.name);
assert.ok(downloadedBlob instanceof Blob);
assert.equal(downloadedBlob.type,'application/zip');

const archive=unzipSync(new Uint8Array(await downloadedBlob.arrayBuffer()));
const names=Object.keys(archive).sort();
assert.deepEqual(names,[
 'BM-000001 Motorola G1/LEIA-ME.txt',
 'BM-000001 Motorola G1/ORIGINAIS/BM-000001-01-ORIGINAL.jpg',
 'BM-000001 Motorola G1/PREPARADAS/BM-000001-01-PREPARADA.jpg'
]);
assert.deepEqual([...archive[names[1]]],[255,216,255,217]);
assert.deepEqual([...archive[names[2]]],[255,216,255,217]);

console.log(`OK: ${result.name} contém ORIGINAIS e PREPARADAS na subpasta do aparelho.`);
