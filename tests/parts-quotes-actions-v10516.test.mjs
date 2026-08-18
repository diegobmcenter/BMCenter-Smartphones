import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/v1064.css',import.meta.url),'utf8');

test('cotações oferecem editar e desfazer no cartão recolhido e individualmente',()=>{
  assert.match(main,/function editQuote\(row,quote\)/,'deve existir edição real da cotação existente');
  assert.match(main,/function undoQuoteStage\(row,quote=null\)/,'deve existir desfazer da etapa de cotação');
  assert.match(main,/parts-v10516-edit-summary[^>]*[\s\S]*?Editar[\s\S]*?parts-v10514-undo-summary[^>]*[\s\S]*?Desfazer/,'cartão de cotação recolhido deve mostrar Editar e Desfazer');
  assert.match(main,/parts-v10516-quote-line-actions[\s\S]*?editQuote\(row,q\)[\s\S]*?Editar[\s\S]*?undoQuoteStage\(row,q\)[\s\S]*?Desfazer/,'cada cotação deve permitir editar e desfazer individualmente');
  assert.match(main,/quotes:remaining,selectedQuoteId,status:'Cotando'/,'desfazer precisa remover a cotação e limpar seleção quando necessário');
  assert.match(main,/A peça voltou para Em aberto/,'feedback deve explicar retorno para Em aberto quando a última cotação for desfeita');
  assert.match(main,/editingQuoteId:quote\.id/,'edição deve identificar a cotação exata em vez de criar outra');
  assert.match(css,/parts-v10516-edit-summary/,'ações novas precisam de regra compacta própria');
});
