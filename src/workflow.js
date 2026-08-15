/**
 * Retorna uma única etapa operacional para o aparelho usando SEMPRE o status atual.
 * Nenhum aparelho pode aparecer em mais de uma etapa da tela Hoje.
 */
export function workflowStageForPhone(phone,{hasAds=false}={}){
  const status=String(phone?.status||'').trim();
  if(status==='Aguardando análise')return'analyze';
  if(status==='Aguardando peças')return'parts';
  if(status==='Em reparo'||status==='Em testes')return'repair';
  if(status==='Pronto'||status==='Para fotografar'||status==='Anúncio preparado')return hasAds?'':'ready';

  // Para status não operacionais, uma peça pendente ainda pode exigir ação de compra,
  // mas nunca sobrepõe um status explícito de Pronto/Reparo definido acima.
  const hasPendingParts=(phone?.parts||[]).some(part=>
    ['Cotando','Comprar','Comprada'].includes(String(part?.status||''))&&
    !['Pedido entregue','Instalada'].includes(String(part?.orderStatus||''))
  );
  return hasPendingParts?'parts':'';
}
