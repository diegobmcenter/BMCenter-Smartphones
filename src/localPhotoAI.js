function imageFromDataUrl(source){
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>resolve(img);
  img.onerror=()=>reject(new Error('Não foi possível abrir a foto original.'));
  img.src=source;
 });
}

function hashText(text){
 let h=2166136261;
 for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return Math.abs(h>>>0);
}

const PALETTES=[
 ['#f7f7f5','#e6e2dc','#c9c1b6'],['#f4f6f8','#dde4ea','#b8c5d1'],
 ['#faf7f2','#eadfce','#c9b18e'],['#eef2f1','#d4dfdc','#abc1bb'],
 ['#17191d','#2a2f36','#777f89'],['#111827','#273449','#60738e'],
 ['#181512','#342c25','#9b8062'],['#202124','#383b40','#858b94'],
 ['#f3efe8','#d9c8b4','#b18e68'],['#f6f2ed','#dfd4c7','#c3aa8d'],
 ['#eef1f5','#d5dce7','#9eacc0'],['#f2f0ec','#d8d4cc','#b6aea0']
];

function roundedRect(ctx,x,y,w,h,r){
 const rr=Math.min(r,w/2,h/2);
 ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);
 ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
}

function drawThemeCanvas(ctx,w,h,scene){
 const seed=hashText(`${scene?.id||''}:${scene?.signature||''}`);
 const p=PALETTES[seed%PALETTES.length];
 const grad=ctx.createLinearGradient(0,0,w,h);
 grad.addColorStop(0,p[0]);grad.addColorStop(.62,p[1]);grad.addColorStop(1,p[2]);
 ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);

 // luz decorativa fora da fotografia, sem alterar o produto
 const gx=(seed%2?.18:.82)*w,gy=.15*h;
 const glow=ctx.createRadialGradient(gx,gy,0,gx,gy,.55*Math.max(w,h));
 glow.addColorStop(0,'rgba(255,255,255,.42)');glow.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);

 // textura procedural muito discreta: não usa arquivo externo e não custa nada
 ctx.globalAlpha=.06;
 for(let i=0;i<18;i++){
  const y=(i/18)*h;
  ctx.fillStyle=i%2?'#fff':'#000';
  ctx.fillRect(0,y,w,Math.max(1,h*.0012));
 }
 ctx.globalAlpha=1;
}

function applyGentleFinish(ctx,w,h,scene,intensity){
 const seed=hashText(scene?.id||scene?.style||'');
 // acabamento extremamente leve, aplicado sobre a foto inteira; não recorta pixels do aparelho
 if(seed%4===0){
  const g=ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'rgba(255,244,226,.035)');g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 }else if(seed%4===1){
  ctx.fillStyle='rgba(226,238,255,.025)';ctx.fillRect(0,0,w,h);
 }
 const vignette=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.30,w/2,h/2,Math.max(w,h)*.72);
 vignette.addColorStop(0,'rgba(0,0,0,0)');
 vignette.addColorStop(1,intensity==='Destaque'?'rgba(0,0,0,.055)':'rgba(0,0,0,.025)');
 ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
}

export async function preparePhotoLocally(imageData,{scene={},intensity='Natural',keepScale=true,onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');
 onProgress?.('Aplicando tema local...');
 const image=await imageFromDataUrl(imageData);
 const ow=image.naturalWidth||image.width,oh=image.naturalHeight||image.height;

 // Até 3200 px e JPEG 0.98: prioriza qualidade para publicação.
 const maxSide=3200,scale=Math.min(1,maxSide/Math.max(ow,oh));
 const photoW=Math.max(1,Math.round(ow*scale)),photoH=Math.max(1,Math.round(oh*scale));

 // Moldura/cenário fica FORA da fotografia. Nenhum recorte/segmentação do aparelho.
 const border=Math.max(18,Math.round(Math.min(photoW,photoH)*.028));
 const w=photoW+border*2,h=photoH+border*2;
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx)throw new Error('Seu navegador não conseguiu preparar a imagem.');

 drawThemeCanvas(ctx,w,h,scene);

 ctx.save();
 ctx.shadowColor='rgba(0,0,0,.18)';
 ctx.shadowBlur=Math.max(8,Math.round(border*.55));
 ctx.shadowOffsetY=Math.max(3,Math.round(border*.18));
 roundedRect(ctx,border,border,photoW,photoH,Math.max(8,Math.round(border*.28)));
 ctx.clip();
 ctx.drawImage(image,border,border,photoW,photoH);
 applyGentleFinish(ctx,w,h,scene,intensity);
 ctx.restore();

 onProgress?.('Finalizando em alta qualidade...');
 return canvas.toDataURL('image/jpeg',.98);
}
