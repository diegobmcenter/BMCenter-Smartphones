import assert from 'node:assert/strict';
import fs from 'node:fs';

const main=fs.readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8');
const phonesView=fs.readFileSync(new URL('../src/v102/pages/SmartphonesV102.jsx',import.meta.url),'utf8');

function extractFunction(source,name){
 const marker=`function ${name}(`,start=source.indexOf(marker);
 assert.ok(start>=0,`função ${name} precisa existir`);
 const open=source.indexOf('{',start);
 let depth=0,quote='',escaped=false,lineComment=false,blockComment=false;
 for(let i=open;i<source.length;i++){
  const c=source[i],n=source[i+1];
  if(lineComment){if(c==='\n')lineComment=false;continue}
  if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++}continue}
  if(quote){if(escaped){escaped=false;continue}if(c==='\\'){escaped=true;continue}if(c===quote)quote='';continue}
  if(c==='/'&&n==='/'){lineComment=true;i++;continue}
  if(c==='/'&&n==='*'){blockComment=true;i++;continue}
  if(c==='\''||c==='"'||c==='`'){quote=c;continue}
  if(c==='{')depth++;
  else if(c==='}'){depth--;if(depth===0)return source.slice(start,i+1)}
 }
 throw new Error(`fim da função ${name} não encontrado`)
}

const functionNames=['defaultAdWorkflow','normalizePublication','normalizeAd','migrateLegacyAds','normalizeMarketplaceProfiles','historicalProfileIds','publishedProfileIds','historicalProfilePublishedAt','publicationWasPublished','salePublicationSnapshot','finalizeSoldPhonePublications','salesDaysFromProfile'];
const runtime=new Function('crypto',`${functionNames.map(name=>extractFunction(main,name)).join('\n')}\nreturn {${functionNames.join(',')}};`)(globalThis.crypto);

const profiles=[{id:'p1',name:'Paty Cat'},{id:'p2',name:'Diego Moraes'}];
const phone={
 id:'phone-1',status:'Anunciado',brand:'Samsung',model:'J7 Prime',
 marketplaceProfiles:{
  p1:{active:true,publishedAt:'2026-08-01',updatedAt:'2026-08-01T10:00:00Z'},
  p2:{active:true,publishedAt:'2026-08-03',updatedAt:'2026-08-03T10:00:00Z'}
 },
 ads:[{id:'ad-1',name:'Anúncio 1',publications:{
  p1:{status:'published',date:'2026-08-01',updatedAt:'2026-08-01T10:00:00Z'},
  p2:{status:'published',date:'2026-08-03',updatedAt:'2026-08-03T10:00:00Z'}
 }}]
};
const sold=runtime.finalizeSoldPhonePublications(phone,profiles,{soldAt:'2026-08-15',value:330,profileId:'p1'});
assert.equal(sold.status,'Vendido');
assert.equal(sold.marketplaceProfiles.p1.active,false);
assert.equal(sold.marketplaceProfiles.p2.active,false);
assert.equal(sold.ads[0].publications.p1.status,'removed');
assert.equal(sold.ads[0].publications.p2.status,'removed');
assert.equal(sold.ads[0].publications.p1.date,'2026-08-01','data original de publicação precisa ser preservada');
assert.equal(sold.ads[0].publications.p1.endedReason,'sold');
assert.deepEqual(runtime.publishedProfileIds(sold),[],'vendido não pode possuir publicação ativa');
assert.deepEqual(new Set(sold.sale.publicationProfiles.map(x=>x.id)),new Set(['p1','p2']),'todos os perfis históricos precisam permanecer na venda');
assert.equal(runtime.salesDaysFromProfile(sold,'p1'),14,'tempo até venda deve continuar usando a data histórica');
assert.equal(runtime.publicationWasPublished(sold.ads[0].publications.p1),true,'publicação encerrada ainda conta como evento histórico de publicação');

assert.match(main,/bmcenter-sold-publications-v10474/,'vendidos antigos devem ser migrados automaticamente');
assert.match(main,/Venda registrada por .*anúncios encerrados/,'registro de venda deve fechar anúncios no mesmo fluxo');
assert.match(phonesView,/Histórico de publicação/,'aparelho vendido deve continuar mostrando perfis antigos');
assert.match(phonesView,/Anúncios encerrados/,'vendido deve ser exibido como encerrado e não publicado');
assert.match(phonesView,/disabled=\{sold\}/,'histórico do vendido deve ser somente leitura');

console.log('sold-publication-lifecycle.test: OK');
