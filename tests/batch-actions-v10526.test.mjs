import assert from 'node:assert/strict';
import fs from 'node:fs';
import {syncPhonePublicationStatus} from '../src/publicationStatus.js';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const view=fs.readFileSync(new URL('../src/v102/pages/BatchV102.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1073.css',import.meta.url),'utf8');

assert.match(main,/import'\.\/v1073\.css';/,'v10.5.26 CSS must be imported last');
assert.match(main,/setPublicationProfileId/,'batch page must manage publication profile');
assert.match(main,/setPublicationMode/,'batch page must manage publication action');
assert.match(main,/setRemoveTagValue/,'batch page must expose tag removal');
assert.match(main,/setReviewOpen\(true\)/,'batch page must require a review step');
assert.match(main,/setLastBatchAction\(\{stamp,before,ids:changedIds/,'batch page must snapshot the last action for undo');
assert.match(main,/phone\.lastActivityAt!==lastBatchAction\.stamp/,'undo must avoid overwriting phones changed after the batch action');
assert.match(main,/statuses\.filter\(status=>!\['Vendido','Descarte\/Sucata'\]\.includes\(status\)\)/,'sold and scrap statuses must not be batch targets');
assert.match(main,/if\(newStatus&&!protectedPhone/,'closed phones must be protected from batch status changes');
assert.match(main,/if\(publicationMode&&batchProfile&&!protectedPhone\)/,'closed phones must be protected from batch publication changes');
assert.match(main,/syncPhonePublicationStatus/,'publication batch changes must reuse the existing status synchronization rule');

assert.match(view,/Publicação por perfil/,'UI must show publication by profile');
assert.match(view,/Marcar como publicado/,'UI must expose publish action');
assert.match(view,/Remover publicação/,'UI must expose publication removal');
assert.match(view,/Adicionar etiqueta/,'UI must expose tag addition');
assert.match(view,/Não remover/,'UI must expose tag removal');
assert.match(view,/REVISÃO OBRIGATÓRIA/,'UI must show mandatory review dialog');
assert.match(view,/Desfazer alteração/,'UI must expose undo');
assert.match(view,/Venda e descarte continuam fora da edição em lote/,'UI must explain protected statuses');

assert.match(css,/\.v10526-batch-ops\{[\s\S]*grid-template-columns/,'desktop batch operations must use a compact grid');
assert.match(css,/@media\(max-width:720px\)[\s\S]*\.v10526-batch-ops\{grid-template-columns:1fr!important\}/,'mobile batch operations must stack safely');
assert.match(css,/\.v102-app\.theme-dark \.v10526-batch-command/,'dark theme must be explicitly covered');
assert.match(css,/\.v102-app\.theme-dark \.v10526-batch-page \.v102-batch-toolbar select/,'dark theme must explicitly cover the batch status filter');
assert.match(css,/\.v102-app\.theme-dark \.v10526-batch-command button:not\(\.primary\)/,'dark theme must explicitly cover secondary batch buttons');
assert.doesNotMatch(css,/var\(--card/,'must not use undefined --card design token');
assert.doesNotMatch(css,/var\(--border/,'must not use undefined --border design token');

const published=syncPhonePublicationStatus({status:'Pronto'},{paty:{active:true}});
assert.equal(published.status,'Anunciado','first active publication should synchronize status to Anunciado');
const removed=syncPhonePublicationStatus({status:'Anunciado'},{paty:{active:false}},{returnToReadyWhenEmpty:true});
assert.equal(removed.status,'Pronto','last publication removal should return Anunciado to Pronto');
const sold=syncPhonePublicationStatus({status:'Vendido',sale:{soldAt:'2026-08-20'}},{paty:{active:true}});
assert.equal(sold.status,'Vendido','sold phones must remain protected');

console.log('batch-actions-v10526.test: OK');
