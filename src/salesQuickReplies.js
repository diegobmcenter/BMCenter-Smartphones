import{phoneSaleDisplayValue}from'./saleAccounting.js';

const brl=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(value)||0);
const capacity=value=>{const text=String(value??'').trim();if(!text)return'';return /gb$/i.test(text)?text:`${text}GB`};
const clean=value=>String(value??'').trim();
const sentence=text=>{const value=clean(text);return value?/[.!?]$/.test(value)?value:`${value}.`:''};
const naturalJoin=list=>{const values=list.filter(Boolean);if(values.length<=1)return values[0]||'';if(values.length===2)return `${values[0]} e ${values[1]}`;return `${values.slice(0,-1).join(', ')} e ${values.at(-1)}`};

export function defaultSalesReplySettings(){return{location:'Maringá'}}
export function normalizeSalesReplySettings(value){const source=value&&typeof value==='object'&&!Array.isArray(value)?value:{};return{location:clean(source.location)||defaultSalesReplySettings().location}}

export function buildSalesQuickReplies(phone,settings={}){
 const config=normalizeSalesReplySettings(settings),name=[clean(phone?.brand),clean(phone?.model)].filter(Boolean).join(' ')||'Smartphone';
 const storage=capacity(phone?.storage),ram=phone?.ram?`${capacity(phone.ram)} RAM`:'',color=clean(phone?.color),priceValue=Number(phoneSaleDisplayValue(phone)||0),price=priceValue>0?brl(priceValue):'valor a consultar';
 const condition=phone?.likeNew===true?'em estado de novo':'seminovo';
 const extras=[phone?.nfc===true?'NFC':'',phone?.biometrics===true?'biometria':'',phone?.screenProtector===true?'película':'',phone?.caseIncluded===true?'capinha':''].filter(Boolean);
 const detailBits=[storage,ram,color].filter(Boolean),detailLine=[name,...detailBits].join(' • '),location=config.location?`Estou em ${config.location}.`:'';
 const closed=['Vendido','Descarte/Sucata'].includes(phone?.status),reserved=phone?.status==='Reservado';
 const availability=closed?'Esse aparelho não está disponível no momento.':reserved?'No momento esse aparelho está reservado.':'Sim, está disponível!';
 const availabilityCompact=closed?'Não está disponível no momento.':reserved?'Está reservado no momento.':'Está disponível.';
 const extrasText=naturalJoin(extras),extrasSentence=extrasText?`Conta com ${extrasText}.`:'';
 const modelWithStorage=[name,storage].filter(Boolean).join(' ');
 return[
  {id:'availability',label:'Está disponível?',hint:'Resposta direta para disponibilidade',text:[availability,!closed&&!reserved?`${modelWithStorage}${color?`, ${color}`:''}, ${condition}.`:sentence(`${modelWithStorage}${color?`, ${color}`:''}`),`Valor: ${price}.`,location].filter(Boolean).join(' ')},
  {id:'price',label:'Qual o valor?',hint:'Valor + disponibilidade',text:[`O valor do ${modelWithStorage} é ${price}.`,availabilityCompact,location].filter(Boolean).join(' ')},
  {id:'details',label:'Memória e detalhes',hint:'Especificações rápidas',text:[`${detailLine}.`,`Aparelho ${condition}.`,extrasSentence,`Valor: ${price}.`].filter(Boolean).join(' ')},
  {id:'complete',label:'Resposta completa',hint:'Resumo pronto para enviar',text:[`Oi! ${availability}`,`${detailLine}, ${condition}.`,extrasSentence,`Valor: ${price}.`,location].filter(Boolean).join(' ')}
 ]
}
