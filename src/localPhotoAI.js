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
 ['#fbfbfa','#ece7df','#cdbda9'],['#f5f8fb','#dbe5ee','#9eb0c2'],
 ['#fff8ef','#ead7bd','#b89063'],['#eef4f2','#cfe0da','#8fb4a7'],
 ['#15181d','#242b33','#576575'],['#0d1420','#172b43','#3f6a94'],
 ['#17120e','#30251d','#8b684a'],['#1b1b1d','#303136','#777a82'],
 ['#f6efe5','#dbc4a7','#a98158'],['#f7f2ea','#ded0bd','#b79b78'],
 ['#edf2f8','#cbd8e8','#899fbb'],['#f4f1eb','#d7d0c4','#aaa08f']
];

function roundedRect(ctx,x,y,w,h,r){
 const rr=Math.min(r,w/2,h/2);
 ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);
 ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
}

function drawScene(ctx,w,h,scene){
 const seed=hashText(`${scene?.id||''}:${scene?.signature||''}`);
 const p=PALETTES[seed%PALETTES.length];

 const bg=ctx.createLinearGradient(0,0,w,h);
 bg.addColorStop(0,p[0]);bg.addColorStop(.58,p[1]);bg.addColorStop(1,p[2]);
 ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);

 // painel de fundo
 ctx.globalAlpha=.24;
 if(seed%3===0){
  for(let x=0;x<w;x+=Math.max(26,Math.round(w*.035))){
   ctx.fillStyle=(x/30)%2?'#fff':'#000';ctx.fillRect(x,0,1,h*.72);
  }
 }else if(seed%3===1){
  for(let y=0;y<h*.72;y+=Math.max(24,Math.round(h*.03))){
   ctx.fillStyle='#fff';ctx.fillRect(0,y,w,1);
  }
 }else{
  for(let i=0;i<12;i++){
   ctx.strokeStyle=i%2?'#fff':'#000';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(0,i*h/12);ctx.lineTo(w,(i+2)*h/12);ctx.stroke();
  }
 }
 ctx.globalAlpha=1;

 // luz ambiente
 const lx=seed%2?w*.20:w*.80;
 const glow=ctx.createRadialGradient(lx,h*.15,0,lx,h*.15,Math.max(w,h)*.58);
 glow.addColorStop(0,'rgba(255,255,255,.58)');
 glow.addColorStop(.45,'rgba(255,255,255,.13)');
 glow.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);

 // bancada/superfície
 const floorY=h*.76;
 const floor=ctx.createLinearGradient(0,floorY,0,h);
 floor.addColorStop(0,'rgba(255,255,255,.08)');
 floor.addColorStop(1,'rgba(0,0,0,.20)');
 ctx.fillStyle=floor;ctx.fillRect(0,floorY,w,h-floorY);
 ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(0,floorY,w,2);

 // detalhes de cenário fora da fotografia
 ctx.globalAlpha=.16;
 if(seed%4===0){
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(w*.12,h*.18,w*.055,0,Math.PI*2);ctx.fill();
  ctx.fillRect(w*.08,h*.58,w*.18,h*.05);
 }else if(seed%4===1){
  ctx.fillStyle='#000';ctx.fillRect(w*.76,h*.12,w*.13,h*.28);
  ctx.fillStyle='#fff';ctx.fillRect(w*.80,h*.17,w*.05,h*.18);
 }else if(seed%4===2){
  ctx.fillStyle='#fff';ctx.fillRect(w*.07,h*.18,w*.18,h*.20);
  ctx.fillStyle='#000';ctx.fillRect(w*.82,h*.55,w*.09,h*.15);
 }else{
  ctx.fillStyle='#fff';ctx.fillRect(w*.12,h*.10,w*.10,h*.30);
  ctx.fillStyle='#000';ctx.beginPath();ctx.arc(w*.86,h*.18,w*.045,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;
}

export async function preparePhotoLocally(imageData,{scene={},intensity='Natural',keepScale=true,onProgress}={}){
 if(!String(imageData||'').startsWith('data:image/'))throw new Error('Imagem original inválida.');
 onProgress?.('Montando cenário...');
 const image=await imageFromDataUrl(imageData);
 const ow=image.naturalWidth||image.width,oh=image.naturalHeight||image.height;

 // A foto original ocupa ~82% da largura; o cenário fica claramente visível ao redor.
 const maxPhotoSide=3000;
 const scale=Math.min(1,maxPhotoSide/Math.max(ow,oh));
 const photoW=Math.max(1,Math.round(ow*scale)),photoH=Math.max(1,Math.round(oh*scale));

 const padX=Math.max(70,Math.round(photoW*.11));
 const padTop=Math.max(80,Math.round(photoH*.10));
 const padBottom=Math.max(120,Math.round(photoH*.16));
 const w=photoW+padX*2,h=photoH+padTop+padBottom;

 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx)throw new Error('Seu navegador não conseguiu preparar a imagem.');

 drawScene(ctx,w,h,scene);

 // sombra do "card" da foto
 ctx.save();
 ctx.shadowColor='rgba(0,0,0,.34)';
 ctx.shadowBlur=Math.max(22,Math.round(w*.018));
 ctx.shadowOffsetY=Math.max(10,Math.round(h*.012));
 roundedRect(ctx,padX,padTop,photoW,photoH,Math.max(18,Math.round(w*.012)));
 ctx.fillStyle='#fff';ctx.fill();
 ctx.restore();

 // foto inteira: sem segmentação, sem recorte do aparelho
 ctx.save();
 roundedRect(ctx,padX,padTop,photoW,photoH,Math.max(18,Math.round(w*.012)));
 ctx.clip();
 ctx.drawImage(image,padX,padTop,photoW,photoH);
 ctx.restore();

 // linha premium ao redor
 ctx.strokeStyle='rgba(255,255,255,.52)';
 ctx.lineWidth=Math.max(2,Math.round(w*.002));
 roundedRect(ctx,padX,padTop,photoW,photoH,Math.max(18,Math.round(w*.012)));
 ctx.stroke();

 onProgress?.('Finalizando em alta qualidade...');
 return canvas.toDataURL('image/jpeg',.985);
}
