export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido'});
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey)return res.status(503).json({error:'OPENAI_API_KEY não configurada no servidor'});
  try{
    const {phone={},profile='',previous=[]}=req.body||{};
    const previousText=(Array.isArray(previous)?previous:[]).slice(0,8).map((item,index)=>`${index+1}. Título: ${item?.title||''}\nDescrição: ${item?.description||''}`).join('\n\n');
    const input=`Crie um anúncio em português do Brasil para Facebook Marketplace de um smartphone usado/seminovo.

DADOS REAIS DO APARELHO:
${JSON.stringify(phone,null,2)}

PERFIL ONDE SERÁ PUBLICADO:
${profile||'não especificado'}

TEXTOS JÁ USADOS PARA ESTE APARELHO/PERFIL:
${previousText||'nenhum'}

Regras:
- Não invente características, acessórios, garantia, estado ou condições que não estejam nos dados.
- Produza uma variação claramente diferente dos textos anteriores.
- Título curto, natural e útil para Marketplace, sem excesso de símbolos.
- Descrição objetiva e fácil de ler.
- Não diga que a publicação terá mais alcance ou melhor entrega.
- Retorne SOMENTE JSON válido neste formato: {"title":"...","description":"..."}`;
    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:'gpt-5-mini',input})
    });
    const data=await response.json();
    if(!response.ok)throw new Error(data?.error?.message||'Falha ao gerar texto');
    const text=data?.output_text||data?.output?.flatMap(item=>item?.content||[]).find(part=>part?.type==='output_text')?.text||'';
    let parsed;
    try{parsed=JSON.parse(text)}catch{
      const match=String(text).match(/\{[\s\S]*\}/);
      if(match)parsed=JSON.parse(match[0]);
    }
    if(!parsed?.title||!parsed?.description)throw new Error('A IA retornou uma resposta incompleta');
    return res.status(200).json({title:String(parsed.title).trim(),description:String(parsed.description).trim()});
  }catch(error){
    return res.status(500).json({error:error?.message||'Erro ao gerar anúncio'});
  }
}
