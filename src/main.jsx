import React,{useEffect,useMemo,useRef,useState}from'react';import{createRoot}from'react-dom/client';import{Smartphone,Users,ShoppingCart,LayoutDashboard,Plus,LogOut,X,Store,ClipboardCheck,History,Camera,FileText,Download,Upload,ShieldCheck,KanbanSquare,BarChart3,Search,CalendarDays,WalletCards,Tags,Package,Clock3,Image,AlertTriangle,TrendingUp,Settings,Bell,ListTodo,Eye,ChevronLeft,ChevronRight,Star,CheckSquare,DatabaseZap,RefreshCw,Activity,Archive,Bookmark,UploadCloud,MessageSquare,Paperclip,Palette,Target,Gauge,CalendarClock,Copy}from'lucide-react';
import{QRCodeSVG}from'qrcode.react';
import SmartphonesView from './pages/SmartphonesView.jsx';
import AdsOverviewView from './pages/AdsOverviewView.jsx';
import BatchActionsView from './pages/BatchActionsView.jsx';
import AppFrame from './components/v7/AppFrame.jsx';
import AppFrameV102 from './v102/AppFrameV102.jsx';
import DashboardV102 from './v102/pages/DashboardV102.jsx';
import TodayV102 from './v102/pages/TodayV102.jsx';
import SmartphonesV102 from './v102/pages/SmartphonesV102.jsx';
import AdsV102 from './v102/pages/AdsV102.jsx';
import BatchV102 from './v102/pages/BatchV102.jsx';import ActivityV102 from './v102/pages/ActivityV102.jsx';import ReportsV10 from './v10/pages/ReportsV10.jsx';import{cloudConfigured,getCloudSession,signInCloud,signUpCloud,signOutCloud,initializeCloudState,queueCloudSave,subscribeCloudState,getCloudStatus,clearCloudState,pushCloudStateNow,createCloudBackup,listCloudBackups,restoreCloudBackup,deleteCloudBackup}from'./cloud.js';import'./styles.css';import'./v10.css';import'./v102.css';import'./v1023.css';import'./v1024.css';import'./v1025.css';import'./v1026.css';import'./v1027.css';
const SKEY='bmcenter-smartphones',VKEY='bmcenter-sellers',BKEY='bmcenter-bank-accounts',FKEY='bmcenter-suppliers',UKEY='bmcenter-users',PKEY='bmcenter-marketplace-profiles',TKEY='bmcenter-ad-templates',IKEY='bmcenter-parts-inventory',MKEY='bmcenter-inventory-movements',MENUKEY='bmcenter-visible-menus',CFGKEY='bmcenter-system-config',ATITLEKEY='bmcenter-ad-title-library',ADESCKEY='bmcenter-ad-description-library',VIEWKEY='bmcenter-saved-views',CHECKKEY='bmcenter-custom-checklists',GOALKEY='bmcenter-operational-goals',PHONECOLKEY='bmcenter-phone-columns',TABLELAYOUTKEY='bmcenter-table-layouts',SNAPKEY='bmcenter-auto-snapshots',AKEY='bmcenter-auth';
const APP_VERSION='10.2.7';
const ALL_CLOUD_KEYS=[SKEY,VKEY,BKEY,FKEY,UKEY,PKEY,TKEY,IKEY,MKEY,MENUKEY,CFGKEY,ATITLEKEY,ADESCKEY,VIEWKEY,CHECKKEY,GOALKEY,PHONECOLKEY,TABLELAYOUTKEY,SNAPKEY];
const load=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}},save=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));queueCloudSave(k,v)};
const money=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0);
function phoneSelectedPartsCost(phone){
 return (phone.parts||[]).reduce((sum,part)=>{
  const quotes=part.quotes||[];
  const selected=quotes.find(q=>q.id===part.selectedQuoteId)||[...quotes].sort((a,b)=>Number(a.price)-Number(b.price))[0];
  return sum+Number(selected?.price||0);
 },0);
}
function phoneTotalCost(phone){return Number(phone.paid||0)+phoneSelectedPartsCost(phone)}
function formatDate(value){if(!value)return'—';const[y,m,d]=value.split('-');return d&&m&&y?`${d}/${m}/${y}`:value}
function formatMonth(value){if(!value)return'—';const[y,m]=value.split('-');return m&&y?`${m}/${y}`:value}
function capacityLabel(value){const text=String(value??'').trim();if(!text)return'';return /gb$/i.test(text)?text:`${text}GB`}
function formatPhoneSpecs(phone){return [phone?.color,capacityLabel(phone?.storage),phone?.ram&&`${capacityLabel(phone.ram)} RAM`,phone?.nfc===true?'NFC':'',phone?.connector||''].filter(Boolean).join(' · ')||'Sem detalhes'}
const statuses=['Aguardando análise','Aguardando peças','Em reparo','Em testes','Pronto','Para fotografar','Anúncio preparado','Anunciado','Reservado','Vendido'];

function normalizeSnapshotList(value){
 if(!Array.isArray(value))return[];
 return value.filter(item=>item&&typeof item==='object'&&item.id&&item.date).slice(0,5)
}
function captureSnapshotData(){
 return captureCompleteBackup({excludeKeys:[SNAPKEY]})
}
function repairSnapshotStorage(){
 try{
  const raw=localStorage.getItem(SNAPKEY);
  if(!raw)return;
  const parsed=JSON.parse(raw);
  const clean=normalizeSnapshotList(parsed).map(item=>{
   if(item?.data?.storage&&Object.prototype.hasOwnProperty.call(item.data.storage,SNAPKEY)){
    const storage={...item.data.storage};
    delete storage[SNAPKEY];
    return{...item,data:{...item.data,storage}}
   }
   return item
  }).slice(0,3);
  localStorage.setItem(SNAPKEY,JSON.stringify(clean))
 }catch(error){
  console.warn('Pontos de restauração antigos foram descartados para recuperar o sistema.',error);
  localStorage.removeItem(SNAPKEY)
 }
}

class AppErrorBoundary extends React.Component{
 constructor(props){super(props);this.state={error:null}}
 static getDerivedStateFromError(error){return{error}}
 componentDidCatch(error,info){console.error('BMCenter fatal error',error,info)}
 render(){
  if(!this.state.error)return this.props.children;
  const resetSnapshots=()=>{
   localStorage.removeItem(SNAPKEY);
   localStorage.setItem('bmcenter-last-version','5.3.2');
   location.reload()
  };
  const openPhones=()=>{
   sessionStorage.setItem('bmcenter-current-page','phones');
   location.reload()
  };
  return <div className="bmcenter-recovery-screen">
   <div>
    <AlertTriangle size={42}/>
    <h1>O BMCenter encontrou um dado incompatível</h1>
    <p>Seus dados na nuvem continuam preservados. A aplicação impediu a tela preta e pode recuperar a interface.</p>
    <code>{String(this.state.error?.message||this.state.error)}</code>
    <div className="recovery-actions">
     <button className="primary" onClick={resetSnapshots}>Corrigir pontos de restauração e recarregar</button>
     <button onClick={openPhones}>Abrir diretamente em Smartphones</button>
    </div>
   </div>
  </div>
 }
}

const FONT_SCALE_KEY='bmcenter-font-scales';
function loadFontScales(){try{const value=JSON.parse(localStorage.getItem(FONT_SCALE_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return{}}}
function fontScaleId(kind,name){return `${kind}:${String(name||'default').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'default'}`}
function getFontScale(id){const value=Number(loadFontScales()[id]??1);return Math.min(1.15,Math.max(.9,Number.isFinite(value)?value:1))}
function saveFontScale(id,value){const next={...loadFontScales(),[id]:Math.min(1.15,Math.max(.9,Number(value)||1))};localStorage.setItem(FONT_SCALE_KEY,JSON.stringify(next));return next[id]}
function App({cloudUser,onCloudLogout}){
 const[mobileMenuOpen,setMobileMenuOpen]=useState(false);
 const[config,setConfig]=useState(()=>loadSystemConfig());
 const[page,setPage]=useState(()=>sessionStorage.getItem('bmcenter-current-page')||loadSystemConfig().homePage||'dashboard');
 useEffect(()=>{const key='bmcenter-lean-phone-v102';if(localStorage.getItem(key)==='1')return;const phones=load(SKEY);if(Array.isArray(phones)){const lean=phones.map(sanitizePhoneForLeanMode);localStorage.setItem(SKEY,JSON.stringify(lean));queueCloudSave(SKEY,lean)}localStorage.setItem(key,'1')},[]);
 useEffect(()=>{const key='bmcenter-phone-schema-v1024';if(localStorage.getItem(key)==='1')return;const phones=load(SKEY);if(Array.isArray(phones)){const migrated=phones.map(sanitizePhoneForLeanMode);localStorage.setItem(SKEY,JSON.stringify(migrated));queueCloudSave(SKEY,migrated)}localStorage.setItem(key,'1')},[]);
 const[visibleMenus,setVisibleMenus]=useState(()=>loadMenuSettings());
 const[commandOpen,setCommandOpen]=useState(false);
 useEffect(()=>{document.body.classList.toggle('hide-product-code',config.showProductCode===false)},[config.showProductCode]);

 useEffect(()=>{
  if(!mobileMenuOpen)return;
  requestAnimationFrame(()=>{
   const nav=document.querySelector('.global-sidebar .sidebar-nav');
   if(nav)nav.scrollTop=0;
   const sidebar=document.querySelector('.global-sidebar');
   if(sidebar)sidebar.scrollTop=0;
  });
 },[mobileMenuOpen]);
 useEffect(()=>{
  repairSnapshotStorage();
  const savedScroll=Number(sessionStorage.getItem('bmcenter-scroll-y')||0);
  if(savedScroll)requestAnimationFrame(()=>window.scrollTo(0,savedScroll));
  if(config.autoSnapshot!==false){
   const version=APP_VERSION,last=localStorage.getItem('bmcenter-last-version');
   if(last!==version){
    try{
     const snapshots=normalizeSnapshotList(load(SNAPKEY));
     const snapshot={id:crypto.randomUUID(),date:new Date().toISOString(),label:`Antes da versão ${version}`,data:captureSnapshotData()};
     const next=[snapshot,...snapshots].slice(0,3);
     localStorage.setItem(SNAPKEY,JSON.stringify(next));
     queueCloudSave(SNAPKEY,next);
    }catch(error){
     console.warn('Auto snapshot ignorado para manter o sistema disponível.',error);
     localStorage.removeItem(SNAPKEY);
    }finally{
     localStorage.setItem('bmcenter-last-version',version)
    }
   }
  }
  const fn=e=>{if(e.key==='Escape')setCommandOpen(false);if((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='k'){e.preventDefault();setCommandOpen(true)}};
  window.addEventListener('keydown',fn);
  return()=>window.removeEventListener('keydown',fn)
 },[]);

 const menuItems=[
  {id:'dashboard',icon:<LayoutDashboard/>,text:'Dashboard'},
  {id:'today',icon:<ListTodo/>,text:'Hoje'},
  {id:'phones',icon:<Smartphone/>,text:'Smartphones'},
  {id:'ads',icon:<FileText/>,text:'Anúncios'},
  {id:'batch',icon:<CheckSquare/>,text:'Ações em lote'},
  {id:'activity',icon:<Activity/>,text:'Atividades'},
  {id:'profileAnalytics',icon:<BarChart3/>,text:'Perfis'},
  {id:'parts',icon:<ShoppingCart/>,text:'Peças e acessórios'},
  {id:'dataQuality',icon:<DatabaseZap/>,text:'Qualidade dos dados'},
  {id:'reports',icon:<BarChart3/>,text:'Relatórios'},
  {id:'data',icon:<Download/>,text:'Central de dados'},
  {id:'backup',icon:<Download/>,text:'Backup'},
  {id:'settings',icon:<Settings/>,text:'Configurações',always:true}
 ];
 const primaryMenuIds=menuItems.filter(item=>!['data','backup','settings'].includes(item.id)).map(item=>item.id);
 const dataMenuIds=['data','backup','settings'];
 const removedPages=new Set(['agenda','goals','renewals','archive','globalSearch','sellers','suppliers','banks']);
 useEffect(()=>{if(removedPages.has(page)){const target=['suppliers','banks'].includes(page)?'settings':'phones';sessionStorage.setItem('bmcenter-current-page',target);setPage(target)}},[page]);

 function isVisible(id){return ['phones','settings'].includes(id)||visibleMenus[id]!==false}
 function saveVisible(next){const safe={...next,phones:true};setVisibleMenus(safe);save(MENUKEY,safe)}
 function saveConfig(next){setConfig(next);save(CFGKEY,next)}
 function navigate(id){sessionStorage.setItem('bmcenter-current-page',id);setPage(id);setMobileMenuOpen(false)}
 const currentMenu=menuItems.find(item=>item.id===page)||{text:'BMCenter',icon:<LayoutDashboard/>};

 return <AppFrameV102
  mobileOpen={mobileMenuOpen}
  setMobileOpen={setMobileMenuOpen}
  menuItems={menuItems}
  visibleMenus={visibleMenus}
  page={page}
  navigate={navigate}
  alerts={getOperationalAlerts().length}
  version={APP_VERSION}
  userEmail={cloudUser?.email}
  onLogout={onCloudLogout}
  config={config}
  onConfigChange={saveConfig}
 >
  <section className={`v10-route v102-route v102-route-${page}`}>
   {page==='settings'
    ?<SystemSettingsPage visibleMenus={visibleMenus} onChange={saveVisible} menuItems={menuItems.filter(x=>x.id!=='settings')} config={config} onConfigChange={saveConfig}/>
    :<PageContent page={page}/>}
  </section>
  {commandOpen&&<CommandPalette menuItems={menuItems.filter(x=>!['suppliers','banks'].includes(x.id))} onNavigate={id=>{navigate(id);setCommandOpen(false)}} onClose={()=>setCommandOpen(false)}/>}
  <UniversalTableCustomizer page={page}/>
 </AppFrameV102>
}

const BALANCED_THEME={
 accent:'balanced',
 themeMode:'dark',
 primaryColor:'#6f8cf6',
 secondaryColor:'#475a7c',
 highlightColor:'#58b7a8',
 surfaceColor:'#0d1117',
 panelColor:'#121820',
 cardColor:'#171e27',
 borderColor:'#2a3440',
 textColor:'#e8edf3',
 mutedTextColor:'#98a4b3',
 borderRadius:11,
 density:'comfortable',
 themeTransitions:true,
 applyThemeGlobally:true
};
const BALANCED_THEME_MIGRATION_KEY='bmcenter-balanced-theme-v807';

function loadSystemConfig(){
 const defaults={
  homePage:'dashboard',compact:false,autoSnapshot:true,showProductCode:true,brightness:100,readingMode:false,
  dashboardWidgets:['metrics','profiles','workflow'],...BALANCED_THEME
 };
 const saved=load(CFGKEY);
 const merged=saved&&typeof saved==='object'&&!Array.isArray(saved)?{...defaults,...saved}:defaults;
 // One-time visual migration requested for v8.0.7.
 if(localStorage.getItem(BALANCED_THEME_MIGRATION_KEY)!=='1'){
  return {...merged,...BALANCED_THEME}
 }
 return merged
}

function showProductCode(){return loadSystemConfig().showProductCode!==false}
function phoneDisplayName(phone,options={}){
 const device=[phone?.brand,phone?.model].filter(Boolean).join(' ').trim()||'Aparelho sem identificação';
 const includeCode=options.includeCode!==false&&showProductCode()&&phone?.code;
 return includeCode?`${phone.code} · ${device}`:device
}
function phoneShortName(phone){
 return showProductCode()&&phone?.code?phone.code:([phone?.brand,phone?.model].filter(Boolean).join(' ').trim()||'Aparelho')
}
function normalizeUnlockCredentials(phone){
 const source=Array.isArray(phone?.unlockCredentials)?phone.unlockCredentials.filter(Boolean):[];
 const normalized=source.map((entry,index)=>({
  id:entry.id||crypto.randomUUID(),
  type:entry.type==='pattern'?'pattern':'text',
  label:entry.label||`Alternativa ${index+1}`,
  value:entry.type==='pattern'?'':String(entry.value||''),
  pattern:Array.isArray(entry.pattern)?entry.pattern.map(Number).filter(n=>n>=1&&n<=9):[],
  note:String(entry.note||'')
 }));
 if(!normalized.length&&phone?.devicePassword){
  normalized.push({id:crypto.randomUUID(),type:'text',label:'Alternativa 1',value:String(phone.devicePassword),pattern:[],note:'Migrada da senha antiga'})
 }
 return normalized
}
function sanitizePhoneForLeanMode(phone){
 const {priority,nextAction,nextActionDate,expectedSaleDate,sellerId,purchaseSupplierId,accessories,photoChecklist,photoNotes,archived,archivedAt,imei1,imei2,serial,devicePassword,...clean}=phone||{};
 return {...clean,nfc:phone?.nfc===true?true:phone?.nfc===false?false:null,unlockCredentials:normalizeUnlockCredentials(phone)}
}

function loadMenuSettings(){
 const saved=load(MENUKEY);
 const menus=saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};
 if(menus.phones===false){
  const repaired={...menus,phones:true};
  localStorage.setItem(MENUKEY,JSON.stringify(repaired));
  return repaired
 }
 return{...menus,phones:true}
}


function ThemeDashboardPreview({mode}){return <div className={`v102-live-preview ${mode}`} aria-hidden="true"><aside><span className="logo-dot"/><i/><i/><i/><i/></aside><section><header><span/><b/><b/></header><main><div className="preview-title"><i/><strong/><small/></div><div className="preview-kpis"><article/><article/><article/><article/></div><div className="preview-content"><article><i/><i/><i/><i/></article><aside><i/><i/></aside></div></main></section></div>}

function SystemSettingsPage({visibleMenus,onChange,menuItems,config,onConfigChange}){
 const[tab,setTab]=useState('appearance');
 const showAll=()=>onChange(Object.fromEntries(menuItems.map(x=>[x.id,true])));
 const hideOptional=()=>{const keep=['dashboard','today','phones','batch','dataQuality','activity','ads','profileAnalytics'];onChange(Object.fromEntries(menuItems.map(x=>[x.id,keep.includes(x.id)])))};
 const restore=()=>onConfigChange({...config,themeMode:'light',accent:'v102',applyThemeGlobally:true,borderRadius:12,density:'comfortable',brightness:100,readingMode:false});
 const tabs=[['general','Geral','⚙'],['appearance','Aparência','◉'],['suppliers','Fornecedores','▣'],['banks','Contas bancárias','▤'],['notifications','Notificações','♟'],['system','Sistema','⚙'],['about','Sobre','ⓘ']];
 return <div className="v102-settings-page">
  <Title t="Configurações" s="Preferências, cadastros auxiliares e opções do sistema."><button onClick={restore}><RefreshCw/> Restaurar padrões</button></Title>
  <div className="v102-settings-tabs">{tabs.map(([id,label,icon])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span>{icon}</span>{label}</button>)}</div>
  {tab==='appearance'&&<section className="v102-settings-section v102-appearance-section"><header><span>APARÊNCIA</span><h2>Escolha o ambiente que combina com o seu uso.</h2><p>As prévias abaixo reproduzem a estrutura real do BMCenter. Brilho e modo leitura ficam disponíveis no topo em qualquer tela.</p></header><div className="v102-theme-grid">
    <button className={config.themeMode==='light'?'selected':''} onClick={()=>onConfigChange({...config,themeMode:'light',accent:'v102',applyThemeGlobally:true})}><ThemeDashboardPreview mode="light"/><div className="v102-theme-copy"><b>Claro</b><span>Fundo suave, cartões claros e azul reservado para ações.</span></div>{config.themeMode==='light'&&<em>✓ Em uso</em>}</button>
    <button className={config.themeMode!=='light'?'selected':''} onClick={()=>onConfigChange({...config,themeMode:'dark',accent:'v102',applyThemeGlobally:true})}><ThemeDashboardPreview mode="dark"/><div className="v102-theme-copy"><b>Escuro</b><span>Grafite confortável, superfícies discretas e sem faixas brancas.</span></div>{config.themeMode!=='light'&&<em>✓ Em uso</em>}</button>
   </div><div className="v102-theme-note"><ShieldCheck/><div><b>Paleta fixa aprovada</b><p>O ajuste de brilho não modifica sua paleta; ele apenas reduz a luminosidade da interface. O modo leitura acrescenta conforto para uso noturno.</p></div></div></section>}
  {tab==='general'&&<section className="v102-settings-section"><header><span>GERAL</span><h2>Preferências do sistema</h2></header><div className="v102-settings-card"><label>Página inicial<select value={config.homePage||'dashboard'} onChange={e=>onConfigChange({...config,homePage:e.target.value})}>{menuItems.filter(x=>visibleMenus[x.id]!==false).map(x=><option value={x.id} key={x.id}>{x.text}</option>)}</select></label><label className="v102-setting-toggle"><input type="checkbox" checked={config.showProductCode!==false} onChange={e=>onConfigChange({...config,showProductCode:e.target.checked})}/><span><b>Exibir código interno dos aparelhos</b><small>Quando desligado, BM-000000 desaparece de todo o sistema.</small></span></label><label className="v102-setting-toggle"><input type="checkbox" checked={config.autoSnapshot!==false} onChange={e=>onConfigChange({...config,autoSnapshot:e.target.checked})}/><span><b>Ponto automático antes de uma nova versão</b><small>Mantém uma restauração rápida em caso de atualização.</small></span></label></div><div className="v102-settings-card"><h3>Menus visíveis</h3><div className="v102-settings-actions"><button onClick={showAll}>Mostrar todos</button><button onClick={hideOptional}>Somente essenciais</button></div><div className="v102-menu-settings">{menuItems.map(item=>{const essential=item.id==='phones';return <label key={item.id}><input type="checkbox" checked={essential||visibleMenus[item.id]!==false} disabled={essential} onChange={e=>onChange({...visibleMenus,[item.id]:e.target.checked})}/><span>{item.icon}</span><b>{item.text}</b>{essential&&<small>Essencial</small>}</label>})}</div></div></section>}
  {tab==='suppliers'&&<section className="v102-settings-embedded"><Suppliers/></section>}
  {tab==='banks'&&<section className="v102-settings-embedded"><Banks/></section>}
  {tab==='notifications'&&<section className="v102-settings-section"><header><span>NOTIFICAÇÕES</span><h2>Notificações</h2></header><div className="v102-settings-card"><Empty text="As configurações de notificações serão centralizadas aqui."/></div></section>}
  {tab==='system'&&<section className="v102-settings-section"><header><span>SISTEMA</span><h2>Informações do sistema</h2></header><div className="v102-settings-card"><p>Versão atual: v10.2.2</p><p>Armazenamento local e sincronização em nuvem ativos.</p></div></section>}
  {tab==='about'&&<section className="v102-settings-section"><header><span>SOBRE</span><h2>BMCenter Smartphones</h2></header><div className="v102-settings-card"><p>Sistema de gestão operacional para compra, reparo, anúncio e venda de smartphones.</p></div></section>}
 </div>
}

function CommandPalette({menuItems,onNavigate,onClose}){
 const[q,setQ]=useState(''),phones=load(SKEY),profiles=load(PKEY);
 const query=q.trim().toLowerCase();
 const menus=menuItems.filter(x=>x.text.toLowerCase().includes(query));
 const devices=query?phones.filter(p=>`${p.code} ${p.brand} ${p.model} ${(p.tags||[]).join(' ')}`.toLowerCase().includes(query)).slice(0,6):[];
 const ads=query?phones.flatMap(p=>(p.ads||migrateLegacyAds(p)).map(ad=>({phone:p,ad:normalizeAd(ad)}))).filter(x=>`${x.phone.code} ${x.phone.brand} ${x.phone.model} ${x.ad.name||''} ${x.ad.title||''}`.toLowerCase().includes(query)).slice(0,5):[];
 return <div className="command-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
  <div className="command-palette">
   <div className="command-input"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Ir para menu ou procurar aparelho..."/><kbd>Esc</kbd></div>
   <div className="command-results">
    <small>MENUS</small>{menus.slice(0,8).map(x=><button key={x.id} onClick={()=>onNavigate(x.id)}><span>{x.icon}</span><b>{x.text}</b><em>Abrir</em></button>)}
    {!!devices.length&&<small>SMARTPHONES</small>}{devices.map(p=><button key={p.id} onClick={()=>onNavigate('phones')}><Smartphone/><div><b>{showProductCode()&&<>{p.code} · </>}{p.brand} {p.model}</b><span>{p.status}</span></div><em>{money(p.expected)}</em></button>)}
    {!!ads.length&&<small>ANÚNCIOS</small>}{ads.map(x=><button key={x.ad.id} onClick={()=>onNavigate('ads')}><FileText/><div><b>{showProductCode()&&<>{x.phone.code} · </>}{x.ad.name}</b><span>{x.ad.title||'Sem título'}</span></div><em>{publishedCountForAd(x.ad)}/{profiles.length}</em></button>)}
    {!menus.length&&!devices.length&&!ads.length&&<div className="command-empty">Nenhum resultado encontrado.</div>}
   </div>
  </div>
 </div>
}

function reloadPreservingContext(){sessionStorage.setItem('bmcenter-scroll-y',String(window.scrollY||0));location.reload()}
function CloudGate(){
 const[session,setSession]=useState(null),[ready,setReady]=useState(false),[syncing,setSyncing]=useState(false),[status,setStatus]=useState('');
 useEffect(()=>{let unsubscribe=()=>{};(async()=>{if(!cloudConfigured()){setReady(true);return}const current=await getCloudSession();setSession(current);if(current?.user){setSyncing(true);setStatus('Sincronizando dados...');await initializeCloudState(ALL_CLOUD_KEYS);repairSnapshotStorage();unsubscribe=subscribeCloudState(key=>{setStatus(key==='__BM_RESET__'?'Dados apagados em outro dispositivo':'Alteração recebida de outro dispositivo');setTimeout(()=>key==='__BM_RESET__'?location.reload():reloadPreservingContext(),450)});setSyncing(false)}setReady(true)})();return()=>unsubscribe()},[]);
 async function authenticated(next){setSession(next);setSyncing(true);setStatus('Preparando sua área na nuvem...');await initializeCloudState(ALL_CLOUD_KEYS);repairSnapshotStorage();subscribeCloudState(key=>setTimeout(()=>key==='__BM_RESET__'?location.reload():reloadPreservingContext(),450));setSyncing(false)}
 if(!ready||syncing)return <CloudLoading text={status||'Carregando BMCenter...'}/>;
 if(!cloudConfigured())return <CloudSetupRequired/>;
 if(!session?.user)return <CloudLogin onAuthenticated={authenticated}/>;
 return <App cloudUser={session.user} onCloudLogout={async()=>{await signOutCloud();setSession(null)}}/>
}
function CloudLoading({text}){return <div className="cloud-loading"><div className="cloud-spinner"/><h2>{text}</h2><p>Aguarde alguns instantes.</p></div>}
function CloudSetupRequired(){return <div className="cloud-setup"><div className="logo"><Smartphone/></div><h1>BMCenter Cloud</h1><p>As variáveis do Supabase ainda não foram configuradas.</p><code>VITE_SUPABASE_URL</code><code>VITE_SUPABASE_ANON_KEY</code><small>Consulte o arquivo PUBLICAR-ONLINE.md incluído nesta versão.</small></div>}
function CloudLogin({onAuthenticated}){const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[mode,setMode]=useState('login'),[busy,setBusy]=useState(false),[message,setMessage]=useState('');async function submit(e){e.preventDefault();setBusy(true);setMessage('');try{const result=mode==='login'?await signInCloud(email,password):await signUpCloud(email,password);if(result.session)await onAuthenticated(result.session);else setMessage('Conta criada. Confirme o e-mail recebido e depois entre no sistema.')}catch(err){setMessage(err.message||'Não foi possível acessar.')}finally{setBusy(false)}}return <div className="login cloud-login"><form onSubmit={submit}><div className="logo"><Smartphone/></div><h1>BMCenter Smartphones</h1><p>Acesse seus dados sincronizados em todos os dispositivos.</p><label>E-mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="seuemail@exemplo.com"/></label><label>Senha<input type="password" required minLength="6" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres"/></label>{message&&<div className="cloud-auth-message">{message}</div>}<button className="primary" disabled={busy}>{busy?'Aguarde...':mode==='login'?'Entrar':'Criar conta'}</button><button type="button" className="link-button" onClick={()=>{setMode(mode==='login'?'signup':'login');setMessage('')}}>{mode==='login'?'Criar minha conta na nuvem':'Já tenho uma conta'}</button></form></div>}
function Nav({icon,text,active,onClick,badge}){return <button className={'nav '+(active?'active':'')} onClick={onClick}>{icon}<span>{text}</span>{badge>0&&<em className="nav-badge">{badge}</em>}</button>}
function PageContent({page}){
 try{
  return page==='dashboard'?<Dashboard/>:
   page==='today'?<TodayPage/>:
   page==='phones'?<Phones/>:
   page==='ads'?<Ads/>:
   page==='batch'?<BatchActionsPage/>:
   page==='activity'?<ActivityCenterPage/>:
   page==='suppliers'?<Suppliers/>:
   page==='banks'?<Banks/>:
   page==='profileAnalytics'?<ProfileAnalyticsPage/>:
   page==='parts'?<Parts/>:
   page==='dataQuality'?<DataQualityPage/>:
   page==='pending'?<PendingCenterPage/>:
   page==='reports'?<ReportsPage/>:
   page==='data'?<DataCenterPage/>:
   page==='backup'?<BackupPage/>:<Phones/>;
 }catch(error){
  console.error(error);
  return <div className="panel error-panel"><h2>Não foi possível abrir esta tela</h2><p>{String(error?.message||error)}</p><button onClick={()=>location.reload()}>Recarregar sistema</button></div>
 }
}

function getOperationalAlerts(){
 const phones=load(SKEY),alerts=[];
 phones.filter(p=>p.status!=='Vendido').forEach(p=>{
  if(daysSince(p.lastActivityAt||p.date)>=7)alerts.push({type:'stale',title:`${phoneShortName(p)} parado há ${daysSince(p.lastActivityAt||p.date)} dias`,detail:`${p.brand} ${p.model}`,phoneId:p.id});
  if(!(p.ads||migrateLegacyAds(p)).length&&['Pronto','Para fotografar','Anúncio preparado','Anunciado'].includes(p.status))alerts.push({type:'ad',title:`${phoneShortName(p)} sem anúncio`,detail:`${p.brand} ${p.model}`,phoneId:p.id});
 });
 return alerts;
}


function GoalsPage(){
 const[goals,setGoals]=useState(()=>{const saved=load(GOALKEY);return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{month:new Date().toISOString().slice(0,7),salesQuantity:0,adsPublished:0,phonesPrepared:0,maximumStale:7}});
 const phones=load(SKEY),profiles=load(PKEY),month=goals.month||new Date().toISOString().slice(0,7);
 const sales=phones.filter(p=>(p.sale?.soldAt||'').slice(0,7)===month);
 const ads=phones.flatMap(p=>(p.ads||migrateLegacyAds(p)).map(a=>normalizeAd(a))).reduce((sum,a)=>sum+Object.values(a.publications||{}).filter(x=>x.status==='published'&&(x.date||'').slice(0,7)===month).length,0);
 const prepared=phones.filter(p=>['Pronto','Para fotografar','Anúncio preparado','Anunciado','Vendido'].includes(p.status)&&(p.lastActivityAt||p.date||'').slice(0,7)===month).length;
 const stale=phones.filter(p=>p.status!=='Vendido'&&daysSince(p.lastActivityAt||p.date)>Number(goals.maximumStale||7)).length;
 const persist=next=>{setGoals(next);save(GOALKEY,next)};
 const cards=[
  ['Vendas no mês',sales.length,Number(goals.salesQuantity||0)],
  ['Publicações no mês',ads,Number(goals.adsPublished||0)],
  ['Aparelhos preparados',prepared,Number(goals.phonesPrepared||0)]
 ];
 return <>
  <Title t="Metas operacionais" s="Defina objetivos mensais e acompanhe o avanço da operação."/>
  <div className="panel goal-config"><div className="grid"><Field label="Mês" type="month" value={month} onChange={v=>persist({...goals,month:v})}/><Field label="Meta de vendas" type="number" value={goals.salesQuantity||0} onChange={v=>persist({...goals,salesQuantity:Number(v)})}/><Field label="Meta de publicações" type="number" value={goals.adsPublished||0} onChange={v=>persist({...goals,adsPublished:Number(v)})}/><Field label="Meta de aparelhos preparados" type="number" value={goals.phonesPrepared||0} onChange={v=>persist({...goals,phonesPrepared:Number(v)})}/><Field label="Máximo de dias parado" type="number" value={goals.maximumStale||7} onChange={v=>persist({...goals,maximumStale:Number(v)})}/></div></div>
  <div className="goal-grid">{cards.map(([name,current,target])=>{const pct=target?Math.min(100,Math.round(current/target*100)):0;return <article key={name}><div><Target/><span>{name}</span></div><strong>{current} <small>/ {target||'sem meta'}</small></strong><div className="goal-track"><i style={{width:`${pct}%`}}/></div><b>{pct}% concluído</b></article>})}<article className={stale?'goal-warning':'goal-ok'}><div><Gauge/><span>Fora do prazo operacional</span></div><strong>{stale}</strong><p>Aparelhos parados acima de {goals.maximumStale||7} dias.</p></article></div>
 </>
}

function TodayPage(){
 const phones=load(SKEY),profiles=load(PKEY),alerts=getOperationalAlerts(),active=phones.filter(p=>p.status!=='Vendido');
 const groups=[
  {title:'Analisar',items:active.filter(p=>p.status==='Aguardando análise')},
  {title:'Comprar peças',items:active.filter(p=>(p.parts||[]).some(part=>['Cotando','Comprar'].includes(part.status)))},
  {title:'Reparar e testar',items:active.filter(p=>['Em reparo','Em testes','Aguardando peças'].includes(p.status))},
  {title:'Prontos para anunciar',items:active.filter(p=>['Pronto','Para fotografar','Anúncio preparado'].includes(p.status)&&!(p.ads||migrateLegacyAds(p)).length)}
 ];
 return <TodayV102 groups={groups} alerts={alerts} phoneDisplayName={phoneDisplayName}/>

}

function GlobalSearchPage(){
 const[q,setQ]=useState('');
 const phones=load(SKEY),sellers=load(VKEY),suppliers=load(FKEY),profiles=load(PKEY);
 const query=q.trim().toLowerCase();
 const phoneResults=query?phones.filter(p=>`${p.code} ${p.brand} ${p.model} ${(p.tags||[]).join(' ')} ${p.tasks||''} ${p.notes||''}`.toLowerCase().includes(query)):[];
 const sellerResults=query?sellers.filter(x=>`${x.name} ${x.phone||''} ${x.city||''} ${x.address||''}`.toLowerCase().includes(query)):[];
 const supplierResults=query?suppliers.filter(x=>`${x.name} ${x.phone||''} ${x.whatsapp||''} ${x.city||''}`.toLowerCase().includes(query)):[];
 const adResults=query?phones.flatMap(p=>(p.ads||migrateLegacyAds(p)).map(ad=>({phone:p,ad:normalizeAd(ad)}))).filter(x=>`${x.ad.name||''} ${x.ad.title||''} ${x.ad.description||''} ${x.phone.code} ${x.phone.brand} ${x.phone.model}`.toLowerCase().includes(query)):[];
 return <>
  <Title t="Pesquisa global" s="Encontre aparelhos, anúncios, vendedores e fornecedores em uma única busca."/>
  <div className="global-search-box"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Digite modelo, nome, telefone, etiqueta..."/><span>{phoneResults.length+sellerResults.length+supplierResults.length+adResults.length} resultado(s)</span></div>
  {!query?<div className="search-welcome"><Search size={38}/><b>Comece digitando acima</b><span>A pesquisa consulta todas as áreas do BMCenter.</span></div>:
  <div className="global-results">
   <SearchSection title="Smartphones" count={phoneResults.length}>{phoneResults.map(p=><div className="search-result" key={p.id}><Smartphone/><div><b>{showProductCode()&&<>{p.code} · </>}{p.brand} {p.model}</b><small>{p.nfc===true?'NFC · ':''}{p.status}</small></div><strong>{money(p.expected)}</strong></div>)}</SearchSection>
   <SearchSection title="Anúncios" count={adResults.length}>{adResults.map(x=><div className="search-result" key={x.ad.id}><FileText/><div><b>{showProductCode()&&<>{x.phone.code} · </>}{x.ad.name}</b><small>{x.ad.title||'Sem título'}</small></div><strong>{publishedCountForAd(x.ad)}/{profiles.length}</strong></div>)}</SearchSection>
   <SearchSection title="Vendedores" count={sellerResults.length}>{sellerResults.map(x=><div className="search-result" key={x.id}><Users/><div><b>{x.name}</b><small>{x.phone||'Sem telefone'} · {x.city||''}</small></div></div>)}</SearchSection>
   <SearchSection title="Fornecedores" count={supplierResults.length}>{supplierResults.map(x=><div className="search-result" key={x.id}><Store/><div><b>{x.name}</b><small>{x.phone||x.whatsapp||'Sem telefone'} · {x.category||''}</small></div></div>)}</SearchSection>
  </div>}
 </>
}
function SearchSection({title,count,children}){return <section className="panel search-section"><h2>{title}<span>{count}</span></h2>{children}{!count&&<Empty text="Nenhum resultado nesta área."/>}</section>}


function ProfileAnalyticsPage(){
 const[profiles,setProfiles]=useState(()=>load(PKEY).map((p,index)=>({active:true,color:'#1877f2',platform:'Facebook Marketplace',order:index,...p})));
 const[phones]=useState(load(SKEY)),[tab,setTab]=useState('manage'),[editing,setEditing]=useState(null),[query,setQuery]=useState('');
 const persist=next=>{const ordered=next.map((p,index)=>({...p,order:index}));setProfiles(ordered);save(PKEY,ordered)};
 const sales=phones.filter(p=>p.sale?.soldAt);
 const allAds=phones.flatMap(p=>(p.ads||migrateLegacyAds(p)).map(ad=>({phone:p,ad:normalizeAd(ad)})));
 const data=profiles.map(profile=>{
  const published=allAds.filter(x=>x.ad.publications[profile.id]?.status==='published');
  const sold=sales.filter(p=>p.sale?.profileId===profile.id);
  const value=sold.reduce((a,p)=>a+Number(p.sale?.value||0),0);
  const days=sold.map(p=>Math.max(0,Math.round((new Date(p.sale.soldAt)-new Date(p.date||p.sale.soldAt))/86400000)));
  return{profile,published:published.length,sales:sold.length,value,last:[...sold].sort((a,b)=>(b.sale.soldAt||'').localeCompare(a.sale.soldAt||''))[0],averageDays:days.length?Math.round(days.reduce((a,b)=>a+b,0)/days.length):0}
 }).sort((a,b)=>b.sales-a.sales||b.value-a.value);
 const filtered=profiles.filter(p=>`${p.name} ${p.platform||''} ${p.notes||''}`.toLowerCase().includes(query.toLowerCase()));
 function removeProfile(profile){
  const used=phones.some(phone=>(phone.ads||migrateLegacyAds(phone)).some(ad=>normalizeAd(ad).publications?.[profile.id])||phone.sale?.profileId===profile.id);
  if(used&&!confirm(`O perfil "${profile.name}" possui histórico em anúncios ou vendas. Deseja excluí-lo mesmo assim?`))return;
  if(!used&&!confirm(`Excluir o perfil "${profile.name}"?`))return;
  persist(profiles.filter(p=>p.id!==profile.id))
 }
 function move(id,direction){
  const index=profiles.findIndex(p=>p.id===id),target=index+direction;
  if(index<0||target<0||target>=profiles.length)return;
  const next=[...profiles],[item]=next.splice(index,1);next.splice(target,0,item);persist(next)
 }
 return <div className="premium-page modern-page profiles-modern-page">
  <Title t="Perfis do Facebook" s="Cadastre, organize e acompanhe os perfis usados nas publicações e vendas.">
   <button className="primary" onClick={()=>setEditing({id:crypto.randomUUID(),name:'',platform:'Facebook Marketplace',facebookUrl:'',color:'#1877f2',notes:'',active:true})}><Plus/> Novo perfil</button>
  </Title>
  <div className="profile-page-tabs">
   <button className={tab==='manage'?'active':''} onClick={()=>setTab('manage')}>Gerenciar perfis</button>
   <button className={tab==='analytics'?'active':''} onClick={()=>setTab('analytics')}>Desempenho</button>
  </div>

  {tab==='manage'&&<>
   <div className="profile-manager-toolbar panel">
    <label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar perfil do Facebook..."/></label>
    <div><span>{profiles.filter(p=>p.active!==false).length} ativo(s)</span><span>{profiles.filter(p=>p.active===false).length} inativo(s)</span></div>
   </div>
   <div className="facebook-profile-grid">
    {filtered.map((profile,index)=>{const stats=data.find(x=>x.profile.id===profile.id);return <article className={profile.active===false?'inactive':''} key={profile.id}>
     <header>
      <div className="facebook-profile-avatar" style={{background:profile.color||'#1877f2'}}>{String(profile.name||'FB').slice(0,2).toUpperCase()}</div>
      <div><b>{profile.name||'Perfil sem nome'}</b><span>{profile.platform||'Facebook Marketplace'}</span></div>
      <span className={profile.active===false?'profile-state off':'profile-state'}>{profile.active===false?'Inativo':'Ativo'}</span>
     </header>
     <div className="facebook-profile-stats"><div><strong>{stats?.published||0}</strong><span>Publicações</span></div><div><strong>{stats?.sales||0}</strong><span>Vendas</span></div><div><strong>{money(stats?.value||0)}</strong><span>Valor vendido</span></div></div>
     {profile.facebookUrl&&<a href={profile.facebookUrl} target="_blank" rel="noreferrer">Abrir perfil do Facebook</a>}
     {profile.notes&&<p>{profile.notes}</p>}
     <footer>
      <div className="profile-order-actions"><button disabled={index===0} onClick={()=>move(profile.id,-1)} title="Mover para cima">↑</button><button disabled={index===profiles.length-1} onClick={()=>move(profile.id,1)} title="Mover para baixo">↓</button></div>
      <button onClick={()=>persist(profiles.map(p=>p.id===profile.id?{...p,active:p.active===false}:p))}>{profile.active===false?'Ativar':'Desativar'}</button>
      <button onClick={()=>setEditing(profile)}>Editar</button>
      <button className="danger" onClick={()=>removeProfile(profile)}>Excluir</button>
     </footer>
    </article>})}
   </div>
   {!filtered.length&&<Empty text={profiles.length?'Nenhum perfil encontrado.':'Nenhum perfil do Facebook cadastrado.'}/>}
  </>}

  {tab==='analytics'&&<>
   <div className="profile-analytics-grid">{data.map((x,index)=><article key={x.profile.id}>
    <div className="profile-analytics-head"><span style={{background:x.profile.color||'#1877f2'}}>{String(x.profile.name||'?').slice(0,2).toUpperCase()}</span><div><b>{x.profile.name}</b><small>Posição #{index+1} · {x.profile.active===false?'Inativo':'Ativo'}</small></div></div>
    <div className="profile-analytics-stats"><div><span>Anúncios publicados</span><strong>{x.published}</strong></div><div><span>Vendas</span><strong>{x.sales}</strong></div><div><span>Valor vendido</span><strong>{money(x.value)}</strong></div><div><span>Tempo médio</span><strong>{x.averageDays} dias</strong></div></div>
    <footer><span>Última venda</span><b>{x.last?`${formatDate(x.last.sale.soldAt)} · ${x.last.brand} ${x.last.model}`:'Nenhuma venda registrada'}</b></footer>
   </article>)}</div>
   {!profiles.length&&<Empty text="Cadastre o primeiro perfil do Facebook."/>}
  </>}

  {editing&&<FacebookProfileModal item={editing} onClose={()=>setEditing(null)} onSave={value=>{persist(profiles.some(p=>p.id===value.id)?profiles.map(p=>p.id===value.id?value:p):[...profiles,value]);setEditing(null)}}/>}
 </div>
}

function FacebookProfileModal({item,onClose,onSave}){
 const[f,setF]=useState({...item});
 return <Modal title={item.name?'Editar perfil do Facebook':'Novo perfil do Facebook'} onClose={onClose}>
  <div className="facebook-profile-form">
   <Field label="Nome de identificação" value={f.name||''} onChange={v=>setF({...f,name:v})}/>
   <label>Plataforma<select value={f.platform||'Facebook Marketplace'} onChange={e=>setF({...f,platform:e.target.value})}><option>Facebook Marketplace</option><option>Facebook perfil pessoal</option><option>Facebook Página</option><option>Instagram</option><option>Outro</option></select></label>
   <Field label="Link do perfil ou página" value={f.facebookUrl||''} onChange={v=>setF({...f,facebookUrl:v})}/>
   <label>Cor de identificação<input type="color" value={f.color||'#1877f2'} onChange={e=>setF({...f,color:e.target.value})}/></label>
   <label className="profile-active-check"><input type="checkbox" checked={f.active!==false} onChange={e=>setF({...f,active:e.target.checked})}/> Perfil ativo para novos anúncios</label>
   <label className="profile-notes-field">Observações<textarea value={f.notes||''} onChange={e=>setF({...f,notes:e.target.value})} placeholder="Informações internas, celular usado, localização, responsável..."/></label>
  </div>
  <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>{if(!f.name?.trim())return alert('Informe o nome do perfil.');onSave({...f,name:f.name.trim()})}}>Salvar perfil</button></div>
 </Modal>
}

function BatchActionsPage(){
 const[phones,setPhones]=useState(load(SKEY)),[query,setQuery]=useState(''),[statusFilter,setStatusFilter]=useState('Ativos'),[selected,setSelected]=useState([]),[newStatus,setNewStatus]=useState(''),[newTag,setNewTag]=useState('');
 const persist=v=>{const lean=v.map(sanitizePhoneForLeanMode);setPhones(lean);save(SKEY,lean)};
 const rows=phones.filter(p=>{const text=`${p.code} ${p.brand} ${p.model} ${(p.tags||[]).join(' ')}`.toLowerCase();const statusOk=statusFilter==='Todos'||(statusFilter==='Ativos'?p.status!=='Vendido':p.status===statusFilter);return text.includes(query.toLowerCase())&&statusOk});
 const allSelected=rows.length>0&&rows.every(p=>selected.includes(p.id));
 function toggle(id){setSelected(selected.includes(id)?selected.filter(x=>x!==id):[...selected,id])}
 function applyBatch(){
  if(!selected.length)return alert('Selecione pelo menos um aparelho.');
  const stamp=new Date().toISOString();
  const changed=phones.map(p=>{if(!selected.includes(p.id))return p;let next={...p},changes=[];if(newStatus){next.status=newStatus;changes.push(`status para ${newStatus}`)}if(newTag.trim()){const clean=newTag.trim().toUpperCase();next.tags=[...new Set([...(next.tags||[]),clean])];changes.push(`etiqueta ${clean}`)}next.lastActivityAt=stamp;return changes.length?addTimeline(next,`Alteração em lote: ${changes.join(', ')}`):next});
  persist(changed);setSelected([]);setNewStatus('');setNewTag('');
 }
 const selectedTags=[...new Set(phones.filter(p=>selected.includes(p.id)).flatMap(p=>p.tags||[]))].sort();
 function removeTag(tag){persist(phones.map(p=>selected.includes(p.id)?addTimeline({...p,tags:(p.tags||[]).filter(t=>t!==tag),lastActivityAt:new Date().toISOString()},`Etiqueta removida em lote: ${tag}`):p))}
 return <BatchV102
  rows={rows} selected={selected} setSelected={setSelected} query={query} setQuery={setQuery}
  statusFilter={statusFilter} setStatusFilter={setStatusFilter} statuses={statuses}
  newStatus={newStatus} setNewStatus={setNewStatus} newTag={newTag} setNewTag={setNewTag}
  applyBatch={applyBatch} toggle={toggle} allSelected={allSelected}
  daysSince={daysSince} phoneDisplayName={phoneDisplayName}
/>
}

function DataQualityPage(){
 const[phones,setPhones]=useState(load(SKEY)),[filter,setFilter]=useState('Todos');const persist=v=>{const lean=v.map(sanitizePhoneForLeanMode);setPhones(lean);save(SKEY,lean)};
 const issues=phones.flatMap(phone=>{const list=[];if(!phone.brand||!phone.model)list.push(['Cadastro','Alta','Marca ou modelo não informado']);if(phone.nfc===null||phone.nfc===undefined)list.push(['Recursos','Baixa','NFC ainda não informado']);if(!normalizeUnlockCredentials(phone).length)list.push(['Acesso','Baixa','Nenhuma alternativa de desbloqueio registrada']);if(!Number(phone.expected||0)&&phone.status!=='Vendido')list.push(['Valor','Média','Previsão de venda não informada']);if(['Pronto','Para fotografar','Anúncio preparado','Anunciado'].includes(phone.status)&&!(phone.ads||migrateLegacyAds(phone)).length)list.push(['Anúncios','Alta','Aparelho pronto sem anúncio']);return list.map(([type,severity,message])=>({phone,type,severity,message}))});
 const filtered=issues.filter(x=>filter==='Todos'||x.severity===filter),affected=new Set(issues.map(x=>x.phone.id)).size;
 function suggest(phone){const text=phone.status==='Aguardando análise'?'Realizar diagnóstico':phone.status==='Aguardando peças'?'Acompanhar pedido de peças':phone.status==='Pronto'?'Preparar anúncio':'Revisar próxima etapa';persist(phones.map(p=>p.id===phone.id?addTimeline({...p,lastActivityAt:new Date().toISOString()},`Ação sugerida: ${text}`):p))}
 return <><Title t="Qualidade dos dados" s="Encontre cadastros incompletos e informações úteis ausentes."/><div className="quality-metrics"><div><span>Problemas</span><strong>{issues.length}</strong></div><div><span>Aparelhos afetados</span><strong>{affected}</strong></div><div><span>Problemas graves</span><strong>{issues.filter(x=>x.severity==='Alta').length}</strong></div><div><span>Cadastros completos</span><strong>{Math.max(0,phones.length-affected)}</strong></div></div>
 <div className="tabs">{['Todos','Alta','Média','Baixa'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="quality-list">{filtered.map((x,i)=><article key={`${x.phone.id}-${i}`}><span className={`quality-severity severity-${x.severity.toLowerCase().replace('é','e')}`}>{x.severity}</span><div><b>{showProductCode()&&<>{x.phone.code} · </>}{x.phone.brand} {x.phone.model}</b><small>{x.type} · {x.message}</small></div>{x.type==='Operação'&&<button onClick={()=>suggest(x.phone)}>Sugerir ação</button>}</article>)}{!filtered.length&&<Empty text="Nenhum problema nesta categoria."/>}</div></>
}

function AdRenewalCenterPage(){
 const[phones,setPhones]=useState(()=>safeAdsPhones()),[range,setRange]=useState('7'),[query,setQuery]=useState('');const profiles=load(PKEY),persist=v=>{setPhones(v);save(SKEY,v)},rows=[];
 phones.forEach(phone=>(phone.ads||[]).forEach(ad=>profiles.forEach(profile=>{const pub=normalizeAd(ad).publications[profile.id];if(pub?.status==='published')rows.push({phone,ad:normalizeAd(ad),profile,pub,days:pub.renewAt?daysUntil(pub.renewAt):99999})})));
 const filtered=rows.filter(x=>`${x.phone.code} ${x.phone.brand} ${x.phone.model} ${x.ad.name} ${x.profile.name}`.toLowerCase().includes(query.toLowerCase())&&(range==='Todos'||(range==='Vencidos'?x.days<0:x.days<=Number(range)))).sort((a,b)=>a.days-b.days);
 function renew(items){const ids=new Set(items.map(x=>`${x.phone.id}|${x.ad.id}|${x.profile.id}`)),d=new Date(),today=d.toISOString().slice(0,10);d.setDate(d.getDate()+7);const renewAt=d.toISOString().slice(0,10);persist(phones.map(phone=>({...phone,ads:(phone.ads||[]).map(ad=>{const n=normalizeAd(ad),publications={...n.publications};profiles.forEach(profile=>{if(ids.has(`${phone.id}|${ad.id}|${profile.id}`)){const pub=publications[profile.id]||normalizePublication({});publications[profile.id]={...pub,status:'published',date:pub.date||today,lastRenewedAt:today,renewAt}}});return normalizeAd({...n,publications,updatedAt:new Date().toISOString()})})})))}
 function schedule(item){const d=new Date();d.setDate(d.getDate()+7);const renewAt=d.toISOString().slice(0,10);persist(phones.map(p=>p.id!==item.phone.id?p:{...p,ads:(p.ads||[]).map(a=>a.id!==item.ad.id?a:normalizeAd({...a,publications:{...normalizeAd(a).publications,[item.profile.id]:{...item.pub,renewAt}}}))}))}
 const due=rows.filter(x=>x.days<=0),unscheduled=rows.filter(x=>!x.pub.renewAt);
 return <><Title t="Central de renovações" s="Controle publicações por perfil."><button className="primary" onClick={()=>renew(due)} disabled={!due.length}>Renovar vencidas ({due.length})</button></Title><div className="renewal-metrics"><div><span>Ativas</span><strong>{rows.length}</strong></div><div><span>Vencidas/hoje</span><strong>{due.length}</strong></div><div><span>Próximos 7 dias</span><strong>{rows.filter(x=>x.days>=0&&x.days<=7).length}</strong></div><div><span>Sem programação</span><strong>{unscheduled.length}</strong></div></div>
 <div className="filter-bar renewal-filters"><label><Search size={16}/> Pesquisa<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Aparelho, anúncio ou perfil"/></label><label>Período<select value={range} onChange={e=>setRange(e.target.value)}><option value="7">7 dias</option><option value="15">15 dias</option><option value="30">30 dias</option><option>Vencidos</option><option>Todos</option></select></label></div><div className="renewal-list">{filtered.map(item=><article className={item.days<0?'overdue':item.days<=3?'soon':''} key={`${item.phone.id}-${item.ad.id}-${item.profile.id}`}><div><b>{showProductCode()&&<>{item.phone.code} · </>}{item.phone.brand} {item.phone.model}</b><small>{item.ad.name} · {item.profile.name}</small></div><div><span>Última</span><b>{formatDate(item.pub.lastRenewedAt||item.pub.date)}</b></div><div><span>Próxima</span><b>{item.pub.renewAt?formatDate(item.pub.renewAt):'Sem data'}</b></div><div><span>Situação</span><b>{!item.pub.renewAt?'Sem programação':item.days<0?`${Math.abs(item.days)} dia(s) atrasado`:item.days===0?'Hoje':`Em ${item.days} dia(s)`}</b></div><div className="renewal-actions">{!item.pub.renewAt&&<button onClick={()=>schedule(item)}>Programar</button>}<button className="primary" onClick={()=>renew([item])}>Renovado hoje</button></div></article>)}{!filtered.length&&<Empty text="Nenhuma publicação encontrada."/>}</div></>
}

function SupplierIntelligencePage(){
 const phones=load(SKEY),suppliers=load(FKEY),quotes=phones.flatMap(phone=>(phone.parts||[]).flatMap(part=>(part.quotes||[]).map(q=>({phone,part,quote:q,supplierName:q.supplier||suppliers.find(s=>s.id===q.supplierId)?.name||'Não informado'})))),stats={};
 quotes.forEach(x=>{const key=x.supplierName;if(!stats[key])stats[key]={name:key,quotes:0,wins:0,total:0,items:new Set()};stats[key].quotes++;stats[key].total+=Number(x.quote.price||0);stats[key].items.add(x.part.name);const prices=(x.part.quotes||[]).map(q=>Number(q.price||0)).filter(v=>v>0);if(prices.length&&Number(x.quote.price||0)===Math.min(...prices))stats[key].wins++});
 const ranked=Object.values(stats).map(x=>({...x,average:x.quotes?x.total/x.quotes:0,winRate:x.quotes?Math.round(x.wins/x.quotes*100):0})).sort((a,b)=>b.wins-a.wins||a.average-b.average),names=[...new Set(quotes.map(x=>x.part.name))].sort();
 return <><Title t="Inteligência de fornecedores" s="Compare preços e frequência de melhores ofertas."/><div className="supplier-intel-grid">{ranked.map((x,i)=><article key={x.name}><header><span>#{i+1}</span><div><b>{x.name}</b><small>{x.items.size} tipo(s) de peça</small></div></header><div><div><span>Cotações</span><strong>{x.quotes}</strong></div><div><span>Menor preço</span><strong>{x.wins}x</strong></div><div><span>Taxa de vitória</span><strong>{x.winRate}%</strong></div><div><span>Média</span><strong>{money(x.average)}</strong></div></div></article>)}</div>
 <section className="panel"><h2>Comparativo por peça</h2><div className="table-wrap"><table><thead><tr><th>Peça</th><th>Menor preço</th><th>Fornecedor</th><th>Maior preço</th><th>Economia possível</th><th>Cotações</th></tr></thead><tbody>{names.map(name=>{const list=quotes.filter(x=>x.part.name===name&&Number(x.quote.price)>0).sort((a,b)=>Number(a.quote.price)-Number(b.quote.price)),low=list[0],high=list[list.length-1];return <tr key={name}><td><b>{name}</b></td><td>{money(low?.quote.price)}</td><td>{low?.supplierName||'—'}</td><td>{money(high?.quote.price)}</td><td className="profit-positive">{money(Number(high?.quote.price||0)-Number(low?.quote.price||0))}</td><td>{list.length}</td></tr>})}</tbody></table>{!names.length&&<Empty text="Ainda não existem cotações suficientes."/>}</div></section></>
}


function ActivityCenterPage(){
 const[phones]=useState(load(SKEY)),[query,setQuery]=useState(''),[type,setType]=useState('Todos'),[days,setDays]=useState('30');
 const events=phones.flatMap(phone=>(phone.timeline||[]).map(event=>({phone,event,type:classifyActivity(event.message)}))).filter(x=>{
  const text=`${x.phone.code} ${x.phone.brand} ${x.phone.model} ${x.event.message}`.toLowerCase();
  const dateOk=days==='Todos'||daysSince(x.event.date)<=Number(days);
  return text.includes(query.toLowerCase())&&(type==='Todos'||x.type===type)&&dateOk;
 }).sort((a,b)=>new Date(b.event.date)-new Date(a.event.date));
 return <ActivityV102 events={events} query={query} setQuery={setQuery} type={type} setType={setType} days={days} setDays={setDays} showProductCode={showProductCode}/>;
}
function classifyActivity(message=''){
 const m=message.toLowerCase();
 if(m.includes('venda')||m.includes('vendido'))return'Venda';
 if(m.includes('anúncio')||m.includes('publicação')||m.includes('renov'))return'Anúncios';
 if(m.includes('peça')||m.includes('cotação')||m.includes('pedido'))return'Peças';
 if(m.includes('criado')||m.includes('cadastrado')||m.includes('comprado'))return'Cadastro';
 if(m.includes('status')||m.includes('diagnóstico')||m.includes('reparo')||m.includes('ação'))return'Operação';
 return'Outros';
}

function ArchivedPhonesPage(){
 const[phones,setPhones]=useState(load(SKEY)),[query,setQuery]=useState('');
 const persist=v=>{setPhones(v);save(SKEY,v)};
 const rows=phones.filter(p=>p.archived&&`${p.code} ${p.brand} ${p.model}`.toLowerCase().includes(query.toLowerCase()));
 function restore(phone){persist(phones.map(p=>p.id===phone.id?addTimeline({...p,archived:false,archivedAt:'',lastActivityAt:new Date().toISOString()},'Aparelho restaurado do arquivo'):p))}
 function removeForever(phone){if(!confirm(`Excluir definitivamente ${phone.code}? Esta ação não pode ser desfeita.`))return;persist(phones.filter(p=>p.id!==phone.id))}
 return <>
  <Title t="Aparelhos arquivados" s="Itens retirados da operação principal, mas ainda preservados no histórico."/>
  <div className="filter-bar"><label><Search size={16}/> Pesquisa<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Modelo"/></label></div>
  <div className="table-wrap"><table><thead><tr><th>Aparelho</th><th>Status anterior</th><th>Arquivado em</th><th>Compra</th><th>Valor previsto</th><th></th></tr></thead><tbody>{rows.map(p=><tr key={p.id}><td><b>{phoneDisplayName(p)}</b></td><td>{p.status}</td><td>{p.archivedAt?new Date(p.archivedAt).toLocaleString('pt-BR'):'—'}</td><td>{formatDate(p.date)}</td><td>{money(p.expected)}</td><td><button onClick={()=>restore(p)}>Restaurar</button>{' '}<button className="danger" onClick={()=>removeForever(p)}>Excluir definitivamente</button></td></tr>)}</tbody></table>{!rows.length&&<Empty text="Nenhum aparelho arquivado."/>}</div>
 </>
}

function Dashboard(){
 const phones=load(SKEY),profiles=load(PKEY),today=new Date();
 const active=phones.filter(p=>p.status!=='Vendido');
 const sales=phones.filter(p=>p.sale?.soldAt);
 const pendingReceivables=sales.reduce((a,p)=>a+salePendingValue(p.sale),0);
 const allAds=phones.flatMap(p=>(p.ads||migrateLegacyAds(p)).map(ad=>({phone:p,ad:normalizeAd(ad)})));
 const prepared=allAds.filter(x=>x.ad.title&&x.ad.description);
 const dataIssues=active.filter(p=>(p.nfc===null||p.nfc===undefined)||!Number(p.expected||0)).length;
 const publishedCount=allAds.reduce((sum,x)=>sum+Object.values(x.ad.publications||{}).filter(v=>v.status==='published').length,0);
 const invested=active.reduce((a,x)=>a+phoneTotalCost(x),0);
 const expected=active.reduce((a,x)=>a+Number(x.expected||0),0);
 const forecast7=active.filter(p=>daysUntil(p.expectedSaleDate)>=0&&daysUntil(p.expectedSaleDate)<=7).reduce((a,p)=>a+Number(p.expected||0),0);
 const forecast30=active.filter(p=>daysUntil(p.expectedSaleDate)>=0&&daysUntil(p.expectedSaleDate)<=30).reduce((a,p)=>a+Number(p.expected||0),0);
 const stale=active.filter(p=>daysSince(p.lastActivityAt||p.date)>=7).sort((a,b)=>daysSince(b.lastActivityAt||b.date)-daysSince(a.lastActivityAt||a.date));
 const attention=stale.slice(0,6);
 const salesByProfile=profiles.map(profile=>{
  const items=sales.filter(p=>p.sale?.profileId===profile.id);
  return{profile,quantity:items.length,revenue:items.reduce((sum,p)=>sum+Number(p.sale?.value||0),0)};
 }).filter(x=>x.quantity).sort((a,b)=>b.revenue-a.revenue);
 const workflow=[
  ['Aguardando análise',active.filter(p=>p.status==='Aguardando análise').length],
  ['Aguardando peças',active.filter(p=>p.status==='Aguardando peças').length],
  ['Em reparo',active.filter(p=>p.status==='Em reparo').length],
  ['Em testes',active.filter(p=>p.status==='Em testes').length],
  ['Prontos',active.filter(p=>['Pronto','Para fotografar','Anúncio preparado','Anunciado'].includes(p.status)).length]
 ];
 const workflowMax=Math.max(1,...workflow.map(x=>x[1]));
 const metrics=[
  {label:'Total de aparelhos',value:phones.length,detail:`${active.length} em estoque`,kind:'blue'},
  {label:'Anúncios publicados',value:publishedCount,detail:`${prepared.length} preparados`,kind:'purple'},
  {label:'Vendas realizadas',value:sales.length,detail:money(sales.reduce((a,p)=>a+Number(p.sale?.value||0),0)),kind:'green'},
  {label:'Previsão 7 dias',value:money(forecast7),detail:'entrada estimada',kind:'blue'},
  {label:'Previsão 30 dias',value:money(forecast30),detail:'entrada estimada',kind:'purple'},
  {label:'Valor em estoque',value:money(expected),detail:`Custo ${money(invested)}`,kind:'amber'},
  {label:'Lucro previsto',value:money(expected-invested),detail:'sobre o estoque',kind:'green'},
  {label:'A receber',value:money(pendingReceivables),detail:'vendas pendentes',kind:'amber'},
  {label:'Cadastros incompletos',value:dataIssues,detail:'precisam de revisão',kind:'amber'},
  {label:'Parados há 7+ dias',value:stale.length,detail:'sem movimentação',kind:'red'}
 ];
 return <DashboardV102 metrics={metrics} workflow={workflow} workflowMax={workflowMax} attention={attention} salesByProfile={salesByProfile} money={money} active={active.length}/>
}


function defaultPhoneColumns(){return[
 {id:'code',label:'Código',width:86,visible:true},
 {id:'device',label:'Aparelho',width:200,visible:true},
 {id:'profiles',label:'Perfis anunciados',width:190,visible:true},
 {id:'status',label:'Status',width:145,visible:true},
 {id:'cost',label:'Custo',width:105,visible:true},
 {id:'expected',label:'Valor de venda',width:125,visible:true},
 {id:'profit',label:'Lucro',width:105,visible:true},
 {id:'actions',label:'Ações',width:230,visible:true}
]}
function loadPhoneColumns(){const saved=load(PHONECOLKEY);if(!Array.isArray(saved)||!saved.length)return defaultPhoneColumns();const defaults=defaultPhoneColumns(),byId=Object.fromEntries(saved.map(x=>[x.id,x]));return defaults.map(d=>({...d,...byId[d.id]})).sort((a,b)=>{const ao=saved.findIndex(x=>x.id===a.id),bo=saved.findIndex(x=>x.id===b.id);return (ao<0?999:ao)-(bo<0?999:bo)})}
function Phones(){
 const[items,setItems]=useState(load(SKEY)),[edit,setEdit]=useState(null),[detail,setDetail]=useState(null),[salePhone,setSalePhone]=useState(null),[actionPhone,setActionPhone]=useState(null),[query,setQuery]=useState(''),[statusFilter,setStatusFilter]=useState('Todos'),[tagFilter,setTagFilter]=useState('Todas'),[onlyFavorites,setOnlyFavorites]=useState(false),[columns,setColumns]=useState(loadPhoneColumns),[columnEditor,setColumnEditor]=useState(false),[batchCreate,setBatchCreate]=useState(false);
 const tableWrapRef=useRef(null);
 useEffect(()=>{if(tableWrapRef.current)tableWrapRef.current.scrollLeft=0},[query,statusFilter,tagFilter,onlyFavorites]);
 const banks=load(BKEY),suppliers=load(FKEY),profiles=load(PKEY);
 const persist=v=>{const lean=v.map(sanitizePhoneForLeanMode);setItems(lean);save(SKEY,lean)};
 const persistColumns=v=>{setColumns(v);save(PHONECOLKEY,v)};
 const allTags=[...new Set(items.flatMap(x=>x.tags||[]))].sort();
 const changeStatus=(id,status)=>persist(items.map(x=>x.id===id?touchPhone(addTimeline({...x,status},`Status alterado para ${status}`)):x));
 const updateFinancial=(id,field,value)=>{
  const numeric=Math.max(0,Number(String(value).replace(',','.'))||0);
  persist(items.map(phone=>{
   if(phone.id!==id)return phone;
   const partsCost=phoneSelectedPartsCost(phone);
   if(field==='cost')return touchPhone({...phone,paid:Math.max(0,numeric-partsCost)});
   if(field==='expected')return touchPhone({...phone,expected:numeric});
   if(field==='profit')return touchPhone({...phone,expected:Math.max(0,phoneTotalCost(phone)+numeric)});
   return phone
  }))
 };
 const filtered=items.filter(x=>{const text=`${x.code} ${x.brand} ${x.model} ${(x.tags||[]).join(' ')} ${x.status}`.toLowerCase();return text.includes(query.toLowerCase())&&(statusFilter==='Todos'||x.status===statusFilter)&&(tagFilter==='Todas'||(x.tags||[]).includes(tagFilter))&&(!onlyFavorites||x.favorite)});
 function toggleFavorite(phone){persist(items.map(x=>x.id===phone.id?touchPhone({...x,favorite:!x.favorite}):x))}
 function duplicatePhone(phone){const copy={...phone,id:crypto.randomUUID(),code:nextPhoneCode(items),status:'Aguardando análise',sale:null,ads:[],photos:[],favorite:false,archived:false,archivedAt:'',timeline:[{id:crypto.randomUUID(),date:new Date().toISOString(),message:`Duplicado a partir de ${phone.code}`}],lastActivityAt:new Date().toISOString()};persist([copy,...items])}
 function moveColumn(draggedId,targetId){if(!draggedId||draggedId===targetId)return;const from=columns.findIndex(c=>c.id===draggedId),to=columns.findIndex(c=>c.id===targetId);if(from<0||to<0)return;const next=[...columns],item=next.splice(from,1)[0];next.splice(to,0,item);persistColumns(next)}
 function startColumnResize(e,column){e.preventDefault();e.stopPropagation();const startX=e.clientX,startWidth=column.width;document.body.classList.add('column-resizing');const move=event=>{const width=Math.max(12,Math.min(1600,startWidth+event.clientX-startX));setColumns(current=>current.map(c=>c.id===column.id?{...c,width}:c))};const up=event=>{const width=Math.max(12,Math.min(1600,startWidth+event.clientX-startX));const next=columns.map(c=>c.id===column.id?{...c,width}:c);persistColumns(next);document.body.classList.remove('column-resizing');window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
 function autoFitPhoneColumn(columnId){const table=document.querySelector('.configurable-phone-table');if(!table)return;const cells=[...table.querySelectorAll(`[data-column-id="${columnId}"]`)];let max=12;cells.forEach(cell=>{const clone=cell.cloneNode(true);clone.querySelectorAll('button,input,select,.excel-column-resizer,.universal-resize-handle').forEach(x=>x.remove());clone.style.cssText='position:absolute;visibility:hidden;width:max-content;max-width:none;white-space:nowrap;display:block;padding:0;font:inherit';document.body.appendChild(clone);max=Math.max(max,Math.ceil(clone.scrollWidth+10));clone.remove()});persistColumns(columns.map(c=>c.id===columnId?{...c,width:Math.min(1600,max)}:c))}
 const columnAlign=id=>['photos','accessories','cost','expected','profit','actions','priority','status'].includes(id)?'center':'left';
 const visibleColumns=columns.filter(c=>c.visible&&(c.id!=='code'||showProductCode()));
 function cell(column,x){const cost=phoneTotalCost(x),profit=Number(x.expected||0)-cost,photoCount=Object.values(x.photoChecklist||{}).filter(Boolean).length,accessories=(x.accessories||[]).filter(a=>a.included).length,published=profiles.filter(profile=>(x.ads||migrateLegacyAds(x)).some(ad=>normalizeAd(ad).publications[profile.id]?.status==='published'));
  switch(column.id){
   case'code':return <td className="product-code"><b>{x.code}</b></td>;
   case'device':return <td className="smartphone-device-cell"><b>{x.brand} {x.model}</b><small>{[x.color,x.storage].filter(Boolean).join(' · ')||'Sem detalhes'}</small><div className="tag-line">{(x.tags||[]).slice(0,3).map(t=><span key={t}>{t}</span>)}</div></td>;
   case'profiles':return <td><div className="profile-publication-list">{published.map(profile=><span key={profile.id}>{profile.name}</span>)}{!published.length&&<small>Não anunciado</small>}</div></td>;
   case'status':return <td><select className="inline-status-select" value={x.status} onChange={e=>changeStatus(x.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td>;
   case'cost':return <td className="money-cell">{money(cost)}</td>;
   case'expected':return <td className="money-cell">{money(x.expected)}</td>;
   case'profit':return <td className="money-cell"><span className={profit>=0?'profit-positive':'profit-negative'}>{money(profit)}</span></td>;
   case'actions':return <td className="smartphone-actions-cell"><div className="smartphone-actions-primary"><button className={x.favorite?'phone-action favorite-button active':'phone-action'} onClick={()=>toggleFavorite(x)} title="Favorito"><Star size={18}/></button><button className="phone-action view-action" onClick={()=>setDetail(x)} title="Abrir ficha"><Eye size={18}/></button><button className="phone-action edit-action" onClick={()=>setEdit(x)} title="Editar aparelho"><FileText size={18}/></button><button className="phone-action duplicate-action" onClick={()=>duplicatePhone(x)} title="Duplicar aparelho"><Copy size={18}/></button><button className="phone-action more-action" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setActionPhone({phone:x,anchor:{top:r.bottom+6,left:Math.max(12,r.right-190)}})}} title="Mais ações">•••</button></div></td>;
   default:return null
  }
 }
 return <>
  <SmartphonesV102
    filtered={filtered} statuses={statuses} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
    allTags={allTags} tagFilter={tagFilter} setTagFilter={setTagFilter}
    query={query} setQuery={setQuery} onlyFavorites={onlyFavorites} setOnlyFavorites={setOnlyFavorites}
    visibleColumns={visibleColumns} profiles={profiles} showProductCode={showProductCode}
    phoneTotalCost={phoneTotalCost} money={money} toggleFavorite={toggleFavorite} changeStatus={changeStatus}
    setDetail={setDetail} setEdit={setEdit} setColumnEditor={setColumnEditor} setBatchCreate={setBatchCreate}
    blankPhone={blankPhone} items={items} actionPhone={actionPhone} setActionPhone={setActionPhone}
    setSalePhone={setSalePhone} persist={persist} updateFinancial={updateFinancial}
    totalExpected={items.filter(x=>x.status!=='Vendido').reduce((sum,x)=>sum+Number(x.expected||0),0)}
  />
  {batchCreate&&<BatchPhoneModal existing={items} banks={banks} onClose={()=>setBatchCreate(false)} onSave={created=>{persist([...created,...items]);setBatchCreate(false)}}/>}
  {columnEditor&&<PhoneColumnsModal columns={showProductCode()?columns:columns.filter(c=>c.id!=='code')} onClose={()=>setColumnEditor(false)} onChange={next=>persistColumns(showProductCode()?next:[...next,columns.find(c=>c.id==='code')].filter(Boolean))}/>}
  {detail&&<PhoneDetailModal item={items.find(x=>x.id===detail.id)||detail} profiles={profiles} onClose={()=>setDetail(null)} onSave={v=>{persist(items.map(x=>x.id===v.id?touchPhone(v):x));setDetail(v)}}/>}
  {edit&&<PhoneModal item={edit} banks={banks} suppliers={suppliers} onClose={()=>setEdit(null)} onSave={v=>{const current=items.find(x=>x.id===v.id),priceChanged=current&&Number(current.expected)!==Number(v.expected);let saved=touchPhone(addTimeline(v,'Cadastro atualizado'));if(priceChanged)saved={...saved,priceHistory:[...(current.priceHistory||[]),{id:crypto.randomUUID(),date:new Date().toISOString(),oldValue:Number(current.expected||0),newValue:Number(v.expected||0)}]};persist(items.some(x=>x.id===v.id)?items.map(x=>x.id===v.id?saved:x):[saved,...items]);setEdit(null)}}/>}
  {salePhone&&<SaleModal item={salePhone} profiles={profiles} onClose={()=>setSalePhone(null)} onSave={sale=>{persist(items.map(x=>x.id!==salePhone.id?x:touchPhone(addTimeline({...x,status:'Vendido',sale},`Venda registrada por ${money(sale.value)}`))));setSalePhone(null)}}/>}
 </>
}

function PhoneActionsPopover({data,onClose,onSale,onDelete}){
 useEffect(()=>{const close=e=>{if(!e.target.closest('.phone-actions-popover'))onClose()};const esc=e=>e.key==='Escape'&&onClose();setTimeout(()=>document.addEventListener('pointerdown',close),0);window.addEventListener('keydown',esc);return()=>{document.removeEventListener('pointerdown',close);window.removeEventListener('keydown',esc)}},[]);
 return <div className="phone-actions-popover" style={{top:data.anchor.top,left:data.anchor.left}}><button className="success-button" onClick={onSale}><WalletCards size={16}/> {data.phone.sale?.soldAt?'Editar venda':'Registrar venda'}</button><button className="danger" onClick={onDelete}><X size={16}/> Excluir aparelho</button></div>
}

function tableSlug(text){return String(text||'tabela').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)}
function getTableLayouts(){const saved=load(TABLELAYOUTKEY);return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{}}
function saveTableLayouts(layouts){save(TABLELAYOUTKEY,layouts)}

function UniversalTableCustomizer({page}){
 const[active,setActive]=useState(null),[refresh,setRefresh]=useState(0);
 useEffect(()=>{
  let scheduled=false;
  const enhance=()=>{
   scheduled=false;
   const heading=document.querySelector('.global-page h1')?.textContent?.trim()||page;
   const tables=[...document.querySelectorAll('.global-page .table-wrap table')].filter(t=>!t.classList.contains('configurable-phone-table'));
   tables.forEach(table=>{const signature=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim()).join('-');prepareUniversalTable(table,`${page}-${tableSlug(heading)}-${tableSlug(signature)}`,key=>setActive({key,table}))});
  };
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(enhance)}};
  schedule();
  const observer=new MutationObserver(schedule);observer.observe(document.querySelector('.global-page')||document.body,{childList:true,subtree:true});
  window.addEventListener('resize',schedule);
  return()=>{observer.disconnect();window.removeEventListener('resize',schedule)}
 },[page,refresh]);
 if(!active)return null;
 const layouts=getTableLayouts(),current=layouts[active.key]||readUniversalColumns(active.table);
 const update=next=>{saveTableLayouts({...layouts,[active.key]:next});applyUniversalLayout(active.table,next);setActive({...active});setRefresh(v=>v+1)};
 return <div className="universal-column-backdrop" onPointerDown={e=>e.target===e.currentTarget&&setActive(null)}><aside className="universal-column-drawer"><header><div><b>Personalizar tabela</b><small>Arraste, redimensione e oculte colunas.</small></div><button onClick={()=>setActive(null)}><X/></button></header><div className="universal-column-list">{current.map((c,index)=><div draggable onDragStart={e=>e.dataTransfer.setData('text/universal-column',c.id)} onDragOver={e=>e.preventDefault()} onDrop={e=>{const from=e.dataTransfer.getData('text/universal-column'),fromIndex=current.findIndex(x=>x.id===from);if(fromIndex<0||from===c.id)return;const next=[...current],item=next.splice(fromIndex,1)[0];next.splice(index,0,item);update(next)}} className={!c.visible?'is-hidden':''} key={c.id}><span className="column-drag">⋮⋮</span><label><input type="checkbox" checked={c.visible} onChange={e=>update(current.map(x=>x.id===c.id?{...x,visible:e.target.checked}:x))}/><b>{c.label}</b></label><div className="universal-width-control"><button onClick={()=>update(current.map(x=>x.id===c.id?{...x,width:Math.max(12,x.width-10)}:x))}>−</button><input type="number" value={c.width} min="12" max="1600" onChange={e=>update(current.map(x=>x.id===c.id?{...x,width:Math.max(12,Math.min(1600,Number(e.target.value)||60))}:x))}/><button onClick={()=>update(current.map(x=>x.id===c.id?{...x,width:Math.min(1600,x.width+10)}:x))}>+</button></div></div>)}</div><footer><button onClick={()=>{const defaults=readUniversalColumns(active.table,true);update(defaults)}}>Restaurar padrão</button><button className="primary" onClick={()=>setActive(null)}>Salvar e fechar</button></footer></aside></div>
}
function readUniversalColumns(table,reset=false){
 const headers=[...table.querySelectorAll('thead tr:first-child th')];
 return headers.map((th,index)=>({id:th.dataset.columnId||`${tableSlug(th.textContent)}-${index}`,label:th.dataset.columnLabel||th.textContent.trim()||`Coluna ${index+1}`,width:reset?Math.max(20,Math.round(th.getBoundingClientRect().width||120)):Number(th.dataset.columnWidth||Math.max(20,Math.round(th.getBoundingClientRect().width||120))),visible:reset?true:th.dataset.columnVisible!=='false'}))
}
function prepareUniversalTable(table,key,openEditor){
 table.dataset.layoutKey=key;table.classList.add('universal-managed-table');
 const headers=[...table.querySelectorAll('thead tr:first-child th')];
 headers.forEach((th,index)=>{const id=th.dataset.columnId||`${tableSlug(th.textContent)}-${index}`;th.dataset.columnId=id;th.dataset.columnLabel=th.dataset.columnLabel||th.textContent.trim()||`Coluna ${index+1}`;table.querySelectorAll('tr').forEach(row=>{const cell=row.children[index];if(cell&&!cell.dataset.columnId)cell.dataset.columnId=id})});
 const layouts=getTableLayouts(),settings=layouts[key]||readUniversalColumns(table);
 if(!layouts[key])saveTableLayouts({...layouts,[key]:settings});
 applyUniversalLayout(table,settings);
 const pageHost=table.closest('.global-page')||table.parentElement;
 const existingButton=pageHost.querySelector(':scope > .universal-table-config-button');
 if(!existingButton){const button=document.createElement('button');button.type='button';button.className='universal-table-config-button universal-page-columns';button.textContent='Personalizar colunas';button.onclick=e=>{e.preventDefault();e.stopPropagation();openEditor(key)};pageHost.appendChild(button)}
 headers.forEach(th=>{
  if(!th.querySelector('.universal-resize-handle')){const handle=document.createElement('i');handle.className='universal-resize-handle';handle.onpointerdown=e=>{if(e.detail>=2){e.preventDefault();e.stopPropagation();autoFitUniversalColumn(table,key,th.dataset.columnId)}else startUniversalResize(e,table,key,th.dataset.columnId)};handle.ondblclick=e=>{e.preventDefault();e.stopPropagation();autoFitUniversalColumn(table,key,th.dataset.columnId)};handle.title='Arraste para redimensionar; dê dois cliques para ajustar ao conteúdo';th.appendChild(handle)}
  th.draggable=true;th.ondragstart=e=>e.dataTransfer.setData('text/universal-column',th.dataset.columnId);th.ondragover=e=>e.preventDefault();th.ondrop=e=>{const from=e.dataTransfer.getData('text/universal-column'),layouts=getTableLayouts(),list=layouts[key]||readUniversalColumns(table),fromIndex=list.findIndex(x=>x.id===from),toIndex=list.findIndex(x=>x.id===th.dataset.columnId);if(fromIndex<0||toIndex<0||fromIndex===toIndex)return;const next=[...list],item=next.splice(fromIndex,1)[0];next.splice(toIndex,0,item);saveTableLayouts({...layouts,[key]:next});applyUniversalLayout(table,next)}
 })
}
function applyUniversalLayout(table,settings){
 table.classList.add('universal-flex-table');
 const byId=Object.fromEntries(settings.map((c,index)=>[c.id,{...c,order:index}]));
 table.querySelectorAll('tr').forEach(row=>[...row.children].forEach(cell=>{const c=byId[cell.dataset.columnId];if(!c)return;cell.style.order=c.order;cell.style.flex=`0 0 ${c.width}px`;cell.style.width=`${c.width}px`;cell.style.minWidth=`${c.width}px`;cell.style.display=c.visible?'':'none';cell.dataset.columnWidth=c.width;cell.dataset.columnVisible=String(c.visible)}))
}
function autoFitUniversalColumn(table,key,columnId){const layouts=getTableLayouts(),list=layouts[key]||readUniversalColumns(table),cells=[...table.querySelectorAll(`[data-column-id="${columnId}"]`)];let max=12;cells.forEach(cell=>{const clone=cell.cloneNode(true);clone.querySelectorAll('button,input,select,.excel-column-resizer,.universal-resize-handle').forEach(x=>x.remove());clone.style.cssText='position:absolute;visibility:hidden;width:max-content;max-width:none;white-space:nowrap;display:block;padding:0;font:inherit';document.body.appendChild(clone);max=Math.max(max,Math.ceil(clone.scrollWidth+10));clone.remove()});const next=list.map(x=>x.id===columnId?{...x,width:Math.min(1600,max)}:x);saveTableLayouts({...layouts,[key]:next});applyUniversalLayout(table,next)}
function startUniversalResize(e,table,key,columnId){
 e.preventDefault();e.stopPropagation();const layouts=getTableLayouts(),list=layouts[key]||readUniversalColumns(table),column=list.find(x=>x.id===columnId);if(!column)return;const start=e.clientX,width=column.width;document.body.classList.add('column-resizing');const move=event=>{const nextWidth=Math.max(12,Math.min(1600,width+event.clientX-start)),next=list.map(x=>x.id===columnId?{...x,width:nextWidth}:x);applyUniversalLayout(table,next)};const up=event=>{const nextWidth=Math.max(12,Math.min(1600,width+event.clientX-start)),next=list.map(x=>x.id===columnId?{...x,width:nextWidth}:x);saveTableLayouts({...layouts,[key]:next});applyUniversalLayout(table,next);document.body.classList.remove('column-resizing');window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)
}

function PhoneColumnsModal({columns,onClose,onChange}){const[list,setList]=useState(columns),[dragged,setDragged]=useState('');const update=next=>{setList(next);onChange(next)};function move(id,dir){const i=list.findIndex(x=>x.id===id),j=i+dir;if(i<0||j<0||j>=list.length)return;const next=[...list];[next[i],next[j]]=[next[j],next[i]];update(next)}function drop(target){if(!dragged||dragged===target)return;const from=list.findIndex(x=>x.id===dragged),to=list.findIndex(x=>x.id===target),next=[...list],item=next.splice(from,1)[0];next.splice(to,0,item);update(next);setDragged('')}return <Modal title="Personalizar colunas de Smartphones" onClose={onClose}><p className="column-editor-help">Escolha o que deseja exibir e organize as informações. As alterações são salvas automaticamente.</p><div className="column-editor-list">{list.map((c,i)=><div draggable onDragStart={()=>setDragged(c.id)} onDragOver={e=>e.preventDefault()} onDrop={()=>drop(c.id)} className={!c.visible?'column-editor-row hidden-column':'column-editor-row'} key={c.id}><span className="column-drag">⋮⋮</span><label><input type="checkbox" checked={c.visible} onChange={e=>update(list.map(x=>x.id===c.id?{...x,visible:e.target.checked}:x))}/><b>{c.label}</b></label><div className="column-width-control"><button onClick={()=>update(list.map(x=>x.id===c.id?{...x,width:Math.max(12,x.width-10)}:x))}>−</button><input type="number" min="12" max="1600" value={c.width} onChange={e=>update(list.map(x=>x.id===c.id?{...x,width:Math.max(12,Math.min(1600,Number(e.target.value)||60))}:x))}/><span>px</span><button onClick={()=>update(list.map(x=>x.id===c.id?{...x,width:Math.min(1600,x.width+10)}:x))}>+</button></div><div className="column-order-buttons"><button disabled={i===0} onClick={()=>move(c.id,-1)}><ChevronLeft size={16}/></button><button disabled={i===list.length-1} onClick={()=>move(c.id,1)}><ChevronRight size={16}/></button></div></div>)}</div><div className="actions"><button onClick={()=>update(defaultPhoneColumns())}>Restaurar padrão</button><button className="primary" onClick={onClose}>Concluir</button></div></Modal>}
function Sellers(){const[items,setItems]=useState(load(VKEY)),[edit,setEdit]=useState(null);const persist=v=>{setItems(v);save(VKEY,v)};return <><Title t="Vendedores" s="Registre de quem comprou cada aparelho."><button className="primary" onClick={()=>setEdit({id:crypto.randomUUID(),name:'',phone:'',city:'',address:'',notes:''})}><Plus/> Novo vendedor</button></Title><div className="list">{items.map(x=><div className="seller" key={x.id}><div><b>{x.name}</b><span>{x.phone||'Sem telefone'}</span><small>{x.city} · {x.address}</small></div><div><button onClick={()=>setEdit(x)}>Editar</button> <button className="danger" onClick={()=>confirm('Excluir?')&&persist(items.filter(i=>i.id!==x.id))}>Excluir</button></div></div>)}</div>{!items.length&&<Empty/>}{edit&&<SellerModal item={edit} onClose={()=>setEdit(null)} onSave={v=>{persist(items.some(x=>x.id===v.id)?items.map(x=>x.id===v.id?v:x):[v,...items]);setEdit(null)}}/>}</>}


function Suppliers(){const[items,setItems]=useState(load(FKEY)),[edit,setEdit]=useState(null);const persist=v=>{setItems(v);save(FKEY,v)};return <div className="premium-page modern-page suppliers-modern-page"><Title t="Fornecedores" s="Contatos e parceiros usados na compra de peças e aparelhos."><button className="primary" onClick={()=>setEdit({id:crypto.randomUUID(),name:'',phone:'',whatsapp:'',city:'',address:'',category:'Peças',notes:''})}><Plus/> Novo fornecedor</button></Title><div className="entity-card-grid">{items.map(x=><article className="entity-modern-card" key={x.id}><div className="entity-icon"><Store size={20}/></div><div className="entity-copy"><h3>{x.name}</h3><span>{x.category||'Fornecedor'}</span><p>{x.city||'Cidade não informada'}</p>{(x.whatsapp||x.phone)&&<small>{x.whatsapp||x.phone}</small>}</div><div className="entity-actions"><button onClick={()=>setEdit(x)}>Editar</button><button className="danger icon-only" onClick={()=>confirm('Excluir fornecedor?')&&persist(items.filter(i=>i.id!==x.id))}><X size={15}/></button></div></article>)}</div>{!items.length&&<div className="modern-empty-card"><Store size={30}/><b>Nenhum fornecedor cadastrado</b></div>}{edit&&<SupplierModal item={edit} onClose={()=>setEdit(null)} onSave={v=>{persist(items.some(x=>x.id===v.id)?items.map(x=>x.id===v.id?v:x):[v,...items]);setEdit(null)}}/>}</div>}
function SupplierModal({item,onClose,onSave}){
  const[f,setF]=useState(item),set=(k,v)=>setF({...f,[k]:v});
  return <Modal title="Cadastro de fornecedor" onClose={onClose}>
    <div className="grid">
      <Field label="Nome" value={f.name} onChange={v=>set('name',v)}/>
      <Field label="Telefone" value={f.phone} onChange={v=>set('phone',v)}/>
      <Field label="WhatsApp" value={f.whatsapp} onChange={v=>set('whatsapp',v)}/>
      <Field label="Cidade" value={f.city} onChange={v=>set('city',v)}/>
      <Field label="Endereço" value={f.address} onChange={v=>set('address',v)}/>
      <label>Categoria<select value={f.category} onChange={e=>set('category',e.target.value)}><option>Aparelhos</option><option>Peças</option><option>Aparelhos e peças</option><option>Outro</option></select></label>
    </div>
    <label>Observações<textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></label>
    <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar fornecedor</button></div>
  </Modal>
}

function Banks(){const[items,setItems]=useState(load(BKEY)),[edit,setEdit]=useState(null);const persist=v=>{setItems(v);save(BKEY,v)};return <div className="premium-page modern-page banks-modern-page"><Title t="Contas bancárias" s="Contas e meios usados nos pagamentos e recebimentos."><button className="primary" onClick={()=>setEdit({id:crypto.randomUUID(),bank:'',accountName:'',type:'Conta corrente',notes:''})}><Plus/> Nova conta</button></Title><div className="entity-card-grid">{items.map(x=><article className="entity-modern-card bank-modern-card" key={x.id}><div className="entity-icon"><WalletCards size={20}/></div><div className="entity-copy"><h3>{x.bank||'Banco não informado'}</h3><span>{x.accountName||'Conta sem nome'}</span><p>{x.type}</p></div><div className="entity-actions"><button onClick={()=>setEdit(x)}>Editar</button><button className="danger icon-only" onClick={()=>confirm('Excluir conta?')&&persist(items.filter(i=>i.id!==x.id))}><X size={15}/></button></div></article>)}</div>{!items.length&&<div className="modern-empty-card"><WalletCards size={30}/><b>Nenhuma conta cadastrada</b></div>}{edit&&<BankModal item={edit} onClose={()=>setEdit(null)} onSave={v=>{persist(items.some(x=>x.id===v.id)?items.map(x=>x.id===v.id?v:x):[v,...items]);setEdit(null)}}/>}</div>}
function BankModal({item,onClose,onSave}){const[f,setF]=useState(item),set=(k,v)=>setF({...f,[k]:v});return <Modal title="Cadastro de conta bancária" onClose={onClose}><div className="grid"><Field label="Banco" value={f.bank} onChange={v=>set('bank',v)}/><Field label="Nome da conta" value={f.accountName} onChange={v=>set('accountName',v)}/><label>Tipo<select value={f.type} onChange={e=>set('type',e.target.value)}><option>Conta corrente</option><option>Poupança</option><option>Carteira digital</option><option>Dinheiro</option><option>Outro</option></select></label></div><label>Observações<textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></label><div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar conta</button></div></Modal>}

function Parts(){
  const [phones,setPhones]=useState(load(SKEY));
  const [inventory,setInventory]=useState(load(IKEY));
  const [supplierFilter,setSupplierFilter]=useState('Todos');
  const [viewMode,setViewMode]=useState('supplier');
  const [detail,setDetail]=useState(null);
  const profiles=load(PKEY);

  const rows=phones.flatMap(phone=>
    (phone.parts||[])
      .map(part=>{
        const quotes=(part.quotes||[]).filter(q=>q.supplier);
        const ordered=[...quotes].sort((a,b)=>Number(a.price)-Number(b.price));
        const cheapest=ordered[0]||null;
        const mostExpensive=ordered[ordered.length-1]||null;
        const chosen=quotes.find(q=>q.id===part.selectedQuoteId)||cheapest;
        return{
          phone,
          part:{...part,orderStatus:part.orderStatus||'Não pedido'},
          quotes,cheapest,mostExpensive,chosen
        };
      })
  );

  const suppliers=[...new Set(rows.flatMap(r=>r.quotes.map(q=>q.supplier).filter(Boolean)))]
    .sort((a,b)=>a.localeCompare(b,'pt-BR'));

  const filteredRows=supplierFilter==='Todos'
    ? rows
    : rows.filter(r=>r.quotes.some(q=>q.supplier===supplierFilter));

  function savePhones(next){
    setPhones(next);
    save(SKEY,next);
  }

  function choose(phoneId,partId,quoteId){
    const next=phones.map(phone=>phone.id!==phoneId?phone:{
      ...phone,
      parts:(phone.parts||[]).map(part=>part.id!==partId?part:{...part,selectedQuoteId:quoteId})
    });
    savePhones(next);
  }

  function changeOrderStatus(phoneId,partId,orderStatus){
    const next=phones.map(phone=>{
      if(phone.id!==phoneId) return phone;
      const parts=(phone.parts||[]).map(part=>part.id!==partId?part:{...part,orderStatus});
      const pendingOrder=parts.some(part=>['Pedido realizado','Pedido enviado'].includes(part.orderStatus||'Não pedido'));
      const allDelivered=parts.length>0&&parts.every(part=>['Pedido entregue','Instalada'].includes(part.orderStatus||'Não pedido'));
      let status=phone.status;
      if(pendingOrder) status='Aguardando peças';
      else if(allDelivered&&phone.status==='Aguardando peças') status='Em reparo';
      return{...phone,parts,status};
    });
    savePhones(next);
  }

  function markSupplierOrderDone(supplierName,list){
    if(!confirm(`Marcar todas as peças deste pedido em ${supplierName} como “Pedido realizado”?`)) return;
    const targets=new Set(list.map(row=>`${row.phone.id}::${row.part.id}`));
    const next=phones.map(phone=>{
      let changed=false;
      const parts=(phone.parts||[]).map(part=>{
        if(!targets.has(`${phone.id}::${part.id}`)) return part;
        changed=true;
        const selected=(part.quotes||[]).find(q=>q.id===part.selectedQuoteId);
        const cheapest=[...(part.quotes||[])].sort((a,b)=>Number(a.price)-Number(b.price))[0];
        const chosen=selected||cheapest;
        if(chosen?.supplier!==supplierName) return part;
        return{...part,orderStatus:'Pedido realizado'};
      });
      return changed?{...phone,parts,status:'Aguardando peças'}:phone;
    });
    savePhones(next);
  }

  function persistInventory(next){setInventory(next);save(IKEY,next)}
  function addInventoryMovement(movement){save(MKEY,[{id:crypto.randomUUID(),date:new Date().toISOString(),...movement},...load(MKEY)])}

  function receiveIntoInventory(row){
    const quote=row.chosen;
    if(!quote)return alert('Escolha primeiro o fornecedor.');
    const compatibility=`${row.phone.brand} ${row.phone.model}`.trim();
    const match=inventory.find(item=>item.name.toLowerCase()===row.part.name.toLowerCase()&&(item.compatibility||'').toLowerCase()===compatibility.toLowerCase());
    let next;
    if(match){
      next=inventory.map(item=>item.id===match.id?{...item,quantity:Number(item.quantity||0)+1,unitCost:Number(quote.price||item.unitCost||0),updatedAt:new Date().toISOString()}:item);
    }else{
      const supplier=load(FKEY).find(s=>s.name===quote.supplier);
      next=[{id:crypto.randomUUID(),name:row.part.name,compatibility,supplierId:supplier?.id||'',quantity:1,minimum:0,unitCost:Number(quote.price||0),location:'',notes:`Recebida para ${row.phone.code}`,updatedAt:new Date().toISOString()},...inventory];
    }
    persistInventory(next);
    addInventoryMovement({itemId:match?.id||next[0]?.id,itemName:row.part.name,type:'Entrada',quantity:1,before:Number(match?.quantity||0),after:Number(match?.quantity||0)+1,reason:`Recebimento para ${row.phone.code}`,unitCost:Number(quote.price||0)});
    changeOrderStatus(row.phone.id,row.part.id,'Pedido entregue');
    alert('Peça recebida e adicionada ao estoque.');
  }

  function installFromInventory(row){
    const compatibility=`${row.phone.brand} ${row.phone.model}`.trim().toLowerCase();
    const match=inventory.find(item=>item.name.toLowerCase()===row.part.name.toLowerCase()&&(!item.compatibility||(item.compatibility||'').toLowerCase()===compatibility)&&Number(item.quantity||0)>0);
    if(!match)return alert('Não existe esta peça disponível no estoque.');
    persistInventory(inventory.map(item=>item.id===match.id?{...item,quantity:Number(item.quantity)-1,updatedAt:new Date().toISOString()}:item));
    addInventoryMovement({itemId:match.id,itemName:match.name,type:'Saída',quantity:1,before:Number(match.quantity),after:Number(match.quantity)-1,reason:`Instalada no ${row.phone.code}`,unitCost:Number(match.unitCost||0)});
    const nextPhones=phones.map(phone=>phone.id!==row.phone.id?phone:{
      ...phone,
      parts:(phone.parts||[]).map(part=>part.id!==row.part.id?part:{...part,status:'Instalada',orderStatus:'Pedido entregue'}),
      lastActivityAt:new Date().toISOString(),
      timeline:[...(phone.timeline||[]),{id:crypto.randomUUID(),date:new Date().toISOString(),message:`Peça instalada usando estoque: ${row.part.name}`}]
    });
    savePhones(nextPhones);
    alert('Peça baixada do estoque e marcada como instalada.');
  }

  function markReceived(row){
    const next=phones.map(phone=>phone.id!==row.phone.id?phone:{...phone,parts:(phone.parts||[]).map(part=>part.id!==row.part.id?part:{...part,status:'Recebida',orderStatus:'Pedido entregue'}),lastActivityAt:new Date().toISOString(),timeline:[...(phone.timeline||[]),{id:crypto.randomUUID(),date:new Date().toISOString(),message:`Peça recebida: ${row.part.name}`} ]});
    savePhones(next);
  }

  function supplierQuote(row){
    if(supplierFilter==='Todos') return row.chosen;
    return row.quotes.find(q=>q.supplier===supplierFilter)||null;
  }

  function totalForRows(list){
    return list.reduce((sum,row)=>sum+(Number(supplierQuote(row)?.price)||0),0);
  }

  function optionColor(row,q){
    if(q.id===row.cheapest?.id) return '#1d4ed8';
    if(row.quotes.length>1&&q.id===row.mostExpensive?.id) return '#b91c1c';
    return '#111827';
  }

  function optionLabel(row,q){
    const tags=[];
    if(q.id===row.cheapest?.id) tags.push('menor preço');
    if(row.quotes.length>1&&q.id===row.mostExpensive?.id) tags.push('maior preço');
    return `${q.supplier} · ${money(q.price)}${tags.length?` (${tags.join(' / ')})`:''}`;
  }

  function copySupplierList(){
    if(supplierFilter==='Todos'){
      alert('Selecione um fornecedor específico para copiar a lista.');
      return;
    }
    const list=filteredRows.map(r=>{
      const quote=supplierQuote(r);
      if(!quote) return '';
      return `${phoneDisplayName(r.phone)} | ${r.part.name} | ${money(quote.price)} | ${r.part.orderStatus||'Não pedido'}`;
    }).filter(Boolean).join('\n');
    if(!list){alert('Nenhuma peça encontrada para este fornecedor.');return;}
    const finalText=`${list}\n\nTOTAL: ${money(totalForRows(filteredRows))}`;
    navigator.clipboard.writeText(finalText)
      .then(()=>alert('Lista copiada para a área de transferência.'))
      .catch(()=>prompt('Copie a lista abaixo:',finalText));
  }

  const groupedBySupplier=filteredRows.reduce((acc,row)=>{
    const quote=supplierQuote(row);
    const key=supplierFilter==='Todos'?(row.chosen?.supplier||'Fornecedor não definido'):supplierFilter;
    if(!quote&&supplierFilter!=='Todos') return acc;
    (acc[key]??=[]).push(row);
    return acc;
  },{});

  const groupedByPhone=filteredRows.reduce((acc,row)=>{
    const key=phoneDisplayName(row.phone);
    (acc[key]??=[]).push(row);
    return acc;
  },{});

  const renderQuoteSelect=row=>{const chosen=row.chosen;const isLowest=chosen?.id===row.cheapest?.id;return <div className={`v102-quote-choice ${isLowest?'best':''}`}><div className="v102-quote-choice-top"><Store size={14}/><div><small>Fornecedor escolhido</small><b>{chosen?.supplier||'Escolher fornecedor'}</b></div>{chosen&&<strong>{money(chosen.price)}</strong>}</div><select
    className={row.quotes.length>1&&chosen?.id===row.mostExpensive?.id?'quote-select quote-select-high':'quote-select'}
    value={chosen?.id||''}
    onChange={e=>choose(row.phone.id,row.part.id,e.target.value)}
    aria-label="Fornecedor escolhido"
  >
    <option value="">Escolher fornecedor</option>
    {row.quotes.map(q=><option value={q.id} key={q.id}>{optionLabel(row,q)}</option>)}
  </select>{chosen&&<span className="v102-quote-hint">{isLowest?'✓ Melhor cotação disponível':row.quotes.length>1&&chosen?.id===row.mostExpensive?.id?'Cotação mais alta':'Cotação selecionada'}</span>}</div>}

  const renderOrderSelect=row=><select
    className={`order-status order-${(row.part.orderStatus||'Não pedido').replaceAll(' ','-').toLowerCase()}`}
    value={row.part.orderStatus||'Não pedido'}
    onChange={e=>changeOrderStatus(row.phone.id,row.part.id,e.target.value)}
  >
    <option>Não pedido</option>
    <option>Pedido realizado</option>
    <option>Pedido enviado</option>
    <option>Pedido entregue</option>
  </select>;

  return <><div className="v102-page v102-parts-page">
    <header className="v102-hero"><div><span>COMPRAS E PEÇAS</span><h1>Peças e acessórios</h1><p>Cotações e pedidos organizados sem aparência de planilha.</p></div></header>
    <section className="v102-parts-toolbar"><label>Fornecedor<select value={supplierFilter} onChange={e=>setSupplierFilter(e.target.value)}><option>Todos</option>{suppliers.map(s=><option key={s}>{s}</option>)}</select></label><label>Agrupar por<select value={viewMode} onChange={e=>setViewMode(e.target.value)}><option value="supplier">Fornecedor</option><option value="phone">Aparelho</option></select></label><button onClick={copySupplierList} disabled={supplierFilter==='Todos'}>Copiar lista</button></section>
    {!filteredRows.length&&<Empty text="Nenhuma peça encontrada para este filtro."/>}
    <section className="v102-parts-groups">{(viewMode==='supplier'?Object.entries(groupedBySupplier):Object.entries(groupedByPhone)).map(([group,list])=><article className="v102-parts-group" key={group}>
      <header><div><small>{viewMode==='supplier'?'FORNECEDOR':'APARELHO'}</small><h2>{viewMode==='phone'?group.replace(/^BM-\d+\s*·\s*/,''):group}</h2><span>{list.length} item(ns)</span></div><strong>{money(totalForRows(list))}</strong>{viewMode==='supplier'&&group!=='Fornecedor não definido'&&<button onClick={()=>markSupplierOrderDone(group,list)}>Marcar pedido realizado</button>}</header>
      <div className="v102-part-list">{list.map(row=><div className="v102-part-row" key={row.part.id}>
        {viewMode==='supplier'&&<div className="v102-part-device"><small>APARELHO</small><button type="button" className="v102-phone-link" onClick={()=>setDetail(row.phone)}>{phoneDisplayName(row.phone,{includeCode:false})}</button></div>}
        <div><small>PEÇA</small><b>{row.part.name}</b></div>
        <div><small>MELHOR COTAÇÃO</small><b className="good">{row.cheapest?`${row.cheapest.supplier} · ${money(row.cheapest.price)}`:'Sem cotação'}</b></div>
        <div className="v102-part-supplier">{renderQuoteSelect(row)}</div>
        <label><small>PEDIDO</small>{renderOrderSelect(row)}</label>
        <div className="v102-part-actions"><button onClick={()=>markReceived(row)}>Receber</button></div>
      </div>)}</div>
    </article>)}</section>
  </div>
  {detail&&<PhoneDetailModal item={phones.find(p=>p.id===detail.id)||detail} profiles={profiles} onClose={()=>setDetail(null)} onSave={v=>{const next=phones.map(p=>p.id===v.id?touchPhone(v):p);savePhones(next);setDetail(v)}}/>}
  </>
}



function PartsInventoryPage(){
 const[items,setItems]=useState(load(IKEY)),[movements,setMovements]=useState(load(MKEY)),[editing,setEditing]=useState(null),[moving,setMoving]=useState(null),[query,setQuery]=useState(''),[tab,setTab]=useState('stock'),[onlyLow,setOnlyLow]=useState(false);
 const suppliers=load(FKEY);
 const persist=v=>{setItems(v);save(IKEY,v)};
 const persistMovements=v=>{setMovements(v);save(MKEY,v)};
 const filtered=items.filter(x=>{
  const matches=`${x.name} ${x.compatibility||''} ${suppliers.find(s=>s.id===x.supplierId)?.name||''}`.toLowerCase().includes(query.toLowerCase());
  return matches&&(!onlyLow||Number(x.quantity||0)<=Number(x.minimum||0));
 });
 const total=items.reduce((a,x)=>a+Number(x.quantity||0)*Number(x.unitCost||0),0);
 const low=items.filter(x=>Number(x.quantity||0)<=Number(x.minimum||0));

 function recordMovement(item,type,quantity,reason,unitCost){
  const signed=type==='Saída'?-Math.abs(Number(quantity||0)):type==='Entrada'?Math.abs(Number(quantity||0)):Number(quantity||0);
  const before=Number(item.quantity||0);
  const after=Math.max(0,before+signed);
  const nextItem={...item,quantity:after,unitCost:Number(unitCost||item.unitCost||0),updatedAt:new Date().toISOString()};
  persist(items.map(x=>x.id===item.id?nextItem:x));
  const movement={id:crypto.randomUUID(),itemId:item.id,itemName:item.name,type,quantity:Math.abs(Number(quantity||0)),before,after,reason:reason||'',unitCost:Number(unitCost||item.unitCost||0),date:new Date().toISOString()};
  persistMovements([movement,...movements]);
 }

 function quickAdjust(item,delta){
  recordMovement(item,delta>0?'Entrada':'Saída',Math.abs(delta),delta>0?'Ajuste rápido de entrada':'Ajuste rápido de saída',item.unitCost);
 }

 return <>
  <Title t="Estoque de peças" s="Controle quantidades, custos, estoque mínimo e histórico de movimentações.">
   <button className="primary" onClick={()=>setEditing({id:crypto.randomUUID(),name:'',compatibility:'',supplierId:'',quantity:0,minimum:0,unitCost:0,location:'',notes:'',updatedAt:new Date().toISOString()})}><Plus/> Nova peça</button>
  </Title>
  <div className="sales-totals"><div><span>Itens cadastrados</span><strong>{items.length}</strong></div><div><span>Baixo estoque</span><strong>{low.length}</strong></div><div><span>Valor em peças</span><strong>{money(total)}</strong></div><div><span>Movimentações</span><strong>{movements.length}</strong></div></div>

  <div className="tabs"><button className={tab==='stock'?'active':''} onClick={()=>setTab('stock')}>Estoque atual</button><button className={tab==='movements'?'active':''} onClick={()=>setTab('movements')}>Movimentações</button></div>

  {tab==='stock'?<>
   <div className="filter-bar">
    <label><Search size={17}/> Pesquisa<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Peça, compatibilidade ou fornecedor"/></label>
    <label className="inventory-check"><input type="checkbox" checked={onlyLow} onChange={e=>setOnlyLow(e.target.checked)}/> Somente baixo estoque</label>
   </div>
   <div className="table-wrap"><table><thead><tr><th>Peça</th><th>Compatibilidade</th><th>Fornecedor</th><th>Quantidade</th><th>Mínimo</th><th>Custo unitário</th><th>Valor total</th><th>Local</th><th></th></tr></thead>
   <tbody>{filtered.map(x=><tr key={x.id}><td><b>{x.name}</b>{Number(x.quantity||0)<=Number(x.minimum||0)&&<small className="stock-warning">Repor estoque</small>}</td><td>{x.compatibility||'—'}</td><td>{suppliers.find(s=>s.id===x.supplierId)?.name||'—'}</td><td><div className="quantity-control"><button onClick={()=>quickAdjust(x,-1)}>−</button><strong>{x.quantity}</strong><button onClick={()=>quickAdjust(x,1)}>+</button></div></td><td>{x.minimum}</td><td>{money(x.unitCost)}</td><td>{money(Number(x.quantity||0)*Number(x.unitCost||0))}</td><td>{x.location||'—'}</td><td><button onClick={()=>setMoving(x)}>Movimentar</button>{' '}<button onClick={()=>setEditing(x)}>Editar</button>{' '}<button className="danger" onClick={()=>confirm('Excluir peça do estoque?')&&persist(items.filter(i=>i.id!==x.id))}>Excluir</button></td></tr>)}</tbody></table>{!filtered.length&&<Empty text="Nenhuma peça encontrada."/>}</div>
  </>:<>
   <div className="table-wrap"><table><thead><tr><th>Data</th><th>Peça</th><th>Tipo</th><th>Quantidade</th><th>Antes</th><th>Depois</th><th>Custo</th><th>Motivo</th></tr></thead>
   <tbody>{movements.map(m=><tr key={m.id}><td>{new Date(m.date).toLocaleString('pt-BR')}</td><td>{m.itemName}</td><td><span className={`movement-badge movement-${m.type.toLowerCase().replace('í','i')}`}>{m.type}</span></td><td>{m.quantity}</td><td>{m.before}</td><td>{m.after}</td><td>{money(m.unitCost)}</td><td>{m.reason||'—'}</td></tr>)}</tbody></table>{!movements.length&&<Empty text="Nenhuma movimentação registrada."/>}</div>
  </>}

  {editing&&<InventoryModal item={editing} suppliers={suppliers} onClose={()=>setEditing(null)} onSave={v=>{
   const exists=items.some(x=>x.id===v.id);
   persist(exists?items.map(x=>x.id===v.id?v:x):[v,...items]);
   if(!exists&&Number(v.quantity||0)>0){
    persistMovements([{id:crypto.randomUUID(),itemId:v.id,itemName:v.name,type:'Entrada',quantity:Number(v.quantity),before:0,after:Number(v.quantity),reason:'Saldo inicial',unitCost:Number(v.unitCost||0),date:new Date().toISOString()},...movements]);
   }
   setEditing(null)
  }}/>}
  {moving&&<InventoryMovementModal item={moving} onClose={()=>setMoving(null)} onSave={data=>{recordMovement(moving,data.type,data.quantity,data.reason,data.unitCost);setMoving(null)}}/>}
 </>
}

function InventoryModal({item,suppliers,onClose,onSave}){
 const[f,setF]=useState(item),set=(k,v)=>setF({...f,[k]:v});
 return <Modal title="Peça em estoque" onClose={onClose}><div className="grid">
  <Field label="Nome da peça" value={f.name} onChange={v=>set('name',v)}/>
  <Field label="Compatibilidade" value={f.compatibility} onChange={v=>set('compatibility',v)}/>
  <label>Fornecedor<select value={f.supplierId||''} onChange={e=>set('supplierId',e.target.value)}><option value="">Não informado</option>{suppliers.filter(s=>s.category!=='Aparelhos').map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select></label>
  <Field label="Quantidade" type="number" value={f.quantity} onChange={v=>set('quantity',Number(v))}/>
  <Field label="Estoque mínimo" type="number" value={f.minimum} onChange={v=>set('minimum',Number(v))}/>
  <Field label="Custo unitário" type="number" value={f.unitCost} onChange={v=>set('unitCost',Number(v))}/>
  <Field label="Localização" value={f.location} onChange={v=>set('location',v)}/>
 </div><label>Observações<textarea value={f.notes||''} onChange={e=>set('notes',e.target.value)}/></label><div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave({...f,updatedAt:new Date().toISOString()})}>Salvar peça</button></div></Modal>
}


function InventoryMovementModal({item,onClose,onSave}){
 const[f,setF]=useState({type:'Entrada',quantity:1,reason:'',unitCost:item.unitCost||0});
 const set=(k,v)=>setF({...f,[k]:v});
 return <Modal title={`Movimentar estoque · ${item.name}`} onClose={onClose}>
  <div className="inventory-current"><span>Saldo atual</span><strong>{item.quantity}</strong></div>
  <div className="grid">
   <label>Tipo<select value={f.type} onChange={e=>set('type',e.target.value)}><option>Entrada</option><option>Saída</option><option>Ajuste</option></select></label>
   <Field label={f.type==='Ajuste'?'Variação (+ ou -)':'Quantidade'} type="number" value={f.quantity} onChange={v=>set('quantity',Number(v))}/>
   <Field label="Custo unitário" type="number" value={f.unitCost} onChange={v=>set('unitCost',Number(v))}/>
   <Field label="Motivo" value={f.reason} onChange={v=>set('reason',v)}/>
  </div>
  <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Registrar movimentação</button></div>
 </Modal>
}

const diagnosticItems=['Tela','Bateria','Tampa traseira','Câmera frontal','Câmera traseira','Alto-falante','Auricular','Microfone','Conector de carga','Botões','Biometria','Face ID','Wi‑Fi','Bluetooth','Vibração','Sensores','Carregamento','Rede/Chip'];

function Diagnostics(){
  const[phones,setPhones]=useState(load(SKEY)),[selected,setSelected]=useState('');
  const phone=phones.find(p=>p.id===selected);
  function saveDiagnostic(itemName,status,notes=''){
    const next=phones.map(p=>{
      if(p.id!==selected)return p;
      const list=[...(p.diagnostics||[])];
      const index=list.findIndex(x=>x.name===itemName);
      const entry={name:itemName,status,notes};
      if(index>=0)list[index]=entry;else list.push(entry);
      return addTimeline({...p,diagnostics:list},`Diagnóstico: ${itemName} = ${status}`);
    });
    setPhones(next);save(SKEY,next);
  }
  return <>
    <Title t="Diagnósticos" s="Checklist técnico de cada aparelho."/>
    <div className="panel">
      <label>Selecione o aparelho<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Escolha um aparelho</option>{phones.filter(p=>p.status!=='Vendido').map(p=><option value={p.id} key={p.id}>{phoneDisplayName(p)}</option>)}</select></label>
    </div>
    {phone&&<div className="panel"><h2>{phoneDisplayName(phone)}</h2><div className="diagnostic-grid">{diagnosticItems.map(name=>{const current=(phone.diagnostics||[]).find(x=>x.name===name)||{status:'Não testado',notes:''};return <div className="diagnostic-card" key={name}><b>{name}</b><select value={current.status} onChange={e=>saveDiagnostic(name,e.target.value,current.notes)}><option>Não testado</option><option>OK</option><option>Testar</option><option>Trocar</option><option>Não funciona</option><option>Não se aplica</option></select><input value={current.notes} placeholder="Observação" onChange={e=>saveDiagnostic(name,current.status,e.target.value)}/></div>})}</div></div>}
  </>
}


function AdDetailModal({phone,ad,profiles,onClose,onEdit}){
 const normalized=normalizeAd(ad||{});
 const published=profiles.filter(p=>normalized.publications[p.id]?.status==='published').length;
 const pct=profiles.length?Math.round(published/profiles.length*100):0;
 return <Modal className="ad-detail-modal" title={`Detalhes do anúncio · ${phone.brand||''} ${phone.model||''}`} onClose={onClose}>
  <div className="v102-ad-detail-head">
   <div><small>APARELHO</small><h3>{phone.brand} {phone.model}</h3><span>{money(phone.expected)}</span></div>
   <div className="v102-ad-detail-progress"><strong>{pct}%</strong><small>{published}/{profiles.length} perfis publicados</small><i><u style={{width:`${pct}%`}}/></i></div>
  </div>
  <section className="v102-ad-detail-copy">
   <div><small>NOME INTERNO</small><b>{normalized.name||'Sem nome'}</b></div>
   <div><small>TÍTULO</small><p>{normalized.title||'Título ainda não preparado.'}</p></div>
   <div><small>DESCRIÇÃO</small><p className="v102-ad-description">{normalized.description||'Descrição ainda não preparada.'}</p></div>
  </section>
  <section className="v102-ad-detail-profiles">
   <h3>Publicação por perfil</h3>
   <div>{profiles.map(profile=>{const pub=normalized.publications[profile.id]||{status:'not_published'};return <article className={pub.status} key={profile.id}><span>{String(profile.name).slice(0,2).toUpperCase()}</span><div><b>{profile.name}</b><small>{publicationLabel(pub.status)}</small></div></article>})}</div>
  </section>
  <div className="actions"><button onClick={onClose}>Fechar</button><button className="primary" onClick={onEdit}>Editar anúncio</button></div>
 </Modal>
}

function Ads(){
 const[phones,setPhones]=useState(()=>safeAdsPhones());
 const[templates,setTemplates]=useState(load(TKEY));
 const[titleLibrary,setTitleLibrary]=useState(()=>load(ATITLEKEY));
 const[descriptionLibrary,setDescriptionLibrary]=useState(()=>load(ADESCKEY));
 const[newTitle,setNewTitle]=useState(''),[newDescription,setNewDescription]=useState('');
 const[view,setView]=useState('matrix');
 const[query,setQuery]=useState('');
 const[selectedPhone,setSelectedPhone]=useState('');
 const[selectedAd,setSelectedAd]=useState('');
 const[showNoAds,setShowNoAds]=useState(false);
 const[templateId,setTemplateId]=useState('');
 const[editTemplate,setEditTemplate]=useState(null);
 const profiles=load(PKEY);
 const phone=phones.find(p=>p.id===selectedPhone);
 const ad=phone?.ads?.find(a=>a.id===selectedAd);
 const persist=next=>{setPhones(next);save(SKEY,next)};
 const persistTemplates=next=>{setTemplates(next);save(TKEY,next)};
 const persistTitles=next=>{setTitleLibrary(next);save(ATITLEKEY,next)};
 const persistDescriptions=next=>{setDescriptionLibrary(next);save(ADESCKEY,next)};

 function updateAds(phoneId,updater,message){
  const next=phones.map(p=>p.id!==phoneId?p:touchPhone(addTimeline({...p,ads:updater(p.ads||[])},message)));
  persist(next);
 }

 function createAd(phoneId=selectedPhone){
  const target=phones.find(p=>p.id===phoneId);
  if(!target)return alert('Selecione um aparelho.');
  const newAd=normalizeAd({
   id:crypto.randomUUID(),name:`Anúncio ${(target.ads||[]).length+1}`,title:'',description:'',
   publications:{},workflow:defaultAdWorkflow(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()
  });
  updateAds(target.id,ads=>[...ads,newAd],'Novo anúncio criado');
  setSelectedPhone(target.id);setSelectedAd(newAd.id);setView('editor');
 }

 function patchAd(patch,message='Anúncio atualizado'){
  if(!phone||!ad)return;
  updateAds(phone.id,ads=>ads.map(x=>x.id===ad.id?normalizeAd({...x,...patch,updatedAt:new Date().toISOString()}):x),message);
 }

 function duplicateAd(phoneId=selectedPhone,adId=selectedAd){
  const target=phones.find(p=>p.id===phoneId);
  const source=target?.ads?.find(a=>a.id===adId);
  if(!target||!source)return;
  const copy=normalizeAd({...source,id:crypto.randomUUID(),name:`${source.name||'Anúncio'} - cópia`,publications:{},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  updateAds(target.id,ads=>[...ads,copy],'Anúncio duplicado');
  setSelectedPhone(target.id);setSelectedAd(copy.id);
 }

 function deleteAd(){
  if(!phone||!ad)return;
  if(!confirm(`Excluir "${ad.name||'este anúncio'}"?`))return;
  updateAds(phone.id,ads=>ads.filter(x=>x.id!==ad.id),'Anúncio excluído');
  setSelectedAd('');setView('matrix');
 }

 function setPublication(phoneId,adId,profileId,status){
  const next=phones.map(p=>p.id!==phoneId?p:{
   ...p,
   ads:(p.ads||[]).map(item=>{
    if(item.id!==adId)return item;
    const current=normalizeAd(item);
    return normalizeAd({...current,publications:{...current.publications,[profileId]:{
     status,date:status==='published'?new Date().toISOString().slice(0,10):'',updatedAt:new Date().toISOString()
    }},updatedAt:new Date().toISOString()});
   }),
   lastActivityAt:new Date().toISOString()
  });
  persist(next);
 }

 function cyclePublication(phoneId,adId,profileId){
  const item=phones.find(p=>p.id===phoneId)?.ads?.find(a=>a.id===adId);
  const status=normalizeAd(item||{}).publications[profileId]?.status||'not_published';
  const sequence=['not_published','published','pending','removed'];
  setPublication(phoneId,adId,profileId,sequence[(sequence.indexOf(status)+1)%sequence.length]);
 }

 function markAll(phoneId,adId,status='published'){
  const publications={};
  profiles.forEach(p=>publications[p.id]={status,date:status==='published'?new Date().toISOString().slice(0,10):'',updatedAt:new Date().toISOString()});
  persist(phones.map(p=>p.id!==phoneId?p:{...p,ads:(p.ads||[]).map(a=>a.id===adId?normalizeAd({...a,publications,updatedAt:new Date().toISOString()}):a)}));
 }

 function setPublicationRenewal(phoneId,adId,profileId,renewAt){
  const next=phones.map(p=>p.id!==phoneId?p:{...p,ads:(p.ads||[]).map(item=>{
   if(item.id!==adId)return item;
   const current=normalizeAd(item),pub=current.publications[profileId]||normalizePublication({});
   return normalizeAd({...current,publications:{...current.publications,[profileId]:{...pub,renewAt}},updatedAt:new Date().toISOString()});
  })});
  persist(next);
 }

 function renewPublication(phoneId,adId,profileId){
  const today=new Date().toISOString().slice(0,10);
  const nextDate=new Date();nextDate.setDate(nextDate.getDate()+7);
  const renewAt=nextDate.toISOString().slice(0,10);
  const next=phones.map(p=>p.id!==phoneId?p:{...p,ads:(p.ads||[]).map(item=>{
   if(item.id!==adId)return item;
   const current=normalizeAd(item),pub=current.publications[profileId]||normalizePublication({});
   return normalizeAd({...current,publications:{...current.publications,[profileId]:{...pub,status:'published',date:pub.date||today,lastRenewedAt:today,renewAt}},updatedAt:new Date().toISOString()});
  })});
  persist(next);
 }

 function generate(){
  if(!phone||!ad)return;
  const list=defaultTemplates(),t=list[Math.floor(Math.random()*list.length)];
  const titleSource=titleLibrary.length?titleLibrary[Math.floor(Math.random()*titleLibrary.length)].text:t.title;
  const descriptionSource=descriptionLibrary.length?descriptionLibrary[Math.floor(Math.random()*descriptionLibrary.length)].text:t.description;
  patchAd({title:renderAd(titleSource,phone),description:renderAd(descriptionSource,phone)},'Variação automática gerada');
 }

 function applyTemplate(){
  const t=templates.find(x=>x.id===templateId);
  if(!t)return alert('Selecione um modelo.');
  patchAd({title:renderAd(t.title,phone),description:renderAd(t.description,phone),templateId:t.id},`Modelo aplicado: ${t.name}`);
 }

 const allAds=phones.flatMap(p=>(p.ads||[]).map(a=>({phone:p,ad:normalizeAd(a)})));
 const filtered=allAds.filter(({phone,ad})=>`${phone.code} ${phone.brand} ${phone.model} ${ad.name||''} ${ad.title||''}`.toLowerCase().includes(query.toLowerCase()));
 const noAds=phones.filter(p=>p.status!=='Vendido'&&!(p.ads||[]).length);
 const publishedTotal=allAds.reduce((sum,x)=>sum+profiles.filter(p=>x.ad.publications[p.id]?.status==='published').length,0);
 const possible=allAds.length*profiles.length;
 const publicationRate=possible?Math.round(publishedTotal/possible*100):0;
 const pendingTotal=allAds.reduce((sum,x)=>sum+profiles.filter(p=>x.ad.publications[p.id]?.status==='pending').length,0);
 const notPublishedTotal=allAds.reduce((sum,x)=>sum+profiles.filter(p=>!['published','pending'].includes(x.ad.publications[p.id]?.status||'not_published')).length,0);

 return <div className="ads-v11 ads-premium-page">
  <div className="ads-v11-head ads-clean-head">
   <div><span className="ads-section-kicker">GESTÃO DE PUBLICAÇÕES</span><h1>Anúncios</h1><p>Acompanhe cada aparelho e o status das publicações em um só lugar.</p></div>
   <div className="ads-v11-actions">{view!=='matrix'&&<button onClick={()=>setView('matrix')}>Visão geral</button>}<button className={view==='templates'?'active':''} onClick={()=>setView('templates')}>Modelos</button><button className={view==='library'?'active':''} onClick={()=>setView('library')}>Biblioteca</button><button className="primary" onClick={()=>setView('editor')}><Plus/> Novo anúncio</button></div>
  </div>
  <div className="ads-summary-strip"><div><span>Anúncios</span><strong>{allAds.length}</strong></div><i/><div><span>Publicados</span><strong>{publishedTotal}</strong></div><i/><div><span>Pendentes</span><strong>{pendingTotal}</strong></div><i/><div><span>Aguardando anúncio</span><strong>{noAds.length}</strong></div></div>

  {view==='matrix'&&<AdsV102
    filtered={filtered} profiles={profiles} noAds={noAds} setShowNoAds={setShowNoAds}
    query={query} setQuery={setQuery} money={money} showProductCode={showProductCode}
    publicationLabel={publicationLabel} cyclePublication={cyclePublication}
    setSelectedPhone={setSelectedPhone} setSelectedAd={setSelectedAd} setView={setView}
  />}
  {view==='details'&&phone&&ad&&<AdDetailModal phone={phone} ad={ad} profiles={profiles} onClose={()=>setView('matrix')} onEdit={()=>setView('editor')}/>}
  {showNoAds&&<div className="ads-drawer-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setShowNoAds(false)}>
   <aside className="ads-awaiting-drawer">
    <header><div><h2>Aguardando anúncio</h2><p>{noAds.length} aparelho{noAds.length!==1?'s':''} sem anúncio cadastrado.</p></div><button onClick={()=>setShowNoAds(false)}><X/></button></header>
    <div className="ads-awaiting-list">{noAds.map(p=><article key={p.id}>
     <div className="ads-awaiting-thumb"><Smartphone size={22}/></div>
     <div><b>{p.brand} {p.model}</b><small>{[p.storage,p.color].filter(Boolean).join(' · ')||'Sem detalhes'}</small><strong>{money(p.expected)}</strong></div>
     <button className="primary" onClick={()=>{createAd(p.id);setShowNoAds(false)}}><Plus/> Criar anúncio</button>
    </article>)}</div>
   </aside>
  </div>}
  {view==='editor'&&<div className="ads-v11-editor">
   <section>
    <label>Aparelho<select value={selectedPhone} onChange={e=>{setSelectedPhone(e.target.value);setSelectedAd('')}}><option value="">Escolha um aparelho</option>{phones.filter(p=>p.status!=='Vendido').map(p=><option value={p.id} key={p.id}>{phoneDisplayName(p)}</option>)}</select></label>
    {phone&&<>
     <div className="ads-editor-title"><div><h2>Anúncios deste aparelho</h2><span>{phone.ads?.length||0} cadastrado(s)</span></div><button className="primary" onClick={()=>createAd(phone.id)}><Plus/> Criar anúncio</button></div>
     <div className="phone-ad-tabs">{(phone.ads||[]).map(item=><button className={selectedAd===item.id?'active':''} key={item.id} onClick={()=>setSelectedAd(item.id)}><span>{item.name||'Sem nome'}</span><small>{publishedCountForAd(item)}/{profiles.length} perfis</small></button>)}</div>
     {ad&&<>
      <div className="ads-editor-grid">
       <Field label="Nome interno" value={ad.name||''} onChange={v=>patchAd({name:v},'Nome alterado')}/>
       <label>Modelo<select value={templateId} onChange={e=>setTemplateId(e.target.value)}><option value="">Selecione</option>{templates.map(t=><option value={t.id} key={t.id}>{t.name}</option>)}</select></label>
      </div>
      <div className="ads-editor-buttons"><button onClick={applyTemplate}>Usar modelo</button><button onClick={generate}>Gerar variação</button><button onClick={()=>duplicateAd(phone.id,ad.id)}>Duplicar</button><button className="danger" onClick={deleteAd}>Excluir</button></div>
      <label>Título<input value={ad.title||''} onChange={e=>patchAd({title:e.target.value},'Título alterado')}/></label>
      <label>Descrição<textarea className="large-textarea" value={ad.description||''} onChange={e=>patchAd({description:e.target.value},'Descrição alterada')}/></label>
      <div className="copy-row"><button onClick={()=>copyText(ad.title||'')}>Copiar título</button><button onClick={()=>copyText(ad.description||'')}>Copiar descrição</button><span className="badge ok">Salvo automaticamente</span></div>
      <h3>Publicação por perfil</h3>
      <div className="ads-profile-editor">{profiles.map(profile=>{
       const pub=ad.publications[profile.id]||{status:'not_published'};
       return <div className={pub.status} key={profile.id}><b>{profile.name}</b><select value={pub.status} onChange={e=>setPublication(phone.id,ad.id,profile.id,e.target.value)}><option value="not_published">Não publicado</option><option value="published">Publicado</option><option value="pending">Pendente</option><option value="removed">Removido</option></select></div>
      })}</div>
     </>}
    </>}
   </section>
   <aside><h2>Resumo</h2>{phone?<><b>{phone.brand} {phone.model}</b>{showProductCode()&&<span>{phone.code}</span>}<strong>{money(phone.expected)}</strong><button onClick={()=>setView('matrix')}>Voltar à visão geral</button></>:<p>Selecione um aparelho para começar.</p>}</aside>
  </div>}

  {view==='templates'&&<section className="ads-v11-templates">
   <div className="ads-editor-title"><div><h2>Modelos de anúncio</h2><span>Textos prontos para títulos e descrições.</span></div><button className="primary" onClick={()=>setEditTemplate({id:crypto.randomUUID(),name:'',title:'{marca} {modelo} {armazenamento} {cor}',description:'{marca} {modelo} com {armazenamento}. Valor: {valor}.'})}><Plus/> Novo modelo</button></div>
   <div className="template-list">{templates.map(t=><div className="template-card" key={t.id}><div><b>{t.name}</b><span>{t.title}</span></div><div><button onClick={()=>setEditTemplate(t)}>Editar</button><button className="danger" onClick={()=>confirm('Excluir modelo?')&&persistTemplates(templates.filter(x=>x.id!==t.id))}>Excluir</button></div></div>)}</div>
   {!templates.length&&<Empty text="Nenhum modelo cadastrado."/>}
  </section>}


  {view==='library'&&<section className="ads-v11-templates ad-library-page">
   <div className="ads-editor-title"><div><h2>Biblioteca de textos</h2><span>Cadastre títulos e descrições independentes para o gerador misturar automaticamente.</span></div></div>
   <div className="ad-library-grid">
    <div className="panel"><h3>Títulos</h3><div className="library-add"><input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="{marca} {modelo} {armazenamento} - Seminovo"/><button className="primary" onClick={()=>{if(!newTitle.trim())return;persistTitles([{id:crypto.randomUUID(),text:newTitle.trim()},...titleLibrary]);setNewTitle('')}}>Adicionar</button></div><div className="library-list">{titleLibrary.map(x=><div key={x.id}><span>{x.text}</span><button className="danger" onClick={()=>persistTitles(titleLibrary.filter(y=>y.id!==x.id))}>Excluir</button></div>)}</div>{!titleLibrary.length&&<Empty text="Nenhum título personalizado."/>}</div>
    <div className="panel"><h3>Descrições</h3><div className="library-add"><textarea value={newDescription} onChange={e=>setNewDescription(e.target.value)} placeholder="Aparelho {marca} {modelo}, revisado e pronto para uso..."/><button className="primary" onClick={()=>{if(!newDescription.trim())return;persistDescriptions([{id:crypto.randomUUID(),text:newDescription.trim()},...descriptionLibrary]);setNewDescription('')}}>Adicionar</button></div><div className="library-list">{descriptionLibrary.map(x=><div key={x.id}><span>{x.text}</span><button className="danger" onClick={()=>persistDescriptions(descriptionLibrary.filter(y=>y.id!==x.id))}>Excluir</button></div>)}</div>{!descriptionLibrary.length&&<Empty text="Nenhuma descrição personalizada."/>}</div>
   </div>
   <div className="template-help"><b>Variáveis disponíveis:</b><code>{showProductCode()?'{marca} {modelo} {cor} {armazenamento} {ram} {valor} {codigo} {tarefas} {observacoes}':'{marca} {modelo} {cor} {armazenamento} {ram} {valor} {tarefas} {observacoes}'}</code></div>
  </section>}

  {editTemplate&&<TemplateModal item={editTemplate} onClose={()=>setEditTemplate(null)} onSave={v=>{persistTemplates(templates.some(x=>x.id===v.id)?templates.map(x=>x.id===v.id?v:x):[v,...templates]);setEditTemplate(null)}}/>}
 </div>
}

function defaultAdWorkflow(){
 return{
  photosReady:false,
  titleReady:false,
  descriptionReady:false,
  groupsShared:false,
  renewScheduled:false,
  boosted:false,
  sold:false
 };
}

function normalizePublication(value){
 if(!value||typeof value!=='object')return{status:'not_published',date:'',updatedAt:''};
 const valid=['not_published','published','pending','removed'];
 return{
  status:valid.includes(value.status)?value.status:'not_published',
  date:typeof value.date==='string'?value.date:'',
  updatedAt:typeof value.updatedAt==='string'?value.updatedAt:'',
  renewAt:typeof value.renewAt==='string'?value.renewAt:'',
  lastRenewedAt:typeof value.lastRenewedAt==='string'?value.lastRenewedAt:''
 };
}

function normalizeAd(ad){
 const source=ad&&typeof ad==='object'?ad:{};
 const publications={};
 if(source.publications&&typeof source.publications==='object'&&!Array.isArray(source.publications)){
  Object.entries(source.publications).forEach(([id,value])=>publications[id]=normalizePublication(value));
 }
 if(Array.isArray(source.publishedProfiles)){
  source.publishedProfiles.forEach(id=>{
   if(id&&!publications[id])publications[id]={
    status:'published',
    date:String(source.updatedAt||new Date().toISOString()).slice(0,10),
    updatedAt:String(source.updatedAt||'')
   };
  });
 }
 return{
  ...source,
  id:source.id||crypto.randomUUID(),
  name:source.name||'Anúncio',
  title:source.title||'',
  description:source.description||'',
  publications,
  workflow:{...defaultAdWorkflow(),...(source.workflow&&typeof source.workflow==='object'?source.workflow:{})},
  createdAt:source.createdAt||new Date().toISOString(),
  updatedAt:source.updatedAt||new Date().toISOString()
 };
}

function safeAdsPhones(){
 try{
  const raw=load(SKEY);
  if(!Array.isArray(raw))return[];
  return raw.filter(p=>p&&typeof p==='object').map(p=>{
   let ads=[];
   try{
    const source=Array.isArray(p.ads)?p.ads:migrateLegacyAds(p);
    ads=(Array.isArray(source)?source:[]).filter(Boolean).map(normalizeAd);
   }catch(error){
    console.error('Erro ao converter anúncios de',p?.code,error);
    ads=[];
   }
   return{
    ...p,
    brand:p.brand||'',
    model:p.model||'',
    color:p.color||'',
    storage:p.storage||'',
    photos:Array.isArray(p.photos)?p.photos:[],
    ads
   };
  });
 }catch(error){
  console.error('Erro ao carregar anúncios',error);
  return[];
 }
}

function publicationIcon(status){return status==='published'?'✓':status==='pending'?'◷':status==='removed'?'×':'—'}
function publicationLabel(status){return status==='published'?'Publicado':status==='pending'?'Pendente':status==='removed'?'Removido':'Não publicado'}
function publishedCountForAd(ad){return Object.values(normalizeAd(ad).publications).filter(x=>x.status==='published').length}
function TemplateModal({item,onClose,onSave}){const[f,setF]=useState(item),set=(k,v)=>setF({...f,[k]:v});return <Modal title="Modelo de anúncio" onClose={onClose}><div className="grid"><Field label="Nome do modelo" value={f.name} onChange={v=>set('name',v)}/><Field label="Modelo de título" value={f.title} onChange={v=>set('title',v)}/></div><label>Modelo de descrição<textarea className="large-textarea" value={f.description} onChange={e=>set('description',e.target.value)}/></label><div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar modelo</button></div></Modal>}
function SaleModal({item,profiles,onClose,onSave}){
 const banks=load(BKEY);
 const initial={
  value:item.expected||0,profileId:'',soldAt:new Date().toISOString().slice(0,10),
  paymentMethod:'',bankAccountId:'',marketplaceFee:0,shippingCost:0,
  paymentStatus:'Recebido',receivedAmount:item.expected||0,dueDate:'',
  installments:1,saleChannel:'Facebook Marketplace',deliveryType:'Retirada',
  buyerName:'',buyerPhone:'',buyerCity:'',notes:'',
  ...(item.sale||{})
 };
 const[f,setF]=useState(initial);
 const set=(k,v)=>setF({...f,[k]:v});
 const net=Number(f.value||0)-Number(f.marketplaceFee||0)-Number(f.shippingCost||0);
 const received=Math.min(net,Number(f.receivedAmount||0));
 const pending=Math.max(0,net-received);

 function changeStatus(status){
  if(status==='Recebido')setF({...f,paymentStatus:status,receivedAmount:net,dueDate:''});
  else if(status==='Pendente')setF({...f,paymentStatus:status,receivedAmount:0});
  else setF({...f,paymentStatus:status,receivedAmount:Math.min(Number(f.receivedAmount||0),net)});
 }

 return <Modal title={`Registrar venda · ${showProductCode()?item.code:item.brand+' '+item.model}`} onClose={onClose}>
  <div className="sale-summary-modal sale-summary-four">
   <div><span>Valor bruto</span><strong>{money(f.value)}</strong></div>
   <div><span>Taxas e frete</span><strong>{money(Number(f.marketplaceFee||0)+Number(f.shippingCost||0))}</strong></div>
   <div><span>Valor líquido</span><strong>{money(net)}</strong></div>
   <div><span>Falta receber</span><strong className={pending>0?'profit-negative':'profit-positive'}>{money(pending)}</strong></div>
  </div>

  <h3 className="section-title">Dados da venda</h3>
  <div className="grid">
   <Field label="Valor vendido" type="number" value={f.value} onChange={v=>set('value',Number(v))}/>
   <label>Perfil que realizou a venda<select value={f.profileId||''} onChange={e=>set('profileId',e.target.value)}><option value="">Não informado</option>{profiles.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>
   <Field label="Data da venda" type="date" value={f.soldAt} onChange={v=>set('soldAt',v)}/>
   <label>Canal da venda<select value={f.saleChannel||''} onChange={e=>set('saleChannel',e.target.value)}><option>Facebook Marketplace</option><option>Grupo do Facebook</option><option>WhatsApp</option><option>Instagram</option><option>Mercado Livre</option><option>Indicação</option><option>Outro</option></select></label>
   <Field label="Forma de pagamento" value={f.paymentMethod||''} onChange={v=>set('paymentMethod',v)}/>
   <label>Conta de recebimento<select value={f.bankAccountId||''} onChange={e=>set('bankAccountId',e.target.value)}><option value="">Não informado</option>{banks.map(b=><option value={b.id} key={b.id}>{b.name}</option>)}</select></label>
   <Field label="Taxa da plataforma" type="number" value={f.marketplaceFee||0} onChange={v=>set('marketplaceFee',Number(v))}/>
   <Field label="Custo de frete/entrega" type="number" value={f.shippingCost||0} onChange={v=>set('shippingCost',Number(v))}/>
   <label>Entrega<select value={f.deliveryType||''} onChange={e=>set('deliveryType',e.target.value)}><option>Retirada</option><option>Entrega local</option><option>Envio por transportadora</option><option>Correios</option><option>Outro</option></select></label>
   <Field label="Parcelas" type="number" value={f.installments||1} onChange={v=>set('installments',Math.max(1,Number(v)||1))}/>
  </div>

  <h3 className="section-title">Recebimento</h3>
  <div className="grid">
   <label>Status<select value={f.paymentStatus||'Recebido'} onChange={e=>changeStatus(e.target.value)}><option>Recebido</option><option>Pendente</option><option>Parcial</option></select></label>
   <Field label="Valor recebido" type="number" value={f.receivedAmount||0} onChange={v=>set('receivedAmount',Number(v))}/>
   <Field label="Vencimento" type="date" value={f.dueDate||''} onChange={v=>set('dueDate',v)}/>
  </div>

  <h3 className="section-title">Comprador</h3>
  <div className="grid">
   <Field label="Nome do comprador" value={f.buyerName||''} onChange={v=>set('buyerName',v)}/>
   <Field label="Telefone/WhatsApp" value={f.buyerPhone||''} onChange={v=>set('buyerPhone',v)}/>
   <Field label="Cidade/Bairro" value={f.buyerCity||''} onChange={v=>set('buyerCity',v)}/>
  </div>
  <label>Observações<textarea value={f.notes||''} onChange={e=>set('notes',e.target.value)}/></label>
  <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave({...f,netValue:net,receivedAmount:received,pendingAmount:pending})}>Salvar venda</button></div>
 </Modal>
}

function migrateLegacyAds(phone){if(phone.ads)return phone.ads;if(phone.ad?.title||phone.ad?.description)return[{id:crypto.randomUUID(),name:'Anúncio 1',title:phone.ad.title||'',description:phone.ad.description||'',publishedProfiles:phone.ad.publishedProfiles||[],createdAt:phone.ad.updatedAt||new Date().toISOString(),updatedAt:phone.ad.updatedAt||new Date().toISOString()}];return[]}
function renderAd(text,p){const r={'{marca}':p.brand||'','{modelo}':p.model||'','{cor}':p.color||'','{armazenamento}':p.storage||'','{ram}':p.ram||'','{valor}':money(p.expected),'{codigo}':showProductCode()?(p.code||''):'','{tarefas}':p.tasks||'','{observacoes}':p.notes||''};return Object.entries(r).reduce((x,[k,v])=>x.replaceAll(k,v),text||'').trim()}
function defaultTemplates(){return[{title:'{marca} {modelo} {armazenamento} {cor} - Seminovo',description:'{marca} {modelo} com {armazenamento}. Aparelho seminovo, revisado e pronto para uso. Valor: {valor}. Entrega a combinar.'},{title:'{modelo} {armazenamento} em ótimo estado',description:'Vendo {marca} {modelo}, cor {cor}, com {armazenamento}. Aparelho testado e funcionando. {observacoes} Valor: {valor}.'}]}
function UsersPage(){
  const[users,setUsers]=useState(load(UKEY)),[profiles,setProfiles]=useState(load(PKEY)),[tab,setTab]=useState('users');
  const[editingUser,setEditingUser]=useState(null),[editingProfile,setEditingProfile]=useState(null);
  const persistUsers=v=>{setUsers(v);save(UKEY,v)};
  const persistProfiles=v=>{setProfiles(v);save(PKEY,v)};
  return <>
    <Title t="Usuários e Perfis" s="Prepare acessos e controle os perfis usados nas publicações."/>
    <div className="tabs"><button className={tab==='users'?'active':''} onClick={()=>setTab('users')}>Usuários</button><button className={tab==='profiles'?'active':''} onClick={()=>setTab('profiles')}>Perfis de anúncio</button></div>
    {tab==='users'?<>
      <div className="section-row"><h2>Usuários</h2><button className="primary" onClick={()=>setEditingUser({id:crypto.randomUUID(),name:'',email:'',role:'Assistente',active:true})}><Plus/> Novo usuário</button></div>
      <div className="list">{users.map(u=><div className="seller" key={u.id}><div><b>{u.name}</b><span>{u.email}</span><small>{u.role} · {u.active?'Ativo':'Inativo'}</small></div><div><button onClick={()=>setEditingUser(u)}>Editar</button></div></div>)}</div>
      {!users.length&&<Empty text="Nenhum usuário cadastrado."/>}
    </>:<>
      <div className="section-row"><h2>Perfis de anúncio</h2><button className="primary" onClick={()=>setEditingProfile({id:crypto.randomUUID(),name:'',platform:'Facebook Marketplace',notes:''})}><Plus/> Novo perfil</button></div>
      <div className="list">{profiles.map(p=><div className="seller" key={p.id}><div><b>{p.name}</b><span>{p.platform}</span><small>{p.notes}</small></div><div><button onClick={()=>setEditingProfile(p)}>Editar</button></div></div>)}</div>
      {!profiles.length&&<Empty text="Nenhum perfil cadastrado."/>}
    </>}
    {editingUser&&<SimpleEntityModal title="Usuário" item={editingUser} fields={[['Nome','name'],['E-mail','email']]} selects={[['Função','role',['Administrador','Técnico','Fotógrafo','Anunciante','Assistente']]]} onClose={()=>setEditingUser(null)} onSave={v=>{persistUsers(users.some(x=>x.id===v.id)?users.map(x=>x.id===v.id?v:x):[v,...users]);setEditingUser(null)}}/>}
    {editingProfile&&<SimpleEntityModal title="Perfil de anúncio" item={editingProfile} fields={[['Nome do perfil','name'],['Plataforma','platform'],['Observações','notes']]} onClose={()=>setEditingProfile(null)} onSave={v=>{persistProfiles(profiles.some(x=>x.id===v.id)?profiles.map(x=>x.id===v.id?v:x):[v,...profiles]);setEditingProfile(null)}}/>}
  </>
}


function OperationsPage(){
 const[phones,setPhones]=useState(load(SKEY)),[query,setQuery]=useState('');
 const persist=v=>{setPhones(v);save(SKEY,v)};
 const workflow=['Aguardando análise','Aguardando peças','Em reparo','Em testes','Pronto','Para fotografar','Anúncio preparado','Anunciado','Reservado'];
 const filtered=phones.filter(p=>p.status!=='Vendido'&&`${p.code} ${p.brand} ${p.model}`.toLowerCase().includes(query.toLowerCase()));
 function move(phone,status){persist(phones.map(p=>p.id===phone.id?addTimeline({...p,status},`Movido na operação para ${status}`):p))}
 return <>
  <Title t="Operação" s="Quadro visual do fluxo dos aparelhos."/>
  <div className="filter-bar"><label><Search size={17}/> Pesquisa<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Código ou aparelho"/></label></div>
  <div className="kanban-board">{workflow.map(status=>{
   const list=filtered.filter(p=>p.status===status);
   return <section className="kanban-column" key={status}><header><b>{status}</b><span>{list.length}</span></header><div className="kanban-cards">{list.map(phone=><article className="kanban-card" key={phone.id}><b>{phoneDisplayName(phone)}</b><small>{phone.tasks||'Sem tarefa informada'}</small><select value={phone.status} onChange={e=>move(phone,e.target.value)}>{workflow.map(s=><option key={s}>{s}</option>)}</select></article>)}</div></section>
  })}</div>
 </>
}

function SalesPage(){
 const[phones,setPhones]=useState(load(SKEY)),[query,setQuery]=useState(''),[profileFilter,setProfileFilter]=useState('Todos'),[paymentFilter,setPaymentFilter]=useState('Todos'),[month,setMonth]=useState(''),[editing,setEditing]=useState(null);
 const profiles=load(PKEY),banks=load(BKEY);
 const persist=v=>{setPhones(v);save(SKEY,v)};
 const sales=phones.filter(p=>p.sale?.soldAt).filter(p=>{
  const text=`${p.code} ${p.brand} ${p.model} ${p.sale?.buyerName||''} ${p.sale?.buyerPhone||''} ${p.sale?.saleChannel||''}`.toLowerCase();
  return text.includes(query.toLowerCase()) &&
   (profileFilter==='Todos'||p.sale.profileId===profileFilter) &&
   (paymentFilter==='Todos'||salePaymentStatus(p.sale)===paymentFilter) &&
   (!month||(p.sale.soldAt||'').slice(0,7)===month);
 });
 const total=sales.reduce((a,p)=>a+Number(p.sale.value||0),0);
 const netTotal=sales.reduce((a,p)=>a+saleNetValue(p.sale),0);
 const receivedTotal=sales.reduce((a,p)=>a+saleReceivedValue(p.sale),0);
 const pendingTotal=sales.reduce((a,p)=>a+salePendingValue(p.sale),0);
 const profit=sales.reduce((a,p)=>a+(saleNetValue(p.sale)-phoneTotalCost(p)),0);

 function removeSale(phone){
  if(!confirm(`Remover o registro de venda de ${phone.code}?`))return;
  persist(phones.map(p=>p.id!==phone.id?p:touchPhone(addTimeline({...p,status:'Pronto',sale:null},'Registro de venda removido'))));
 }
 function saveEditedSale(phone,sale){
  persist(phones.map(p=>p.id!==phone.id?p:touchPhone(addTimeline({...p,status:'Vendido',sale},`Venda editada para ${money(sale.value)}`))));
  setEditing(null);
 }

 return <>
  <Title t="Histórico de vendas" s="Consulte, filtre e edite vendas, clientes e recebimentos."/>
  <div className="filter-bar sales-filters">
   <label><Search size={17}/> Pesquisa<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Aparelho, comprador, telefone ou canal"/></label>
   <label>Perfil<select value={profileFilter} onChange={e=>setProfileFilter(e.target.value)}><option>Todos</option>{profiles.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>
   <label>Recebimento<select value={paymentFilter} onChange={e=>setPaymentFilter(e.target.value)}><option>Todos</option><option>Recebido</option><option>Pendente</option><option>Parcial</option></select></label>
   <label>Mês<input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label>
  </div>

  <div className="sales-totals sales-totals-five">
   <div><span>Quantidade</span><strong>{sales.length}</strong></div>
   <div><span>Valor bruto</span><strong>{money(total)}</strong></div>
   <div><span>Valor líquido</span><strong>{money(netTotal)}</strong></div>
   <div><span>Recebido</span><strong>{money(receivedTotal)}</strong></div>
   <div><span>A receber</span><strong>{money(pendingTotal)}</strong></div>
   <div><span>Lucro realizado</span><strong className={profit>=0?'profit-positive':'profit-negative'}>{money(profit)}</strong></div>
  </div>

  <div className="table-wrap"><table><thead><tr><th>Data</th><th>Aparelho</th><th>Comprador</th><th>Canal</th><th>Perfil</th><th>Conta</th><th>Status</th><th>Líquido</th><th>Recebido</th><th>A receber</th><th>Lucro</th><th></th></tr></thead>
  <tbody>{sales.map(p=>{
   const cost=phoneTotalCost(p),net=saleNetValue(p.sale),received=saleReceivedValue(p.sale),pending=salePendingValue(p.sale),gain=net-cost,status=salePaymentStatus(p.sale);
   return <tr key={p.id}>
    <td>{formatDate(p.sale.soldAt)}</td>
    <td><b>{phoneDisplayName(p)}</b></td>
    <td>{p.sale.buyerName||'—'}<small>{p.sale.buyerPhone||''}</small></td>
    <td>{p.sale.saleChannel||'—'}</td>
    <td>{profiles.find(x=>x.id===p.sale.profileId)?.name||'—'}</td>
    <td>{banks.find(x=>x.id===p.sale.bankAccountId)?.name||'—'}</td>
    <td><span className={`payment-badge payment-${status.toLowerCase()}`}>{status}</span></td>
    <td>{money(net)}</td><td>{money(received)}</td><td>{money(pending)}</td>
    <td><span className={gain>=0?'profit-positive':'profit-negative'}>{money(gain)}</span></td>
    <td><button onClick={()=>setEditing(p)}>Editar</button>{' '}<button className="danger" onClick={()=>removeSale(p)}>Remover</button></td>
   </tr>
  })}</tbody></table>{!sales.length&&<Empty text="Nenhuma venda encontrada."/>}</div>
  {editing&&<SaleModal item={editing} profiles={profiles} onClose={()=>setEditing(null)} onSave={sale=>saveEditedSale(editing,sale)}/>}
 </>
}


function ReceivablesPage(){
 const[phones,setPhones]=useState(load(SKEY)),[filter,setFilter]=useState('Pendentes'),[query,setQuery]=useState('');
 const banks=load(BKEY),today=new Date().toISOString().slice(0,10);
 const persist=v=>{setPhones(v);save(SKEY,v)};
 const sales=phones.filter(p=>p.sale?.soldAt);
 const rows=sales.filter(p=>{
  const status=salePaymentStatus(p.sale);
  const matchStatus=filter==='Todos'||(filter==='Vencidos'?salePendingValue(p.sale)>0&&p.sale.dueDate&&p.sale.dueDate<today:filter==='Pendentes'?salePendingValue(p.sale)>0:status===filter);
  const text=`${p.code} ${p.brand} ${p.model} ${p.sale.buyerName||''} ${p.sale.buyerPhone||''}`.toLowerCase();
  return matchStatus&&text.includes(query.toLowerCase());
 }).sort((a,b)=>(a.sale.dueDate||'9999').localeCompare(b.sale.dueDate||'9999'));

 const pending=sales.reduce((a,p)=>a+salePendingValue(p.sale),0);
 const overdue=sales.filter(p=>salePendingValue(p.sale)>0&&p.sale.dueDate&&p.sale.dueDate<today).reduce((a,p)=>a+salePendingValue(p.sale),0);
 const received=sales.reduce((a,p)=>a+saleReceivedValue(p.sale),0);

 function markReceived(phone){
  const net=saleNetValue(phone.sale);
  persist(phones.map(p=>p.id!==phone.id?p:touchPhone(addTimeline({...p,sale:{...p.sale,paymentStatus:'Recebido',receivedAmount:net,pendingAmount:0,dueDate:''}},`Recebimento confirmado: ${money(net)}`))));
 }
 function updateReceived(phone,value){
  const net=saleNetValue(phone.sale),received=Math.max(0,Math.min(net,Number(value||0))),pending=Math.max(0,net-received);
  const status=pending<=0?'Recebido':received>0?'Parcial':'Pendente';
  persist(phones.map(p=>p.id!==phone.id?p:{...p,sale:{...p.sale,receivedAmount:received,pendingAmount:pending,paymentStatus:status}}));
 }

 const bankSummary=banks.map(bank=>{
  const items=sales.filter(p=>p.sale.bankAccountId===bank.id);
  return{bank,received:items.reduce((a,p)=>a+saleReceivedValue(p.sale),0),pending:items.reduce((a,p)=>a+salePendingValue(p.sale),0)};
 }).filter(x=>x.received||x.pending);

 return <>
  <Title t="Recebimentos" s="Acompanhe valores recebidos, pendentes e vencidos."/>
  <div className="receivable-metrics">
   <div><span>Total recebido</span><strong>{money(received)}</strong></div>
   <div><span>Total a receber</span><strong>{money(pending)}</strong></div>
   <div><span>Valores vencidos</span><strong>{money(overdue)}</strong></div>
   <div><span>Vendas pendentes</span><strong>{sales.filter(p=>salePendingValue(p.sale)>0).length}</strong></div>
  </div>
  <div className="tabs"><button className={filter==='Pendentes'?'active':''} onClick={()=>setFilter('Pendentes')}>Pendentes</button><button className={filter==='Vencidos'?'active':''} onClick={()=>setFilter('Vencidos')}>Vencidos</button><button className={filter==='Parcial'?'active':''} onClick={()=>setFilter('Parcial')}>Parciais</button><button className={filter==='Recebido'?'active':''} onClick={()=>setFilter('Recebido')}>Recebidos</button><button className={filter==='Todos'?'active':''} onClick={()=>setFilter('Todos')}>Todos</button></div>
  <div className="filter-bar"><label><Search size={17}/> Pesquisa<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Aparelho, comprador ou telefone"/></label></div>

  <div className="receivable-layout">
   <div className="table-wrap"><table><thead><tr><th>Vencimento</th><th>Venda</th><th>Comprador</th><th>Conta</th><th>Líquido</th><th>Recebido</th><th>A receber</th><th>Status</th><th></th></tr></thead>
   <tbody>{rows.map(p=>{const net=saleNetValue(p.sale),receivedValue=saleReceivedValue(p.sale),pendingValue=salePendingValue(p.sale),status=salePaymentStatus(p.sale);return <tr key={p.id}>
    <td><span className={p.sale.dueDate&&p.sale.dueDate<today&&pendingValue>0?'due-overdue':''}>{p.sale.dueDate?formatDate(p.sale.dueDate):'—'}</span></td>
    <td><b>{phoneDisplayName(p)}</b></td>
    <td>{p.sale.buyerName||'—'}<small>{p.sale.buyerPhone||''}</small></td>
    <td>{banks.find(b=>b.id===p.sale.bankAccountId)?.name||'—'}</td>
    <td>{money(net)}</td>
    <td><input className="received-inline" type="number" value={receivedValue} onChange={e=>updateReceived(p,e.target.value)}/></td>
    <td>{money(pendingValue)}</td>
    <td><span className={`payment-badge payment-${status.toLowerCase()}`}>{status}</span></td>
    <td>{pendingValue>0&&<button className="success-button" onClick={()=>markReceived(p)}>Marcar recebido</button>}</td>
   </tr>})}</tbody></table>{!rows.length&&<Empty text="Nenhum recebimento encontrado."/>}</div>

   <aside className="panel bank-summary"><h2>Resumo por conta</h2>{bankSummary.map(x=><div className="bank-summary-row" key={x.bank.id}><div><b>{x.bank.name}</b><small>Recebido {money(x.received)}</small></div><strong>{money(x.pending)}</strong></div>)}{!bankSummary.length&&<Empty text="Sem movimentações por conta."/>}</aside>
  </div>
 </>
}

function AgendaPage(){
 const[phones,setPhones]=useState(load(SKEY)),[month,setMonth]=useState(new Date().toISOString().slice(0,7)),[editing,setEditing]=useState(null);
 const persist=v=>{setPhones(v);save(SKEY,v)};
 const events=phones.filter(p=>p.nextActionDate&&(p.nextActionDate||'').slice(0,7)===month).sort((a,b)=>(a.nextActionDate||'').localeCompare(b.nextActionDate||''));
 const daysInMonth=new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate(),firstDay=new Date(`${month}-01T12:00:00`).getDay(),cells=[...Array(firstDay).fill(null),...Array.from({length:daysInMonth},(_,i)=>i+1)];
 function saveAction(phone,data){persist(phones.map(p=>p.id===phone.id?addTimeline({...p,nextAction:data.nextAction,nextActionDate:data.nextActionDate,lastActivityAt:new Date().toISOString()},`Agenda atualizada: ${data.nextAction}`):p));setEditing(null)}
 return <><Title t="Agenda operacional" s="Calendário de próximas ações e compromissos dos aparelhos."/><div className="agenda-toolbar"><label>Mês<input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label><span>{events.length} compromisso(s)</span></div><div className="agenda-layout"><section className="calendar-panel panel"><div className="calendar-week">{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(x=><b key={x}>{x}</b>)}</div><div className="calendar-grid">{cells.map((day,i)=>day===null?<div className="calendar-empty" key={`e${i}`}/>:<div className="calendar-day" key={day}><strong>{day}</strong>{events.filter(p=>Number((p.nextActionDate||'').slice(8,10))===day).map(p=><button key={p.id} onClick={()=>setEditing(p)}><b>{p.code}</b><span>{p.nextAction||'Ação'}</span></button>)}</div>)}</div></section><aside className="panel agenda-side"><h2>Compromissos do mês</h2>{events.map(p=><button key={p.id} onClick={()=>setEditing(p)}><time>{formatDate(p.nextActionDate)}</time><div><b>{showProductCode()&&<>{p.code} · </>}{p.brand} {p.model}</b><span>{p.nextAction}</span></div></button>)}{!events.length&&<Empty text="Nenhum compromisso neste mês."/>}</aside></div>{editing&&<AgendaEditModal item={editing} onClose={()=>setEditing(null)} onSave={data=>saveAction(editing,data)}/>}</>
}
function AgendaEditModal({item,onClose,onSave}){const[f,setF]=useState({nextAction:item.nextAction||'',nextActionDate:item.nextActionDate||''});return <Modal title={`Agenda · ${showProductCode()?item.code:item.brand+' '+item.model}`} onClose={onClose}><div className="grid"><Field label="Próxima ação" value={f.nextAction} onChange={v=>setF({...f,nextAction:v})}/><Field label="Data" type="date" value={f.nextActionDate} onChange={v=>setF({...f,nextActionDate:v})}/></div><div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar</button></div></Modal>}

function PendingCenterPage(){
 const phones=load(SKEY),inventory=load(IKEY),profiles=load(PKEY);
 const today=new Date().toISOString().slice(0,10);
 const active=phones.filter(p=>p.status!=='Vendido');
 const overdueTasks=active.filter(p=>p.nextActionDate&&p.nextActionDate<today);
 const noAds=active.filter(p=>!(p.ads||migrateLegacyAds(p)).length);
 const lowStock=inventory.filter(i=>Number(i.quantity||0)<=Number(i.minimum||0));
 const renewals=[];
 phones.forEach(phone=>(phone.ads||migrateLegacyAds(phone)).forEach(ad=>{
  const normalized=normalizeAd(ad);
  profiles.forEach(profile=>{
   const pub=normalized.publications[profile.id];
   if(pub?.status==='published'&&pub.renewAt&&pub.renewAt<=today)renewals.push({phone,ad:normalized,profile,pub});
  });
 }));
 return <>
  <Title t="Central de pendências" s="Tudo o que precisa de atenção reunido em uma única tela."/>
  <div className="pending-metrics">
   <div><span>Tarefas vencidas</span><strong>{overdueTasks.length}</strong></div>
   <div><span>Anúncios para renovar</span><strong>{renewals.length}</strong></div>
   <div><span>Baixo estoque</span><strong>{lowStock.length}</strong></div>
   <div><span>Aparelhos sem anúncio</span><strong>{noAds.length}</strong></div>
  </div>
  <div className="pending-grid">
   <section className="panel"><h2>Tarefas vencidas</h2>{overdueTasks.map(p=><div className="pending-row" key={p.id}><div><b>{showProductCode()&&<>{p.code} · </>}{p.brand} {p.model}</b><small>{p.nextAction||'Sem descrição'}</small></div><span>{formatDate(p.nextActionDate)}</span></div>)}{!overdueTasks.length&&<Empty text="Nenhuma tarefa vencida."/>}</section>
   <section className="panel"><h2>Anúncios para renovar</h2>{renewals.map((x,i)=><div className="pending-row" key={`${x.phone.id}-${x.ad.id}-${x.profile.id}-${i}`}><div><b>{showProductCode()&&<>{x.phone.code} · </>}{x.phone.brand} {x.phone.model}</b><small>{x.profile.name} · {x.ad.name}</small></div><span>{formatDate(x.pub.renewAt)}</span></div>)}{!renewals.length&&<Empty text="Nenhuma renovação vencida."/>}</section>
   <section className="panel"><h2>Baixo estoque</h2>{lowStock.map(i=><div className="pending-row" key={i.id}><div><b>{i.name}</b><small>{i.compatibility||'Sem compatibilidade informada'}</small></div><span>{i.quantity}/{i.minimum}</span></div>)}{!lowStock.length&&<Empty text="Estoque dentro dos mínimos."/>}</section>
   <section className="panel"><h2>Aparelhos sem anúncio</h2>{noAds.map(p=><div className="pending-row" key={p.id}><div><b>{showProductCode()&&<>{p.code} · </>}{p.brand} {p.model}</b><small>{p.status}</small></div><span>{money(p.expected)}</span></div>)}{!noAds.length&&<Empty text="Todos os aparelhos ativos possuem anúncio."/>}</section>
  </div>
 </>
}

function ReportsPage(){
 const phones=load(SKEY),profiles=load(PKEY),suppliers=load(FKEY),sales=phones.filter(p=>p.sale?.soldAt);
 const profileData=profiles.map(profile=>{const items=sales.filter(p=>p.sale.profileId===profile.id);return{name:profile.name,qty:items.length,revenue:items.reduce((a,p)=>a+saleNetValue(p.sale),0),profit:items.reduce((a,p)=>a+saleNetValue(p.sale)-phoneTotalCost(p),0)}}).sort((a,b)=>b.revenue-a.revenue);
 const supplierSpend={};phones.forEach(p=>(p.parts||[]).forEach(part=>{const quotes=part.quotes||[],selected=quotes.find(q=>q.id===part.selectedQuoteId)||[...quotes].sort((a,b)=>Number(a.price)-Number(b.price))[0];if(selected?.supplier){supplierSpend[selected.supplier]=(supplierSpend[selected.supplier]||0)+Number(selected.price||0)}}));
 const supplierData=Object.entries(supplierSpend).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
 const tagCount={};phones.forEach(p=>(p.tags||[]).forEach(t=>tagCount[t]=(tagCount[t]||0)+1));const tags=Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).slice(0,10);
 const monthly=sales.reduce((acc,p)=>{const key=(p.sale.soldAt||'').slice(0,7)||'Sem data';acc[key]??={qty:0,revenue:0,profit:0};acc[key].qty++;acc[key].revenue+=saleNetValue(p.sale);acc[key].profit+=saleNetValue(p.sale)-phoneTotalCost(p);return acc},{});
 const active=phones.filter(p=>p.status!=='Vendido'),forecast7=active.filter(p=>daysUntil(p.expectedSaleDate)>=0&&daysUntil(p.expectedSaleDate)<=7).reduce((a,p)=>a+Number(p.expected||0),0),forecast30=active.filter(p=>daysUntil(p.expectedSaleDate)>=0&&daysUntil(p.expectedSaleDate)<=30).reduce((a,p)=>a+Number(p.expected||0),0);

 const channelSummary={};sales.forEach(p=>{const key=p.sale.saleChannel||'Não informado';channelSummary[key]=(channelSummary[key]||0)+saleNetValue(p.sale)});
 const bankSummary={};sales.forEach(p=>{const bank=load(BKEY).find(b=>b.id===p.sale.bankAccountId)?.name||'Não informado';bankSummary[bank]=(bankSummary[bank]||0)+saleReceivedValue(p.sale)});
 return <ReportsV10 forecast7={forecast7} forecast30={forecast30} stockExpected={active.reduce((a,p)=>a+Number(p.expected||0),0)} profileData={profileData} supplierData={supplierData} tags={tags} channelSummary={channelSummary} bankSummary={bankSummary} monthly={monthly} money={money} formatMonth={formatMonth}/>
}

function DataCenterPage(){
 const[snapshots,setSnapshots]=useState(()=>normalizeSnapshotList(load(SNAPKEY)));
 function makeSnapshot(){
  try{
   const data=captureSnapshotData();
   const next=[{id:crypto.randomUUID(),date:new Date().toISOString(),data},...normalizeSnapshotList(snapshots)].slice(0,5);
   setSnapshots(next);localStorage.setItem(SNAPKEY,JSON.stringify(next));queueCloudSave(SNAPKEY,next);alert('Ponto de restauração criado.');
  }catch(error){alert(`Não foi possível criar o ponto de restauração: ${error.message||error}`)}
 }
 async function restore(snapshot){
  if(!confirm(`Restaurar os dados de ${new Date(snapshot.date).toLocaleString('pt-BR')}?`))return;
  try{await restoreAllData(snapshot.data);alert('Dados restaurados. A página será recarregada.');location.reload()}
  catch(error){alert(`Não foi possível restaurar: ${error.message||error}`)}
 }
 function exportCsv(){
  const phones=load(SKEY);
  const profiles=load(PKEY);
  const rows=[showProductCode()?['Código','Marca','Modelo','NFC','Status','Valor pago','Custo total','Valor de venda','Valor vendido','Data venda','Perfil venda']:['Marca','Modelo','NFC','Status','Valor pago','Custo total','Valor de venda','Valor vendido','Data venda','Perfil venda']];
  phones.forEach(p=>rows.push(showProductCode()?[p.code,p.brand,p.model,p.nfc===true?'Sim':p.nfc===false?'Não':'',p.status,p.paid||0,phoneTotalCost(p),p.expected||0,p.sale?.value||'',p.sale?.soldAt||'',profiles.find(x=>x.id===p.sale?.profileId)?.name||'']:[p.brand,p.model,p.nfc===true?'Sim':p.nfc===false?'Não':'',p.status,p.paid||0,phoneTotalCost(p),p.expected||0,p.sale?.value||'',p.sale?.soldAt||'',profiles.find(x=>x.id===p.sale?.profileId)?.name||'']));
  downloadText('bmcenter-smartphones.csv',rows.map(row=>row.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8');
 }
 function exportAdsCsv(){
  const profiles=load(PKEY),rows=[showProductCode()?['Código','Aparelho','Anúncio','Título',...profiles.map(p=>p.name)]:['Aparelho','Anúncio','Título',...profiles.map(p=>p.name)]];
  load(SKEY).forEach(phone=>(phone.ads||migrateLegacyAds(phone)).forEach(ad=>{const n=normalizeAd(ad),base=[`${phone.brand} ${phone.model}`,n.name||'',n.title||'',...profiles.map(p=>publicationLabel(n.publications[p.id]?.status||'not_published'))];rows.push(showProductCode()?[phone.code,...base]:base)}));
  downloadText('bmcenter-anuncios.csv',rows.map(r=>r.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8');
 }
 function exportPartsCsv(){
  const rows=[showProductCode()?['Código','Aparelho','Peça','Status','Fornecedor escolhido','Preço']:['Aparelho','Peça','Status','Fornecedor escolhido','Preço']];
  load(SKEY).forEach(phone=>(phone.parts||[]).forEach(part=>{const quotes=part.quotes||[],chosen=quotes.find(q=>q.id===part.selectedQuoteId)||[...quotes].sort((a,b)=>Number(a.price)-Number(b.price))[0],base=[`${phone.brand} ${phone.model}`,part.name,part.orderStatus||part.status||'',chosen?.supplier||'',chosen?.price||0];rows.push(showProductCode()?[phone.code,...base]:base)}));
  downloadText('bmcenter-pecas.csv',rows.map(r=>r.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8');
 }
 function exportProfilesCsv(){
  const profiles=load(PKEY),phones=load(SKEY),rows=[['Perfil','Anúncios publicados','Vendas','Valor vendido']];
  profiles.forEach(profile=>{let published=0;phones.forEach(p=>(p.ads||migrateLegacyAds(p)).forEach(ad=>{if(normalizeAd(ad).publications[profile.id]?.status==='published')published++}));const sales=phones.filter(p=>p.sale?.profileId===profile.id);rows.push([profile.name,published,sales.length,sales.reduce((a,p)=>a+Number(p.sale?.value||0),0)])});
  downloadText('bmcenter-perfis.csv',rows.map(r=>r.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8');
 }
 async function clearAll(){
  if(prompt('ATENÇÃO: esta ação excluirá todos os dados locais e da nuvem.\n\nDigite APAGAR TUDO para confirmar:')!=='APAGAR TUDO')return;
  if(!confirm('Confirma a exclusão definitiva de aparelhos, perfis, fornecedores, anúncios, configurações e demais dados em todos os dispositivos?'))return;
  const keys=[...ALL_CLOUD_KEYS];
  try{
   document.body.classList.add('cloud-destructive-busy');
   await clearCloudState(keys);
   keys.forEach(key=>localStorage.removeItem(key));
   sessionStorage.removeItem('bmcenter-scroll-y');
   alert('Todos os dados foram apagados deste dispositivo e da nuvem. Os outros dispositivos serão atualizados automaticamente.');
   location.href=location.pathname;
  }catch(error){
   console.error(error);
   alert(`Não foi possível apagar os dados da nuvem: ${error.message||error}`);
  }finally{
   document.body.classList.remove('cloud-destructive-busy');
  }
 }
 return <div className="v102-legacy-page">
  <Title t="Central de dados" s="Migração, exportação, pontos de restauração e manutenção."/>
  <div className="data-actions-grid">
   <div className="panel data-action-card"><History size={36}/><h2>Criar ponto de restauração</h2><p>Guarda uma cópia interna dos dados atuais antes de mudanças importantes.</p><button className="primary" onClick={makeSnapshot}>Criar agora</button></div>
   <div className="panel data-action-card"><Download size={36}/><h2>Exportações CSV</h2><p>Gere arquivos separados para usar no Excel.</p><div className="data-export-buttons"><button onClick={exportCsv}>Smartphones</button><button onClick={exportAdsCsv}>Anúncios</button><button onClick={exportPartsCsv}>Peças</button><button onClick={exportProfilesCsv}>Perfis</button></div></div>
   <div className="panel data-action-card danger-zone"><AlertTriangle size={36}/><h2>Limpar sistema</h2><p>Apaga todos os dados locais deste endereço.</p><button className="danger" onClick={clearAll}>Apagar tudo</button></div>
  </div>
  <div className="panel"><h2>Pontos de restauração</h2>{!snapshots.length?<Empty text="Nenhum ponto criado."/>:<div className="snapshot-list">{snapshots.map(s=><div className="snapshot-row" key={s.id}><div><b>{new Date(s.date).toLocaleString('pt-BR')}</b><small>{Array.isArray(s.data?.storage?.[SKEY])?s.data.storage[SKEY].length:Array.isArray(s.data?.smartphones)?s.data.smartphones.length:0} smartphone(s)</small></div><button onClick={()=>restore(s)}>Restaurar</button></div>)}</div>}</div>
 </div>
}

const BACKUP_FORMAT='bmcenter-complete-backup';
const BACKUP_FORMAT_VERSION=3;
function backupEligibleKey(key){
 return key.startsWith('bmcenter-')&&!['bmcenter-cloud-session'].includes(key);
}
function captureCompleteBackup(options={}){
 const storage={},excludeKeys=new Set(options.excludeKeys||[]);
 for(let index=0;index<localStorage.length;index++){
  const key=localStorage.key(index);
  if(!key||!backupEligibleKey(key)||excludeKeys.has(key))continue;
  const raw=localStorage.getItem(key);
  try{storage[key]=JSON.parse(raw)}catch{storage[key]=raw}
 }
 const audit={
   colorsAndTheme:!!storage[CFGKEY],
   phoneColumns:!!storage[PHONECOLKEY],
   tableLayouts:!!storage[TABLELAYOUTKEY],
   fontScales:!!storage[FONT_SCALE_KEY],
   menuVisibility:!!storage[MENUKEY],
   savedViews:!!storage[VIEWKEY],
   allBmcenterKeys:Object.keys(storage).length,
   capturedKeys:Object.keys(storage).sort()
  };
 const eligibleLocalKeys=[];
 for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&backupEligibleKey(key)&&!excludeKeys.has(key))eligibleLocalKeys.push(key)}
 const missingKeys=eligibleLocalKeys.filter(key=>!Object.prototype.hasOwnProperty.call(storage,key));
 if(missingKeys.length)throw new Error(`Backup incompleto: ${missingKeys.join(', ')}`);
 return{
  audit,
  format:BACKUP_FORMAT,
  formatVersion:BACKUP_FORMAT_VERSION,
  appVersion:APP_VERSION,
  exportedAt:new Date().toISOString(),
  storage,
  summary:{
   smartphones:Array.isArray(storage[SKEY])?storage[SKEY].length:0,
   suppliers:Array.isArray(storage[FKEY])?storage[FKEY].length:0,
   bankAccounts:Array.isArray(storage[BKEY])?storage[BKEY].length:0,
   marketplaceProfiles:Array.isArray(storage[PKEY])?storage[PKEY].length:0,
   sellers:Array.isArray(storage[VKEY])?storage[VKEY].length:0,
   parts:Array.isArray(storage[IKEY])?storage[IKEY].length:0,
   totalKeys:Object.keys(storage).length
  }
 }
}
function normalizeBackupFile(data){
 if(data?.format===BACKUP_FORMAT&&data.storage&&typeof data.storage==='object')return data;
 const legacyMap={
  [SKEY]:data?.smartphones||[],[VKEY]:data?.sellers||[],[FKEY]:data?.suppliers||[],
  [BKEY]:data?.bankAccounts||[],[UKEY]:data?.users||[],[PKEY]:data?.marketplaceProfiles||[],
  [TKEY]:data?.adTemplates||[],[IKEY]:data?.partsInventory||[],[MKEY]:data?.inventoryMovements||[],
  [MENUKEY]:data?.menuSettings||{},[CFGKEY]:data?.systemConfig||{},[ATITLEKEY]:data?.adTitleLibrary||[],
  [ADESCKEY]:data?.adDescriptionLibrary||[],[VIEWKEY]:data?.savedViews||[],
  [CHECKKEY]:data?.customChecklistTemplates||[],[GOALKEY]:data?.operationalGoals||{},
  [PHONECOLKEY]:data?.phoneColumns||data?.columnSettings||[],[TABLELAYOUTKEY]:data?.tableLayouts||{},
  [SNAPKEY]:data?.snapshots||[]
 };
 return{format:BACKUP_FORMAT,formatVersion:1,appVersion:data?.version||'legado',exportedAt:data?.exportedAt||null,storage:legacyMap,summary:{totalKeys:Object.keys(legacyMap).length}}
}
async function applyCompleteBackup(backup,{replace=true}={}){
 const normalized=normalizeBackupFile(backup);
 if(!normalized.storage||typeof normalized.storage!=='object')throw new Error('O arquivo não contém dados restauráveis.');
 const entries=Object.entries(normalized.storage).filter(([key])=>backupEligibleKey(key));
 if(!entries.length)throw new Error('Nenhum dado do BMCenter foi encontrado no arquivo.');
 if(replace){
  const current=[];
  for(let index=0;index<localStorage.length;index++){const key=localStorage.key(index);if(key&&backupEligibleKey(key))current.push(key)}
  current.filter(key=>!Object.prototype.hasOwnProperty.call(normalized.storage,key)).forEach(key=>localStorage.removeItem(key));
 }
 for(const[key,value]of entries){
  localStorage.setItem(key,JSON.stringify(value));
 }
 await Promise.all(entries.map(([key,value])=>pushCloudStateNow(key,value)));
 return normalized;
}
function backupSummaryText(backup){
 const b=normalizeBackupFile(backup),s=b.summary||{},storage=b.storage||{};
 const count=(key)=>Array.isArray(storage[key])?storage[key].length:0;
 return `${count(SKEY)} aparelho(s), ${count(FKEY)} fornecedor(es), ${count(BKEY)} conta(s) bancária(s), ${count(PKEY)} perfil(is) e ${Object.keys(storage).length} conjunto(s) de dados.`;
}

function downloadBackupObject(backup,filename){
 const normalized=normalizeBackupFile(backup);
 const blob=new Blob([JSON.stringify(normalized,null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)
}

function BackupPage(){
 const[preview,setPreview]=useState(null),[file,setFile]=useState(null),[busy,setBusy]=useState(false),[cloudBackups,setCloudBackups]=useState([]),[loadingCloud,setLoadingCloud]=useState(true);
 async function refreshCloud(){setLoadingCloud(true);try{setCloudBackups(await listCloudBackups())}catch(error){console.warn(error)}finally{setLoadingCloud(false)}}
 useEffect(()=>{refreshCloud()},[]);
 function exportData(){const data=captureCompleteBackup();downloadBackupObject(data,`bmcenter-completo-${new Date().toISOString().replace(/[:.]/g,'-')}.bmcenter`)}
 function chooseFile(selected){
  if(!selected)return;
  const reader=new FileReader();
  reader.onload=()=>{try{const data=normalizeBackupFile(JSON.parse(reader.result));setFile(selected);setPreview(data)}catch{setFile(null);setPreview(null);alert('Arquivo de backup inválido.')}};
  reader.readAsText(selected)
 }
 async function importData(){
  if(!preview)return;
  if(!confirm(`Restaurar este backup?\n\n${backupSummaryText(preview)}\n\nOs dados atuais serão substituídos.`))return;
  setBusy(true);
  try{
   await applyCompleteBackup(preview,{replace:true});
   alert('Backup restaurado integralmente e enviado para a nuvem.');
   location.reload()
  }catch(error){alert(`Falha na restauração: ${error.message||error}`)}
  finally{setBusy(false)}
 }
 async function makeCloudBackup(){
  setBusy(true);
  try{await createCloudBackup(captureCompleteBackup());await refreshCloud();alert('Backup automático criado na nuvem.')}
  catch(error){alert(`Falha ao criar backup na nuvem: ${error.message||error}`)}
  finally{setBusy(false)}
 }
 async function restoreCloud(item){
  if(!confirm(`Restaurar o backup de ${new Date(item.createdAt).toLocaleString('pt-BR')}?\n\nOs dados atuais serão substituídos.`))return;
  setBusy(true);
  try{const backup=await restoreCloudBackup(item.id);await applyCompleteBackup(backup,{replace:true});alert('Backup da nuvem restaurado integralmente.');location.reload()}
  catch(error){alert(`Falha ao restaurar: ${error.message||error}`)}
  finally{setBusy(false)}
 }
 async function downloadCloud(item){
  setBusy(true);
  try{const backup=await restoreCloudBackup(item.id);downloadBackupObject(backup,`bmcenter-nuvem-${new Date(item.createdAt).toISOString().replace(/[:.]/g,'-')}.bmcenter`)}
  catch(error){alert(`Falha ao baixar: ${error.message||error}`)}
  finally{setBusy(false)}
 }
 async function removeCloud(item){
  if(!confirm('Excluir este backup da nuvem?'))return;
  setBusy(true);try{await deleteCloudBackup(item.id);await refreshCloud()}catch(error){alert(error.message||String(error))}finally{setBusy(false)}
 }
 return <div className="v102-legacy-page">
  <Title t="Backup completo" s="Proteja e restaure 100% dos dados, configurações e personalizações do BMCenter.">
   <button onClick={makeCloudBackup} disabled={busy}><UploadCloud/> Criar backup na nuvem</button>
  </Title>
  <div className="backup-integrity-banner"><ShieldCheck/><div><b>Backup integral e compatível com versões futuras</b><small>O backup captura automaticamente todas as chaves BMCenter presentes no navegador, incluindo aparelhos, anúncios, fornecedores, contas, perfis, configurações, personalizações, layouts, menus e novos módulos adicionados depois.</small></div></div>
  <div className="backup-grid complete-backup-grid">
   <div className="panel backup-card"><Download size={38}/><h2>Baixar backup completo</h2><p>Gera um arquivo único com todos os módulos e configurações.</p><button className="primary" onClick={exportData}>Baixar arquivo .bmcenter</button></div>
   <div className="panel backup-card"><Upload size={38}/><h2>Restaurar arquivo</h2><p>Leia e confira o conteúdo antes de substituir os dados atuais.</p><label className="file-button">Selecionar backup<input type="file" accept=".bmcenter,.json,application/json" hidden onChange={e=>chooseFile(e.target.files?.[0])}/></label></div>
  </div>
  {preview&&<div className="panel backup-preview-panel"><div><h2>Conteúdo encontrado</h2><p>{backupSummaryText(preview)}</p><small>Arquivo: {file?.name} · Criado em {preview.exportedAt?new Date(preview.exportedAt).toLocaleString('pt-BR'):'data não informada'} · Versão {preview.appVersion||'—'}</small></div><button className="primary" disabled={busy} onClick={importData}>Restaurar tudo</button></div>}
  <div className="panel cloud-backup-panel">
   <div className="cloud-backup-heading"><div><h2>Backups automáticos na nuvem</h2><p>Os 10 backups mais recentes ficam disponíveis para recuperação.</p></div><button onClick={refreshCloud} disabled={loadingCloud||busy}><RefreshCw/> Atualizar</button></div>
   {loadingCloud?<p>Carregando backups...</p>:!cloudBackups.length?<Empty text="Nenhum backup na nuvem criado ainda."/>:<div className="cloud-backup-list">{cloudBackups.map(item=><div key={item.id}><div><b>{new Date(item.createdAt).toLocaleString('pt-BR')}</b><small>{item.summary||'Backup completo do sistema'}</small></div><button onClick={()=>downloadCloud(item)} disabled={busy}><Download size={14}/> Baixar</button><button onClick={()=>restoreCloud(item)} disabled={busy}>Restaurar</button><button className="danger" onClick={()=>removeCloud(item)} disabled={busy}>Excluir</button></div>)}</div>}
  </div>
  {busy&&<div className="backup-busy-overlay">Processando backup e sincronizando com a nuvem...</div>}
 </div>
}

function SimpleEntityModal({title,item,fields=[],selects=[],onClose,onSave}){
  const[f,setF]=useState(item),set=(k,v)=>setF({...f,[k]:v});
  return <Modal title={title} onClose={onClose}><div className="grid">{fields.map(([label,key])=><Field key={key} label={label} value={f[key]||''} onChange={v=>set(key,v)}/>)}
  {selects.map(([label,key,options])=><label key={key}>{label}<select value={f[key]||''} onChange={e=>set(key,e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>)}</div>
  <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar</button></div></Modal>
}

function addTimeline(phone,message){
  return {...phone,timeline:[...(phone.timeline||[]),{id:crypto.randomUUID(),date:new Date().toISOString(),message}]};
}
function copyText(text){
  if(!text)return;
  navigator.clipboard.writeText(text).then(()=>alert('Copiado.')).catch(()=>prompt('Copie abaixo:',text));
}


function PatternGestureGrid({pattern,onChange}){
 const gridRef=useRef(null),draggingRef=useRef(false),sequenceRef=useRef(Array.isArray(pattern)?pattern:[]);
 useEffect(()=>{if(!draggingRef.current)sequenceRef.current=Array.isArray(pattern)?pattern:[]},[pattern]);
 const emit=seq=>{sequenceRef.current=seq;onChange(seq)};
 const addNode=n=>{const seq=sequenceRef.current||[];if(seq.includes(n))return;emit([...seq,n])};
 const nodeAt=(clientX,clientY)=>{
  const el=document.elementFromPoint(clientX,clientY)?.closest?.('[data-pattern-node]');
  if(!el||!gridRef.current?.contains(el))return null;
  return Number(el.dataset.patternNode)||null
 };
 const startDraw=e=>{e.preventDefault();draggingRef.current=true;e.currentTarget.setPointerCapture?.(e.pointerId);const n=nodeAt(e.clientX,e.clientY);if(n)addNode(n)};
 const moveDraw=e=>{if(!draggingRef.current)return;e.preventDefault();const n=nodeAt(e.clientX,e.clientY);if(n)addNode(n)};
 const stopDraw=e=>{if(!draggingRef.current)return;draggingRef.current=false;e.currentTarget.releasePointerCapture?.(e.pointerId)};
 const points=(Array.isArray(pattern)?pattern:[]).map(n=>{const index=n-1,row=Math.floor(index/3),col=index%3;return `${34+col*56},${34+row*56}`}).join(' ');
 return <div ref={gridRef} className="pattern-grid gesture-pattern" onPointerDown={startDraw} onPointerMove={moveDraw} onPointerUp={stopDraw} onPointerCancel={stopDraw}>
  <svg className="pattern-lines" viewBox="0 0 180 180" preserveAspectRatio="none" aria-hidden="true"><polyline points={points}/></svg>
  {[1,2,3,4,5,6,7,8,9].map(n=><button type="button" data-pattern-node={n} key={n} className={(pattern||[]).includes(n)?'selected':''} onClick={e=>{e.preventDefault();if(!draggingRef.current)addNode(n)}}><span>{n}</span><small>{(pattern||[]).indexOf(n)>=0?(pattern||[]).indexOf(n)+1:''}</small></button>)}
 </div>
}

function UnlockCredentialsEditor({value,onChange,compact=false}){
 const items=Array.isArray(value)?value:[];
 const update=(id,patch)=>onChange(items.map(x=>x.id===id?{...x,...patch}:x));
 const remove=id=>onChange(items.filter(x=>x.id!==id));
 const add=type=>onChange([...items,{id:crypto.randomUUID(),type,label:`Alternativa ${items.length+1}`,value:'',pattern:[],note:''}]);
 return <div className={`unlock-credentials ${compact?'compact':''}`}>
  <div className="unlock-head"><div><b>Desbloqueio do aparelho</b><small>Cadastre quantas alternativas precisar. No padrão, você pode tocar ponto a ponto ou deslizar como no desbloqueio real.</small></div><div><button type="button" onClick={()=>add('text')}>+ Senha/PIN</button><button type="button" onClick={()=>add('pattern')}>+ Padrão</button></div></div>
  {!items.length&&<div className="unlock-empty">Nenhuma alternativa cadastrada.</div>}
  <div className="unlock-list">{items.map((item,index)=><article key={item.id} className={`unlock-item type-${item.type}`}>
   <header><input className="unlock-label" value={item.label||`Alternativa ${index+1}`} onChange={e=>update(item.id,{label:e.target.value})}/><select value={item.type} onChange={e=>update(item.id,{type:e.target.value,value:'',pattern:[]})}><option value="text">Senha / PIN</option><option value="pattern">Padrão de desenho</option></select><button type="button" className="danger" onClick={()=>remove(item.id)}>Remover</button></header>
   {item.type==='pattern'?<div className="pattern-editor"><PatternGestureGrid pattern={item.pattern||[]} onChange={pattern=>update(item.id,{pattern})}/><div className="pattern-summary"><span>Sequência registrada:</span><b>{(item.pattern||[]).length?(item.pattern||[]).join(' → '):'Deslize o dedo ou mouse pelos pontos'}</b><small>Você ainda pode tocar nos pontos individualmente.</small><button type="button" onClick={()=>update(item.id,{pattern:[]})}>Limpar padrão</button></div></div>:<label className="unlock-value">Senha, PIN ou texto<input value={item.value||''} onChange={e=>update(item.id,{value:e.target.value})} placeholder="Ex.: 2580, abc123, 0000..."/></label>}
   <label className="unlock-note">Observação opcional<input value={item.note||''} onChange={e=>update(item.id,{note:e.target.value})} placeholder="Ex.: cliente não tem certeza; tentar primeiro esta opção"/></label>
  </article>)}</div>
 </div>
}
function UnlockCredentialsSummary({phone}){
 const items=normalizeUnlockCredentials(phone);
 if(!items.length)return <InfoRow label="Desbloqueio" value="Não informado"/>;
 return <div className="unlock-summary"><span>Desbloqueio</span><div>{items.map((item,index)=><div key={item.id}><b>{item.label||`Alternativa ${index+1}`}</b><small>{item.type==='pattern'?`Padrão: ${(item.pattern||[]).join(' → ')||'não definido'}`:`${item.value||'não informado'}`}{item.note?` · ${item.note}`:''}</small></div>)}</div></div>
}

function PhoneDetailModal({item,profiles,onClose,onSave}){
 const[f,setF]=useState(()=>({...item,nfc:item.nfc===true?true:item.nfc===false?false:null,unlockCredentials:normalizeUnlockCredentials(item),photos:Array.isArray(item.photos)?item.photos:[],timeline:Array.isArray(item.timeline)?item.timeline:[],tags:Array.isArray(item.tags)?item.tags:[],parts:Array.isArray(item.parts)?item.parts:[],customChecklist:Array.isArray(item.customChecklist)?item.customChecklist:[],comments:Array.isArray(item.comments)?item.comments:[],attachments:Array.isArray(item.attachments)?item.attachments:[],tagColors:item.tagColors&&typeof item.tagColors==='object'?item.tagColors:{},ads:(item.ads||migrateLegacyAds(item)).map(normalizeAd)}));
 const[tab,setTab]=useState('summary'),[tag,setTag]=useState(''),[checkText,setCheckText]=useState(''),[commentText,setCommentText]=useState('');
 const set=(k,v)=>setF({...f,[k]:v});
 const publishedProfiles=[...new Set((f.ads||[]).flatMap(ad=>profiles.filter(p=>normalizeAd(ad).publications[p.id]?.status==='published').map(p=>p.name)))];
 const stages=[
  ['Comprado',true],['Diagnóstico',(f.diagnostics||[]).length>0],['Cotação',(f.parts||[]).some(p=>(p.quotes||[]).length)],['Pedido',(f.parts||[]).some(p=>p.orderStatus&&p.orderStatus!=='Não pedido')],
  ['Reparo',['Em reparo','Em testes','Pronto','Para fotografar','Anúncio preparado','Anunciado','Vendido'].includes(f.status)],['Anúncios',(f.ads||[]).length>0],['Venda',!!f.sale?.soldAt]
 ];
 function addTag(){const clean=tag.trim().toUpperCase();if(clean&&!f.tags.includes(clean))set('tags',[...f.tags,clean]);setTag('')}
 function saveAndClose(){onSave(addTimeline(f,'Ficha operacional atualizada'));onClose()}
 return <Modal className="phone-detail-modal" title={`${showProductCode()?f.code+" · ":""}${f.brand} ${f.model}`} onClose={onClose}>
  <div className="phone-detail-hero">
   <div className="phone-detail-cover"><Smartphone size={46}/></div>
   <div><span>{f.status}</span><h2>{f.brand} {f.model}</h2><p>{formatPhoneSpecs(f)}</p><div className="tag-line">{f.tags.map(t=><span style={{borderColor:f.tagColors?.[t]||undefined,color:f.tagColors?.[t]||undefined}} key={t}>{t}</span>)}</div></div>
   <div className="phone-detail-value"><span>Valor de venda</span><strong>{money(f.expected)}</strong><small>Custo estimado {money(phoneTotalCost(f))}</small></div>
  </div>
  <div className="phone-detail-progress">{stages.map(([name,done])=><div className={done?'done':''} key={name}><i>{done?'✓':'○'}</i><span>{name}</span></div>)}</div>
  <div className="tabs phone-detail-tabs">{[['summary','Resumo'],['workflow','Operação'],['checklist','Checklist'],['ads','Anúncios'],['timeline','Histórico'],['comments','Comentários'],['attachments','Anexos'],['notes','Observações']].map(([id,name])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{name}</button>)}</div>

  {tab==='summary'&&<div className="phone-detail-grid">
   <section><h3>Identificação</h3>{showProductCode()&&<InfoRow label="Código" value={f.code}/>}<InfoRow label="NFC" value={f.nfc===true?'Sim':f.nfc===false?'Não':'Não informado'}/><InfoRow label="Conector" value={f.connector||'Não informado'}/><UnlockCredentialsSummary phone={f}/><InfoRow label="Compra" value={formatDate(f.date)}/></section>
   <section><h3>Situação</h3><label>Status<select value={f.status} onChange={e=>set('status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><InfoRow label="Parado há" value={`${daysSince(f.lastActivityAt||f.date)} dias`}/><InfoRow label="Próxima ação" value={f.nextAction}/></section>
   <section><h3>Resumo operacional</h3><InfoRow label="Peças necessárias" value={f.parts.length}/><InfoRow label="Anúncios" value={f.ads.length}/><InfoRow label="Publicado em" value={publishedProfiles.join(', ')||'Nenhum perfil'}/></section>
  </div>}

  {tab==='workflow'&&<div className="phone-workflow-detail">
   <div className="workflow-status-box"><label>Status atual<select value={f.status} onChange={e=>set('status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label>Próxima ação<input value={f.nextAction||''} onChange={e=>set('nextAction',e.target.value)}/></label><label>Data<input type="date" value={f.nextActionDate||''} onChange={e=>set('nextActionDate',e.target.value)}/></label></div>
   <h3>Peças e cotações</h3>{f.parts.map(p=><div className="detail-part-row" key={p.id}><div><b>{p.name}</b><small>{p.status}</small></div><span>{(p.quotes||[]).length} cotação(ões)</span><strong>{money(Math.min(...(p.quotes||[]).map(q=>Number(q.price)||Infinity)))}</strong></div>)}{!f.parts.length&&<Empty text="Nenhuma peça necessária."/>}
  </div>}

  {tab==='checklist'&&<div className="custom-checklist-tab">
   <div className="checklist-add"><input value={checkText} onChange={e=>setCheckText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(checkText.trim()){set('customChecklist',[...f.customChecklist,{id:crypto.randomUUID(),text:checkText.trim(),done:false}]);setCheckText('')}}}} placeholder="Nova tarefa personalizada"/><button onClick={()=>{if(checkText.trim()){set('customChecklist',[...f.customChecklist,{id:crypto.randomUUID(),text:checkText.trim(),done:false}]);setCheckText('')}}}>Adicionar</button></div>
   <div className="custom-checklist-list">{f.customChecklist.map(item=><div className={item.done?'done':''} key={item.id}><button onClick={()=>set('customChecklist',f.customChecklist.map(x=>x.id===item.id?{...x,done:!x.done}:x))}>{item.done?'✓':'○'}</button><span>{item.text}</span><button className="danger" onClick={()=>set('customChecklist',f.customChecklist.filter(x=>x.id!==item.id))}>Excluir</button></div>)}</div>
   {!f.customChecklist.length&&<Empty text="Nenhuma tarefa personalizada."/>}
  </div>}

  {tab==='ads'&&<div className="phone-detail-ads">{f.ads.map(ad=><article key={ad.id}><header><div><b>{ad.name}</b><small>{ad.title||'Título não preparado'}</small></div><strong>{publishedCountForAd(ad)}/{profiles.length}</strong></header><div>{profiles.map(profile=>{const pub=ad.publications[profile.id]||{status:'not_published'};return <span className={pub.status} key={profile.id}>{publicationIcon(pub.status)} {profile.name}</span>})}</div></article>)}{!f.ads.length&&<Empty text="Nenhum anúncio criado."/>}</div>}

  {tab==='timeline'&&<div className="phone-master-timeline">{[...f.timeline].reverse().map(t=><div key={t.id}><i/><div><b>{new Date(t.date).toLocaleString('pt-BR')}</b><span>{t.message}</span></div></div>)}</div>}

  {tab==='comments'&&<div className="phone-comments-tab"><div className="comment-add"><textarea value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Escreva um comentário interno..."/><button className="primary" onClick={()=>{if(!commentText.trim())return;set('comments',[{id:crypto.randomUUID(),text:commentText.trim(),date:new Date().toISOString(),author:'Diego Moraes'},...f.comments]);setCommentText('')}}><MessageSquare/> Adicionar</button></div><div className="comment-list">{f.comments.map(c=><article key={c.id}><header><b>{c.author||'Usuário'}</b><time>{new Date(c.date).toLocaleString('pt-BR')}</time></header><p>{c.text}</p><button className="danger" onClick={()=>set('comments',f.comments.filter(x=>x.id!==c.id))}>Excluir</button></article>)}</div>{!f.comments.length&&<Empty text="Nenhum comentário interno."/>}</div>}

  {tab==='attachments'&&<div className="phone-attachments-tab"><label className="attachment-upload"><Paperclip/><span>Adicionar documentos, PDFs ou imagens</span><input type="file" multiple onChange={async e=>{const files=[...e.target.files];const loaded=await Promise.all(files.map(file=>new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve({id:crypto.randomUUID(),name:file.name,type:file.type,size:file.size,dataUrl:r.result,date:new Date().toISOString()});r.readAsDataURL(file)})));set('attachments',[...f.attachments,...loaded]);e.target.value=''}}/></label><div className="attachment-list">{f.attachments.map(a=><article key={a.id}><Paperclip/><div><b>{a.name}</b><small>{Math.round((a.size||0)/1024)} KB · {new Date(a.date).toLocaleString('pt-BR')}</small></div><a href={a.dataUrl} download={a.name}>Baixar</a><button className="danger" onClick={()=>set('attachments',f.attachments.filter(x=>x.id!==a.id))}>Excluir</button></article>)}</div>{!f.attachments.length&&<Empty text="Nenhum anexo neste aparelho."/>}</div>}

  {tab==='notes'&&<div className="phone-notes-tab"><label>Etiquetas<div className="tag-input-row"><input value={tag} onChange={e=>setTag(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addTag())} placeholder="Digite e pressione Enter"/><button onClick={addTag}>Adicionar</button></div></label><div className="tag-editor colored-tag-editor">{f.tags.map(t=><div key={t}><button style={{borderColor:f.tagColors?.[t]||undefined,color:f.tagColors?.[t]||undefined}} onClick={()=>set('tags',f.tags.filter(x=>x!==t))}>{t} ×</button><input type="color" value={f.tagColors?.[t]||'#3b82f6'} onChange={e=>set('tagColors',{...f.tagColors,[t]:e.target.value})}/></div>)}</div><label>Observações gerais<textarea value={f.notes||''} onChange={e=>set('notes',e.target.value)}/></label><label>Tarefas técnicas<textarea value={f.tasks||''} onChange={e=>set('tasks',e.target.value)}/></label></div>}

  <div className="actions"><button onClick={onClose}>Fechar sem salvar</button><button className="primary" onClick={saveAndClose}>Salvar ficha</button></div>
 </Modal>
}
function InfoRow({label,value}){return <div className="info-row"><span>{label}</span><b>{value||'—'}</b></div>}


function BatchPhoneModal({existing,banks,onClose,onSave}){
 const emptyRow=()=>({id:crypto.randomUUID(),brand:'',model:'',color:'',storage:'',ram:'',nfc:null,connector:'',unlockCredentials:[],paid:'',expected:'',notes:'',status:'Aguardando análise'});
 const[shared,setShared]=useState({date:new Date().toISOString().slice(0,10),origin:'',payment:'',bankAccountId:'',buyerNotes:''});
 const[rows,setRows]=useState([emptyRow(),emptyRow(),emptyRow()]);
 const[busy,setBusy]=useState(false);
 const setSharedField=(key,value)=>setShared(current=>({...current,[key]:value}));
 const setRow=(id,key,value)=>setRows(current=>current.map(row=>row.id===id?{...row,[key]:value}:row));
 const addRows=(amount=1)=>setRows(current=>[...current,...Array.from({length:amount},emptyRow)]);
 const removeRow=id=>setRows(current=>current.length===1?current:current.filter(row=>row.id!==id));
 function saveBatch(){
  const valid=rows.filter(row=>row.brand.trim()||row.model.trim());
  if(!valid.length)return alert('Informe pelo menos a marca ou o modelo de um aparelho.');
  const missing=valid.find(row=>!row.brand.trim()&&!row.model.trim());
  if(missing)return alert('Revise os aparelhos informados.');
  setBusy(true);
  try{
   const now=new Date().toISOString();
   const start=existing.length;
   const created=valid.map((row,index)=>{
    const phone=blankPhone(start+index+1);
    return{
     ...phone,
     ...row,
     id:crypto.randomUUID(),
     code:nextPhoneCode([...existing,...valid.slice(0,index).map((_,i)=>({code:`BM-${String(start+i+1).padStart(6,'0')}`}))]),
     date:shared.date,
     origin:shared.origin,
     payment:shared.payment,
     bankAccountId:shared.bankAccountId,
     paid:Number(row.paid||0),
     expected:Number(row.expected||0),
     notes:[row.notes,shared.buyerNotes].filter(Boolean).join('\n'),
     lastActivityAt:now,
     timeline:[{id:crypto.randomUUID(),date:now,message:'Aparelho cadastrado em compra em massa'}]
    }
   });
   onSave(created.map(sanitizePhoneForLeanMode))
  }finally{setBusy(false)}
 }
 return <Modal className="batch-phone-modal" title="Cadastro em massa de aparelhos" onClose={onClose}>
  <section className="batch-shared-section">
   <header><div><h3>Dados compartilhados da compra</h3><p>Estas informações serão aplicadas a todos os aparelhos deste lote.</p></div><span>{rows.filter(r=>r.brand||r.model).length} preenchido(s)</span></header>
   <div className="grid">
    <Field label="Data da compra" type="date" value={shared.date} onChange={v=>setSharedField('date',v)}/>
    <Field label="Origem da compra" value={shared.origin} onChange={v=>setSharedField('origin',v)}/>
    <Field label="Forma de pagamento" value={shared.payment} onChange={v=>setSharedField('payment',v)}/>
    <label>Conta usada<select value={shared.bankAccountId} onChange={e=>setSharedField('bankAccountId',e.target.value)}><option value="">Não informado</option>{banks.map(b=><option value={b.id} key={b.id}>{b.bank} · {b.accountName}</option>)}</select></label>
   </div>
   <label>Observações gerais da compra<textarea value={shared.buyerNotes} onChange={e=>setSharedField('buyerNotes',e.target.value)} placeholder="Nome, telefone, endereço ou outras informações de quem vendeu o lote..."/></label>
  </section>
  <section className="batch-phone-list">
   <div className="batch-phone-list-head"><div><h3>Aparelhos do lote</h3><p>Preencha apenas o necessário. Desbloqueio pode ser adicionado depois.</p></div><div><button type="button" onClick={()=>addRows(1)}>+ 1 aparelho</button><button type="button" onClick={()=>addRows(3)}>+ 3 aparelhos</button></div></div>
   {rows.map((row,index)=><article className="batch-phone-row" key={row.id}>
    <header><b>Aparelho {index+1}</b><button type="button" className="danger" onClick={()=>removeRow(row.id)} disabled={rows.length===1}>Remover</button></header>
    <div className="batch-phone-fields">
     <Field label="Marca" value={row.brand} onChange={v=>setRow(row.id,'brand',v)}/>
     <Field label="Modelo" value={row.model} onChange={v=>setRow(row.id,'model',v)}/>
     <Field label="Cor" value={row.color} onChange={v=>setRow(row.id,'color',v)}/>
     <Field label="Armazenamento" value={row.storage} onChange={v=>setRow(row.id,'storage',v)}/>
     <Field label="RAM" value={row.ram} onChange={v=>setRow(row.id,'ram',v)}/>
     <label>NFC<select value={row.nfc===true?'sim':row.nfc===false?'nao':''} onChange={e=>setRow(row.id,'nfc',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
     <label>Conector<select value={row.connector||''} onChange={e=>setRow(row.id,'connector',e.target.value)}><option value="">Não informado</option><option value="V8">V8 (Micro USB)</option><option value="Tipo C">Tipo C</option></select></label>
     <Field label="Valor pago" type="number" value={row.paid} onChange={v=>setRow(row.id,'paid',v)}/>
     <Field label="Valor de venda" type="number" value={row.expected} onChange={v=>setRow(row.id,'expected',v)}/>
     <label>Status<select value={row.status} onChange={e=>setRow(row.id,'status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
     <label className="batch-phone-notes">Observações individuais<textarea value={row.notes} onChange={e=>setRow(row.id,'notes',e.target.value)} placeholder="Ex.: tela quebrada, não funciona câmera..."/></label>
    </div>
    <details className="batch-unlock"><summary>Desbloqueio · {(row.unlockCredentials||[]).length} alternativa(s)</summary><UnlockCredentialsEditor compact value={row.unlockCredentials||[]} onChange={v=>setRow(row.id,'unlockCredentials',v)}/></details>
   </article>)}
  </section>
  <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" disabled={busy} onClick={saveBatch}>Salvar {rows.filter(r=>r.brand||r.model).length||''} aparelho(s)</button></div>
 </Modal>
}

function PhoneModal({item,banks,suppliers,onClose,onSave}){
  const normalizedParts=(item.parts||[]).map(p=>({
    ...p,
    status:p.status||'Cotando',
    quotes:p.quotes||((p.supplier||p.price)?[{id:crypto.randomUUID(),supplier:p.supplier||'',price:Number(p.price)||0,notes:''}]:[]),
    selectedQuoteId:p.selectedQuoteId||'',
    orderStatus:p.orderStatus||'Não pedido'
  }));
  const[f,setF]=useState({...item,nfc:item.nfc===true?true:item.nfc===false?false:null,unlockCredentials:normalizeUnlockCredentials(item),bankAccountId:item.bankAccountId||'',parts:normalizedParts,diagnostics:item.diagnostics||[],timeline:item.timeline||[],ad:item.ad||{},tags:item.tags||[],priceHistory:item.priceHistory||[],photos:item.photos||[]}),[part,setPart]=useState(''),[tag,setTag]=useState('');
  const set=(k,v)=>setF(current=>({...current,[k]:v}));
  const up=(i,k,v)=>setF(current=>{const parts=[...current.parts];parts[i]={...parts[i],[k]:v};return{...current,parts}});
  const addPartNow=()=>{if(!part.trim())return;setF(current=>({...current,parts:[...current.parts,{id:crypto.randomUUID(),name:part.trim(),status:'Cotando',quotes:[],selectedQuoteId:'',orderStatus:'Não pedido'}]}));setPart('')};
  const handleEnterNext=e=>{if(e.key!=='Enter')return;e.preventDefault();const fields=[...e.currentTarget.closest('.quote-row').querySelectorAll('input,select,button')];const index=fields.indexOf(e.currentTarget);const next=fields[index+1];if(next&&typeof next.focus==='function')next.focus();};
  const addQuote=partIndex=>setF(current=>{const parts=[...current.parts];parts[partIndex]={...parts[partIndex],quotes:[...(parts[partIndex].quotes||[]),{id:crypto.randomUUID(),supplier:'',price:0,notes:''}]};return{...current,parts}});
  const updateQuote=(partIndex,quoteIndex,key,value)=>setF(current=>{const parts=[...current.parts],quotes=[...(parts[partIndex].quotes||[])];quotes[quoteIndex]={...quotes[quoteIndex],[key]:key==='price'?Number(value):value};parts[partIndex]={...parts[partIndex],quotes};return{...current,parts}});
  const removeQuote=(partIndex,quoteId)=>setF(current=>{const parts=[...current.parts],part=parts[partIndex];parts[partIndex]={...part,quotes:(part.quotes||[]).filter(q=>q.id!==quoteId),selectedQuoteId:part.selectedQuoteId===quoteId?'':part.selectedQuoteId};return{...current,parts}});
  return <Modal className="phone-editor-modal" title={showProductCode()?(f.code||'Novo aparelho'):([f.brand,f.model].filter(Boolean).join(' ')||'Novo aparelho')} onClose={onClose}>
    <h3 className="section-title">Dados do aparelho</h3>
    <div className="grid phone-core-fields">
      {[['Marca','brand'],['Modelo','model'],['Cor','color'],['Armazenamento','storage'],['RAM','ram']].map(([l,k])=><Field key={k} label={l} value={f[k]} onChange={v=>set(k,v)}/>) }
      <label>NFC<select value={f.nfc===true?'sim':f.nfc===false?'nao':''} onChange={e=>set('nfc',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
      <label>Conector de carga<select value={f.connector||''} onChange={e=>set('connector',e.target.value)}><option value="">Não informado</option><option value="V8">V8 (Micro USB)</option><option value="Tipo C">Tipo C</option></select></label>
    </div>
    <details className="compact-editor-section"><summary>Desbloqueio <span>{(f.unlockCredentials||[]).length} alternativa(s)</span></summary><UnlockCredentialsEditor value={f.unlockCredentials} onChange={v=>set('unlockCredentials',v)}/></details>
    <h3 className="section-title">Dados da compra</h3>
    <div className="grid compact-purchase-grid">
      <Field label="Data da compra" type="date" value={f.date} onChange={v=>set('date',v)}/>
      <Field label="Origem da compra" value={f.origin} onChange={v=>set('origin',v)}/>
      <Field label="Forma de pagamento" value={f.payment} onChange={v=>set('payment',v)}/>
      <label>Conta/banco usado no pagamento
        <select value={f.bankAccountId||''} onChange={e=>set('bankAccountId',e.target.value)}>
          <option value="">Não informado</option>
          {banks.map(b=><option value={b.id} key={b.id}>{b.bank} · {b.accountName}</option>)}
        </select>
        {!banks.length&&<small className="field-help">Cadastre primeiro uma conta em Configurações → Contas bancárias.</small>}
      </label>
      <Field label="Valor pago" type="number" value={f.paid} onChange={v=>set('paid',v)}/>
      <Field label="Valor de venda" type="number" value={f.expected} onChange={v=>set('expected',v)}/>
      <label>Status<select value={f.status} onChange={e=>set('status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
    </div>
    <div className="compact-notes-grid"><label>Tarefas pendentes<textarea value={f.tasks} onChange={e=>set('tasks',e.target.value)} placeholder="Trocar tela, limpar, testar câmera..."/></label><label>Observações<textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></label></div>

    <details className="compact-editor-section"><summary><span><Tags size={15}/> Etiquetas</span><span>{f.tags.length}</span></summary>
    <div className="tag-editor"><div className="add"><input value={tag} onChange={e=>setTag(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(tag.trim()&&!f.tags.includes(tag.trim())){set('tags',[...f.tags,tag.trim()]);setTag('')}}}} placeholder="Ex.: NFC, 5G, OLED, Dual Chip"/><button type="button" onClick={()=>{if(tag.trim()&&!f.tags.includes(tag.trim())){set('tags',[...f.tags,tag.trim()]);setTag('')}}}>Adicionar</button></div><div className="tag-list">{f.tags.map(t=><span key={t}>{t}<button type="button" onClick={()=>set('tags',f.tags.filter(x=>x!==t))}>×</button></span>)}</div></div>

    </details>
    <details className="compact-editor-section"><summary>Peças necessárias <span>{f.parts.length}</span></summary>
    <div className="parts compact-parts">
      <h3 className="visually-hidden">Peças necessárias</h3>
      <div className="add"><input value={part} onChange={e=>setPart(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addPartNow()}}} placeholder="Ex.: Tela OLED"/><button type="button" onClick={addPartNow}>Adicionar peça</button></div>
      {f.parts.map((p,i)=><div className="quote-box" key={p.id}>
        <div className="part-head">
          <input value={p.name} onChange={e=>up(i,'name',e.target.value)}/>
          <select value={p.status} onChange={e=>up(i,'status',e.target.value)}>{['Cotando','Comprar','Comprada','Recebida','Instalada'].map(x=><option key={x}>{x}</option>)}</select>
          <button type="button" className="danger" onClick={()=>setF(current=>({...current,parts:current.parts.filter(x=>x.id!==p.id)}))}>Remover peça</button>
        </div>
        <div className="quotes-title">Cotações cadastradas</div>
        {(p.quotes||[]).map((q,qi)=><div className="quote-row" key={q.id}>
          <select className={!q.supplier?'supplier-placeholder':''} value={q.supplier} onChange={e=>updateQuote(i,qi,'supplier',e.target.value)} onKeyDown={e=>handleEnterNext(e)}><option value="" disabled hidden>Fornecedor</option>{suppliers.filter(s=>s.category!=='Aparelhos').map(s=><option value={s.name} key={s.id}>{s.name}</option>)}{q.supplier&&!suppliers.some(s=>s.name===q.supplier)&&<option value={q.supplier}>{q.supplier}</option>}</select>
          <input type="number" value={q.price||''} onChange={e=>updateQuote(i,qi,'price',e.target.value)} onKeyDown={e=>handleEnterNext(e)} placeholder="Preço"/>
          <input value={q.notes||''} onChange={e=>updateQuote(i,qi,'notes',e.target.value)} onKeyDown={e=>handleEnterNext(e)} placeholder="Observação"/>
          <button type="button" className="danger" onClick={()=>removeQuote(i,q.id)}>Excluir cotação</button>
        </div>)}
        <button type="button" className="quote-add-button" onClick={()=>addQuote(i)}>+ Adicionar cotação</button>
      </div>)}
    </div>

    </details>
    <details className="compact-editor-section"><summary>Etiqueta do aparelho</summary>
    <div className="label-preview" id={`label-${f.id}`}><div>{showProductCode()&&<b>{f.code}</b>}<span>{f.brand} {f.model}</span><small>{f.color} · {f.storage}</small></div><QRCodeSVG value={`${showProductCode()?f.code:''}|${f.brand} ${f.model}`} size={92}/></div>
    <button type="button" onClick={()=>printPhoneLabel(f)}>Imprimir etiqueta</button>
    </details>

    <details className="compact-editor-section"><summary>Históricos</summary>
    <div className="price-history-section">
      <h3><TrendingUp size={18}/> Histórico de preços</h3>
      {!f.priceHistory.length?<p className="muted">Nenhuma alteração de preço registrada.</p>:<div className="timeline-list">{[...f.priceHistory].reverse().map(h=><div className="timeline-item" key={h.id}><b>{new Date(h.date).toLocaleString('pt-BR')}</b><span>{money(h.oldValue)} → <strong>{money(h.newValue)}</strong></span></div>)}</div>}
    </div>
    <div className="timeline-section">
      <h3><History size={18}/> Histórico</h3>
      <div className="timeline-list">{[...(f.timeline||[])].reverse().map(t=><div className="timeline-item" key={t.id}><b>{new Date(t.date).toLocaleString('pt-BR')}</b><span>{t.message}</span></div>)}</div>
    </div>
    </details>
    <div className="actions sticky-modal-actions"><button type="button" onClick={onClose}>Cancelar</button><button type="button" className="primary" onClick={()=>onSave(f)}>Salvar</button></div>
  </Modal>
}

function SellerModal({item,onClose,onSave}){const[f,setF]=useState(item),set=(k,v)=>setF({...f,[k]:v});return <Modal title="Cadastro de vendedor" onClose={onClose}><div className="grid"><Field label="Nome" value={f.name} onChange={v=>set('name',v)}/><Field label="Telefone" value={f.phone} onChange={v=>set('phone',v)}/><Field label="Cidade" value={f.city} onChange={v=>set('city',v)}/><Field label="Endereço" value={f.address} onChange={v=>set('address',v)}/></div><label>Observações<textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></label><div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar</button></div></Modal>}
function Modal({title,onClose,children,className=''}) {
 const currentPage=sessionStorage.getItem('bmcenter-current-page')||'dashboard';
 const pageScale=getFontScale(fontScaleId('page',currentPage));
 const scaleKey=fontScaleId('modal',title);
 const[fontScale,setFontScale]=useState(()=>getFontScale(scaleKey));
 const changeFont=delta=>setFontScale(current=>saveFontScale(scaleKey,Math.round((current+delta)*100)/100));
 return <div className="back" style={{zoom:1/pageScale}} onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={`modal ${className}`} style={{zoom:fontScale}}><div className="modalhead"><h2>{title}</h2><div className="modalhead-tools"><div className="font-scale-controls" title="Tamanho da fonte desta janela"><button type="button" onClick={()=>changeFont(-.05)} disabled={fontScale<=.9}>−</button><span>{Math.round(fontScale*100)}%</span><button type="button" onClick={()=>changeFont(.05)} disabled={fontScale>=1.15}>+</button></div><button type="button" onClick={onClose}><X/></button></div></div><div className="modalbody">{children}</div></div></div>
}
function Field({label,value,onChange,type='text'}){return <label>{label}<input type={type} value={value??''} onChange={e=>onChange(e.target.value)}/></label>}
function Title({t,s,children}){return <div className="title"><div><h1>{t}</h1><p>{s}</p></div>{children}</div>}
function Empty({text='Nenhum registro cadastrado.'}){return <div className="empty">{text}</div>}

const photoLabels={front:'Frente',back:'Traseira',left:'Lateral esquerda',right:'Lateral direita',screen:'Tela ligada',cameras:'Câmeras',accessories:'Acessórios',details:'Detalhes estéticos'};
function defaultPhotoChecklist(){return{front:false,back:false,left:false,right:false,screen:false,cameras:false,accessories:false,details:false}}
function defaultAccessories(){return['Caixa','Carregador','Cabo USB','Capinha','Película','Nota fiscal','Fone de ouvido'].map(name=>({name,included:false}))}
function touchPhone(phone){return{...phone,lastActivityAt:new Date().toISOString()}}
function daysSince(value){if(!value)return 0;return Math.max(0,Math.floor((Date.now()-new Date(value).getTime())/86400000))}
function daysUntil(value){if(!value)return 99999;return Math.ceil((new Date(value+'T23:59:59').getTime()-Date.now())/86400000)}

function printPhoneLabel(phone){
 const code=showProductCode()&&phone.code?`<b>${phone.code}</b>`:'';
 const qr=showProductCode()&&phone.code?`<div>QR: ${phone.code}</div>`:'';
 const html=`<!doctype html><html><head><title>${showProductCode()?phone.code:'BMCenter'}</title><style>body{font-family:Arial;margin:20px}.label{width:330px;border:2px solid #111;padding:14px;display:flex;justify-content:space-between;align-items:center}.label b{font-size:28px}.label span,.label small{display:block;margin-top:5px}</style></head><body><div class="label"><div>${code}<span>${phone.brand||''} ${phone.model||''}</span><small>${phone.color||''} · ${phone.storage||''}</small><small>NFC: ${phone.nfc===true?'Sim':phone.nfc===false?'Não':'não informado'}</small></div>${qr}</div><script>print();</script></body></html>`;
 const w=window.open('','_blank','width=500,height=400');w.document.write(html);w.document.close();
}


function saleNetValue(sale){
 if(!sale)return 0;
 if(sale.netValue!==undefined&&sale.netValue!==null)return Number(sale.netValue||0);
 return Number(sale.value||0)-Number(sale.marketplaceFee||0)-Number(sale.shippingCost||0);
}


function saleReceivedValue(sale){
 if(!sale)return 0;
 const net=saleNetValue(sale);
 if(sale.receivedAmount!==undefined&&sale.receivedAmount!==null)return Math.max(0,Math.min(net,Number(sale.receivedAmount||0)));
 return sale.paymentStatus==='Pendente'?0:net;
}
function salePendingValue(sale){
 if(!sale)return 0;
 return Math.max(0,saleNetValue(sale)-saleReceivedValue(sale));
}
function salePaymentStatus(sale){
 if(!sale)return'Pendente';
 const pending=salePendingValue(sale),received=saleReceivedValue(sale);
 return pending<=0?'Recebido':received>0?'Parcial':'Pendente';
}

function nextPhoneCode(items){
 const max=items.reduce((m,p)=>Math.max(m,Number(String(p.code||'').replace(/\D/g,''))||0),0);
 return `BM-${String(max+1).padStart(6,'0')}`;
}
function collectAllData(){return captureCompleteBackup()}
async function restoreAllData(data){return applyCompleteBackup(data,{replace:true})}
function csvCell(value){const s=String(value??'').replaceAll('"','""');return `"${s}"`}
function downloadText(name,text,type){const blob=new Blob(['\ufeff'+text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
function blankPhone(n){return{id:crypto.randomUUID(),code:`BM-${String(n).padStart(6,'0')}`,brand:'',model:'',color:'',storage:'',ram:'',nfc:null,connector:'',unlockCredentials:[],date:new Date().toISOString().slice(0,10),origin:'',payment:'',bankAccountId:'',paid:0,expected:0,status:'Aguardando análise',tasks:'',notes:'',tags:[],photos:[],priceHistory:[],lastActivityAt:new Date().toISOString(),parts:[],diagnostics:[],timeline:[{id:crypto.randomUUID(),date:new Date().toISOString(),message:'Aparelho cadastrado'}],ad:{}}}
createRoot(document.getElementById('root')).render(<AppErrorBoundary><CloudGate/></AppErrorBoundary>);