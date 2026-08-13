import {copyFile, mkdir, readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(projectRoot,'node_modules','@mediapipe','tasks-vision','wasm');
const destination=path.join(projectRoot,'public','mediapipe','wasm');

await mkdir(destination,{recursive:true});
const files=(await readdir(source,{withFileTypes:true})).filter(entry=>entry.isFile());
if(!files.length)throw new Error('Os arquivos WASM do MediaPipe não foram encontrados após o npm install.');
await Promise.all(files.map(entry=>copyFile(path.join(source,entry.name),path.join(destination,entry.name))));
console.log(`MediaPipe local: ${files.length} arquivo(s) copiado(s) para public/mediapipe/wasm.`);
