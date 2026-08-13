function dataUrlToBlob(dataUrl){
 const [head,data]=String(dataUrl||'').split(',');
 const mime=(head.match(/data:([^;]+)/)||[])[1]||'image/jpeg';
 const bin=atob(data||'');
 const bytes=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
 return new Blob([bytes],{type:mime});
}

function blobToImage(blob){
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(blob),img=new Image();
  img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
  img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível abrir a imagem processada.'))};
  img.src=url;
 });
}

function paletteForScene(scene){
 const style=String(scene?.style||'Automático').toLowerCase();
 const signature=Number(scene?.signature||1);
 const variants={
  claro:[['#f6f7f9','#dde3e9','#c7d1dc'],['#f8f5ef','#e8e0d5','#d1c2b2'],['#f5f7f6','#dfe8e3','#c7d8d0']],
  escuro:[['#131820','#252d38','#3a4654'],['#171717','#292929','#44403c'],['#111827','#273449','#46576f']],
  premium:[['#111318','#272b31','#b39870'],['#171513','#332c26','#c2a77e'],['#101419','#27323b','#728c9e']],
  residencial:[['#eee7df','#d7c8b8','#af9b86'],['#ece9e4','#d7d2c8','#b8aa97'],['#f2eee8','#ddd3c7','#baa992']],
  minimalista:[['#f4f4f2','#deded9','#bfc1bc'],['#f3f5f5','#dce1e1','#b9c5c5'],['#f5f3f1','#ded8d3','#c2b6ac']],
  automático:[['#f4f5f6','#dce1e6','#bcc7d1'],['#f3efe9','#ded4c8','#bcae9d'],['#eef2f1','#d5dfdc','#b6c9c3']]
 };
 const list=variants[style]||variants['automático'];
 return list[signature%list.length];
}

function drawBackground(ctx,w,h,scene,intensity){
 const [top,bottom,accent]=paletteForScene(scene);
 const vertical=ctx.createLinearGradient(0,0,0,h);
 vertical.addColorStop(0,top);vertical.addColorStop(.68,bottom);vertical.addColorStop(1,accent);
 ctx.fillStyle=vertical;ctx.fillRect(0,0,w,h);

 // Luz difusa de estúdio.
 const signature=Number(scene?.signature||1);
 const lightX=(signature%2?.26:.74)*w,lightY=.18*h;
 const glow=ctx.createRadialGradient(lightX,lightY,0,lightX,lightY,.62*Math.max(w,h));
 glow.addColorStop(0,'rgba(255,255,255,.42)');glow.addColorStop(.45,'rgba(255,255,255,.12)');glow.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);

 // Superfície discreta para dar contato físico ao produto.
 const floorY=.78*h;
 const floor=ctx.createLinearGradient(0,floorY,0,h);
 floor.addColorStop(0,'rgba(255,255,255,.04)');floor.addColorStop(1,intensity==='Destaque'?'rgba(0,0,0,.15)':'rgba(0,0,0,.09)');
 ctx.fillStyle=floor;ctx.fillRect(0,floorY,w,h-floorY);
 ctx.fillStyle='rgba(255,255,255,.13)';ctx.fillRect(0,floorY, w, Math.max(1,h*.002));
}

export async function preparePhotoLocally(imageData,{scene={},intensity='Natural',keepScale=true,onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');
 onProgress?.('Carregando IA local...');
 const mod=await import('@imgly/background-removal');
 const removeBackground=mod.removeBackground||mod.default;
 if(typeof removeBackground!=='function')throw new Error('A IA local de recorte não foi carregada corretamente. Atualize a página e tente novamente.');
 const inputBlob=dataUrlToBlob(imageData);
 let cutoutBlob;
 try{
  cutoutBlob=await removeBackground(inputBlob,{
  progress:(key,current,total)=>{
   if(total>0){const pct=Math.min(100,Math.round(current/total*100));onProgress?.(`IA local: ${pct}%`)}
  }
  });
 }catch(error){
  console.error('BMCenter Local Photo AI',error);
  const message=String(error?.message||error||'Erro desconhecido');
  throw new Error(`Falha na IA local: ${message}. Na primeira execução, mantenha internet ativa até o modelo terminar de baixar.`);
 }
 onProgress?.('Montando cenário...');
 const [original,cutout]=await Promise.all([blobToImage(inputBlob),blobToImage(cutoutBlob)]);
 const maxSide=1600,scale=Math.min(1,maxSide/Math.max(original.naturalWidth||original.width,original.naturalHeight||original.height));
 const w=Math.max(1,Math.round((original.naturalWidth||original.width)*scale));
 const h=Math.max(1,Math.round((original.naturalHeight||original.height)*scale));
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx)throw new Error('Seu navegador não conseguiu preparar a imagem localmente.');
 drawBackground(ctx,w,h,scene,intensity);

 // O aparelho é desenhado a partir do recorte da foto original, sem regeneração.
 // Mantemos a mesma escala/enquadramento por padrão.
 const dx=0,dy=0,dw=w,dh=h;
 ctx.save();
 ctx.shadowColor='rgba(0,0,0,.30)';ctx.shadowBlur=Math.max(10,Math.round(w*.018));ctx.shadowOffsetY=Math.max(5,Math.round(h*.012));
 ctx.drawImage(cutout,dx,dy,dw,dh);
 ctx.restore();
 ctx.drawImage(cutout,dx,dy,dw,dh);

 onProgress?.('Finalizando foto...');
 return canvas.toDataURL('image/jpeg',intensity==='Destaque'?.94:.92);
}
