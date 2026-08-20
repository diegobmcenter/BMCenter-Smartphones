import React,{useEffect,useState}from'react';
import{AlertTriangle,Camera,CheckCircle2,ChevronRight,Clock3,ListTodo,Megaphone,PackageSearch,Play,RotateCcw,ScanSearch,ShoppingCart,SkipForward,Smartphone,Wrench}from'lucide-react';

const stageIcons={'Analisar':<ScanSearch/>,'Comprar peças':<PackageSearch/>,'Reparar e testar':<Wrench/>,'Prontos para anunciar':<CheckCircle2/>};
const actionIcons={analyze:<ScanSearch/>,parts:<ShoppingCart/>,repair:<Wrench/>,photos:<Camera/>,ads:<Megaphone/>,coverage:<Megaphone/>,sale:<CheckCircle2/>,receivable:<Clock3/>,return:<RotateCcw/>,refund:<RotateCcw/>,task:<ListTodo/>,stale:<Clock3/>};
const toneFor=item=>item?.priority>=95?'urgent':item?.priority>=85?'attention':'normal';

export default function TodayV102({groups,alerts,actions=[],waiting=[],metrics={},onOpenPhone,onRunAction}){
 const[queueOpen,setQueueOpen]=useState(false),[queueIndex,setQueueIndex]=useState(0);
 useEffect(()=>{if(!actions.length){setQueueOpen(false);setQueueIndex(0)}else if(queueIndex>=actions.length)setQueueIndex(0)},[actions.length,queueIndex]);
 const current=actions[queueIndex]||null;
 const startQueue=()=>{if(!actions.length)return;setQueueIndex(0);setQueueOpen(true)};
 const skip=()=>{if(queueIndex>=actions.length-1){setQueueOpen(false);setQueueIndex(0)}else setQueueIndex(index=>index+1)};
 const summary=[['Ações agora',metrics.actions??actions.length,'action'],['Aguardando',metrics.waiting??waiting.length,'wait'],['Prontos',metrics.ready??0,'ready'],['Anunciados',metrics.published??0,'published']];
 return <div className="v102-page v10523-today">
  <header className="v102-hero v10523-hero"><div><span>HOJE</span><h1>Sua fila de trabalho.</h1><p>Faça primeiro o que já pode avançar. O que depende de terceiros fica separado em Aguardando.</p></div><button className="primary v10523-start" disabled={!actions.length} onClick={startQueue}><Play size={15}/> Iniciar minha fila</button></header>

  <section className="v10523-summary">{summary.map(([label,value,tone])=><article className={tone} key={label}><strong>{value}</strong><span>{label}</span></article>)}</section>

  {queueOpen&&current&&<section className={`v10523-focus ${toneFor(current)}`}><header><div><span>TAREFA {queueIndex+1} DE {actions.length}</span><b>{current.cta||'Próxima ação'}</b></div><button onClick={()=>setQueueOpen(false)}>Encerrar fila</button></header><div><i>{actionIcons[current.type]||<Smartphone/>}</i><section><h2>{current.title}</h2><p>{current.detail}</p></section><button className="primary" onClick={()=>onRunAction?.(current)}>{current.cta||'Abrir ação'} <ChevronRight size={14}/></button><button onClick={skip}><SkipForward size={14}/> Pular</button></div></section>}

  <div className="v10523-work-grid">
   <section className="v10523-panel v10523-actions"><header><div><span>PRÓXIMAS AÇÕES</span><h2>O que você consegue fazer agora</h2></div><b>{actions.length}</b></header><div>{actions.length?actions.slice(0,14).map((item,index)=><article className={toneFor(item)} key={item.id}><span>{index+1}</span><i>{actionIcons[item.type]||<Smartphone/>}</i><div><b>{item.title}</b><small>{item.detail}</small></div><button className="primary" onClick={()=>onRunAction?.(item)}>{item.cta||'Abrir ação'}</button><button className="icon-only" title="Ver aparelho" onClick={()=>onOpenPhone?.(item.phoneId)}><ChevronRight size={14}/></button></article>):<div className="v10523-empty">✓ Nenhuma ação pendente agora.</div>}</div></section>

   <section className="v10523-panel v10523-waiting"><header><div><span>AGUARDANDO</span><h2>Nada para fazer agora</h2></div><b>{waiting.length}</b></header><div>{waiting.length?waiting.slice(0,14).map(item=><article key={item.id}><i>{item.type==='parts'?<PackageSearch/>:<Clock3/>}</i><div><b>{item.title}</b><small>{item.detail}</small></div><em>{item.status||'Aguardando'}</em><button className="icon-only" title="Ver aparelho" onClick={()=>onOpenPhone?.(item.phoneId)}><ChevronRight size={14}/></button></article>):<div className="v10523-empty">Nenhum item depende de terceiros agora.</div>}</div></section>
  </div>

  <section className="v10523-stage"><header><span>FLUXO ATUAL</span><small>Visão rápida das etapas operacionais</small></header><div>{groups.map((group,index)=><article key={group.title}><i>{stageIcons[group.title]||<Smartphone/>}</i><div><small>ETAPA {index+1}</small><b>{group.title}</b></div><strong>{group.items.length}</strong></article>)}</div></section>

  <section className="v102-alert-strip v10523-alerts"><div><AlertTriangle size={16}/><b>Alertas operacionais</b><span>{alerts.length}</span></div>{alerts.length?<div className="v102-alert-items">{alerts.slice(0,4).map((a,i)=><article key={i}><b>{a.title}</b><small>{a.detail}</small></article>)}</div>:<div className="v102-ok-inline">✓ Nenhum alerta agora.</div>}</section>
 </div>
}
