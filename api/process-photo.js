function stripJpegMetadataBase64(base64){
  try{
    const input=Buffer.from(base64,'base64');
    if(input.length<4||input[0]!==0xFF||input[1]!==0xD8)return base64;
    const chunks=[input.subarray(0,2)];let pos=2;
    while(pos<input.length){
      if(input[pos]!==0xFF){chunks.push(input.subarray(pos));break}
      const marker=input[pos+1];
      if(marker===0xDA){chunks.push(input.subarray(pos));break}
      if(marker===0xD9){chunks.push(input.subarray(pos,pos+2));break}
      if(marker===0x00||marker===0xD8||(marker>=0xD0&&marker<=0xD7)){chunks.push(input.subarray(pos,pos+2));pos+=2;continue}
      if(pos+4>input.length)break;
      const length=input.readUInt16BE(pos+2);if(length<2||pos+2+length>input.length)break;
      const isMetadata=(marker>=0xE1&&marker<=0xEF)||marker===0xFE;
      if(!isMetadata)chunks.push(input.subarray(pos,pos+2+length));
      pos+=2+length;
    }
    return Buffer.concat(chunks).toString('base64');
  }catch{return base64}
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido'});
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey)return res.status(503).json({error:'OPENAI_API_KEY não configurada no servidor'});
  try{
    const {imageData='',referenceData='',scenePrompt='',phoneInfo={},intensity='Natural',keepScale=true}=req.body||{};
    if(!String(imageData).startsWith('data:image/'))return res.status(400).json({error:'Imagem original inválida'});
    const product=[phoneInfo.brand,phoneInfo.model,phoneInfo.color].filter(Boolean).join(' ')||'smartphone usado';
    const prompt=`Use a ferramenta de edição de imagem. A PRIMEIRA imagem é a fotografia original do aparelho real que será vendido. ${referenceData?'A SEGUNDA imagem é uma referência visual do cenário já aprovado para as outras fotos deste mesmo aparelho. Reproduza o mesmo ambiente, materiais, paleta, iluminação e linguagem visual da referência, adaptando apenas perspectiva e enquadramento à nova foto.':'Crie um novo cenário fotográfico profissional para este aparelho e use-o como identidade visual deste conjunto.'}\n\nAPARELHO: ${product}.\nCENÁRIO: ${scenePrompt}.\nINTENSIDADE: ${intensity}.\n\nREGRAS OBRIGATÓRIAS:\n- Preserve o aparelho da primeira imagem com fidelidade máxima. Não redesenhe, não troque modelo, cor, câmeras, botões, conectores, riscos, marcas de uso, tela, películas ou detalhes físicos.\n- Altere somente o ambiente/fundo e a integração de luz/sombra necessária para parecer uma fotografia real.\n- ${keepScale?'Mantenha escala, proporções, perspectiva e enquadramento realistas do aparelho.':'Mantenha proporções realistas do aparelho.'}\n- Crie sombra de contato natural; nunca faça o telefone flutuar.\n- Não adicione textos, logotipos, mãos, outros celulares, caixas ou acessórios que não existam na foto original.\n- Não esconda defeitos nem melhore artificialmente o estado do aparelho.\n- Resultado comercial sofisticado, natural e apropriado para anúncio de smartphone seminovo.\n- Entregue somente a imagem editada.`;
    const content=[{type:'input_text',text:prompt},{type:'input_image',image_url:imageData,detail:'high'}];
    if(referenceData&&String(referenceData).startsWith('data:image/'))content.push({type:'input_image',image_url:referenceData,detail:'high'});
    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'gpt-5-mini',
        input:[{role:'user',content}],
        tools:[{type:'image_generation',action:'edit',model:'gpt-image-1',input_fidelity:'high',quality:'high',size:'1024x1024',output_format:'jpeg',output_compression:92}],
        tool_choice:'required'
      })
    });
    const data=await response.json();
    if(!response.ok)throw new Error(data?.error?.message||'Falha no processamento da imagem');
    const call=(data?.output||[]).find(item=>item?.type==='image_generation_call'&&item?.result);
    if(!call?.result)throw new Error('A IA não retornou a imagem processada.');
    const cleanResult=stripJpegMetadataBase64(call.result);
    return res.status(200).json({dataUrl:`data:image/jpeg;base64,${cleanResult}`,model:'gpt-image-1',metadataSanitized:true});
  }catch(error){
    return res.status(500).json({error:error?.message||'Erro ao preparar a foto'});
  }
}
