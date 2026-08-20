import React,{useEffect,useState}from'react';
import{AlertTriangle,ArrowLeft,Camera,CheckCircle2,ChevronDown,ChevronRight,Clock3,ListTodo,Maximize2,Megaphone,PackageSearch,Play,RotateCcw,ScanSearch,ShoppingCart,SkipForward,Smartphone,Wrench,X}from'lucide-react';

const QUEUE_PROGRESS_KEY='bmcenter-today-queue-progress-v1';
const stageIcons={'Analisar':<ScanSearch/>,'Comprar peças':<PackageSearch/>,'Reparar e testar':<Wrench/>,'Prontos para anunciar':<CheckCircle2/>};
const actionIcons={analyze:<ScanSearch/>,parts:<ShoppingCart/>,repair:<Wrench/>,photos:<Camera/>,ads:<Megaphone/>,coverage:<Megaphone/>,sale:<CheckCircle2/>,receivable:<Clock3/>,return:<RotateCcw/>,refund:<RotateCcw/>,task:<ListTodo/>,stale:<Clock3/>,attention:<AlertTriangle/>,timeline:<CheckCircle2/>};
const toneFor=item=>item?.priority>=95?'urgent':item?.priority>=85?'attention':'normal';
const readQueueProgress=()=>{try{return JSON.parse(localStorage.getItem(QUEUE_PROGRESS_KEY)||'null')}catch{return null}};
const saveQueueProgress=actionId=>{try{localStorage.setItem(QUEUE_PROGRESS_KEY,JSON.stringify({actionId,savedAt:new Date().toISOString()}))}catch{}};
const clearQueueProgress=()=>{try{localStorage.removeItem(QUEUE_PROGRESS_KEY)}catch{}};

export default function TodayV102({groups,attention=[],actions=[],waiting=[],completed=[],metrics={},onOpenPhone,onRunAction,onQuickAction}){
 const initialProgress=readQueueProgress();
 const[queueOpen,setQueueOpen]=useState(false),[queueIndex,setQueueIndex]=useState(0),[resumeId,setResumeId]=useState(initialProgress?.actionId||''),[focusMode,setFocusMode]=useState(false);
 useEffect(()=>{
  if(!actions.length){setQueueOpen(false);setFocusMode(false);setQueueIndex(0);setResumeId('');clearQueueProgress();return}
  if(resumeId&&!actions.some(item=>item.id===resumeId)){
   const next=actions[0];setResumeId(next.id);saveQueueProgress(next.id);if(queueOpen)setQueueIndex(0);return;
  }
  if(queueIndex>=actions.length)setQueueIndex(0);
 },[actions,queueIndex,queueOpen,resumeId]);
 const current=actions[queueIndex]||null;
 useEffect(()=>{if(queueOpen&&current){setResumeId(current.id);saveQueueProgress(current.id)}},[queueOpen,current?.id]);
 const queueStartIndex=()=>{const index=resumeId?actions.findIndex(item=>item.id===resumeId):0;return index<0?0:index};
 const startQueue=()=>{if(!actions.length)return;setQueueIndex(queueStartIndex());setFocusMode(false);setQueueOpen(true)};
 const startFocus=()=>{if(!actions.length)return;setQueueIndex(queueStartIndex());setFocusMode(true);setQueueOpen(true)};
 const endQueue=()=>{setQueueOpen(false);setFocusMode(false);setQueueIndex(0);setResumeId('');clearQueueProgress()};
 const exitFocus=()=>{if(current){setResumeId(current.id);saveQueueProgress(current.id)}setFocusMode(false);setQueueOpen(false)};
 const previous=()=>{if(queueIndex<=0)return;const nextIndex=queueIndex-1;setQueueIndex(nextIndex);setResumeId(actions[nextIndex].id);saveQueueProgress(actions[nextIndex].id)};
 const skip=()=>{if(queueIndex>=actions.length-1){endQueue()}else{const nextIndex=queueIndex+1;setQueueIndex(nextIndex);setResumeId(actions[nextIndex].id);saveQueueProgress(actions[nextIndex].id)}};
 const executeAction=item=>item?.quickAction?onQuickAction?.(item):onRunAction?.(item);
 const executeFocusedAction=item=>{
  if(item?.quickAction){onQuickAction?.(item);return}
  if(item){setResumeId(item.id);saveQueueProgress(item.id)}
  setFocusMode(false);setQueueOpen(false);onRunAction?.(item);
 };
 const summary=[['Ações agora',metrics.actions??actions.length,'action'],['Aguardando',metrics.waiting??waiting.length,'wait'],['Atenção',metrics.attention??attention.length,'attention'],['Prontos',metrics.ready??0,'ready'],['Anunciados',metrics.published??0,'published']];
 const focusProgress=actions.length?Math.round(((queueIndex+1)/actions.length)*100):0;
 return <div className="v102-page v10523-today v10524-today v10525-today">
  <header className="v102-hero v10523-hero"><div><span>HOJE</span><h1>Sua fila de trabalho.</h1><p>Faça primeiro o que já pode avançar. Exceções importantes ficam em Atenção e dependências externas em Aguardando.</p></div><div className="v10525-hero-actions"><button className="primary v10523-start" disabled={!actions.length} onClick={startQueue}><Play size={15}/> {resumeId?'Continuar minha fila':'Iniciar minha fila'}</button><button className="v10525-focus-start" disabled={!actions.length} onClick={startFocus}><Maximize2 size={15}/> Modo foco</button></div></header>

  <section className="v10523-summary v10524-summary">{summary.map(([label,value,tone])=><article className={`${tone} ${tone==='attention'&&value?'has-attention':''}`} key={label}><strong>{value}</strong><span>{label}</span></article>)}</section>

  {!!attention.length&&<section className="v10524-attention"><header><div><AlertTriangle size={15}/><span>ATENÇÃO</span><b>{attention.length} exceção(ões) que merecem revisão</b></div></header><div>{attention.slice(0,6).map(item=><article key={item.id}><i>{actionIcons[item.type]||<AlertTriangle/>}</i><div><b>{item.title}</b><small>{item.detail}</small></div><em>{item.reason||'Atenção'}</em><button className="primary" onClick={()=>onRunAction?.(item)}>{item.cta||'Ver'}</button><button className="icon-only" title="Ver aparelho" onClick={()=>onOpenPhone?.(item.phoneId)}><ChevronRight size={14}/></button></article>)}</div></section>}

  {!queueOpen&&resumeId&&actions.length>0&&<div className="v10525-resume-row"><button type="button" className="v10524-resume" onClick={startQueue}><Play size={13}/><span><b>Retomar de onde parei</b><small>{actions.find(item=>item.id===resumeId)?.title||'Próxima tarefa'} · {actions.findIndex(item=>item.id===resumeId)+1} de {actions.length}</small></span><ChevronRight size={14}/></button><button type="button" className="v10525-resume-focus" onClick={startFocus}><Maximize2 size={13}/><span><b>Retomar no modo foco</b><small>Continuar sem distrações</small></span></button></div>}

  {queueOpen&&current&&!focusMode&&<section className={`v10523-focus ${toneFor(current)}`}><header><div><span>TAREFA {queueIndex+1} DE {actions.length}</span><b>{current.cta||'Próxima ação'}</b></div><button onClick={endQueue}>Encerrar fila</button></header><div><i>{actionIcons[current.type]||<Smartphone/>}</i><section><h2>{current.title}</h2><p>{current.detail}</p></section><button className="primary" onClick={()=>executeAction(current)}>{current.cta||'Abrir ação'} <ChevronRight size={14}/></button><button onClick={skip}><SkipForward size={14}/> Pular</button></div></section>}

  <div className="v10523-work-grid">
   <section className="v10523-panel v10523-actions"><header><div><span>PRÓXIMAS AÇÕES</span><h2>O que você consegue fazer agora</h2></div><b>{actions.length}</b></header><div>{actions.length?actions.slice(0,14).map((item,index)=><article className={toneFor(item)} key={item.id}><span>{index+1}</span><i>{actionIcons[item.type]||<Smartphone/>}</i><div><b>{item.title}</b><small>{item.detail}</small></div><button className="primary" onClick={()=>executeAction(item)}>{item.cta||'Abrir ação'}</button><button className="icon-only" title="Ver aparelho" onClick={()=>onOpenPhone?.(item.phoneId)}><ChevronRight size={14}/></button></article>):<div className="v10523-empty">✓ Nenhuma ação pendente agora.</div>}</div></section>

   <section className="v10523-panel v10523-waiting"><header><div><span>AGUARDANDO</span><h2>Nada para fazer agora</h2></div><b>{waiting.length}</b></header><div>{waiting.length?waiting.slice(0,14).map(item=><article key={item.id}><i>{item.type==='parts'?<PackageSearch/>:<Clock3/>}</i><div><b>{item.title}</b><small>{item.detail}</small></div><em>{item.status||'Aguardando'}</em><button className="icon-only" title="Ver aparelho" onClick={()=>onOpenPhone?.(item.phoneId)}><ChevronRight size={14}/></button></article>):<div className="v10523-empty">Nenhum item depende de terceiros agora.</div>}</div></section>
  </div>

  <section className="v10523-stage"><header><span>FLUXO ATUAL</span><small>Visão rápida das etapas operacionais</small></header><div>{groups.map((group,index)=><article key={group.title}><i>{stageIcons[group.title]||<Smartphone/>}</i><div><small>ETAPA {index+1}</small><b>{group.title}</b></div><strong>{group.items.length}</strong></article>)}</div></section>

  <details className="v10524-completed"><summary><div><CheckCircle2 size={14}/><span>CONCLUÍDO HOJE</span><b>{completed.length} avanço(s) registrado(s)</b></div><ChevronDown size={15}/></summary><div>{completed.length?completed.slice(0,12).map(item=><article key={item.id}><i>{actionIcons[item.type]||<CheckCircle2/>}</i><div><b>{item.title}</b><small>{item.detail}</small></div>{item.phoneId&&<button className="icon-only" title="Ver aparelho" onClick={()=>onOpenPhone?.(item.phoneId)}><ChevronRight size={14}/></button>}</article>):<div className="v10523-empty">Nenhum avanço registrado hoje ainda.</div>}</div></details>

  {queueOpen&&current&&focusMode&&<div className="v10525-focus-shell" role="dialog" aria-modal="true" aria-label="Modo foco da fila de trabalho"><section className={`v10525-focus-card ${toneFor(current)}`}><header><div><span>MODO FOCO</span><b>Tarefa {queueIndex+1} de {actions.length}</b></div><button type="button" onClick={exitFocus}><X size={14}/> Sair do modo foco</button></header><div className="v10525-focus-progress" aria-label={`${focusProgress}% da fila`}><i style={{width:`${focusProgress}%`}}/></div><main><i className="v10525-focus-icon">{actionIcons[current.type]||<Smartphone/>}</i><div className="v10525-focus-copy"><span>PRÓXIMA AÇÃO</span><h1>{current.title}</h1><p>{current.detail}</p></div><button className="primary v10525-focus-primary" onClick={()=>executeFocusedAction(current)}>{current.cta||'Executar ação'} <ChevronRight size={16}/></button></main><footer><button type="button" disabled={queueIndex<=0} onClick={previous}><ArrowLeft size={14}/> Anterior</button><div><small>{queueIndex+1} de {actions.length}</small><button type="button" onClick={skip}><SkipForward size={14}/> Pular</button></div></footer></section></div>}
 </div>
}
