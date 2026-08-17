import React,{useEffect,useMemo,useRef,useState}from'react';import{createRoot}from'react-dom/client';import{Smartphone,Users,ShoppingCart,LayoutDashboard,Plus,LogOut,X,Store,ClipboardCheck,History,FileText,Download,Upload,ShieldCheck,KanbanSquare,BarChart3,Search,CalendarDays,WalletCards,Tags,Package,Clock3,AlertTriangle,TrendingUp,Settings,Bell,ListTodo,Eye,Pencil,MoreVertical,ChevronLeft,ChevronRight,ChevronDown,Star,CheckSquare,DatabaseZap,RefreshCw,RotateCcw,Activity,Archive,Bookmark,UploadCloud,MessageSquare,Paperclip,Target,Gauge,CalendarClock,Copy,Trash2,ExternalLink,Save}from'lucide-react';
import{QRCodeSVG}from'qrcode.react';
import{effectivePartCost,partsOperationalCounters,partsPeriodReportMetrics,returnRefundTotal,returnRecoveredAmount,returnPartRefundDraft,normalizePartsOrder,normalizePartsOrders,syncOrdersIntoPhones,migrateLegacyPartsOrders,recoverLegacyPartOrderStatusMutations,isPartProcurementComplete,isPartOpenForProcurement,orderStatusLabel,createBulkPartsOrder,createMultiBulkPartsOrder,removePartsOrderLinks,bulkPhoneProductsTotal}from'./partsOrders.js';
import{workflowStageForPhone}from'./workflow.js';
import{adCoverageMetrics,buildOperationalTimeline,businessSuggestions,capitalAllocation,intelligencePhoneCost,modelKey,operationalIdleDays,phoneOtherCosts,profitabilityForPhone,purchaseSuggestion,smartActionQueue,stockAgingRows,turnoverByModel}from'./businessIntelligence.js';
import{phoneSaleDisplayValue,restoreSuggestedValueAfterSaleRemoval,soldSaleValueNeedsRepair,syncRecordedSaleValue}from'./saleAccounting.js';
import{BACKUP_RUNTIME_KEY,AUTO_BACKUP_CHECK_MS,automaticBackupBucket,backupFingerprint,shouldRefreshAutomaticBackup,auditBackupObject,decodeStorageRaw,encodeStorageValue}from'./backupAudit.js';
import SmartphonesView from './pages/SmartphonesView.jsx';
import AdsOverviewView from './pages/AdsOverviewView.jsx';
import BatchActionsView from './pages/BatchActionsView.jsx';
import AppFrame from './components/v7/AppFrame.jsx';
import AppFrameV102 from './v102/AppFrameV102.jsx';
import DashboardV102 from './v102/pages/DashboardV102.jsx';
import TodayV102 from './v102/pages/TodayV102.jsx';
import SmartphonesV102 from './v102/pages/SmartphonesV102.jsx';
import AdsV102 from './v102/pages/AdsV102.jsx';
import BatchV102 from './v102/pages/BatchV102.jsx';import ActivityV102 from './v102/pages/ActivityV102.jsx';import ReportsV10 from './v10/pages/ReportsV10.jsx';import{cloudConfigured,getCloudSession,signInCloud,signUpCloud,signOutCloud,initializeCloudState,queueCloudSave,subscribeCloudState,getCloudStatus,clearCloudState,pushCloudStateNow,createCloudBackup,listCloudBackups,restoreCloudBackup,deleteCloudBackup,CLOUD_REMOTE_EVENT}from'./cloud.js';import'./styles.css';import'./v10.css';import'./v102.css';import'./v1023.css';import'./v1024.css';import'./v1025.css';import'./v1026.css';import'./v1027.css';import'./v1028.css';import'./v1029.css';import'./v1030.css';import'./v1031.css';import'./v1033.css';import'./v1034.css';import'./v1038.css';import'./v1039.css';import'./v10311.css';import'./v10312.css';import'./v10313.css';import'./v10314.css';import'./v10315.css';import'./v1040.css';import'./v1041.css';import'./v1042.css';import'./v1043.css';import'./v1044.css';import'./v1046.css';import'./v1047.css';import'./v1048.css';import'./v1049.css';import'./v10410.css';import'./v10413.css';import'./v10414.css';import'./v10415.css';import'./v10416.css';import'./v10417.css';import'./v10418.css';import'./v10423.css';import'./v10424.css';import'./v10447.css';import'./v10448.css';import'./v10449.css';import'./v10450.css';import'./v10451.css';import'./v10452.css';import'./v10453.css';import'./v10454.css';import'./v10455.css';import'./v10456.css';import'./v10457.css';import'./v10458.css';import'./v10459.css';import'./v10460.css';import'./v10461.css';import'./v10462.css';import'./v10463.css';import'./v10464.css';import'./v10465.css';import'./v10466.css';import'./v10467.css';import'./v10468.css';import'./v10469.css';import'./v10470.css';import'./v10472.css';import'./v10474.css';import'./v10476.css';import'./v10477.css';import'./v10478.css';import'./v10479.css';import'./v10480.css';import'./v10481.css';import'./v10482.css';import'./v10483.css';import'./v10484.css';import'./v10486.css';import'./v10487.css';import'./v10489.css';import'./v10490.css';import'./v10491.css';import'./v10493.css';import'./v1050.css';import'./v1051.css';import'./v1052.css';import'./v1053.css';import'./v1054.css';import'./v1055.css';import'./v1057.css';
const SKEY='bmcenter-smartphones',ADSNOTEKEY='bmcenter-ads-observations',VKEY='bmcenter-sellers',BKEY='bmcenter-bank-accounts',FKEY='bmcenter-suppliers',QKEY='bmcenter-parts-quote-settings',OKEY='bmcenter-parts-orders',UKEY='bmcenter-users',PKEY='bmcenter-marketplace-profiles',TKEY='bmcenter-ad-templates',IKEY='bmcenter-parts-inventory',MKEY='bmcenter-inventory-movements',MENUKEY='bmcenter-visible-menus',CFGKEY='bmcenter-system-config',ATITLEKEY='bmcenter-ad-title-library',ADESCKEY='bmcenter-ad-description-library',VIEWKEY='bmcenter-saved-views',CHECKKEY='bmcenter-custom-checklists',GOALKEY='bmcenter-operational-goals',PHONECOLKEY='bmcenter-phone-columns',TABLELAYOUTKEY='bmcenter-table-layouts',SNAPKEY='bmcenter-auto-snapshots',PHONE_DRAFT_KEY='bmcenter-phone-draft',BATCH_DRAFT_KEY='bmcenter-batch-phone-draft',STATUSKEY='bmcenter-phone-statuses',AKEY='bmcenter-auth';
const APP_VERSION='10.5.8';
const ALL_CLOUD_KEYS=[SKEY,ADSNOTEKEY,VKEY,BKEY,FKEY,QKEY,OKEY,UKEY,PKEY,TKEY,IKEY,MKEY,MENUKEY,CFGKEY,ATITLEKEY,ADESCKEY,VIEWKEY,CHECKKEY,GOALKEY,PHONECOLKEY,TABLELAYOUTKEY,SNAPKEY,PHONE_DRAFT_KEY,BATCH_DRAFT_KEY,STATUSKEY,'bmcenter-font-scales'];
const load=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}},save=(k,v)=>{localStorage.setItem(k,JSON.stringify(v));queueCloudSave(k,v)};
function useRemoteStorageBridge(key,setter,normalize){
 const normalizeRef=useRef(normalize);normalizeRef.current=normalize;
 useEffect(()=>{const handler=event=>{if(event.detail?.key!==key)return;const raw=event.detail?.value;const next=normalizeRef.current?normalizeRef.current(raw):raw;setter(next)};window.addEventListener(CLOUD_REMOTE_EVENT,handler);return()=>window.removeEventListener(CLOUD_REMOTE_EVENT,handler)},[key,setter])
}
const loadDraft=k=>{try{const value=JSON.parse(localStorage.getItem(k)||'null');return value&&typeof value==='object'&&!value.deleted?value:null}catch{return null}};
const saveDraft=(k,v)=>{const payload={...v,deleted:false,savedAt:new Date().toISOString()};localStorage.setItem(k,JSON.stringify(payload));queueCloudSave(k,payload);return payload};
const clearDraft=k=>{const tombstone={deleted:true,deletedAt:new Date().toISOString()};localStorage.setItem(k,JSON.stringify(tombstone));queueCloudSave(k,tombstone);pushCloudStateNow(k,tombstone).catch(error=>console.warn('Falha ao remover rascunho da nuvem',error))};
const BULK_PARTS_DEVICE_DRAFT_KEY='bmcenter-device-bulk-parts-order-draft-v1';
function loadDeviceSessionDraft(key){try{const value=JSON.parse(sessionStorage.getItem(key)||'null');return value&&typeof value==='object'?value:null}catch{return null}}
function saveDeviceSessionDraft(key,value){try{sessionStorage.setItem(key,JSON.stringify({...value,savedAt:new Date().toISOString()}))}catch{}}
function clearDeviceSessionDraft(key){try{sessionStorage.removeItem(key)}catch{}}
const money=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0);
function phoneSelectedPartsCost(phone){return (phone.parts||[]).reduce((sum,part)=>sum+effectivePartCost(part),0)}
function phoneTotalCost(phone){return intelligencePhoneCost(phone)}
function formatDate(value){if(!value)return'—';const[y,m,d]=value.split('-');return d&&m&&y?`${d}/${m}/${y}`:value}
function formatMonth(value){if(!value)return'—';const[y,m]=value.split('-');return m&&y?`${m}/${y}`:value}
function capacityLabel(value){const text=String(value??'').trim();if(!text)return'';return /gb$/i.test(text)?text:`${text}GB`}
function stripUnit(value,unit){return String(value??'').replace(new RegExp(`\\s*${unit}\\s*$`,'i'),'').trim()}
function normalizeCapacityInput(value){return stripUnit(value,'GB').replace(/[^0-9.,]/g,'')}
function normalizeRamInput(value){return stripUnit(value,'GB').replace(/[^0-9+.,\s]/g,'').replace(/\s*\+\s*/g,'+').replace(/\+{2,}/g,'+')}
function normalizeMoneyInput(value){return String(value??'').replace(/^\s*R\$\s*/i,'').replace(/[^0-9.,]/g,'').trim()}
function parseMoneyInput(value){const raw=normalizeMoneyInput(value);if(!raw)return 0;if(raw.includes(','))return Number(raw.replace(/\./g,'').replace(',','.'))||0;return Number(raw)||0}
async function photoThumbnail(file){
 return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(reader.error||new Error('Falha ao ler foto'));reader.onload=()=>{const img=new Image();img.onerror=()=>reject(new Error('Imagem inválida'));img.onload=()=>{const max=160,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.42))};img.src=reader.result};reader.readAsDataURL(file)})
}
async function mediaEntriesFromFiles(files){const stamp=new Date().toISOString(),items=[];for(const file of files){if(!String(file.type||'').startsWith('image/'))continue;try{items.push({id:crypto.randomUUID(),name:file.name||`foto-${items.length+1}.jpg`,type:file.type||'image/jpeg',size:Number(file.size||0),date:stamp,thumbnail:await photoThumbnail(file)})}catch(error){console.warn('Foto ignorada',error)}}return items}
function formatPhoneSpecs(phone){return [phone?.color,capacityLabel(phone?.storage),phone?.ram&&`${capacityLabel(phone.ram)} RAM`,phone?.nfc===true?'NFC':'',phone?.connector||'',phone?.screenProtector===true?'Película':'',phone?.caseIncluded===true?'Capinha':'',phone?.likeNew===true?'Estado de novo':'',phone?.biometrics===true?'Biometria':''].filter(Boolean).join(' · ')||'Sem detalhes'}
const DEFAULT_PHONE_STATUSES=['Descarte/Sucata','Aguardando análise','Aguardando peças','Anunciado','Anúncio preparado','Conta Google/FRP','Em reparo','Em testes','Para fotografar','Preparar sistema','Pronto','Reservado','Vendido'];
function sortPhoneStatuses(list){return [...new Set((Array.isArray(list)?list:[]).map(x=>String(x||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}))}
function loadPhoneStatuses(){try{const saved=JSON.parse(localStorage.getItem(STATUSKEY)||'null');return saved&&Array.isArray(saved)&&saved.length?sortPhoneStatuses(saved.includes('Descarte/Sucata')?saved:[...saved,'Descarte/Sucata']):sortPhoneStatuses(DEFAULT_PHONE_STATUSES)}catch{return sortPhoneStatuses(DEFAULT_PHONE_STATUSES)}}
function savePhoneStatuses(list){const next=sortPhoneStatuses(list);localStorage.setItem(STATUSKEY,JSON.stringify(next));queueCloudSave(STATUSKEY,next);return next}
const statuses=loadPhoneStatuses();

function isClosedPhone(phone){return ['Vendido','Descarte/Sucata'].includes(phone?.status)}
const PHONE_CODE_FLOOR_KEY='bmcenter-phone-code-floor-v1042',PHONE_CODE_MIGRATION_KEY='bmcenter-phone-code-migration-v1042',STATUS_V1042_MIGRATION_KEY='bmcenter-status-v1042';
function ensurePhoneCodeSequenceV1042(){
 try{
  const floor=Math.max(870,Number(localStorage.getItem(PHONE_CODE_FLOOR_KEY)||0));
  localStorage.setItem(PHONE_CODE_FLOOR_KEY,String(floor));
  if(localStorage.getItem(PHONE_CODE_MIGRATION_KEY)==='1')return false;
  const phones=load(SKEY);
  if(!Array.isArray(phones)||!phones.length)return false;
  const ordered=[...phones].sort((a,b)=>{const an=Number(String(a.code||'').replace(/\D/g,''))||0,bn=Number(String(b.code||'').replace(/\D/g,''))||0;return an-bn||String(a.date||'').localeCompare(String(b.date||''))||String(a.id||'').localeCompare(String(b.id||''))});
  const codes=new Map(ordered.map((phone,index)=>[phone.id,`BM-${String(848+index).padStart(6,'0')}`]));
  const migrated=phones.map(phone=>({...phone,code:codes.get(phone.id)||phone.code}));
  localStorage.setItem(SKEY,JSON.stringify(migrated));queueCloudSave(SKEY,migrated);pushCloudStateNow(SKEY,migrated).catch(()=>{});
  localStorage.setItem(PHONE_CODE_MIGRATION_KEY,'1');
  return true
 }catch(error){console.warn('Migração de códigos não concluída.',error);return false}
}
function ensureStatusV1042(){
 try{
  if(localStorage.getItem(STATUS_V1042_MIGRATION_KEY)==='1')return;
  const current=loadPhoneStatuses();
  if(!current.includes('Descarte/Sucata'))savePhoneStatuses([...current,'Descarte/Sucata']);
  localStorage.setItem(STATUS_V1042_MIGRATION_KEY,'1')
 }catch(error){console.warn('Status Descarte/Sucata não pôde ser migrado.',error)}
}
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
function saveFontScale(id,value){const next={...loadFontScales(),[id]:Math.min(1.15,Math.max(.9,Number(value)||1))};localStorage.setItem(FONT_SCALE_KEY,JSON.stringify(next));queueCloudSave(FONT_SCALE_KEY,next);return next[id]}
function App({cloudUser,onCloudLogout}){
 const migrationV1042=useMemo(()=>{ensureStatusV1042();const migrated=ensurePhoneCodeSequenceV1042();try{if(localStorage.getItem('bmcenter-parts-orders-migration-v10448')!=='1'){const result=migrateLegacyPartsOrders(load(SKEY),load(OKEY));localStorage.setItem(OKEY,JSON.stringify(result.orders));localStorage.setItem(SKEY,JSON.stringify(result.phones));queueCloudSave(OKEY,result.orders);queueCloudSave(SKEY,result.phones);localStorage.setItem('bmcenter-parts-orders-migration-v10448','1')}}catch(error){console.warn('Migração de pedidos de peças não concluída.',error)}return migrated},[]);void migrationV1042;
 const[mobileMenuOpen,setMobileMenuOpen]=useState(false);
 const[config,setConfig]=useState(()=>loadSystemConfig());
 const[page,setPage]=useState(()=>sessionStorage.getItem('bmcenter-current-page')||loadSystemConfig().homePage||'dashboard');
 const pageRef=useRef(page);
 useEffect(()=>{pageRef.current=page},[page]);
 useEffect(()=>{
  const initialPage=pageRef.current||loadSystemConfig().homePage||'dashboard';
  const fallback=loadSystemConfig().homePage||'dashboard';
  const state=history.state||{};
  /* Mantém sempre uma entrada interna atrás da tela atual. No Android, o primeiro
     VOLTAR não pode abandonar o PWA/site: ele retorna à página anterior do BMCenter. */
  if(state?.bmcenterApp!==true||state?.bmcenterAnchor!==true){
   history.replaceState({...state,bmcenterApp:true,bmcenterPage:fallback,bmcenterAnchor:true},'',location.href);
   history.pushState({bmcenterApp:true,bmcenterPage:initialPage,bmcenterAnchor:false},'',location.href);
  }else if(state.bmcenterPage!==initialPage){
   history.replaceState({...state,bmcenterPage:initialPage},'',location.href);
  }
  const handlePopState=event=>{
   const target=event.state?.bmcenterApp?event.state?.bmcenterPage:null;
   if(target){
    pageRef.current=target;sessionStorage.setItem('bmcenter-current-page',target);setPage(target);setMobileMenuOpen(false);requestAnimationFrame(()=>window.scrollTo(0,0));
    /* Se chegamos à âncora protetora, recria uma entrada ativa para que outro
       VOLTAR continue dentro do aplicativo em vez de sair do navegador. */
    if(event.state?.bmcenterAnchor===true)history.pushState({bmcenterApp:true,bmcenterPage:target,bmcenterAnchor:false},'',location.href);
    return
   }
   history.pushState({bmcenterApp:true,bmcenterPage:fallback,bmcenterAnchor:false},'',location.href);
   pageRef.current=fallback;sessionStorage.setItem('bmcenter-current-page',fallback);setPage(fallback);setMobileMenuOpen(false);requestAnimationFrame(()=>window.scrollTo(0,0));
  };
  window.addEventListener('popstate',handlePopState);
  return()=>window.removeEventListener('popstate',handlePopState);
 },[]);
 useEffect(()=>{
  const key='bmcenter-parts-phone-status-guard-v10467';
  if(localStorage.getItem(key)==='1')return;
  try{
   const current=load(SKEY);
   const recovered=recoverLegacyPartOrderStatusMutations(current);
   const changed=recovered.some((phone,index)=>String(phone?.status||'')!==String(current?.[index]?.status||''));
   if(changed){localStorage.setItem(SKEY,JSON.stringify(recovered));queueCloudSave(SKEY,recovered)}
  }catch(error){console.warn('Correção de status alterado por pedidos de peças não concluída.',error)}
  finally{localStorage.setItem(key,'1')}
 },[]);
 useEffect(()=>{
  const key='bmcenter-sold-publications-v10474';if(localStorage.getItem(key)==='1')return;
  try{const current=load(SKEY),profiles=load(PKEY);if(Array.isArray(current)){const repaired=repairSoldPublicationStates(current,profiles);if(JSON.stringify(repaired)!==JSON.stringify(current)){localStorage.setItem(SKEY,JSON.stringify(repaired));queueCloudSave(SKEY,repaired);pushCloudStateNow(SKEY,repaired).catch(()=>{});window.dispatchEvent(new CustomEvent(CLOUD_REMOTE_EVENT,{detail:{key:SKEY,value:repaired,source:'sold-publication-migration'}}))}}}
  catch(error){console.warn('Encerramento de anúncios de aparelhos vendidos não concluído.',error)}finally{localStorage.setItem(key,'1')}
 },[]);
 useEffect(()=>{const key='bmcenter-lean-phone-v102';if(localStorage.getItem(key)==='1')return;const phones=load(SKEY);if(Array.isArray(phones)){const lean=phones.map(sanitizePhoneForLeanMode);localStorage.setItem(SKEY,JSON.stringify(lean));queueCloudSave(SKEY,lean)}localStorage.setItem(key,'1')},[]);
 useEffect(()=>{const key='bmcenter-phone-schema-v1024';if(localStorage.getItem(key)==='1')return;const phones=load(SKEY);if(Array.isArray(phones)){const migrated=phones.map(sanitizePhoneForLeanMode);localStorage.setItem(SKEY,JSON.stringify(migrated));queueCloudSave(SKEY,migrated)}localStorage.setItem(key,'1')},[]);
 useEffect(()=>{const key='bmcenter-photo-studio-removed-v10445';if(localStorage.getItem(key)!=='1'){const phones=load(SKEY);if(Array.isArray(phones)){const cleaned=phones.map(sanitizePhoneForLeanMode);localStorage.setItem(SKEY,JSON.stringify(cleaned));queueCloudSave(SKEY,cleaned)}localStorage.removeItem('bmcenter-photo-root-local');localStorage.setItem(key,'1')}if('indexedDB'in window)indexedDB.deleteDatabase('bmcenter-photo-studio-v1')},[]);
 useEffect(()=>{const key='bmcenter-photo-target-default-v1051';if(localStorage.getItem(key)==='1')return;const phones=load(SKEY);if(Array.isArray(phones)){let changed=false;const migrated=phones.map(phone=>{const current=Number(phone?.photoTarget||0);if(!current||current===6){changed=true;return{...phone,photoTarget:10}}return phone});if(changed){localStorage.setItem(SKEY,JSON.stringify(migrated));queueCloudSave(SKEY,migrated)}}localStorage.setItem(key,'1')},[]);
 useEffect(()=>{
  const key='bmcenter-sold-sale-value-v1056';if(localStorage.getItem(key)==='1')return;
  try{
   const current=load(SKEY);
   if(Array.isArray(current)){
    const migrated=current.map(phone=>phone?.sale?.soldAt&&phone?.sale?.value!==undefined?syncRecordedSaleValue(phone,phone.sale):phone);
    if(JSON.stringify(migrated)!==JSON.stringify(current)){localStorage.setItem(SKEY,JSON.stringify(migrated));queueCloudSave(SKEY,migrated);pushCloudStateNow(SKEY,migrated).catch(()=>{});window.dispatchEvent(new CustomEvent(CLOUD_REMOTE_EVENT,{detail:{key:SKEY,value:migrated,source:'sold-sale-value-v1056'}}))}
   }
  }catch(error){console.warn('Sincronização do valor real de venda não concluída.',error)}finally{localStorage.setItem(key,'1')}
 },[]);
 const[visibleMenus,setVisibleMenus]=useState(()=>loadMenuSettings());
 const[remoteRevision,setRemoteRevision]=useState(0);
 const[commandOpen,setCommandOpen]=useState(false);
 void remoteRevision;
 useEffect(()=>{const handler=event=>{const key=event.detail?.key;if(!key||key==='__BM_RESET__')return;if(key===CFGKEY)setConfig(loadSystemConfig());if(key===MENUKEY)setVisibleMenus(loadMenuSettings());setRemoteRevision(value=>value+1)};window.addEventListener(CLOUD_REMOTE_EVENT,handler);return()=>window.removeEventListener(CLOUD_REMOTE_EVENT,handler)},[]);
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
     console.warn('Auto snapshot ignorado; pontos existentes foram preservados.',error);
    }finally{
     localStorage.setItem('bmcenter-last-version',version)
    }
   }
  }
  const fn=e=>{if(e.key==='Escape')setCommandOpen(false);if((e.ctrlKey||e.metaKey)&&String(e.key).toLowerCase()==='k'){e.preventDefault();setCommandOpen(true)}};
  window.addEventListener('keydown',fn);
  return()=>window.removeEventListener('keydown',fn)
 },[]);
 useEffect(()=>{
  let stopped=false,timer=null;
  const schedule=delay=>{clearTimeout(timer);if(!stopped)timer=setTimeout(tick,delay)};
  const tick=async()=>{if(stopped)return;await runAutomaticCloudBackup({reason:'agendador global'});schedule(AUTO_BACKUP_CHECK_MS)};
  schedule(8000);
  const visibility=()=>{if(document.visibilityState==='visible')schedule(1500)};
  window.addEventListener('online',visibility);document.addEventListener('visibilitychange',visibility);
  return()=>{stopped=true;clearTimeout(timer);window.removeEventListener('online',visibility);document.removeEventListener('visibilitychange',visibility)}
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
 function saveConfig(next){if(next?.themeMode)localStorage.setItem('bmcenter-last-theme',next.themeMode);setConfig(next);save(CFGKEY,next);pushCloudStateNow(CFGKEY,next).catch(()=>{})}
 function navigate(id){
  if(!id)return;
  sessionStorage.setItem('bmcenter-current-page',id);
  if(id!==pageRef.current)history.pushState({bmcenterApp:true,bmcenterPage:id},'',location.href);
  pageRef.current=id;setPage(id);setMobileMenuOpen(false);requestAnimationFrame(()=>window.scrollTo(0,0))
 }
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
 const hasSaved=saved&&typeof saved==='object'&&!Array.isArray(saved)&&Object.keys(saved).length>0;
 const lastTheme=localStorage.getItem('bmcenter-last-theme');
 const merged={...(hasSaved?{...defaults,...saved}:defaults),...(lastTheme==='light'||lastTheme==='dark'?{themeMode:lastTheme}:{})};
 // Never overwrite a theme the user already chose. The old visual migration only applies to a fresh install.
 if(!hasSaved&&localStorage.getItem(BALANCED_THEME_MIGRATION_KEY)!=='1'){
  localStorage.setItem(BALANCED_THEME_MIGRATION_KEY,'1');
  return {...merged,...BALANCED_THEME}
 }
 if(localStorage.getItem(BALANCED_THEME_MIGRATION_KEY)!=='1')localStorage.setItem(BALANCED_THEME_MIGRATION_KEY,'1');
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
 const {sellerId,purchaseSupplierId,accessories,photoChecklist,photoNotes,photos,photoScene,previousPhotoScene,photoStudioSettings,imei1,imei2,serial,devicePassword,...clean}=phone||{};
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

function StatusManager(){
 const[items,setItems]=useState(()=>loadPhoneStatuses().map(name=>({id:crypto.randomUUID(),name,original:name})));
 const[newStatus,setNewStatus]=useState('');
 const phones=load(SKEY);
 const addStatus=()=>{
  const name=newStatus.trim();
  if(!name)return;
  if(items.some(item=>item.name.trim().localeCompare(name,'pt-BR',{sensitivity:'base'})===0)){alert('Esse status já existe.');return}
  setItems(current=>sortPhoneStatuses([...current.map(x=>x.name),name]).map(statusName=>{
   const existing=items.find(x=>x.name===statusName);
   return existing||{id:crypto.randomUUID(),name:statusName,original:''}
  }));
  setNewStatus('')
 };
 const updateName=(id,name)=>setItems(current=>current.map(item=>item.id===id?{...item,name}:item));
 const removeStatus=item=>{
  const used=phones.filter(phone=>phone.status===item.original||phone.status===item.name).length;
  if(used){alert(`Não é possível remover "${item.name}" porque ${used} aparelho(s) ainda usam esse status. Renomeie o status ou altere esses aparelhos primeiro.`);return}
  if(!confirm(`Remover o status "${item.name}"?`))return;
  setItems(current=>current.filter(x=>x.id!==item.id))
 };
 const saveAll=()=>{
  const clean=items.map(item=>({...item,name:item.name.trim()})).filter(item=>item.name);
  const names=clean.map(item=>item.name);
  if(new Set(names.map(x=>x.toLocaleLowerCase('pt-BR'))).size!==names.length){alert('Existem status duplicados. Corrija antes de salvar.');return}
  let updatedPhones=phones;
  clean.forEach(item=>{
   if(item.original&&item.original!==item.name){
    updatedPhones=updatedPhones.map(phone=>phone.status===item.original?{...phone,status:item.name}:phone)
   }
  });
  if(JSON.stringify(updatedPhones)!==JSON.stringify(phones))save(SKEY,updatedPhones);
  savePhoneStatuses(names);
  alert('Status salvos. O sistema será atualizado para aplicar a nova lista em todas as telas.');
  reloadPreservingContext()
 };
 const resetDefaults=()=>{
  if(!confirm('Restaurar a lista padrão de Status? Status personalizados serão removidos se não estiverem em uso.'))return;
  const used=new Set(phones.map(phone=>phone.status).filter(Boolean));
  const merged=sortPhoneStatuses([...DEFAULT_PHONE_STATUSES,...[...used].filter(status=>!DEFAULT_PHONE_STATUSES.includes(status))]);
  setItems(merged.map(name=>({id:crypto.randomUUID(),name,original:name})))
 };
 const sorted=[...items].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'}));
 return <div className="v103-status-manager">
  <div className="v103-status-manager-head"><div><h3>Status dos aparelhos</h3><p>Adicione, renomeie ou remova status. A lista é exibida em ordem alfabética em todo o sistema.</p></div><button type="button" onClick={resetDefaults}>Restaurar padrão</button></div>
  <div className="v103-status-add"><input value={newStatus} onChange={e=>setNewStatus(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addStatus()}}} placeholder="Novo status"/><button type="button" className="primary" onClick={addStatus}>+ Adicionar</button></div>
  <div className="v103-status-list">{sorted.map(item=><div className="v103-status-row" key={item.id}><input value={item.name} onChange={e=>updateName(item.id,e.target.value)} /><button type="button" className="danger" onClick={()=>removeStatus(item)}>Remover</button></div>)}</div>
  <div className="v103-status-footer"><small>{items.length} status configurado(s)</small><button type="button" className="primary" onClick={saveAll}>Salvar status</button></div>
 </div>
}

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
  {tab==='general'&&<section className="v102-settings-section"><header><span>GERAL</span><h2>Preferências do sistema</h2></header><div className="v102-settings-card"><label>Página inicial<select value={config.homePage||'dashboard'} onChange={e=>onConfigChange({...config,homePage:e.target.value})}>{menuItems.filter(x=>visibleMenus[x.id]!==false).map(x=><option value={x.id} key={x.id}>{x.text}</option>)}</select></label><label className="v102-setting-toggle"><input type="checkbox" checked={config.showProductCode!==false} onChange={e=>onConfigChange({...config,showProductCode:e.target.checked})}/><span><b>Exibir código interno dos aparelhos</b><small>Quando desligado, BM-000000 desaparece de todo o sistema.</small></span></label><label className="v102-setting-toggle"><input type="checkbox" checked={config.autoSnapshot!==false} onChange={e=>onConfigChange({...config,autoSnapshot:e.target.checked})}/><span><b>Ponto automático antes de uma nova versão</b><small>Mantém uma restauração rápida em caso de atualização.</small></span></label></div><div className="v102-settings-card"><StatusManager/></div><div className="v102-settings-card"><h3>Menus visíveis</h3><div className="v102-settings-actions"><button onClick={showAll}>Mostrar todos</button><button onClick={hideOptional}>Somente essenciais</button></div><div className="v102-menu-grid v102-menu-settings">{menuItems.map(item=>{const essential=item.id==='phones';return <label key={item.id}><input type="checkbox" checked={essential||visibleMenus[item.id]!==false} disabled={essential} onChange={e=>onChange({...visibleMenus,[item.id]:e.target.checked})}/><span>{item.icon}</span><b>{item.text}</b>{essential&&<small>Essencial</small>}</label>})}</div></div></section>}
  {tab==='suppliers'&&<section className="v102-settings-embedded"><Suppliers/></section>}
  {tab==='banks'&&<section className="v102-settings-embedded"><Banks/></section>}
  {tab==='notifications'&&<section className="v102-settings-section"><header><span>NOTIFICAÇÕES</span><h2>Notificações</h2></header><div className="v102-settings-card"><Empty text="As configurações de notificações serão centralizadas aqui."/></div></section>}
  {tab==='system'&&<section className="v102-settings-section"><header><span>SISTEMA</span><h2>Informações do sistema</h2></header><div className="v102-settings-card"><p>Versão atual: v{APP_VERSION}</p><p>Armazenamento local e sincronização em nuvem ativos.</p></div></section>}
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
    {!!devices.length&&<small>SMARTPHONES</small>}{devices.map(p=><button key={p.id} onClick={()=>onNavigate('phones')}><Smartphone/><div><b>{showProductCode()&&<>{p.code} · </>}{p.brand} {p.model}</b><span>{p.status}</span></div><em>{money(phoneSaleDisplayValue(p))}</em></button>)}
    {!!ads.length&&<small>ANÚNCIOS</small>}{ads.map(x=><button key={x.ad.id} onClick={()=>onNavigate('ads')}><FileText/><div><b>{showProductCode()&&<>{x.phone.code} · </>}{x.ad.name}</b><span>{x.ad.title||'Sem título'}</span></div><em>{publishedCountForAd(x.ad)}/{profiles.length}</em></button>)}
    {!menus.length&&!devices.length&&!ads.length&&<div className="command-empty">Nenhum resultado encontrado.</div>}
   </div>
  </div>
 </div>
}

function reloadPreservingContext(){sessionStorage.setItem('bmcenter-scroll-y',String(window.scrollY||0));location.reload()}
function CloudGate(){
 const[session,setSession]=useState(null),[ready,setReady]=useState(false),[syncing,setSyncing]=useState(false),[status,setStatus]=useState('');
 useEffect(()=>{let unsubscribe=()=>{};(async()=>{if(!cloudConfigured()){setReady(true);return}const current=await getCloudSession();setSession(current);if(current?.user){setSyncing(true);setStatus('Sincronizando dados...');await initializeCloudState(ALL_CLOUD_KEYS);repairSnapshotStorage();unsubscribe=subscribeCloudState(key=>{setStatus(key==='__BM_RESET__'?'Dados apagados em outro dispositivo':'Alteração sincronizada em tempo real');if(key==='__BM_RESET__')setTimeout(()=>location.reload(),450)});setSyncing(false)}setReady(true)})();return()=>unsubscribe()},[]);
 async function authenticated(next){setSession(next);setSyncing(true);setStatus('Preparando sua área na nuvem...');await initializeCloudState(ALL_CLOUD_KEYS);repairSnapshotStorage();subscribeCloudState(key=>{setStatus(key==='__BM_RESET__'?'Dados apagados em outro dispositivo':'Alteração sincronizada em tempo real');if(key==='__BM_RESET__')setTimeout(()=>location.reload(),450)});setSyncing(false)}
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
 phones.filter(p=>!isClosedPhone(p)).forEach(p=>{
  if(daysSince(p.lastActivityAt||p.date)>=7)alerts.push({type:'stale',title:`${phoneShortName(p)} parado há ${daysSince(p.lastActivityAt||p.date)} dias`,detail:`${p.brand} ${p.model}`,phoneId:p.id});
  if(!(p.ads||migrateLegacyAds(p)).length&&['Pronto','Para fotografar','Anúncio preparado','Anunciado'].includes(p.status))alerts.push({type:'ad',title:`${phoneShortName(p)} sem anúncio`,detail:`${p.brand} ${p.model}`,phoneId:p.id});
 });
 return alerts;
}


function GoalsPage(){
 const[goals,setGoals]=useState(()=>{const saved=load(GOALKEY);return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{month:new Date().toISOString().slice(0,7),salesQuantity:0,adsPublished:0,phonesPrepared:0,maximumStale:7}});
 useRemoteStorageBridge(GOALKEY,setGoals,value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{});
 const phones=load(SKEY),profiles=load(PKEY),month=goals.month||new Date().toISOString().slice(0,7);
 const sales=phones.filter(p=>(p.sale?.soldAt||'').slice(0,7)===month);
 const ads=phones.flatMap(p=>(p.ads||migrateLegacyAds(p)).map(a=>normalizeAd(a))).reduce((sum,a)=>sum+Object.values(a.publications||{}).filter(x=>publicationWasPublished(x)&&(x.date||'').slice(0,7)===month).length,0);
 const prepared=phones.filter(p=>['Pronto','Para fotografar','Anúncio preparado','Anunciado','Vendido'].includes(p.status)&&(p.lastActivityAt||p.date||'').slice(0,7)===month).length;
 const stale=phones.filter(p=>!isClosedPhone(p)&&daysSince(p.lastActivityAt||p.date)>Number(goals.maximumStale||7)).length;
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
 const[detail,setDetail]=useState(null);
 const phones=load(SKEY),profiles=load(PKEY),orders=normalizePartsOrders(load(OKEY)),alerts=getOperationalAlerts(),active=phones.filter(p=>!isClosedPhone(p));
 const stageFor=phone=>workflowStageForPhone(phone,{hasAds:!!(phone.ads||migrateLegacyAds(phone)).length});
 const groups=[
  {title:'Analisar',items:active.filter(p=>stageFor(p)==='analyze')},
  {title:'Comprar peças',items:active.filter(p=>stageFor(p)==='parts')},
  {title:'Reparar e testar',items:active.filter(p=>stageFor(p)==='repair')},
  {title:'Prontos para anunciar',items:active.filter(p=>stageFor(p)==='ready')}
 ];
 const actions=smartActionQueue(phones,profiles,orders,new Date());
 const openPhone=phoneId=>{const phone=phones.find(item=>String(item.id)===String(phoneId));if(phone)setDetail(phone)};
 const persistPhone=phone=>{const next=phones.map(item=>item.id===phone.id?touchPhone(phone):item);save(SKEY,next);setDetail(phone)};
 return <><TodayV102 groups={groups} alerts={alerts} actions={actions} phoneDisplayName={phoneDisplayName} onOpenPhone={openPhone}/>{detail&&<PhoneDetailModal item={phones.find(item=>item.id===detail.id)||detail} profiles={profiles} orders={orders} onClose={()=>setDetail(null)} onSave={persistPhone}/>}</>

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
   <SearchSection title="Smartphones" count={phoneResults.length}>{phoneResults.map(p=><div className="search-result" key={p.id}><Smartphone/><div><b>{showProductCode()&&<>{p.code} · </>}{p.brand} {p.model}</b><small>{p.nfc===true?'NFC · ':''}{p.status}</small></div><strong>{money(phoneSaleDisplayValue(p))}</strong></div>)}</SearchSection>
   <SearchSection title="Anúncios" count={adResults.length}>{adResults.map(x=><div className="search-result" key={x.ad.id}><FileText/><div><b>{showProductCode()&&<>{x.phone.code} · </>}{x.ad.name}</b><small>{x.ad.title||'Sem título'}</small></div><strong>{publishedCountForAd(x.ad)}/{profiles.length}</strong></div>)}</SearchSection>
   <SearchSection title="Vendedores" count={sellerResults.length}>{sellerResults.map(x=><div className="search-result" key={x.id}><Users/><div><b>{x.name}</b><small>{x.phone||'Sem telefone'} · {x.city||''}</small></div></div>)}</SearchSection>
   <SearchSection title="Fornecedores" count={supplierResults.length}>{supplierResults.map(x=><div className="search-result" key={x.id}><Store/><div><b>{x.name}</b><small>{x.phone||x.whatsapp||'Sem telefone'} · {x.category||''}</small></div></div>)}</SearchSection>
  </div>}
 </>
}
function SearchSection({title,count,children}){return <section className="panel search-section"><h2>{title}<span>{count}</span></h2>{children}{!count&&<Empty text="Nenhum resultado nesta área."/>}</section>}


function ProfileAnalyticsPage(){
 const[profiles,setProfiles]=useState(()=>load(PKEY).map((p,index)=>({active:true,color:'#1877f2',platform:'Facebook Marketplace',order:index,...p})));
 const[phones,setPhones]=useState(load(SKEY)),[tab,setTab]=useState('manage'),[editing,setEditing]=useState(null),[query,setQuery]=useState('');
 useRemoteStorageBridge(PKEY,setProfiles,value=>Array.isArray(value)?value.map((p,index)=>({active:true,color:'#1877f2',platform:'Facebook Marketplace',order:index,...p})):[]);
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
 const persist=next=>{const ordered=next.map((p,index)=>({...p,order:index}));setProfiles(ordered);save(PKEY,ordered)};
 const sales=phones.filter(p=>p.sale?.soldAt);
 const data=profiles.map(profile=>{
  const published=phones.filter(phone=>publishedProfileIds(phone).includes(profile.id));
  const sold=sales.filter(p=>resolvedSaleProfileId(p,profiles)===profile.id);
  const value=sold.reduce((a,p)=>a+Number(p.sale?.value||0),0);
  const days=sold.map(p=>salesDaysFromProfile(p,profile.id)).filter(v=>v!==null);
  return{profile,published:published.length,sales:sold.length,value,last:[...sold].sort((a,b)=>(b.sale.soldAt||'').localeCompare(a.sale.soldAt||''))[0],averageDays:days.length?Math.round(days.reduce((a,b)=>a+b,0)/days.length):0}
 }).sort((a,b)=>b.sales-a.sales||b.value-a.value);
 const filtered=profiles.filter(p=>`${p.name} ${p.platform||''} ${p.notes||''}`.toLowerCase().includes(query.toLowerCase()));
 const activeProfiles=profiles.filter(p=>p.active!==false).length;
 const totalPublications=data.reduce((sum,item)=>sum+item.published,0);
 const totalProfileSales=data.reduce((sum,item)=>sum+item.sales,0);
 const totalProfileRevenue=data.reduce((sum,item)=>sum+item.value,0);
 const maxProfileSales=Math.max(1,...data.map(item=>item.sales));
 function removeProfile(profile){
  const used=phones.some(phone=>publishedProfileIds(phone).includes(profile.id)||(phone.ads||migrateLegacyAds(phone)).some(ad=>normalizeAd(ad).publications?.[profile.id])||resolvedSaleProfileId(phone,profiles)===profile.id);
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
  <div className="profile-overview-grid">
   <article><span className="profile-overview-icon blue"><Users size={18}/></span><div><small>Perfis ativos</small><strong>{activeProfiles}</strong><em>{profiles.length-activeProfiles} inativo(s)</em></div></article>
   <article><span className="profile-overview-icon violet"><FileText size={18}/></span><div><small>Publicações ativas</small><strong>{totalPublications}</strong><em>em {profiles.length} perfil(is)</em></div></article>
   <article><span className="profile-overview-icon green"><WalletCards size={18}/></span><div><small>Vendas atribuídas</small><strong>{totalProfileSales}</strong><em>histórico por perfil</em></div></article>
   <article><span className="profile-overview-icon amber"><TrendingUp size={18}/></span><div><small>Valor vendido</small><strong>{money(totalProfileRevenue)}</strong><em>somatório dos perfis</em></div></article>
  </div>
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
    {filtered.map((profile,index)=>{const stats=data.find(x=>x.profile.id===profile.id);return <article className={profile.active===false?'inactive':''} style={{'--profile-accent':profile.color||'#1877f2'}} key={profile.id}>
     <header>
      <div className="facebook-profile-avatar" style={{background:profile.color||'#1877f2'}}>{String(profile.name||'FB').slice(0,2).toUpperCase()}</div>
      <div><b>{profile.name||'Perfil sem nome'}</b><span>{profile.platform||'Facebook Marketplace'}</span></div>
      <span className={profile.active===false?'profile-state off':'profile-state'}>{profile.active===false?'Inativo':'Ativo'}</span>
     </header>
     <div className="facebook-profile-stats"><div><strong>{stats?.published||0}</strong><span>Publicações</span></div><div><strong>{stats?.sales||0}</strong><span>Vendas</span></div><div><strong>{money(stats?.value||0)}</strong><span>Valor vendido</span></div></div>
     <div className="profile-card-performance"><div><small>Desempenho relativo de vendas</small><b>{stats?.sales||0} venda(s)</b></div><span><i style={{width:`${Math.max(stats?.sales?8:0,Math.round((stats?.sales||0)/maxProfileSales*100))}%`}}/></span></div>
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
   <label className="profile-active-check"><input type="checkbox" checked={f.active!==false} onChange={e=>setF({...f,active:e.target.checked})}/><span>Perfil ativo para novos anúncios</span></label>
   <label className="profile-notes-field">Observações<textarea value={f.notes||''} onChange={e=>setF({...f,notes:e.target.value})} placeholder="Informações internas, celular usado, localização, responsável..."/></label>
  </div>
  <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>{if(!f.name?.trim())return alert('Informe o nome do perfil.');onSave({...f,name:f.name.trim()})}}>Salvar perfil</button></div>
 </Modal>
}

function BatchActionsPage(){
 const[phones,setPhones]=useState(load(SKEY)),[query,setQuery]=useState(''),[statusFilter,setStatusFilter]=useState('Ativos'),[selected,setSelected]=useState([]),[newStatus,setNewStatus]=useState(''),[newTag,setNewTag]=useState('');
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
 const persist=v=>{const lean=v.map(sanitizePhoneForLeanMode);setPhones(lean);save(SKEY,lean)};
 const rows=phones.filter(p=>{const text=`${p.code} ${p.brand} ${p.model} ${(p.tags||[]).join(' ')}`.toLowerCase();const statusOk=statusFilter==='Todos'||(statusFilter==='Ativos'?!isClosedPhone(p):p.status===statusFilter);return text.includes(query.toLowerCase())&&statusOk});
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
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
 const issues=phones.flatMap(phone=>{const list=[];if(!phone.brand||!phone.model)list.push(['Cadastro','Alta','Marca ou modelo não informado']);if(phone.nfc===null||phone.nfc===undefined)list.push(['Recursos','Baixa','NFC ainda não informado']);if(!normalizeUnlockCredentials(phone).length)list.push(['Acesso','Baixa','Nenhuma alternativa de desbloqueio registrada']);if(!Number(phone.expected||0)&&!isClosedPhone(phone))list.push(['Valor','Média','Previsão de venda não informada']);if(['Pronto','Para fotografar','Anúncio preparado','Anunciado'].includes(phone.status)&&!publishedProfileIds(phone).length)list.push(['Anúncios','Alta','Aparelho pronto sem perfil de publicação']);return list.map(([type,severity,message])=>({phone,type,severity,message}))});
 const filtered=issues.filter(x=>filter==='Todos'||x.severity===filter),affected=new Set(issues.map(x=>x.phone.id)).size;
 function suggest(phone){const text=phone.status==='Aguardando análise'?'Realizar diagnóstico':phone.status==='Aguardando peças'?'Acompanhar pedido de peças':phone.status==='Pronto'?'Preparar anúncio':'Revisar próxima etapa';persist(phones.map(p=>p.id===phone.id?addTimeline({...p,lastActivityAt:new Date().toISOString()},`Ação sugerida: ${text}`):p))}
 return <><Title t="Qualidade dos dados" s="Encontre cadastros incompletos e informações úteis ausentes."/><div className="quality-metrics"><div><span>Problemas</span><strong>{issues.length}</strong></div><div><span>Aparelhos afetados</span><strong>{affected}</strong></div><div><span>Problemas graves</span><strong>{issues.filter(x=>x.severity==='Alta').length}</strong></div><div><span>Cadastros completos</span><strong>{Math.max(0,phones.length-affected)}</strong></div></div>
 <div className="tabs">{['Todos','Alta','Média','Baixa'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="quality-list">{filtered.map((x,i)=><article key={`${x.phone.id}-${i}`}><span className={`quality-severity severity-${x.severity.toLowerCase().replace('é','e')}`}>{x.severity}</span><div><b>{showProductCode()&&<>{x.phone.code} · </>}{x.phone.brand} {x.phone.model}</b><small>{x.type} · {x.message}</small></div>{x.type==='Operação'&&<button onClick={()=>suggest(x.phone)}>Sugerir ação</button>}</article>)}{!filtered.length&&<Empty text="Nenhum problema nesta categoria."/>}</div></>
}

function AdRenewalCenterPage(){
 const[phones,setPhones]=useState(()=>safeAdsPhones()),[range,setRange]=useState('7'),[query,setQuery]=useState('');const profiles=load(PKEY),persist=v=>{setPhones(v);save(SKEY,v)},rows=[];
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
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
 const[phones,setPhones]=useState(load(SKEY)),[query,setQuery]=useState(''),[type,setType]=useState('Todos'),[days,setDays]=useState('30');
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
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
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
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
 const active=phones.filter(p=>!isClosedPhone(p));
 const sales=phones.filter(p=>p.sale?.soldAt);
 const pendingReceivables=sales.reduce((a,p)=>a+salePendingValue(p.sale),0);
 const allAds=phones.flatMap(p=>(p.ads||migrateLegacyAds(p)).map(ad=>({phone:p,ad:normalizeAd(ad)})));
 const prepared=allAds.filter(x=>x.ad.title&&x.ad.description);
 const dataIssues=active.filter(p=>(p.nfc===null||p.nfc===undefined)||!Number(p.expected||0)).length;
 const publishedCount=active.reduce((sum,phone)=>sum+publishedProfileIds(phone).length,0);
 const invested=active.reduce((a,x)=>a+phoneTotalCost(x),0);
 const expected=active.reduce((a,x)=>a+Number(x.expected||0),0);
 const forecast7=active.filter(p=>daysUntil(p.expectedSaleDate)>=0&&daysUntil(p.expectedSaleDate)<=7).reduce((a,p)=>a+Number(p.expected||0),0);
 const forecast30=active.filter(p=>daysUntil(p.expectedSaleDate)>=0&&daysUntil(p.expectedSaleDate)<=30).reduce((a,p)=>a+Number(p.expected||0),0);
 const stale=active.filter(p=>daysSince(p.lastActivityAt||p.date)>=7).sort((a,b)=>daysSince(b.lastActivityAt||b.date)-daysSince(a.lastActivityAt||a.date));
 const attention=stale.slice(0,6);
 const salesByProfile=profiles.map(profile=>{
  const items=sales.filter(p=>resolvedSaleProfileId(p,profiles)===profile.id);
  return{profile,quantity:items.length,revenue:items.reduce((sum,p)=>sum+Number(p.sale?.value||0),0)};
 }).filter(x=>x.quantity).sort((a,b)=>b.revenue-a.revenue);
 const workflow=loadPhoneStatuses()
  .filter(status=>!['Vendido','Descarte/Sucata'].includes(status))
  .map(status=>[status,active.filter(phone=>phone.status===status).length])
  .filter(([,count])=>count>0);
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
 const orders=normalizePartsOrders(load(OKEY));
 const capital=capitalAllocation(phones),aging=stockAgingRows(phones,today),suggestions=businessSuggestions(phones,profiles,orders,today);
 return <DashboardV102 metrics={metrics} workflow={workflow} workflowMax={workflowMax} attention={attention} salesByProfile={salesByProfile} money={money} active={active.length} capital={capital} aging={aging} suggestions={suggestions}/>
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
 const[items,setItems]=useState(()=>repairSoldPublicationStates(load(SKEY),load(PKEY))),[edit,setEdit]=useState(null),[detail,setDetail]=useState(null),[salePhone,setSalePhone]=useState(null),[actionPhone,setActionPhone]=useState(null),[query,setQuery]=useState(''),[statusFilter,setStatusFilter]=useState([]),[tagFilter,setTagFilter]=useState('Todas'),[onlyFavorites,setOnlyFavorites]=useState(false),[columns,setColumns]=useState(loadPhoneColumns),[columnEditor,setColumnEditor]=useState(false),[batchCreate,setBatchCreate]=useState(false),[draftRevision,setDraftRevision]=useState(0);
 useRemoteStorageBridge(SKEY,setItems,value=>Array.isArray(value)?repairSoldPublicationStates(value,load(PKEY)).map(sanitizePhoneForLeanMode):[]);
 useRemoteStorageBridge(PHONECOLKEY,setColumns,()=>loadPhoneColumns());
 const tableWrapRef=useRef(null);
 useEffect(()=>{if(tableWrapRef.current)tableWrapRef.current.scrollLeft=0},[query,statusFilter,tagFilter,onlyFavorites]);
 const banks=load(BKEY),suppliers=load(FKEY),profiles=load(PKEY);
 void draftRevision;
 const phoneDraft=loadDraft(PHONE_DRAFT_KEY),batchDraft=loadDraft(BATCH_DRAFT_KEY);
 const refreshDrafts=()=>setDraftRevision(value=>value+1);
 const continuePhoneDraft=()=>setEdit(blankPhone(Number(nextPhoneCode(items).replace(/\D/g,''))));
 const continueBatchDraft=()=>setBatchCreate(true);
 const deletePhoneDraft=()=>{if(!confirm('Excluir o rascunho do aparelho?'))return;clearDraft(PHONE_DRAFT_KEY);refreshDrafts()};
 const deleteBatchDraft=()=>{if(!confirm('Excluir o rascunho do cadastro em massa?'))return;clearDraft(BATCH_DRAFT_KEY);refreshDrafts()};
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
   if(field==='expected')return touchPhone(phone?.sale?.soldAt?syncRecordedSaleValue(phone,{...phone.sale,value:numeric}):{...phone,expected:numeric});
   if(field==='profit'){const nextValue=Math.max(0,phoneTotalCost(phone)+numeric);return touchPhone(phone?.sale?.soldAt?syncRecordedSaleValue(phone,{...phone.sale,value:nextValue}):{...phone,expected:nextValue})}
   return phone
  }))
 };
 const filtered=items.filter(x=>{const text=`${x.code} ${x.brand} ${x.model} ${(x.tags||[]).join(' ')} ${x.status}`.toLowerCase();const statusOk=statusFilter.length?statusFilter.includes(x.status):!isClosedPhone(x);return text.includes(query.toLowerCase())&&statusOk&&(tagFilter==='Todas'||(x.tags||[]).includes(tagFilter))&&(!onlyFavorites||x.favorite)});
 function toggleFavorite(phone){persist(items.map(x=>x.id===phone.id?touchPhone({...x,favorite:!x.favorite}):x))}
 function duplicatePhone(phone){const copy={...phone,id:crypto.randomUUID(),code:nextPhoneCode(items),status:'Aguardando análise',sale:null,ads:[],favorite:false,archived:false,archivedAt:'',timeline:[{id:crypto.randomUUID(),date:new Date().toISOString(),message:`Duplicado a partir de ${phone.code}`}],lastActivityAt:new Date().toISOString()};persist([copy,...items])}
 function moveColumn(draggedId,targetId){if(!draggedId||draggedId===targetId)return;const from=columns.findIndex(c=>c.id===draggedId),to=columns.findIndex(c=>c.id===targetId);if(from<0||to<0)return;const next=[...columns],item=next.splice(from,1)[0];next.splice(to,0,item);persistColumns(next)}
 function startColumnResize(e,column){e.preventDefault();e.stopPropagation();const startX=e.clientX,startWidth=column.width;document.body.classList.add('column-resizing');const move=event=>{const width=Math.max(12,Math.min(1600,startWidth+event.clientX-startX));setColumns(current=>current.map(c=>c.id===column.id?{...c,width}:c))};const up=event=>{const width=Math.max(12,Math.min(1600,startWidth+event.clientX-startX));const next=columns.map(c=>c.id===column.id?{...c,width}:c);persistColumns(next);document.body.classList.remove('column-resizing');window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up)}
 function autoFitPhoneColumn(columnId){const table=document.querySelector('.configurable-phone-table');if(!table)return;const cells=[...table.querySelectorAll(`[data-column-id="${columnId}"]`)];let max=12;cells.forEach(cell=>{const clone=cell.cloneNode(true);clone.querySelectorAll('button,input,select,.excel-column-resizer,.universal-resize-handle').forEach(x=>x.remove());clone.style.cssText='position:absolute;visibility:hidden;width:max-content;max-width:none;white-space:nowrap;display:block;padding:0;font:inherit';document.body.appendChild(clone);max=Math.max(max,Math.ceil(clone.scrollWidth+10));clone.remove()});persistColumns(columns.map(c=>c.id===columnId?{...c,width:Math.min(1600,max)}:c))}
 const columnAlign=id=>['accessories','cost','expected','profit','actions','priority','status'].includes(id)?'center':'left';
 const visibleColumns=columns.filter(c=>c.visible&&(c.id!=='code'||showProductCode()));
 function cell(column,x){const cost=phoneTotalCost(x),displaySaleValue=phoneSaleDisplayValue(x),profit=displaySaleValue-cost,accessories=(x.accessories||[]).filter(a=>a.included).length,profileIds=(x.sale?.soldAt||x.status==='Vendido')?historicalProfileIds(x):publishedProfileIds(x),published=profiles.filter(profile=>profileIds.includes(profile.id));
  switch(column.id){
   case'code':return <td className="product-code"><b>{x.code}</b></td>;
   case'device':return <td className="smartphone-device-cell"><b>{x.brand} {x.model}</b><small>{[x.color,x.storage].filter(Boolean).join(' · ')||'Sem detalhes'}</small><div className="tag-line">{(x.tags||[]).slice(0,3).map(t=><span key={t}>{t}</span>)}</div></td>;
   case'profiles':return <td><div className="profile-publication-list">{published.map(profile=><span key={profile.id}>{profile.name}</span>)}{!published.length&&<small>{x.sale?.soldAt||x.status==='Vendido'?'Sem histórico de anúncio':'Não anunciado'}</small>}</div></td>;
   case'status':return <td><select className="inline-status-select" value={x.status} onChange={e=>changeStatus(x.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td>;
   case'cost':return <td className="money-cell">{money(cost)}</td>;
   case'expected':return <td className="money-cell">{money(displaySaleValue)}</td>;
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
    blankPhone={()=>blankPhone(Number(nextPhoneCode(items).replace(/\D/g,'')))} items={items} actionPhone={actionPhone} setActionPhone={setActionPhone}
    setSalePhone={setSalePhone} persist={persist} updateFinancial={updateFinancial}
    totalExpected={items.filter(x=>!isClosedPhone(x)).reduce((sum,x)=>sum+Number(x.expected||0),0)}
    phoneDraft={phoneDraft} batchDraft={batchDraft}
    continuePhoneDraft={continuePhoneDraft} continueBatchDraft={continueBatchDraft}
    deletePhoneDraft={deletePhoneDraft} deleteBatchDraft={deleteBatchDraft}
  />
  {batchCreate&&<BatchPhoneModal existing={items} banks={banks} onClose={()=>{setBatchCreate(false);refreshDrafts()}} onSave={created=>{persist([...created,...items]);setBatchCreate(false);refreshDrafts()}}/>}
  {columnEditor&&<PhoneColumnsModal columns={showProductCode()?columns:columns.filter(c=>c.id!=='code')} onClose={()=>setColumnEditor(false)} onChange={next=>persistColumns(showProductCode()?next:[...next,columns.find(c=>c.id==='code')].filter(Boolean))}/>}
  {detail&&<PhoneDetailModal item={items.find(x=>x.id===detail.id)||detail} profiles={profiles} orders={normalizePartsOrders(load(OKEY))} onClose={()=>setDetail(null)} onSave={v=>{persist(items.map(x=>x.id===v.id?touchPhone(v):x));setDetail(v)}}/>}
  {edit&&<PhoneModal item={edit} banks={banks} suppliers={suppliers} onClose={()=>{setEdit(null);refreshDrafts()}} onSave={v=>{const current=items.find(x=>x.id===v.id),priceChanged=current&&Number(current.expected)!==Number(v.expected);const statusChanged=current&&String(current.status||'')!==String(v.status||'');let saved=touchPhone(addTimeline(v,statusChanged?`Status alterado para ${v.status}`:'Cadastro atualizado'));if(priceChanged)saved={...saved,priceHistory:[...(current.priceHistory||[]),{id:crypto.randomUUID(),date:new Date().toISOString(),oldValue:Number(current.expected||0),newValue:Number(v.expected||0)}]};persist(items.some(x=>x.id===v.id)?items.map(x=>x.id===v.id?saved:x):[saved,...items]);setEdit(null);refreshDrafts()}}/>}
  {salePhone&&<SaleModal item={salePhone} profiles={profiles} onClose={()=>setSalePhone(null)} onSave={sale=>{persist(items.map(x=>{if(x.id!==salePhone.id)return x;const finalized=finalizeSoldPhonePublications(x,profiles,sale);return touchPhone(addTimeline(finalized,`Venda registrada por ${money(sale.value)} · anúncios encerrados`))}));setSalePhone(null)}}/>}
 </>
}

function PhoneActionsPopover({data,onClose,onSale,onDelete}){
 useEffect(()=>{const close=e=>{if(!e.target.closest('.phone-actions-popover'))onClose()};const esc=e=>e.key==='Escape'&&onClose();setTimeout(()=>document.addEventListener('pointerdown',close),0);window.addEventListener('keydown',esc);return()=>{document.removeEventListener('pointerdown',close);window.removeEventListener('keydown',esc)}},[]);
 return <div className="phone-actions-popover" style={{top:data.anchor.top,left:data.anchor.left}}><button className="success-button" onClick={onSale}><WalletCards size={16}/> {data.phone.sale?.soldAt?'Alterar Venda':'Registrar venda'}</button><button className="danger" onClick={onDelete}><X size={16}/> Excluir aparelho</button></div>
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
function Sellers(){const[items,setItems]=useState(load(VKEY)),[edit,setEdit]=useState(null);useRemoteStorageBridge(VKEY,setItems,value=>Array.isArray(value)?value:[]);const persist=v=>{setItems(v);save(VKEY,v)};return <><Title t="Vendedores" s="Registre de quem comprou cada aparelho."><button className="primary" onClick={()=>setEdit({id:crypto.randomUUID(),name:'',phone:'',city:'',address:'',notes:''})}><Plus/> Novo vendedor</button></Title><div className="list">{items.map(x=><div className="seller" key={x.id}><div><b>{x.name}</b><span>{x.phone||'Sem telefone'}</span><small>{x.city} · {x.address}</small></div><div><button onClick={()=>setEdit(x)}>Editar</button> <button className="danger" onClick={()=>confirm('Excluir?')&&persist(items.filter(i=>i.id!==x.id))}>Excluir</button></div></div>)}</div>{!items.length&&<Empty/>}{edit&&<SellerModal item={edit} onClose={()=>setEdit(null)} onSave={v=>{persist(items.some(x=>x.id===v.id)?items.map(x=>x.id===v.id?v:x):[v,...items]);setEdit(null)}}/>}</>}


function Suppliers(){const[items,setItems]=useState(load(FKEY)),[edit,setEdit]=useState(null);useRemoteStorageBridge(FKEY,setItems,value=>Array.isArray(value)?value:[]);const persist=v=>{setItems(v);save(FKEY,v)};return <div className="premium-page modern-page suppliers-modern-page"><Title t="Fornecedores" s="Contatos e parceiros usados na compra de peças e aparelhos."><button className="primary" onClick={()=>setEdit({id:crypto.randomUUID(),name:'',phone:'',whatsapp:'',city:'',address:'',category:'Peças',defaultFreight:'',freeShippingAbove:'',freeShippingItems:'',notes:''})}><Plus/> Novo fornecedor</button></Title><div className="entity-card-grid">{items.map(x=><article className="entity-modern-card" key={x.id}><div className="entity-icon"><Store size={20}/></div><div className="entity-copy"><h3>{x.name}</h3><span>{x.category||'Fornecedor'}</span><p>{x.city||'Cidade não informada'}</p>{(x.whatsapp||x.phone)&&<small>{x.whatsapp||x.phone}</small>}</div><div className="entity-actions"><button onClick={()=>setEdit(x)}>Editar</button><button className="danger icon-only" onClick={()=>confirm('Excluir fornecedor?')&&persist(items.filter(i=>i.id!==x.id))}><X size={15}/></button></div></article>)}</div>{!items.length&&<div className="modern-empty-card"><Store size={30}/><b>Nenhum fornecedor cadastrado</b></div>}{edit&&<SupplierModal item={edit} onClose={()=>setEdit(null)} onSave={v=>{persist(items.some(x=>x.id===v.id)?items.map(x=>x.id===v.id?v:x):[v,...items]);setEdit(null)}}/>}</div>}
function SupplierModal({item,onClose,onSave}){
  const[f,setF]=useState({...item,defaultFreight:item.defaultFreight??'',freeShippingAbove:item.freeShippingAbove??'',freeShippingItems:item.freeShippingItems??''}),set=(k,v)=>setF({...f,[k]:v});
  return <Modal title="Cadastro de fornecedor" onClose={onClose}>
    <div className="grid">
      <Field label="Nome" value={f.name} onChange={v=>set('name',v)}/>
      <Field label="Telefone" value={f.phone} onChange={v=>set('phone',v)}/>
      <Field label="WhatsApp" value={f.whatsapp} onChange={v=>set('whatsapp',v)}/>
      <Field label="Cidade" value={f.city} onChange={v=>set('city',v)}/>
      <Field label="Endereço" value={f.address} onChange={v=>set('address',v)}/>
      <label>Categoria<select value={f.category} onChange={e=>set('category',e.target.value)}><option>Aparelhos</option><option>Peças</option><option>Aparelhos e peças</option><option>Outro</option></select></label>
    </div>
    <section className="supplier-freight-settings">
      <div><b>Regras padrão de frete</b><small>Servem como ponto de partida nas cotações. Você pode alterar cada cotação depois.</small></div>
      <div className="supplier-freight-grid">
        <label>Frete padrão<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={f.defaultFreight} onChange={e=>set('defaultFreight',e.target.value.replace(/[^0-9,.-]/g,''))}/></div></label>
        <label>Frete grátis acima de<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={f.freeShippingAbove} onChange={e=>set('freeShippingAbove',e.target.value.replace(/[^0-9,.-]/g,''))}/></div></label>
        <label>Frete grátis a partir de<input inputMode="numeric" placeholder="Ex.: 3 itens" value={f.freeShippingItems} onChange={e=>set('freeShippingItems',e.target.value.replace(/\D/g,''))}/></label>
      </div>
    </section>
    <label>Observações<textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></label>
    <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar fornecedor</button></div>
  </Modal>
}

function Banks(){const[items,setItems]=useState(load(BKEY)),[edit,setEdit]=useState(null);useRemoteStorageBridge(BKEY,setItems,value=>Array.isArray(value)?value:[]);const persist=v=>{setItems(v);save(BKEY,v)};return <div className="premium-page modern-page banks-modern-page"><Title t="Contas bancárias" s="Contas e meios usados nos pagamentos e recebimentos."><button className="primary" onClick={()=>setEdit({id:crypto.randomUUID(),bank:'',accountName:'',type:'Conta corrente',notes:''})}><Plus/> Nova conta</button></Title><div className="entity-card-grid">{items.map(x=><article className="entity-modern-card bank-modern-card" key={x.id}><div className="entity-icon"><WalletCards size={20}/></div><div className="entity-copy"><h3>{x.bank||'Banco não informado'}</h3><span>{x.accountName||'Conta sem nome'}</span><p>{x.type}</p></div><div className="entity-actions"><button onClick={()=>setEdit(x)}>Editar</button><button className="danger icon-only" onClick={()=>confirm('Excluir conta?')&&persist(items.filter(i=>i.id!==x.id))}><X size={15}/></button></div></article>)}</div>{!items.length&&<div className="modern-empty-card"><WalletCards size={30}/><b>Nenhuma conta cadastrada</b></div>}{edit&&<BankModal item={edit} onClose={()=>setEdit(null)} onSave={v=>{persist(items.some(x=>x.id===v.id)?items.map(x=>x.id===v.id?v:x):[v,...items]);setEdit(null)}}/>}</div>}
function BankModal({item,onClose,onSave}){const[f,setF]=useState(item),set=(k,v)=>setF({...f,[k]:v});return <Modal title="Cadastro de conta bancária" onClose={onClose}><div className="grid"><Field label="Banco" value={f.bank} onChange={v=>set('bank',v)}/><Field label="Nome da conta" value={f.accountName} onChange={v=>set('accountName',v)}/><label>Tipo<select value={f.type} onChange={e=>set('type',e.target.value)}><option>Conta corrente</option><option>Poupança</option><option>Carteira digital</option><option>Dinheiro</option><option>Outro</option></select></label></div><label>Observações<textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></label><div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar conta</button></div></Modal>}

function Parts(){
  const initialOrders=normalizePartsOrders(load(OKEY));
  const initialBulkSession=useMemo(()=>loadDeviceSessionDraft(BULK_PARTS_DEVICE_DRAFT_KEY),[]);
  const[orders,setOrders]=useState(initialOrders);
  const[phones,setPhones]=useState(()=>syncOrdersIntoPhones(load(SKEY),initialOrders));
  const[suppliers,setSuppliers]=useState(load(FKEY));
  const[quoteSettings,setQuoteSettings]=useState(()=>{const saved=load(QKEY);return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{}});
  const[partsView,setPartsView]=useState('needs');
  const[query,setQuery]=useState('');
  const[supplierFilter,setSupplierFilter]=useState('Todos');
  const[orderStatusFilter,setOrderStatusFilter]=useState('Todos');
  const[returnFilter,setReturnFilter]=useState('pending');
  const[refundEditor,setRefundEditor]=useState(null);
  const[partFilter,setPartFilter]=useState('Todos');
  const[phoneStatusPartsFilter,setPhoneStatusPartsFilter]=useState('Todos');
  const[needsSituationFilter,setNeedsSituationFilter]=useState('Todos');
  const[quoteSupplierFilter,setQuoteSupplierFilter]=useState('Todos');
  const[notice,setNotice]=useState('');
  const[showAdd,setShowAdd]=useState(false);
  const[showRules,setShowRules]=useState(false);
  const[deviceSearch,setDeviceSearch]=useState('');
  const[quickPhoneId,setQuickPhoneId]=useState('');
  const[quickPart,setQuickPart]=useState('');
  const[quoteModal,setQuoteModal]=useState(false);
  const[quoteSupplier,setQuoteSupplier]=useState('');
  const[quoteDraft,setQuoteDraft]=useState({});
  const[directBuy,setDirectBuy]=useState(null);
  const[directDraft,setDirectDraft]=useState({supplier:'',price:'',freight:'',notes:'',receivedNow:false,orderDate:new Date().toISOString().slice(0,10)});
  const[orderEditor,setOrderEditor]=useState(null);
  const[expandedOrderCards,setExpandedOrderCards]=useState({});
  const[expandedQuoteRows,setExpandedQuoteRows]=useState({});
  const[bulkOrderOpen,setBulkOrderOpen]=useState(()=>initialBulkSession?.open===true);
  const[bulkSearch,setBulkSearch]=useState(()=>initialBulkSession?.search||'');
  const[bulkStatus,setBulkStatus]=useState(()=>initialBulkSession?.status||'Todos');
  const[bulkProducts,setBulkProducts]=useState(()=>Array.isArray(initialBulkSession?.products)?initialBulkSession.products:[]);
  const[bulkActiveProductId,setBulkActiveProductId]=useState(()=>initialBulkSession?.activeProductId||'');
  const[bulkPhoneTotalDrafts,setBulkPhoneTotalDrafts]=useState({});
  const[bulkDraft,setBulkDraft]=useState(()=>initialBulkSession?.draft||{supplier:'',freight:'',orderDate:new Date().toISOString().slice(0,10),expectedDate:'',notes:'',receivedNow:false});
  const[bulkStagedOrders,setBulkStagedOrders]=useState(()=>Array.isArray(initialBulkSession?.stagedOrders)?initialBulkSession.stagedOrders:[]);
  const bulkDialogRef=useRef(null);
  const deviceSearchRef=useRef(null);
  useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value.map(sanitizePhoneForLeanMode):[]);
  useRemoteStorageBridge(FKEY,setSuppliers,value=>Array.isArray(value)?value:[]);
  useRemoteStorageBridge(QKEY,setQuoteSettings,value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{});
  useEffect(()=>{const handler=event=>{if(event.detail?.key!==OKEY)return;const nextOrders=normalizePartsOrders(Array.isArray(event.detail?.value)?event.detail.value:[]);setOrders(nextOrders);setPhones(current=>syncOrdersIntoPhones(current,nextOrders))};window.addEventListener(CLOUD_REMOTE_EVENT,handler);return()=>window.removeEventListener(CLOUD_REMOTE_EVENT,handler)},[]);
  useEffect(()=>{if(!bulkOrderOpen)return;saveDeviceSessionDraft(BULK_PARTS_DEVICE_DRAFT_KEY,{open:true,draft:bulkDraft,products:bulkProducts,activeProductId:bulkActiveProductId,stagedOrders:bulkStagedOrders,search:bulkSearch,status:bulkStatus})},[bulkOrderOpen,bulkDraft,bulkProducts,bulkActiveProductId,bulkStagedOrders,bulkSearch,bulkStatus]);
  useEffect(()=>{
    if(!bulkOrderOpen)return;
    const body=document.body,root=document.documentElement,dialog=bulkDialogRef.current;
    const previous={bodyOverflow:body.style.overflow,rootOverflow:root.style.overflow,bodyOverscroll:body.style.overscrollBehavior,rootOverscroll:root.style.overscrollBehavior,bodyPaddingRight:body.style.paddingRight};
    const scrollbarWidth=Math.max(0,window.innerWidth-root.clientWidth);
    body.classList.add('bmcenter-bulk-modal-open');
    body.style.overflow='hidden';root.style.overflow='hidden';body.style.overscrollBehavior='none';root.style.overscrollBehavior='none';
    if(scrollbarWidth)body.style.paddingRight=`${scrollbarWidth}px`;
    const isScrollable=el=>!!el&&el.scrollHeight>el.clientHeight+1;
    const scrollElement=(el,delta)=>{if(!isScrollable(el))return false;const before=el.scrollTop;el.scrollTop=Math.max(0,Math.min(el.scrollHeight-el.clientHeight,el.scrollTop+delta));return el.scrollTop!==before};
    const onWheel=event=>{
      if(!dialog||Math.abs(event.deltaY)<Math.abs(event.deltaX))return;
      const origin=event.target instanceof Element?event.target:event.target?.parentElement;
      if(!origin){event.preventDefault();return}
      /* Cada região do modal é dona do próprio scroll. Em especial, qualquer wheel
         sobre a coluna direita é enviado explicitamente à lista de aparelhos. */
      const rightPanel=origin.closest('.parts-v50-bulk-select');
      const rightList=dialog.querySelector('.parts-v49-bulk-list');
      if(rightPanel){
        event.preventDefault();
        if(scrollElement(rightList,event.deltaY))return;
        const main=dialog.querySelector('.parts-v50-bulk-main');
        scrollElement(main,event.deltaY);
        return;
      }
      const batchList=origin.closest('.parts-v61-batch-list');
      if(batchList){event.preventDefault();scrollElement(batchList,event.deltaY);return}
      const products=origin.closest('.parts-v50-products');
      if(products){event.preventDefault();if(scrollElement(products,event.deltaY))return;scrollElement(dialog.querySelector('.parts-v50-bulk-left'),event.deltaY);return}
      const leftPanel=origin.closest('.parts-v50-bulk-left');
      if(leftPanel){event.preventDefault();if(scrollElement(leftPanel,event.deltaY))return;scrollElement(dialog.querySelector('.parts-v50-products'),event.deltaY);return}
      /* Cabeçalho/rodapé: usa o conteúdo principal do modal, nunca a página atrás. */
      event.preventDefault();
      const main=dialog.querySelector('.parts-v50-bulk-main');
      if(scrollElement(main,event.deltaY))return;
      scrollElement(rightList,event.deltaY);
    };
    dialog?.addEventListener('wheel',onWheel,{passive:false});
    return()=>{
      dialog?.removeEventListener('wheel',onWheel);
      body.classList.remove('bmcenter-bulk-modal-open');
      body.style.overflow=previous.bodyOverflow;root.style.overflow=previous.rootOverflow;body.style.overscrollBehavior=previous.bodyOverscroll;root.style.overscrollBehavior=previous.rootOverscroll;body.style.paddingRight=previous.bodyPaddingRight;
    };
  },[bulkOrderOpen]);
  const auxiliaryPartsOverlayOpen=showRules||quoteModal||!!directBuy||!!orderEditor||!!refundEditor;
  useEffect(()=>{
    if(!auxiliaryPartsOverlayOpen)return;
    const body=document.body,root=document.documentElement;
    const previous={bodyOverflow:body.style.overflow,rootOverflow:root.style.overflow,bodyOverscroll:body.style.overscrollBehavior,rootOverscroll:root.style.overscrollBehavior};
    body.classList.add('bmcenter-parts-overlay-open');
    body.style.overflow='hidden';root.style.overflow='hidden';body.style.overscrollBehavior='none';root.style.overscrollBehavior='none';
    return()=>{body.classList.remove('bmcenter-parts-overlay-open');body.style.overflow=previous.bodyOverflow;root.style.overflow=previous.rootOverflow;body.style.overscrollBehavior=previous.bodyOverscroll;root.style.overscrollBehavior=previous.rootOverscroll};
  },[auxiliaryPartsOverlayOpen]);
  const profiles=load(PKEY);
  const activeSuppliers=[...suppliers].filter(s=>String(s?.name||'').trim()).sort((a,b)=>String(a.name).localeCompare(String(b.name),'pt-BR',{sensitivity:'base'}));
  const toNumber=value=>{if(typeof value==='number')return Number.isFinite(value)?value:0;let text=String(value??'').trim().replace(/[^0-9,.-]/g,'');if(text.includes(','))text=text.replace(/\./g,'').replace(',','.');const number=Number(text);return Number.isFinite(number)?number:0};
  const flash=message=>{setNotice(message);setTimeout(()=>setNotice(''),2200)};
  const savePhonesOnly=next=>{setPhones(next);save(SKEY,next)};
  const saveQuoteSettings=next=>{setQuoteSettings(next);save(QKEY,next)};
  function persistOrders(nextOrders,sourcePhones=phones){
    const normalized=normalizePartsOrders(nextOrders).map(order=>({...order,updatedAt:new Date().toISOString()}));
    const linked=syncOrdersIntoPhones(sourcePhones,normalized);
    setOrders(normalized);setPhones(linked);save(OKEY,normalized);save(SKEY,linked);
    return{orders:normalized,phones:linked}
  }
  const pendingPhones=phones.filter(phone=>!isClosedPhone(phone));
  const bulkVisiblePhones=pendingPhones.filter(phone=>{const search=`${phone.code||''} ${phone.brand||''} ${phone.model||''} ${phone.color||''} ${phone.status||''}`.toLowerCase();return search.includes(bulkSearch.trim().toLowerCase())&&(bulkStatus==='Todos'||phone.status===bulkStatus)});
  const activeBulkProduct=bulkProducts.find(product=>product.id===bulkActiveProductId)||bulkProducts[0]||null;
  const bulkLineCount=bulkProducts.reduce((sum,product)=>sum+(product.phoneIds||[]).length,0);
  const bulkSubtotal=bulkProducts.reduce((sum,product)=>sum+(product.phoneIds||[]).reduce((inner,id)=>inner+toNumber(product.pricesByPhone?.[id]??product.unitPrice),0),0);
  const bulkCurrentHasSelection=bulkProducts.some(product=>(product.phoneIds||[]).length>0);
  const stagedBulkLineCount=bulkStagedOrders.reduce((sum,batch)=>sum+batch.products.reduce((inner,product)=>inner+(product.phoneIds||[]).length,0),0);
  const stagedBulkTotal=bulkStagedOrders.reduce((sum,batch)=>sum+Number(batch.subtotal||0)+toNumber(batch.draft?.freight),0);
  const rows=pendingPhones.flatMap(phone=>(phone.parts||[]).map(part=>{
    const quotes=(part.quotes||[]).filter(q=>q.supplier&&Number(q.price)>=0);
    const sorted=[...quotes].sort((a,b)=>Number(a.price)-Number(b.price));
    const selected=quotes.find(q=>q.id===part.selectedQuoteId)||null;
    return{phone,part,quotes,cheapest:sorted[0]||null,chosen:selected||sorted[0]||null}
  }));
  const linkedOrderIds=new Set(orders.map(order=>order.id));
  const quoteableRows=rows.filter(row=>isPartOpenForProcurement(row.part,linkedOrderIds));
  const rowSearch=row=>`${phoneDisplayName(row.phone)} ${row.phone.code||''} ${row.phone.status||''} ${row.part.name} ${(row.quotes||[]).map(q=>q.supplier).join(' ')}`.toLowerCase().includes(query.toLowerCase());
  const rowCommonFilter=row=>(partFilter==='Todos'||row.part.name===partFilter)&&(phoneStatusPartsFilter==='Todos'||row.phone.status===phoneStatusPartsFilter);
  const visibleRows=quoteableRows.filter(row=>rowSearch(row)&&rowCommonFilter(row));
  const visibleNeedsRows=visibleRows.filter(row=>needsSituationFilter==='Todos'||(needsSituationFilter==='Sem cotação'?!row.quotes.length:needsSituationFilter==='Com cotação'?!!row.quotes.length:true));
  const visibleQuoteRows=visibleRows.filter(row=>row.quotes.length&&(quoteSupplierFilter==='Todos'||row.quotes.some(q=>q.supplier===quoteSupplierFilter)));
  const noQuote=quoteableRows.filter(row=>!row.quotes.length),quoted=quoteableRows.filter(row=>row.quotes.length);
  const partNames=[...new Set(quoteableRows.map(row=>row.part.name).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
  const quoteSuppliers=[...new Set(quoteableRows.flatMap(row=>(row.quotes||[]).map(q=>q.supplier)).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
  const clearRowFilters=()=>{setPartFilter('Todos');setPhoneStatusPartsFilter('Todos');setNeedsSituationFilter('Todos');setQuoteSupplierFilter('Todos')};
  const waitingOrders=orders.filter(order=>order.status!=='received'),receivedOrders=orders.filter(order=>order.status==='received');
  const returnRows=orders.flatMap(order=>(order.items||[]).filter(item=>item.returnStatus).map(item=>({order,item,phone:phones.find(phone=>phone.id===item.phoneId)||null})));
  const pendingReturns=returnRows.filter(row=>row.item.returnStatus==='pending');
  const pendingReturnFinancials=returnRows.filter(row=>row.item.returnStatus==='returned'&&!['received','supplier_credit'].includes(row.item.returnFinancialStatus));
  const returnAttentionCount=pendingReturns.length+pendingReturnFinancials.length;
  const operationalCounts=partsOperationalCounters(phones,orders);
  const waitingItems=waitingOrders.reduce((sum,order)=>sum+order.items.filter(item=>item.confirmedAt&&!item.receivedAt&&!item.returnStatus).length,0);
  const receivedItems=orders.reduce((sum,order)=>sum+order.items.filter(item=>item.receivedAt&&!item.returnStatus).length,0);
  const deviceMatches=pendingPhones.filter(phone=>`${phone.code||''} ${phone.brand||''} ${phone.model||''} ${phone.color||''}`.toLowerCase().includes(deviceSearch.trim().toLowerCase())).slice(0,8);
  const selectedQuickPhone=pendingPhones.find(phone=>phone.id===quickPhoneId)||null;
  const supplierByName=name=>suppliers.find(s=>s.name===name)||{};
  const settingFor=name=>{const supplier=supplierByName(name),saved=quoteSettings[name]||{};return{freight:saved.freight??supplier.defaultFreight??'',freeAbove:saved.freeAbove??supplier.freeShippingAbove??'',freeItems:saved.freeItems??supplier.freeShippingItems??'',freightPaid:!!saved.freightPaid}};
  const freightFor=(name,items)=>{if(!items.length)return 0;const setting=settingFor(name),subtotal=items.reduce((sum,item)=>sum+Number(item.price||0),0);if(setting.freightPaid)return 0;if(toNumber(setting.freeAbove)>0&&subtotal>=toNumber(setting.freeAbove))return 0;if(toNumber(setting.freeItems)>0&&items.length>=toNumber(setting.freeItems))return 0;return toNumber(setting.freight)};
  function updateSetting(name,key,value){saveQuoteSettings({...quoteSettings,[name]:{...settingFor(name),[key]:value}})}

  const recommendedPlan=useMemo(()=>{
    const candidates=quoteableRows.filter(row=>row.quotes.length);
    if(!candidates.length)return{assignment:[],products:0,freight:0,total:0};
    let assignment=candidates.map(row=>{const q=row.cheapest;return{rowKey:`${row.phone.id}::${row.part.id}`,quoteId:q.id,supplier:q.supplier,price:Number(q.price||0)}});
    const cost=list=>{const groups={};list.forEach(item=>(groups[item.supplier]??=[]).push(item));const products=list.reduce((s,x)=>s+x.price,0),freight=Object.entries(groups).reduce((s,[name,items])=>s+freightFor(name,items),0);return{products,freight,total:products+freight}};
    for(let pass=0;pass<6;pass++){
      let improved=false,current=cost(assignment).total;
      candidates.forEach((row,index)=>row.quotes.forEach(q=>{const trial=assignment.map((item,i)=>i===index?{...item,quoteId:q.id,supplier:q.supplier,price:Number(q.price||0)}:item),next=cost(trial).total;if(next+.001<current){assignment=trial;current=next;improved=true}}));
      if(!improved)break
    }
    return{assignment,...cost(assignment)}
  },[phones,quoteSettings]);

  function addQuickPart(value=quickPart){
    const name=String(value||'').trim();
    if(!quickPhoneId)return flash('Escolha primeiro o aparelho.');
    if(!name)return flash('Digite o nome da peça.');
    const current=phones.find(phone=>phone.id===quickPhoneId);
    if((current?.parts||[]).some(item=>item.name.trim().toLowerCase()===name.toLowerCase()&&!isPartProcurementComplete(item)))return flash('Essa peça já está na lista deste aparelho.');
    const stamp=new Date().toISOString();
    const next=phones.map(phone=>phone.id===quickPhoneId?{...phone,parts:[...(phone.parts||[]),{id:crypto.randomUUID(),name,status:'Cotando',quotes:[],selectedQuoteId:'',orderStatus:'Não pedido'}],lastActivityAt:stamp,timeline:[...(phone.timeline||[]),{id:crypto.randomUUID(),date:stamp,message:`Peça necessária adicionada: ${name}`}]}:phone);
    savePhonesOnly(next);setQuickPart('');flash('Peça adicionada à lista.')
  }
  function removeQuickPart(row){
    if(row.part.orderId&&linkedOrderIds.has(row.part.orderId))return flash('Esta peça está vinculada a um pedido. Edite o pedido antes de removê-la.');
    const quoteCount=(row.part.quotes||[]).length;
    const message=quoteCount?`Excluir a peça "${row.part.name}" deste aparelho? Ela possui ${quoteCount} cotação(ões) e esses dados também serão removidos.`:`Excluir a peça "${row.part.name}" deste aparelho? Esta ação remove o item da lista de Peças e acessórios.`;
    if(!confirm(message))return;
    savePhonesOnly(phones.map(phone=>phone.id===row.phone.id?{...phone,parts:(phone.parts||[]).filter(part=>part.id!==row.part.id)}:phone));
    flash('Peça excluída.')
  }
  function renameQuickPart(row){const value=prompt('Editar nome da peça:',row.part.name||'');if(value===null||!value.trim())return;savePhonesOnly(phones.map(phone=>phone.id===row.phone.id?{...phone,parts:(phone.parts||[]).map(part=>part.id===row.part.id?{...part,name:value.trim()}:part)}:phone));flash('Peça atualizada.')}
  function chooseQuote(row,quoteId){savePhonesOnly(phones.map(phone=>phone.id===row.phone.id?{...phone,parts:(phone.parts||[]).map(part=>part.id===row.part.id?{...part,selectedQuoteId:quoteId}:part)}:phone))}
  function deleteQuote(row,quote){if(row.part.orderId)return flash('Cotação usada em pedido não pode ser excluída aqui.');if(!confirm(`Excluir a cotação de ${quote.supplier}?`))return;savePhonesOnly(phones.map(phone=>phone.id===row.phone.id?{...phone,parts:(phone.parts||[]).map(part=>part.id===row.part.id?{...part,quotes:(part.quotes||[]).filter(q=>q.id!==quote.id),selectedQuoteId:part.selectedQuoteId===quote.id?'':part.selectedQuoteId}:part)}:phone));flash('Cotação excluída.')}

  function startQuickQuote(name=''){
    const supplierName=name||activeSuppliers[0]?.name||'';
    if(!supplierName)return alert('Cadastre primeiro um fornecedor de peças em Configurações > Fornecedores.');
    const draft={};quoteableRows.forEach(row=>{draft[`${row.phone.id}::${row.part.id}`]=row.quotes.find(q=>q.supplier===supplierName)?.price??''});
    setQuoteSupplier(supplierName);setQuoteDraft(draft);setQuoteModal(true)
  }
  function changeQuickSupplier(name){const draft={};quoteableRows.forEach(row=>{draft[`${row.phone.id}::${row.part.id}`]=row.quotes.find(q=>q.supplier===name)?.price??''});setQuoteSupplier(name);setQuoteDraft(draft)}
  function saveQuickQuote(){
    if(!quoteSupplier)return;
    const stamp=new Date().toISOString();let count=0;
    const next=phones.map(phone=>{let changed=false;const parts=(phone.parts||[]).map(part=>{const key=`${phone.id}::${part.id}`,raw=quoteDraft[key];if(raw===undefined||String(raw).trim()==='')return part;const quotes=[...(part.quotes||[])],index=quotes.findIndex(q=>q.supplier===quoteSupplier),quote={...(index>=0?quotes[index]:{}),id:index>=0?quotes[index].id:crypto.randomUUID(),supplier:quoteSupplier,price:toNumber(raw),updatedAt:stamp};if(index>=0)quotes[index]=quote;else quotes.push(quote);changed=true;count++;return{...part,quotes,status:'Cotando'}});return changed?{...phone,parts,lastActivityAt:stamp}:phone});
    savePhonesOnly(next);setQuoteModal(false);setPartsView('quotes');flash(`${count} preço(s) salvo(s).`)
  }

  function newBulkProduct(name='Película'){
    return{id:crypto.randomUUID(),name,unitPrice:'',phoneIds:[],pricesByPhone:{}}
  }
  function emptyBulkDraft(){return{supplier:'',freight:'',orderDate:new Date().toISOString().slice(0,10),expectedDate:'',notes:'',receivedNow:false}}
  function resetCurrentBulkOrder(){
    const first=newBulkProduct('Película');
    setBulkDraft(emptyBulkDraft());setBulkProducts([first]);setBulkActiveProductId(first.id);setBulkPhoneTotalDrafts({});setBulkSearch('');setBulkStatus('Todos')
  }
  function closeBulkOrder(){clearDeviceSessionDraft(BULK_PARTS_DEVICE_DRAFT_KEY);setBulkOrderOpen(false)}
  function openBulkOrder(){
    setBulkOrderOpen(true);setBulkStagedOrders([]);resetCurrentBulkOrder()
  }
  function updateBulkProduct(productId,patch){setBulkProducts(current=>current.map(product=>product.id===productId?{...product,...patch}:product))}
  function focusBulkProductName(productId){setTimeout(()=>document.querySelector(`[data-bulk-product-name="${productId}"]`)?.focus(),0)}
  function addBulkProduct({focusName=false}={}){const product=newBulkProduct('');setBulkProducts(current=>[...current,product]);setBulkActiveProductId(product.id);if(focusName)focusBulkProductName(product.id);return product.id}
  function handleBulkUnitPriceTab(event,product,index){
    if(event.key!=='Tab'||event.shiftKey)return;
    event.preventDefault();
    const next=bulkProducts[index+1];
    if(next){setBulkActiveProductId(next.id);focusBulkProductName(next.id);return}
    if(String(product.name||'').trim()||String(product.unitPrice||'').trim())addBulkProduct({focusName:true})
  }
  function removeBulkProduct(productId){
    if(bulkProducts.length<=1)return flash('O pedido precisa ter pelo menos um produto.');
    const next=bulkProducts.filter(product=>product.id!==productId);setBulkProducts(next);
    if(bulkActiveProductId===productId)setBulkActiveProductId(next[0]?.id||'')
  }
  function toggleBulkPhone(phoneId){if(!activeBulkProduct)return;const selected=activeBulkProduct.phoneIds||[];updateBulkProduct(activeBulkProduct.id,{phoneIds:selected.includes(phoneId)?selected.filter(id=>id!==phoneId):[...selected,phoneId]})}
  function selectBulkFiltered(){if(!activeBulkProduct)return;const ids=bulkVisiblePhones.map(phone=>phone.id);updateBulkProduct(activeBulkProduct.id,{phoneIds:[...new Set([...(activeBulkProduct.phoneIds||[]),...ids])]})}
  function unselectBulkFiltered(){if(!activeBulkProduct)return;const ids=new Set(bulkVisiblePhones.map(phone=>phone.id));updateBulkProduct(activeBulkProduct.id,{phoneIds:(activeBulkProduct.phoneIds||[]).filter(id=>!ids.has(id))})}
  function updateBulkPhonePrice(phoneId,value){if(!activeBulkProduct)return;updateBulkProduct(activeBulkProduct.id,{pricesByPhone:{...(activeBulkProduct.pricesByPhone||{}),[phoneId]:value}})}
  function bulkPhoneTotalDraftKey(phoneId){return `${bulkActiveProductId||'none'}::${phoneId}`}
  function bulkPhoneTotalDisplay(phoneId){const key=bulkPhoneTotalDraftKey(phoneId);if(Object.prototype.hasOwnProperty.call(bulkPhoneTotalDrafts,key))return bulkPhoneTotalDrafts[key];const total=bulkPhoneProductsTotal(bulkProducts,phoneId);return total?total.toFixed(2).replace('.',','):''}
  function updateBulkPhoneTotalDraft(phoneId,value){const key=bulkPhoneTotalDraftKey(phoneId);setBulkPhoneTotalDrafts(current=>({...current,[key]:value}))}
  function commitBulkPhoneTotal(phoneId){
    if(!activeBulkProduct)return;
    const key=bulkPhoneTotalDraftKey(phoneId),raw=Object.prototype.hasOwnProperty.call(bulkPhoneTotalDrafts,key)?bulkPhoneTotalDrafts[key]:bulkPhoneProductsTotal(bulkProducts,phoneId);
    const requested=Math.max(0,toNumber(raw));
    const others=bulkPhoneProductsTotal(bulkProducts,phoneId,activeBulkProduct.id);
    const activePrice=Math.max(0,Math.round((requested-others)*100)/100);
    updateBulkPhonePrice(phoneId,activePrice.toFixed(2).replace('.',','));
    setBulkPhoneTotalDrafts(current=>{const next={...current};delete next[key];return next})
  }
  function buildBulkSnapshot(draft=bulkDraft,products=bulkProducts,id=''){
    if(!String(draft.supplier||'').trim())throw new Error('Selecione o fornecedor deste pedido.');
    const selectedProducts=products.filter(product=>String(product.name||'').trim()&&(product.phoneIds||[]).length);
    if(!selectedProducts.length)throw new Error('Adicione pelo menos um produto e selecione os aparelhos dele.');
    const duplicateNames=selectedProducts.map(product=>product.name.trim().toLocaleLowerCase('pt-BR')).filter((name,index,list)=>list.indexOf(name)!==index);
    if(duplicateNames.length)throw new Error('Há produtos com o mesmo nome neste pedido. Una os aparelhos no mesmo produto.');
    const missingPrice=selectedProducts.some(product=>(product.phoneIds||[]).some(phoneId=>String(product.pricesByPhone?.[phoneId]??product.unitPrice).trim()===''));
    if(missingPrice)throw new Error('Informe o valor de cada produto antes de adicionar o pedido.');
    const cleanProducts=selectedProducts.map(product=>({...product,name:product.name.trim(),phoneIds:[...(product.phoneIds||[])],pricesByPhone:{...(product.pricesByPhone||{})}}));
    const subtotal=cleanProducts.reduce((sum,product)=>sum+(product.phoneIds||[]).reduce((inner,phoneId)=>inner+toNumber(product.pricesByPhone?.[phoneId]??product.unitPrice),0),0);
    return{id:id||crypto.randomUUID(),draft:{...draft,supplier:String(draft.supplier).trim()},products:cleanProducts,subtotal}
  }
  function stageCurrentBulkOrder(){
    try{
      const snapshot=buildBulkSnapshot();
      setBulkStagedOrders(current=>[...current,snapshot]);
      resetCurrentBulkOrder();
      flash(`Pedido ${bulkStagedOrders.length+1} adicionado ao lançamento. Cadastre o próximo.`)
    }catch(error){flash(error?.message||'Revise os dados deste pedido.')}
  }
  function editStagedBulkOrder(batchId){
    const batch=bulkStagedOrders.find(item=>item.id===batchId);if(!batch)return;
    setBulkStagedOrders(current=>current.filter(item=>item.id!==batchId));
    setBulkDraft({...batch.draft});
    setBulkProducts(batch.products.map(product=>({...product,phoneIds:[...(product.phoneIds||[])],pricesByPhone:{...(product.pricesByPhone||{})}})));
    setBulkActiveProductId(batch.products[0]?.id||'');setBulkSearch('');setBulkStatus('Todos');
    flash('Pedido carregado para edição.')
  }
  function removeStagedBulkOrder(batchId){
    const batch=bulkStagedOrders.find(item=>item.id===batchId);if(!batch)return;
    if(!confirm(`Remover do lançamento o pedido de ${batch.draft.supplier} de ${formatDate(batch.draft.orderDate)}? Nada será apagado do sistema porque ele ainda não foi concluído.`))return;
    setBulkStagedOrders(current=>current.filter(item=>item.id!==batchId))
  }
  function saveBulkOrder(){
    try{
      const snapshots=[...bulkStagedOrders];
      if(bulkCurrentHasSelection||String(bulkDraft.supplier||'').trim())snapshots.push(buildBulkSnapshot());
      if(!snapshots.length)return flash('Cadastre pelo menos um pedido antes de concluir o lançamento.');
      let sourcePhones=phones,nextOrders=[...orders],createdOrders=0,createdItems=0,skippedItems=0,receivedOrdersCount=0;
      for(const snapshot of snapshots){
        const products=snapshot.products.map(product=>({...product,unitPrice:toNumber(product.unitPrice),pricesByPhone:Object.fromEntries((product.phoneIds||[]).map(phoneId=>[phoneId,toNumber(product.pricesByPhone?.[phoneId]??product.unitPrice)]))}));
        const result=createMultiBulkPartsOrder({phones:sourcePhones,products,supplier:snapshot.draft.supplier,freight:toNumber(snapshot.draft.freight),orderDate:snapshot.draft.orderDate,expectedDate:snapshot.draft.expectedDate,notes:snapshot.draft.notes,receivedNow:snapshot.draft.receivedNow});
        skippedItems+=result.skipped.length;
        if(!result.order)continue;
        nextOrders.push(result.order);sourcePhones=syncOrdersIntoPhones(result.phones,nextOrders);createdOrders++;createdItems+=result.order.items.length;if(snapshot.draft.receivedNow)receivedOrdersCount++
      }
      if(!createdOrders)return flash(skippedItems?'Todos os itens selecionados já estão vinculados a pedidos ativos.':'Nenhum pedido pôde ser criado.');
      persistOrders(nextOrders,sourcePhones);clearDeviceSessionDraft(BULK_PARTS_DEVICE_DRAFT_KEY);setBulkOrderOpen(false);setBulkStagedOrders([]);setPartsView(receivedOrdersCount===createdOrders?'received':'orders');
      flash(`${createdOrders} pedido(s) criado(s) · ${createdItems} peça(s)${skippedItems?` · ${skippedItems} ignorada(s)`:''}.`)
    }catch(error){flash(error?.message||'Não foi possível concluir os pedidos em massa.')}
  }

  function prepareOrdersFromPhones(sourcePhones){
    const now=new Date().toISOString(),today=now.slice(0,10),sourceRows=sourcePhones.filter(phone=>!isClosedPhone(phone)).flatMap(phone=>(phone.parts||[]).map(part=>{const q=(part.quotes||[]).find(x=>x.id===part.selectedQuoteId);return{phone,part,q}})).filter(x=>x.q&&isPartOpenForProcurement(x.part,linkedOrderIds));
    if(!sourceRows.length){flash('Escolha pelo menos uma cotação antes de preparar o pedido.');return}
    const groups={};sourceRows.forEach(row=>(groups[row.q.supplier]??=[]).push(row));
    let nextOrders=[...orders],created=0;
    Object.entries(groups).forEach(([supplier,list])=>{
      let index=nextOrders.findIndex(order=>order.status==='draft'&&order.supplier===supplier);
      const existing=index>=0?nextOrders[index]:null;
      const existingKeys=new Set((existing?.items||[]).map(item=>`${item.phoneId}::${item.partId}`));
      const additions=list.filter(row=>!existingKeys.has(`${row.phone.id}::${row.part.id}`)).map(row=>({id:crypto.randomUUID(),phoneId:row.phone.id,partId:row.part.id,partName:row.part.name,phoneLabel:phoneDisplayName(row.phone,{includeCode:false}),quoteId:row.q.id,price:Number(row.q.price||0),confirmedAt:'',receivedAt:''}));
      if(!additions.length)return;
      if(existing){nextOrders[index]=normalizePartsOrder({...existing,items:[...existing.items,...additions],updatedAt:now})}
      else{const freight=freightFor(supplier,additions);nextOrders.push(normalizePartsOrder({id:crypto.randomUUID(),supplier,orderDate:'',expectedDate:'',freight,notes:'',items:additions,createdAt:now,updatedAt:now}));created++}
    });
    persistOrders(nextOrders,sourcePhones);setPartsView('orders');flash(created?`${created} pedido(s) criado(s).`:'Itens adicionados aos pedidos em rascunho.')
  }
  function prepareRecommended(){
    if(!recommendedPlan.assignment.length)return flash('Não há cotações para preparar.');
    const map=new Map(recommendedPlan.assignment.map(item=>[item.rowKey,item.quoteId]));
    const next=phones.map(phone=>({...phone,parts:(phone.parts||[]).map(part=>map.has(`${phone.id}::${part.id}`)?{...part,selectedQuoteId:map.get(`${phone.id}::${part.id}`)}:part)}));
    savePhonesOnly(next);prepareOrdersFromPhones(next)
  }

  function openDirectPurchase(row,mode='buy'){
    const existing=row.chosen||row.cheapest||null;
    if(mode==='buy'&&row.part.orderId&&linkedOrderIds.has(row.part.orderId))return flash('Esta peça já está vinculada a um pedido.');
    setDirectBuy({phone:row.phone,part:row.part,mode});
    setDirectDraft({supplier:existing?.supplier||'',price:existing?.price??'',freight:'',notes:existing?.notes||'',receivedNow:false,orderDate:new Date().toISOString().slice(0,10)})
  }
  function saveDirectPurchase(){
    if(!directBuy)return;if(String(directDraft.price).trim()==='')return flash('Informe o valor da peça.');
    const supplier=directDraft.supplier.trim()||(directBuy.mode==='quote'?'Fornecedor não informado':'Compra direta'),price=toNumber(directDraft.price),stamp=new Date().toISOString();
    let quoteId='';
    const nextPhones=phones.map(phone=>{if(phone.id!==directBuy.phone.id)return phone;const parts=(phone.parts||[]).map(part=>{if(part.id!==directBuy.part.id)return part;const quotes=[...(part.quotes||[])],index=quotes.findIndex(q=>q.supplier===supplier),quote={...(index>=0?quotes[index]:{}),id:index>=0?quotes[index].id:crypto.randomUUID(),supplier,price,notes:directDraft.notes,updatedAt:stamp};quoteId=quote.id;if(index>=0)quotes[index]=quote;else quotes.push(quote);return{...part,quotes,selectedQuoteId:quote.id,status:directBuy.mode==='quote'?'Cotando':part.status}});return{...phone,parts,lastActivityAt:stamp}});
    if(directBuy.mode==='quote'){savePhonesOnly(nextPhones);setDirectBuy(null);setPartsView('quotes');flash('Cotação salva.');return}
    const confirmedAt=stamp,receivedAt=directDraft.receivedNow?stamp:'';
    const order=normalizePartsOrder({id:crypto.randomUUID(),supplier,orderDate:directDraft.orderDate||stamp.slice(0,10),freight:toNumber(directDraft.freight),notes:directDraft.notes,items:[{id:crypto.randomUUID(),phoneId:directBuy.phone.id,partId:directBuy.part.id,partName:directBuy.part.name,phoneLabel:phoneDisplayName(directBuy.phone,{includeCode:false}),quoteId,price,confirmedAt,receivedAt}],createdAt:stamp,updatedAt:stamp,receivedAt});
    persistOrders([...orders,order],nextPhones);setDirectBuy(null);setPartsView(directDraft.receivedNow?'received':'orders');flash(directDraft.receivedNow?'Compra registrada como recebida.':'Compra registrada.')
  }

  function withTimeline(sourcePhones,itemKeys,message){
    const set=new Set(itemKeys);const stamp=new Date().toISOString();
    return sourcePhones.map(phone=>{const names=(phone.parts||[]).filter(part=>set.has(`${phone.id}::${part.id}`)).map(part=>part.name);return names.length?{...phone,lastActivityAt:stamp,timeline:[...(phone.timeline||[]),{id:crypto.randomUUID(),date:stamp,message:`${message}: ${names.join(', ')}`}]}:phone})
  }
  function changeOrderItems(orderId,itemId,action){
    const stamp=new Date().toISOString(),today=stamp.slice(0,10);let affected=[];
    const next=orders.map(order=>{if(order.id!==orderId)return order;const items=order.items.map(item=>{if(itemId&&item.id!==itemId)return item;affected.push(`${item.phoneId}::${item.partId}`);if(action==='confirm')return{...item,confirmedAt:item.confirmedAt||stamp};if(action==='receive')return{...item,confirmedAt:item.confirmedAt||stamp,receivedAt:item.receivedAt||stamp};return item});return normalizePartsOrder({...order,items,orderDate:order.orderDate||(action==='confirm'||action==='receive'?today:''),receivedAt:action==='receive'&&!itemId?stamp:order.receivedAt,updatedAt:stamp})});
    const source=withTimeline(phones,affected,action==='receive'?'Peça recebida':'Pedido confirmado');persistOrders(next,source);flash(action==='receive'?'Recebimento atualizado.':'Pedido atualizado.')
  }
  function changeReturnState(orderId,itemId,state,financial=null){
    const currentOrder=orders.find(order=>order.id===orderId),currentItem=currentOrder?.items?.find(item=>item.id===itemId);
    if(state==='pending'&&currentItem?.returnStatus==='returned'&&returnRecoveredAmount(currentItem)>0){
      if(!confirm('Reabrir esta devolução também cancelará o registro financeiro já recuperado e o valor voltará ao custo do aparelho. Continuar?'))return;
    }
    const stamp=new Date().toISOString();let affected=[];
    const next=orders.map(order=>{if(order.id!==orderId)return order;const items=order.items.map(item=>{
      if(item.id!==itemId)return item;affected.push(`${item.phoneId}::${item.partId}`);
      if(state==='pending')return{...item,returnStatus:'pending',returnMarkedAt:item.returnMarkedAt||stamp,returnedToSupplierAt:'',returnFinancialStatus:'',returnPartRefund:0,returnFreightRefund:0,returnRefundMethod:'',returnRefundDate:'',returnFinancialUpdatedAt:''};
      if(state==='returned'){const data=financial||{};return{...item,returnStatus:'returned',returnMarkedAt:item.returnMarkedAt||stamp,returnedToSupplierAt:item.returnedToSupplierAt||stamp,returnFinancialStatus:data.status||'pending',returnPartRefund:Number(data.partRefund||0),returnFreightRefund:Number(data.freightRefund||0),returnRefundMethod:data.method||'',returnRefundDate:data.date||stamp.slice(0,10),returnFinancialUpdatedAt:stamp};}
      return{...item,returnStatus:'',returnMarkedAt:'',returnedToSupplierAt:'',returnFinancialStatus:'',returnPartRefund:0,returnFreightRefund:0,returnRefundMethod:'',returnRefundDate:'',returnFinancialUpdatedAt:''}
    });return normalizePartsOrder({...order,items,updatedAt:stamp})});
    let message=state==='pending'?'Peça separada para devolução':state==='returned'?'Peça devolvida ao fornecedor':'Devolução cancelada';
    if(state==='returned'&&financial){const amount=Number(financial.partRefund||0)+Number(financial.freightRefund||0);message+=financial.status==='pending'?` — reembolso pendente: ${money(amount)}`:financial.status==='supplier_credit'?` — crédito confirmado no fornecedor: ${money(amount)}`:` — reembolso recebido: ${money(amount)}`;}
    const source=withTimeline(phones,affected,message);persistOrders(next,source);
    if(state==='pending'){setPartsView('returns');setReturnFilter('pending');flash('Item adicionado à lista de devoluções.')}else if(state==='returned')flash(financial?.status==='pending'?'Devolução concluída; financeiro ficou pendente.':'Devolução e recuperação financeira registradas.');else flash('Item removido da lista de devoluções.')
  }
  function openReturnSettlement(row){
    const item=row.item,today=new Date().toISOString().slice(0,10);
    const numberText=value=>String(Number(value||0).toFixed(2)).replace('.',',');
    setRefundEditor({orderId:row.order.id,itemId:item.id,supplier:row.order.supplier,partName:item.partName,phoneLabel:row.phone?phoneDisplayName(row.phone,{includeCode:false}):item.phoneLabel||'Aparelho',originalPart:Number(item.price||0),originalFreight:Number(item.freightShare||0),partRefund:numberText(returnPartRefundDraft(item)),freightRefund:numberText(item.returnFreightRefund||0),financialStatus:item.returnFinancialStatus||'received',method:item.returnRefundMethod||'',date:item.returnRefundDate||today});
  }
  function saveReturnSettlement(){
    if(!refundEditor)return;
    const partRefund=Math.max(0,toNumber(refundEditor.partRefund)),freightRefund=Math.max(0,toNumber(refundEditor.freightRefund));
    const maxPart=Math.max(0,Number(refundEditor.originalPart||0)),maxFreight=Math.max(0,Number(refundEditor.originalFreight||0));
    if(partRefund>maxPart+.001)return alert(`O reembolso da peça não pode superar o valor original de ${money(maxPart)}.`);
    if(freightRefund>maxFreight+.001)return alert(`O reembolso do frete não pode superar o frete rateado original de ${money(maxFreight)}.`);
    if(!refundEditor.date)return alert('Informe a data do registro financeiro.');
    let method=String(refundEditor.method||'').trim();
    if(refundEditor.financialStatus==='supplier_credit')method='Crédito no fornecedor';
    if(refundEditor.financialStatus==='pending'&&!method)method='Aguardando fornecedor';
    if(refundEditor.financialStatus==='received'&&!method)return alert('Informe a forma em que o reembolso foi recebido.');
    changeReturnState(refundEditor.orderId,refundEditor.itemId,'returned',{status:refundEditor.financialStatus,partRefund,freightRefund,method,date:refundEditor.date});
    setRefundEditor(null);
  }
  function saveOrderEdit(){
    if(!orderEditor)return;const current=orders.find(order=>order.id===orderEditor.id);if(!current)return;
    const stamp=new Date().toISOString();
    const edited=normalizePartsOrder({...current,...orderEditor,supplier:String(orderEditor.supplier||'').trim()||'Fornecedor não definido',freight:toNumber(orderEditor.freight),items:orderEditor.items.map(item=>({...item,price:toNumber(item.price)})),updatedAt:stamp});
    const next=orders.map(order=>order.id===edited.id?edited:order);persistOrders(next,phones);setOrderEditor(null);flash('Pedido salvo e custos recalculados.')
  }
  function isBulkOrder(order){return order?.source==='bulk'||order?.bulkVersion||((order?.items||[]).length>0&&(order.items||[]).every(item=>!item.quoteId))}
  function deleteOrder(order){
    if(!isBulkOrder(order))return flash('A exclusão direta está disponível para pedidos manuais/em massa.');
    const received=order.status==='received'||order.items.some(item=>item.receivedAt);
    const message=received?`Excluir o pedido recebido de ${order.supplier}? Os custos vinculados serão removidos dos aparelhos. Peças já instaladas serão preservadas.`:`Excluir o pedido de ${order.supplier}? Os vínculos e custos deste pedido serão removidos.`;
    if(!confirm(message))return;
    const remainingOrders=orders.filter(item=>item.id!==order.id);
    const cleared=removePartsOrderLinks(phones,order,remainingOrders);
    persistOrders(remainingOrders,cleared);setExpandedOrderCards(current=>{const next={...current};delete next[order.id];return next});flash('Pedido excluído e custos recalculados.')
  }
  function copyOrder(order){
    const lines=order.items.map((item,index)=>`${index+1}. ${item.partName} — ${item.phoneLabel||'Aparelho'} — ${money(item.price)}`);
    const text=`Olá! Quero confirmar este pedido:\n\n${lines.join('\n')}\n\nPeças: ${money(order.subtotal)}\nFrete: ${money(order.freight)}\nTotal: ${money(order.total)}`;
    navigator.clipboard?.writeText(text).then(()=>flash('Pedido copiado.')).catch(()=>prompt('Copie o pedido:',text))
  }
  function orderMatches(order){
    const text=`${order.supplier} ${order.notes||''} ${order.items.map(item=>`${item.partName} ${item.phoneLabel}`).join(' ')}`.toLowerCase();
    return text.includes(query.toLowerCase())&&(supplierFilter==='Todos'||order.supplier===supplierFilter)&&(orderStatusFilter==='Todos'||order.status===orderStatusFilter)
  }
  const visibleWaitingOrders=waitingOrders.filter(orderMatches),visibleReceivedOrders=receivedOrders.filter(orderMatches);
  const returnMatches=row=>{const text=`${row.order.supplier} ${row.item.partName} ${row.item.phoneLabel||''} ${row.phone?.code||''} ${row.phone?.brand||''} ${row.phone?.model||''}`.toLowerCase();const financialPending=row.item.returnStatus==='returned'&&!['received','supplier_credit'].includes(row.item.returnFinancialStatus);const filterMatch=returnFilter==='all'||(returnFilter==='financial'?financialPending:row.item.returnStatus===returnFilter);return text.includes(query.toLowerCase())&&(supplierFilter==='Todos'||row.order.supplier===supplierFilter)&&filterMatch};
  const visibleReturnRows=returnRows.filter(returnMatches);
  const orderSuppliers=[...new Set(orders.map(order=>order.supplier))].sort((a,b)=>a.localeCompare(b,'pt-BR'));

  function OrderCard({order,receivedHistory=false}){
    const allConfirmed=order.items.length&&order.items.every(item=>item.confirmedAt),allReceived=order.items.length&&order.items.every(item=>item.receivedAt);
    const expanded=!!expandedOrderCards[order.id];
    const toggle=()=>setExpandedOrderCards(current=>({...current,[order.id]:!current[order.id]}));
    return <article className={`parts-v48-order-card status-${order.status} parts-v50-order-card ${receivedHistory?'parts-v49-received-card':''} ${expanded?'expanded':'collapsed'}`}>
      <header className="parts-v50-order-summary"><div className="parts-v48-order-title"><span><Store size={14}/></span><div><small>{orderStatusLabel(order.status).toUpperCase()}</small><h3>{order.supplier}</h3><p>{order.items.length} peça(s){order.orderDate?` · Pedido ${formatDate(order.orderDate)}`:''}</p></div></div><div className="parts-v48-order-total"><small>Total do pedido</small><strong>{money(order.total)}</strong><span>Frete {money(order.freight)}</span></div><button type="button" className="parts-v50-expand-button" title={expanded?'Fechar detalhes':'Ver detalhes'} onClick={toggle}><ChevronDown size={16}/></button></header>
      {expanded&&<><div className="parts-v48-order-lines">{order.items.map(item=>{const phone=phones.find(p=>p.id===item.phoneId);return <div className={item.receivedAt?'received':item.confirmedAt?'confirmed':''} key={item.id}><span className="state">{item.receivedAt?'✓':item.confirmedAt?'●':'○'}</span><div className="identity"><b>{item.partName}</b><small>{phone?phoneDisplayName(phone,{includeCode:false}):item.phoneLabel||'Aparelho'}{phone?.code?` · ${phone.code}`:''}</small></div><div className="cost"><small>Peça</small><b>{money(item.price)}</b></div><div className="cost"><small>Frete rateado</small><b>{money(item.freightShare)}</b></div><div className="cost effective"><small>Custo efetivo</small><b>{money(item.effectiveCost)}</b></div><div className="parts-v48-line-actions">{!item.confirmedAt&&<button onClick={()=>changeOrderItems(order.id,item.id,'confirm')}><CheckSquare size={12}/> Confirmar</button>}{item.confirmedAt&&!item.receivedAt&&<button className="primary" onClick={()=>changeOrderItems(order.id,item.id,'receive')}><Package size={12}/> Receber</button>}{item.receivedAt&&!item.returnStatus&&<><span className="received-label">Recebida</span><button className="parts-v79-return-button" onClick={()=>changeReturnState(order.id,item.id,'pending')}><RotateCcw size={12}/> Devolver</button></>}{item.returnStatus==='pending'&&<><span className="parts-v79-return-label pending">Para devolver</span><button onClick={()=>changeReturnState(order.id,item.id,'cancel')}>Cancelar</button></>}{item.returnStatus==='returned'&&<><span className="parts-v79-return-label returned">Devolvida</span><span className={`parts-v84-finance-mini ${['received','supplier_credit'].includes(item.returnFinancialStatus)?'settled':'pending'}`}>{['received','supplier_credit'].includes(item.returnFinancialStatus)?`Recuperado ${money(returnRecoveredAmount(item))}`:'Financeiro pendente'}</span></>}</div></div>})}</div>
      <footer><div><span>Peças <b>{money(order.subtotal)}</b></span><span>Frete <b>{money(order.freight)}</b></span>{order.returnedRecovered>0&&<><span className="parts-v84-recovered">Recuperado <b>{money(order.returnedRecovered)}</b></span><span>Custo líquido <b>{money(order.netCost)}</b></span></>}</div><div><button onClick={()=>copyOrder(order)}><Copy size={12}/> Copiar</button><button onClick={()=>setOrderEditor(JSON.parse(JSON.stringify(order)))}><FileText size={12}/> Editar pedido</button>{isBulkOrder(order)&&<button className="danger" onClick={()=>deleteOrder(order)}><Trash2 size={12}/> Excluir pedido</button>}{!allConfirmed&&<button className="primary" onClick={()=>changeOrderItems(order.id,null,'confirm')}><CheckSquare size={12}/> Confirmar tudo</button>}{allConfirmed&&!allReceived&&<button className="primary success-button" onClick={()=>changeOrderItems(order.id,null,'receive')}><Package size={12}/> Receber tudo</button>}</div></footer></>}
    </article>
  }

  function QuoteCard({row}){
    const key=`${row.phone.id}::${row.part.id}`,expanded=!!expandedQuoteRows[key];
    const rec=recommendedPlan.assignment.find(item=>item.rowKey===key);
    const selectedId=row.part.selectedQuoteId||rec?.quoteId||'';
    const sorted=[...row.quotes].sort((a,b)=>Number(a.price)-Number(b.price));
    return <article className={`parts-v48-order-card parts-v50-quote-card ${expanded?'expanded':'collapsed'}`}>
      <header className="parts-v50-order-summary"><div className="parts-v48-order-title"><span><Tags size={14}/></span><div><small>COTAÇÕES</small><h3>{row.part.name}</h3><p>{phoneDisplayName(row.phone,{includeCode:false})} · {row.phone.code}</p></div></div><div className="parts-v48-order-total"><small>Menor preço</small><strong>{money(row.cheapest?.price||0)}</strong><span>{row.quotes.length} fornecedor(es)</span></div><button type="button" className="parts-v50-expand-button" title={expanded?'Fechar cotações':'Ver cotações'} onClick={()=>setExpandedQuoteRows(current=>({...current,[key]:!current[key]}))}><ChevronDown size={16}/></button></header>
      {expanded&&<><div className="parts-v50-quote-lines">{sorted.map(q=><div className={selectedId===q.id?'selected':''} key={q.id}><span className="state">{selectedId===q.id?'✓':'○'}</span><div className="identity"><b>{q.supplier}</b><small>{q.notes||'Cotação cadastrada'}</small></div><div className="cost effective"><small>Valor</small><b>{money(q.price)}</b></div><div className="parts-v48-line-actions"><button className={selectedId===q.id?'primary':''} onClick={()=>chooseQuote(row,q.id)}>{selectedId===q.id?'Selecionada':'Selecionar'}</button><button className="danger icon-only" title="Excluir cotação" onClick={()=>deleteQuote(row,q)}><Trash2 size={12}/></button></div></div>)}</div><footer><div><span>{row.quotes.length} cotação(ões)</span>{rec&&<span>Recomendação <b>{rec.supplier}</b></span>}</div><div><button className="primary" onClick={()=>{if(row.cheapest)chooseQuote(row,row.cheapest.id)}}><CheckSquare size={12}/> Menor preço</button><button onClick={()=>openDirectPurchase(row,'quote')}><Plus size={12}/> Nova cotação</button></div></footer></>}
    </article>
  }

  return <><div className="parts-command-page parts-v10447 parts-v10448 parts-v10450">
    <header className="parts-v47-head"><div><span>CENTRAL DE PEÇAS</span><h1>Pedidos e peças</h1><p>Pedidos exclusivos de peças vinculadas aos smartphones já cadastrados.</p></div><div className="parts-v47-summary"><span><b>{operationalCounts.open}</b> em aberto</span><span><b>{waitingItems}</b> aguardando</span><span><b>{receivedItems}</b> recebidas</span><span className={returnAttentionCount?'attention':''}><b>{operationalCounts.returns}</b> devoluções pendentes</span></div><div className="parts-v47-head-actions"><button className="primary" onClick={openBulkOrder}><ShoppingCart size={14}/> Pedido em massa</button><button onClick={()=>{setShowAdd(true);setTimeout(()=>deviceSearchRef.current?.focus(),50)}}><Plus size={14}/> Adicionar à lista</button><button onClick={()=>startQuickQuote()}><Tags size={13}/> Lançar cotação</button><button className="icon-only" title="Configurações de frete" onClick={()=>setShowRules(true)}><Settings size={14}/></button></div></header>
    {notice&&<div className="parts-v47-toast"><CheckSquare size={14}/>{notice}</div>}
    <div className="parts-v48-rule-banner"><ShieldCheck size={16}/><div><b>Pedidos são somente de peças</b><small>Aparelhos continuam sendo cadastrados exclusivamente em Smartphones. Confirmar ou receber uma peça nunca cria um aparelho nem dá entrada automática no estoque geral de peças.</small></div></div>

    {showAdd&&<section className="parts-v47-add-panel"><header><div><span><Plus size={15}/></span><div><b>Adicionar peça necessária</b><small>Vincule a peça a um aparelho já cadastrado.</small></div></div><button className="icon-only" onClick={()=>setShowAdd(false)}><X size={14}/></button></header><div className="parts-v47-add-fields"><div className="parts-v47-device-field"><label><Search size={14}/><input ref={deviceSearchRef} value={deviceSearch} onChange={e=>{setDeviceSearch(e.target.value);if(quickPhoneId)setQuickPhoneId('')}} placeholder="Aparelho ou código..."/></label>{deviceSearch&&!quickPhoneId&&<div className="parts-v47-device-results">{deviceMatches.map(phone=><button key={phone.id} onClick={()=>{setQuickPhoneId(phone.id);setDeviceSearch(phoneDisplayName(phone))}}><b>{phoneDisplayName(phone,{includeCode:false})}</b><small>{phone.code}</small></button>)}</div>}</div><div className="parts-v47-piece-field"><input disabled={!selectedQuickPhone} value={quickPart} onChange={e=>setQuickPart(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addQuickPart()}}} placeholder="Nome da peça..."/><div>{['Tela','Bateria','Conector','Câmera','Alto-falante'].map(name=><button key={name} disabled={!selectedQuickPhone} onClick={()=>setQuickPart(name)}>{name}</button>)}</div></div><div className="parts-v47-add-actions"><button className="primary" disabled={!selectedQuickPhone||!quickPart.trim()} onClick={()=>addQuickPart()}><Plus size={13}/> Adicionar</button></div></div>{selectedQuickPhone&&<div className="parts-v47-selected"><Smartphone size={13}/><b>{phoneDisplayName(selectedQuickPhone,{includeCode:false})}</b><span>{selectedQuickPhone.code}</span><button onClick={()=>{setQuickPhoneId('');setDeviceSearch('')}}>Trocar</button></div>}</section>}

    <section className="parts-v47-workspace parts-v50-workspace"><nav className="parts-v47-tabs"><button className={partsView==='needs'?'active':''} onClick={()=>setPartsView('needs')}><Package size={14}/> Em aberto <b>{operationalCounts.open}</b></button><button className={partsView==='quotes'?'active':''} onClick={()=>setPartsView('quotes')}><Tags size={14}/> Cotações <b>{operationalCounts.quotes}</b></button><button className={partsView==='orders'?'active':''} onClick={()=>setPartsView('orders')}><ShoppingCart size={14}/> Pedidos <b>{operationalCounts.orders}</b></button><button className={partsView==='received'?'active':''} onClick={()=>setPartsView('received')}><CheckSquare size={14}/> Recebidos <b>{operationalCounts.received}</b></button><button className={partsView==='returns'?'active parts-v79-return-tab':''} onClick={()=>setPartsView('returns')}><RotateCcw size={14}/> Devoluções <b>{operationalCounts.returns}</b></button></nav>
      <div className="parts-v50-filters"><label className="parts-v47-search"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar peça, aparelho ou fornecedor..."/></label>{['needs','quotes'].includes(partsView)&&<><select value={partFilter} onChange={e=>setPartFilter(e.target.value)}><option value="Todos">Todas as peças</option>{partNames.map(name=><option key={name}>{name}</option>)}</select><select value={phoneStatusPartsFilter} onChange={e=>setPhoneStatusPartsFilter(e.target.value)}><option value="Todos">Todos os status</option>{statuses.filter(status=>!['Vendido','Descarte/Sucata'].includes(status)).map(status=><option key={status}>{status}</option>)}</select>{partsView==='needs'&&<select value={needsSituationFilter} onChange={e=>setNeedsSituationFilter(e.target.value)}><option value="Todos">Toda situação</option><option>Sem cotação</option><option>Com cotação</option></select>}{partsView==='quotes'&&<select value={quoteSupplierFilter} onChange={e=>setQuoteSupplierFilter(e.target.value)}><option value="Todos">Todos os fornecedores</option>{quoteSuppliers.map(name=><option key={name}>{name}</option>)}</select>}<button className="parts-v50-clear-filters" title="Limpar filtros" onClick={clearRowFilters}><RotateCcw size={13}/></button></>}{['orders','received'].includes(partsView)&&<><select value={supplierFilter} onChange={e=>setSupplierFilter(e.target.value)}><option>Todos</option>{orderSuppliers.map(name=><option key={name}>{name}</option>)}</select><select value={orderStatusFilter} onChange={e=>setOrderStatusFilter(e.target.value)}><option value="Todos">Todos os status</option><option value="draft">Rascunho</option><option value="partial_ordered">Pedido parcial</option><option value="ordered">Pedido realizado</option><option value="partial_received">Recebimento parcial</option><option value="received">Pedido recebido</option></select></>}{partsView==='returns'&&<><select value={supplierFilter} onChange={e=>setSupplierFilter(e.target.value)}><option>Todos</option>{orderSuppliers.map(name=><option key={name}>{name}</option>)}</select><select value={returnFilter} onChange={e=>setReturnFilter(e.target.value)}><option value="pending">Para devolver</option><option value="financial">Financeiro pendente</option><option value="returned">Já devolvidas</option><option value="all">Todas</option></select></>}</div>

      {partsView==='needs'&&<div className="parts-v47-list">{visibleNeedsRows.slice(0,80).map(row=><article className="parts-v47-row" key={`${row.phone.id}-${row.part.id}`}><span className="parts-v47-row-icon"><Package size={14}/></span><div className="parts-v47-identity"><b>{row.part.name}</b><small>{phoneDisplayName(row.phone,{includeCode:false})} · {row.phone.code}</small></div><div className="parts-v47-price">{row.quotes.length?<><small>Menor preço</small><b>{money(row.cheapest?.price||0)}</b><span>{row.cheapest?.supplier}</span></>:<><small>Situação</small><b>Sem cotação</b><span>Aguardando preço</span></>}</div><div className="parts-v47-actions"><button className="primary" onClick={()=>openDirectPurchase(row,'quote')}><Tags size={12}/> Lançar preço</button><button onClick={()=>openDirectPurchase(row,'buy')}><ShoppingCart size={12}/> Compra direta</button><button className="icon-only" title="Editar nome" onClick={()=>renameQuickPart(row)}>✎</button><button className="danger icon-only" onClick={()=>removeQuickPart(row)}><Trash2 size={12}/></button></div></article>)}{!visibleNeedsRows.length&&<div className="parts-v47-empty"><CheckSquare size={20}/><div><b>Nenhuma peça neste filtro</b><span>Ajuste os filtros ou adicione uma peça necessária.</span></div></div>}</div>}

      {partsView==='quotes'&&<div className="parts-v50-quotes-view">{!!visibleQuoteRows.length&&<div className="parts-v47-recommendation"><div><TrendingUp size={15}/><span><b>Melhor combinação: {money(recommendedPlan.total)}</b><small>{money(recommendedPlan.freight)} de frete estimado</small></span></div><button className="primary" onClick={prepareRecommended}><ShoppingCart size={13}/> Aplicar e preparar pedidos</button></div>}<div className="parts-v48-orders parts-v50-quote-cards">{visibleQuoteRows.slice(0,80).map(row=><QuoteCard key={`${row.phone.id}-${row.part.id}`} row={row}/>)}{!visibleQuoteRows.length&&<div className="parts-v47-empty"><Tags size={20}/><div><b>Nenhuma cotação neste filtro</b><span>Lance preços ou altere os filtros acima.</span></div></div>}</div>{!!visibleQuoteRows.length&&<div className="parts-v48-prepare-bar"><span>Depois de escolher as cotações, transforme-as em pedidos persistentes por fornecedor.</span><button className="primary" onClick={()=>prepareOrdersFromPhones(phones)}><ShoppingCart size={13}/> Preparar selecionadas</button></div>}</div>}

      {partsView==='orders'&&<div className="parts-v48-orders">{visibleWaitingOrders.map(order=><OrderCard key={order.id} order={order}/>)}{!visibleWaitingOrders.length&&<div className="parts-v47-empty"><ShoppingCart size={20}/><div><b>Nenhum pedido nesta visão</b><span>Prepare um pedido a partir das cotações ou registre uma compra direta.</span></div></div>}</div>}
      {partsView==='received'&&<div className="parts-v48-orders">{visibleReceivedOrders.map(order=><OrderCard key={order.id} order={order} receivedHistory/>)}{!visibleReceivedOrders.length&&<div className="parts-v47-empty"><CheckSquare size={20}/><div><b>Nenhum pedido recebido nesta visão</b><span>Pedidos totalmente recebidos ficam preservados aqui e podem ser editados.</span></div></div>}</div>}
      {partsView==='returns'&&<div className="parts-v79-returns parts-v84-returns">{visibleReturnRows.map(row=>{const recovered=returnRecoveredAmount(row.item),refund=returnRefundTotal(row.item),financialSettled=['received','supplier_credit'].includes(row.item.returnFinancialStatus),financialPending=row.item.returnStatus==='returned'&&!financialSettled;return <article className={`parts-v79-return-card parts-v84-return-card ${row.item.returnStatus} ${financialPending?'financial-pending':''}`} key={`${row.order.id}-${row.item.id}`}><span className="parts-v79-return-icon"><RotateCcw size={15}/></span><div className="parts-v79-return-identity"><small>{row.order.supplier}</small><b>{row.item.partName}</b><span>{row.phone?phoneDisplayName(row.phone,{includeCode:false}):row.item.phoneLabel||'Aparelho'}{row.phone?.code?` · ${row.phone.code}`:''}</span></div><div className="parts-v79-return-meta"><small>Custo original</small><b>{money(row.item.effectiveCost||row.item.price)}</b></div><div className="parts-v79-return-meta parts-v84-return-finance"><small>{financialSettled?'Recuperado':financialPending?'A recuperar':'Financeiro'}</small><b>{row.item.returnStatus==='pending'?'—':money(financialSettled?recovered:refund)}</b></div><div className="parts-v79-return-meta parts-v84-return-net"><small>Custo líquido</small><b>{money(Math.max(0,Number(row.item.effectiveCost||row.item.price||0)-recovered))}</b></div><div className="parts-v79-return-actions">{row.item.returnStatus==='pending'?<><span>Para devolver</span><button onClick={()=>changeReturnState(row.order.id,row.item.id,'cancel')}>Cancelar</button><button className="primary" onClick={()=>openReturnSettlement(row)}><CheckSquare size={12}/> Devolvido</button></>:<><span className={financialSettled?'returned':'parts-v84-finance-pending'}>{financialSettled?(row.item.returnFinancialStatus==='supplier_credit'?`Crédito ${money(recovered)}`:`Reembolso ${money(recovered)}`):`Financeiro pendente${refund?` ${money(refund)}`:''}`}</span><button className={financialPending?'primary':''} onClick={()=>openReturnSettlement(row)}>{financialPending?'Resolver financeiro':'Editar financeiro'}</button><button onClick={()=>changeReturnState(row.order.id,row.item.id,'pending')}><RotateCcw size={12}/> Reabrir</button></>}</div></article>})}{!visibleReturnRows.length&&<div className="parts-v47-empty"><RotateCcw size={20}/><div><b>Nenhum item neste filtro</b><span>Nos pedidos recebidos, use “Devolver” na peça que ficou sobrando.</span></div></div>}</div>}
    </section>
  </div>

  {showRules&&<div className="parts-v47-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setShowRules(false)}><section className="parts-v47-settings"><header><div><span>CONFIGURAÇÕES</span><h2>Frete padrão para novas cotações</h2><p>Ao preparar um pedido, o valor calculado vira frete próprio daquele pedido e não muda sozinho depois.</p></div><button className="icon-only" onClick={()=>setShowRules(false)}><X size={15}/></button></header><div>{activeSuppliers.map(s=>{const rule=settingFor(s.name);return <article key={s.id||s.name}><b>{s.name}</b><label>Frete<div className="money-prefix"><span>R$</span><input value={rule.freight} onChange={e=>updateSetting(s.name,'freight',e.target.value.replace(/[^0-9,.-]/g,''))}/></div></label><label>Grátis acima de<div className="money-prefix"><span>R$</span><input value={rule.freeAbove} onChange={e=>updateSetting(s.name,'freeAbove',e.target.value.replace(/[^0-9,.-]/g,''))}/></div></label><label>Grátis com<input value={rule.freeItems} onChange={e=>updateSetting(s.name,'freeItems',e.target.value.replace(/\D/g,''))} placeholder="itens"/></label><label className="check"><input type="checkbox" checked={rule.freightPaid} onChange={e=>updateSetting(s.name,'freightPaid',e.target.checked)}/><span>Frete já pago</span></label></article>})}</div><footer><button className="primary" onClick={()=>setShowRules(false)}>Concluir</button></footer></section></div>}

  {bulkOrderOpen&&<div className="parts-v47-backdrop" onMouseDown={e=>e.target===e.currentTarget&&closeBulkOrder()}><section ref={bulkDialogRef} className="parts-v50-bulk-dialog parts-v61-bulk-dialog parts-v62-bulk-dialog"><header><div><span>PEDIDOS EM MASSA · SEM COTAÇÃO</span><h2>Um ou vários pedidos no mesmo lançamento</h2><p>Cada pedido mantém fornecedor, data, frete, observações, produtos e aparelhos próprios. O mesmo fornecedor pode aparecer em pedidos diferentes.</p></div><button className="icon-only" onClick={closeBulkOrder}><X size={15}/></button></header><section className="parts-v61-bulk-batches"><header><div><b>Pedidos deste lançamento</b><small>{bulkStagedOrders.length?`${bulkStagedOrders.length} pedido(s) já preparado(s) · você está editando o próximo`:'Preencha o pedido abaixo. Se houver outro pedido, adicione-o antes de concluir.'}</small></div><button type="button" className="parts-v61-stage-button" onClick={stageCurrentBulkOrder}><Plus size={12}/> Salvar este e adicionar outro pedido</button></header>{!!bulkStagedOrders.length&&<div className="parts-v61-batch-list">{bulkStagedOrders.map((batch,index)=>{const itemCount=batch.products.reduce((sum,product)=>sum+(product.phoneIds||[]).length,0);const total=Number(batch.subtotal||0)+toNumber(batch.draft.freight);return <article key={batch.id}><span>{String(index+1).padStart(2,'0')}</span><div><b>{batch.draft.supplier}</b><small>{formatDate(batch.draft.orderDate)} · {itemCount} peça(s) · frete {money(toNumber(batch.draft.freight))}</small></div><strong>{money(total)}</strong><button type="button" onClick={()=>editStagedBulkOrder(batch.id)}>Editar</button><button type="button" className="danger icon-only" title="Remover deste lançamento" onClick={()=>removeStagedBulkOrder(batch.id)}><Trash2 size={12}/></button></article>})}</div>}</section><div className="parts-v50-bulk-main"><aside className="parts-v50-bulk-left"><section className="parts-v50-bulk-meta parts-v62-bulk-meta"><label className="parts-v62-meta-supplier">Fornecedor<select value={bulkDraft.supplier} onChange={e=>setBulkDraft({...bulkDraft,supplier:e.target.value})}><option value="">Selecione o fornecedor...</option>{activeSuppliers.map(s=><option key={s.id||s.name} value={s.name}>{s.name}</option>)}</select></label><label className="parts-v62-meta-freight">Frete<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={bulkDraft.freight} onChange={e=>setBulkDraft({...bulkDraft,freight:e.target.value.replace(/[^0-9,.-]/g,'')})} placeholder="0,00"/></div></label><label className="parts-v62-meta-date">Data<input type="date" value={bulkDraft.orderDate} onChange={e=>setBulkDraft({...bulkDraft,orderDate:e.target.value})}/></label><label className="parts-v49-bulk-received parts-v62-meta-received"><input type="checkbox" checked={bulkDraft.receivedNow} onChange={e=>setBulkDraft({...bulkDraft,receivedNow:e.target.checked})}/><span>Já recebido</span></label><label className="parts-v62-meta-notes">Observações<input value={bulkDraft.notes} onChange={e=>setBulkDraft({...bulkDraft,notes:e.target.value})} placeholder="Opcional"/></label></section><section className="parts-v50-products"><header><div><b>Produtos deste pedido</b><small>{bulkProducts.length} produto(s) · {bulkLineCount} vínculo(s)</small></div><button type="button" onClick={()=>addBulkProduct({focusName:true})}><Plus size={12}/> Adicionar produto</button></header><div>{bulkProducts.map((product,index)=>{const active=activeBulkProduct?.id===product.id;return <article className={active?'active':''} key={product.id}><button type="button" className="parts-v50-product-select" onClick={()=>setBulkActiveProductId(product.id)}><span>{String(index+1).padStart(2,'0')}</span><div><b>{product.name||'Novo produto'}</b><small>{(product.phoneIds||[]).length} aparelho(s) · clique para selecionar</small></div><ChevronRight size={14}/></button><div className="parts-v50-product-fields"><label>Peça<input data-bulk-product-name={product.id} value={product.name} onFocus={()=>setBulkActiveProductId(product.id)} onChange={e=>updateBulkProduct(product.id,{name:e.target.value})} placeholder="Ex.: Película"/></label><label>Valor unitário<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={product.unitPrice} onFocus={()=>setBulkActiveProductId(product.id)} onChange={e=>updateBulkProduct(product.id,{unitPrice:e.target.value.replace(/[^0-9,.-]/g,'')})} onKeyDown={e=>handleBulkUnitPriceTab(e,product,index)} placeholder="0,00"/></div></label></div><div className="parts-v50-product-actions"><button type="button" className={active?'primary':''} onClick={()=>setBulkActiveProductId(product.id)}><Smartphone size={12}/> Escolher aparelhos</button>{bulkProducts.length>1&&<button type="button" className="danger icon-only" title="Remover produto" onClick={()=>removeBulkProduct(product.id)}><Trash2 size={12}/></button>}</div></article>})}</div></section></aside><section className="parts-v50-bulk-select"><header><div><b>{activeBulkProduct?`Aparelhos para ${activeBulkProduct.name||'este produto'}`:'Selecione um produto'}</b><small>{activeBulkProduct?(activeBulkProduct.phoneIds||[]).length:0} selecionado(s) · {bulkVisiblePhones.length} nesta filtragem</small></div><div><button disabled={!activeBulkProduct} onClick={selectBulkFiltered}>Selecionar filtrados</button><button disabled={!activeBulkProduct} onClick={unselectBulkFiltered}>Desmarcar filtrados</button></div></header><div className="parts-v49-bulk-filters"><label><Search size={13}/><input value={bulkSearch} onChange={e=>setBulkSearch(e.target.value)} placeholder="Buscar modelo, código ou cor..."/></label><select value={bulkStatus} onChange={e=>setBulkStatus(e.target.value)}><option value="Todos">Todos os status</option>{statuses.filter(status=>!['Vendido','Descarte/Sucata'].includes(status)).map(status=><option key={status}>{status}</option>)}</select></div><div className="parts-v49-bulk-list">{activeBulkProduct&&bulkVisiblePhones.map(phone=>{const checked=(activeBulkProduct.phoneIds||[]).includes(phone.id),phoneProductCount=bulkProducts.filter(product=>(product.phoneIds||[]).includes(phone.id)).length,phoneTotal=bulkPhoneProductsTotal(bulkProducts,phone.id);return <article className={checked?'selected':''} key={phone.id}><div className="parts-v64-bulk-card-line"><label className="parts-v49-bulk-check"><input type="checkbox" checked={checked} onChange={()=>toggleBulkPhone(phone.id)}/><div><b>{phoneDisplayName(phone,{includeCode:false})}</b><small>{phone.code} · {phone.status}{phoneProductCount>1?` · ${phoneProductCount} itens`:''}</small></div></label>{checked&&<label className="parts-v49-bulk-row-price parts-v65-bulk-total-price" title={`Total dos ${phoneProductCount||1} item(ns) deste pedido neste aparelho. Ao editar, o ajuste é aplicado ao produto selecionado.`}><span>R$</span><input inputMode="decimal" value={bulkPhoneTotalDisplay(phone.id)} onFocus={e=>{setBulkActiveProductId(activeBulkProduct.id);e.currentTarget.select()}} onChange={e=>updateBulkPhoneTotalDraft(phone.id,e.target.value.replace(/[^0-9,.-]/g,''))} onBlur={()=>commitBulkPhoneTotal(phone.id)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();commitBulkPhoneTotal(phone.id);e.currentTarget.blur()}}} placeholder={phoneTotal?'0,00':'0,00'}/></label>}</div></article>})}{!activeBulkProduct&&<div className="parts-v47-empty"><Package size={18}/><div><b>Selecione um produto</b><span>Escolha um produto à esquerda para vincular os aparelhos.</span></div></div>}{activeBulkProduct&&!bulkVisiblePhones.length&&<div className="parts-v47-empty"><Search size={18}/><div><b>Nenhum aparelho neste filtro</b><span>Altere a busca ou o status.</span></div></div>}</div></section></div><footer className="parts-v61-bulk-footer"><div><span>{bulkStagedOrders.length?`${bulkStagedOrders.length} pedido(s) preparado(s) · ${stagedBulkLineCount} peça(s) já separadas`:`Pedido atual: ${bulkProducts.filter(product=>(product.phoneIds||[]).length).length} produto(s) · ${bulkLineCount} peça(s)`}</span><b>{bulkStagedOrders.length?`Preparados ${money(stagedBulkTotal)} · atual ${money(bulkSubtotal+toNumber(bulkDraft.freight))}`:`Peças ${money(bulkSubtotal)} · Frete ${money(toNumber(bulkDraft.freight))} · Total ${money(bulkSubtotal+toNumber(bulkDraft.freight))}`}</b></div><div><button onClick={closeBulkOrder}>Cancelar</button><button className="primary" onClick={saveBulkOrder}><CheckSquare size={13}/> {bulkStagedOrders.length?`Concluir ${bulkStagedOrders.length+(bulkCurrentHasSelection?1:0)} pedido(s)`:'Concluir pedido em massa'}</button></div></footer></section></div>}

  {directBuy&&<div className="parts-v47-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setDirectBuy(null)}><section className="parts-v47-direct-dialog"><header><div><span>{directBuy.mode==='quote'?'COTAÇÃO':'COMPRA DIRETA DE PEÇA'}</span><h2>{directBuy.part.name}</h2><p>{phoneDisplayName(directBuy.phone,{includeCode:false})} · {directBuy.phone.code}</p></div><button className="icon-only" onClick={()=>setDirectBuy(null)}><X size={15}/></button></header><div className="parts-v47-direct-fields"><label>Fornecedor<input list="parts-v48-suppliers" value={directDraft.supplier} onChange={e=>setDirectDraft({...directDraft,supplier:e.target.value})} placeholder="Fornecedor"/><datalist id="parts-v48-suppliers">{activeSuppliers.map(s=><option key={s.id||s.name} value={s.name}/>)}</datalist></label><label>Valor da peça<div className="money-prefix"><span>R$</span><input autoFocus inputMode="decimal" value={directDraft.price} onChange={e=>setDirectDraft({...directDraft,price:e.target.value.replace(/[^0-9,.-]/g,'')})}/></div></label>{directBuy.mode==='buy'&&<><label>Frete deste pedido<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={directDraft.freight} onChange={e=>setDirectDraft({...directDraft,freight:e.target.value.replace(/[^0-9,.-]/g,'')})}/></div></label><label>Data da compra<input type="date" value={directDraft.orderDate} onChange={e=>setDirectDraft({...directDraft,orderDate:e.target.value})}/></label></>}<label className="wide">Observação<input value={directDraft.notes} onChange={e=>setDirectDraft({...directDraft,notes:e.target.value})}/></label>{directBuy.mode==='buy'&&<label className="parts-v47-received-check"><input type="checkbox" checked={directDraft.receivedNow} onChange={e=>setDirectDraft({...directDraft,receivedNow:e.target.checked})}/><span>Já estou com a peça em mãos</span></label>}</div><footer><button onClick={()=>setDirectBuy(null)}>Cancelar</button><button className="primary" onClick={saveDirectPurchase}><CheckSquare size={13}/> {directBuy.mode==='quote'?'Salvar cotação':directDraft.receivedNow?'Salvar recebida':'Registrar compra'}</button></footer></section></div>}

  {quoteModal&&<div className="parts-quote-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setQuoteModal(false)}><section className="parts-quote-modal"><header><div><span>ENTRADA RÁPIDA</span><h2>Lançar resposta do fornecedor</h2><p>Digite os preços e use TAB para avançar.</p></div><button onClick={()=>setQuoteModal(false)}><X size={16}/></button></header><section className="parts-quote-supplier-row"><label>Fornecedor<select value={quoteSupplier} onChange={e=>changeQuickSupplier(e.target.value)}>{activeSuppliers.map(s=><option key={s.id||s.name} value={s.name}>{s.name}</option>)}</select></label><label>Frete padrão<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={settingFor(quoteSupplier).freight} onChange={e=>updateSetting(quoteSupplier,'freight',e.target.value.replace(/[^0-9,.-]/g,''))}/></div></label><label>Grátis acima de<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={settingFor(quoteSupplier).freeAbove} onChange={e=>updateSetting(quoteSupplier,'freeAbove',e.target.value.replace(/[^0-9,.-]/g,''))}/></div></label></section><div className="parts-fast-price-list">{quoteableRows.map((row,index)=>{const key=`${row.phone.id}::${row.part.id}`;return <label key={key}><span className="index">{String(index+1).padStart(2,'0')}</span><div><b>{row.part.name}</b><small>{phoneDisplayName(row.phone,{includeCode:false})}</small></div><div className="money-prefix"><span>R$</span><input autoFocus={index===0} inputMode="decimal" value={quoteDraft[key]??''} onChange={e=>setQuoteDraft({...quoteDraft,[key]:e.target.value.replace(/[^0-9,.-]/g,'')})}/></div></label>})}</div><footer><button onClick={()=>setQuoteModal(false)}>Cancelar</button><button className="primary" onClick={saveQuickQuote}><CheckSquare size={14}/> Salvar preços</button></footer></section></div>}

  {refundEditor&&<div className="parts-v47-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setRefundEditor(null)}><section className="parts-v84-refund-dialog"><header><div><span>DEVOLUÇÃO FINANCEIRA</span><h2>{refundEditor.partName}</h2><p>{refundEditor.phoneLabel} · {refundEditor.supplier}</p></div><button className="icon-only" onClick={()=>setRefundEditor(null)}><X size={15}/></button></header><div className="parts-v84-refund-original"><div><small>Peça original</small><b>{money(refundEditor.originalPart)}</b></div><div><small>Frete rateado</small><b>{money(refundEditor.originalFreight)}</b></div><div><small>Custo original</small><b>{money(Number(refundEditor.originalPart||0)+Number(refundEditor.originalFreight||0))}</b></div></div><div className="parts-v84-refund-fields"><label>Situação financeira<select value={refundEditor.financialStatus} onChange={e=>setRefundEditor({...refundEditor,financialStatus:e.target.value})}><option value="received">Reembolso recebido</option><option value="supplier_credit">Crédito confirmado no fornecedor</option><option value="pending">Reembolso/crédito pendente</option></select></label><label>Valor da peça recuperado<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={refundEditor.partRefund} onChange={e=>setRefundEditor({...refundEditor,partRefund:e.target.value.replace(/[^0-9,.-]/g,'')})}/></div></label><label>Frete recuperado<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={refundEditor.freightRefund} onChange={e=>setRefundEditor({...refundEditor,freightRefund:e.target.value.replace(/[^0-9,.-]/g,'')})}/></div></label><label>Forma<select value={refundEditor.financialStatus==='supplier_credit'?'Crédito no fornecedor':refundEditor.method} disabled={refundEditor.financialStatus==='supplier_credit'} onChange={e=>setRefundEditor({...refundEditor,method:e.target.value})}><option value="">Selecione</option><option>Pix</option><option>Estorno no cartão</option><option>Dinheiro</option><option>Transferência</option><option>Crédito no fornecedor</option><option>Outro</option></select></label><label>Data do registro<input type="date" value={refundEditor.date} onChange={e=>setRefundEditor({...refundEditor,date:e.target.value})}/></label></div>{(()=>{const promised=Math.min(Number(refundEditor.originalPart||0)+Number(refundEditor.originalFreight||0),Math.max(0,toNumber(refundEditor.partRefund))+Math.max(0,toNumber(refundEditor.freightRefund))),recovered=refundEditor.financialStatus==='pending'?0:promised,residual=Math.max(0,Number(refundEditor.originalPart||0)+Number(refundEditor.originalFreight||0)-recovered);return <div className={`parts-v84-refund-impact ${refundEditor.financialStatus==='pending'?'pending':''}`}><div><small>{refundEditor.financialStatus==='pending'?'Valor aguardando fornecedor':'Redução imediata no custo do aparelho'}</small><strong>{money(refundEditor.financialStatus==='pending'?promised:recovered)}</strong></div><div><small>Custo que permanecerá no aparelho</small><strong>{money(residual)}</strong></div><p>{refundEditor.financialStatus==='pending'?'Enquanto estiver pendente, nenhum valor é retirado do custo do aparelho. Ao confirmar o recebimento ou crédito, o custo será recalculado automaticamente.':'O pedido original continua com o valor histórico integral. Somente o custo líquido do aparelho é reduzido pelo valor efetivamente recuperado.'}</p></div>})()}<footer><button onClick={()=>setRefundEditor(null)}>Cancelar</button><button className="primary" onClick={saveReturnSettlement}><CheckSquare size={13}/> Confirmar devolução</button></footer></section></div>}

  {orderEditor&&<div className="parts-v47-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setOrderEditor(null)}><section className="parts-v48-order-editor"><header><div><span>EDITAR PEDIDO</span><h2>{orderEditor.supplier}</h2><p>Editar um pedido recebido recalcula os custos; não duplica estoque nem valores.</p></div><button className="icon-only" onClick={()=>setOrderEditor(null)}><X size={15}/></button></header><div className="parts-v48-edit-grid"><label>Fornecedor<input list="parts-v48-edit-suppliers" value={orderEditor.supplier} onChange={e=>setOrderEditor({...orderEditor,supplier:e.target.value})}/><datalist id="parts-v48-edit-suppliers">{activeSuppliers.map(s=><option key={s.id||s.name} value={s.name}/>)}</datalist></label><label>Data do pedido<input type="date" value={orderEditor.orderDate||''} onChange={e=>setOrderEditor({...orderEditor,orderDate:e.target.value})}/></label><label>Previsão de chegada<input type="date" value={orderEditor.expectedDate||''} onChange={e=>setOrderEditor({...orderEditor,expectedDate:e.target.value})}/></label><label>Frete do pedido<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={orderEditor.freight??''} onChange={e=>setOrderEditor({...orderEditor,freight:e.target.value.replace(/[^0-9,.-]/g,'')})}/></div></label><label className="wide">Observações<textarea value={orderEditor.notes||''} onChange={e=>setOrderEditor({...orderEditor,notes:e.target.value})}/></label></div><div className="parts-v48-edit-items">{orderEditor.items.map((item,index)=><label key={item.id}><div><b>{item.partName}</b><small>{item.phoneLabel}</small></div><div className="money-prefix"><span>R$</span><input inputMode="decimal" value={item.price} onChange={e=>setOrderEditor({...orderEditor,items:orderEditor.items.map((x,i)=>i===index?{...x,price:e.target.value.replace(/[^0-9,.-]/g,'')}:x)})}/></div><span>{item.returnStatus==='pending'?'Para devolver':item.returnStatus==='returned'?'Devolvida':item.receivedAt?'Recebida':item.confirmedAt?'Confirmada':'Rascunho'}</span></label>)}</div><div className="parts-v48-edit-summary"><span>O frete será rateado proporcionalmente entre as peças, fechando exatamente nos centavos.</span><b>{money(normalizePartsOrder({...orderEditor,freight:toNumber(orderEditor.freight),items:orderEditor.items.map(item=>({...item,price:toNumber(item.price)}))}).total)}</b></div><footer><button onClick={()=>setOrderEditor(null)}>Cancelar</button><button className="primary" onClick={saveOrderEdit}><Save size={13}/> Salvar e recalcular</button></footer></section></div>}
  </>
}


function PartsInventoryPage(){
 const[items,setItems]=useState(load(IKEY)),[movements,setMovements]=useState(load(MKEY)),[editing,setEditing]=useState(null),[moving,setMoving]=useState(null),[query,setQuery]=useState(''),[tab,setTab]=useState('stock'),[onlyLow,setOnlyLow]=useState(false);
 useRemoteStorageBridge(IKEY,setItems,value=>Array.isArray(value)?value:[]);
 useRemoteStorageBridge(MKEY,setMovements,value=>Array.isArray(value)?value:[]);
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
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
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
      <label>Selecione o aparelho<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Escolha um aparelho</option>{phones.filter(p=>!isClosedPhone(p)).map(p=><option value={p.id} key={p.id}>{phoneDisplayName(p)}</option>)}</select></label>
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
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
 const[period,setPeriod]=useState('30');
 const[query,setQuery]=useState('');
 const[selectedPhone,setSelectedPhone]=useState('');
 const[selectedProfile,setSelectedProfile]=useState('');
 const[generated,setGenerated]=useState({title:'',description:'',source:''});
 const[generating,setGenerating]=useState(false);
 const[contentTab,setContentTab]=useState('title');
 const[publicationOpen,setPublicationOpen]=useState(false);
 const[publicationFilter,setPublicationFilter]=useState('all');
 const[reportOpen,setReportOpen]=useState(false);
 const[batchOpen,setBatchOpen]=useState(false);
 const[batchResults,setBatchResults]=useState([]);
 const[historyOpen,setHistoryOpen]=useState(false);
 const[noteSaved,setNoteSaved]=useState(false);
 const[adsNote,setAdsNote]=useState(()=>{try{return JSON.parse(localStorage.getItem(ADSNOTEKEY)||'\"\"')}catch{return''}});
 const storedProfiles=load(PKEY);
 const profiles=(Array.isArray(storedProfiles)?storedProfiles:[]).filter(profile=>profile&&profile.active!==false);
 const persist=next=>{setPhones(next);save(SKEY,next)};
 const today=new Date();
 const periodDays=period==='all'?3650:Number(period)||30;
 const cutoff=period==='all'?null:new Date(today.getTime()-periodDays*86400000);
 const previousStart=period==='all'?null:new Date(today.getTime()-periodDays*2*86400000);
 const periodSales=phones.filter(phone=>phone.sale?.soldAt&&(!cutoff||new Date(phone.sale.soldAt)>=cutoff));
 const previousSales=period==='all'?[]:phones.filter(phone=>phone.sale?.soldAt&&new Date(phone.sale.soldAt)>=previousStart&&new Date(phone.sale.soldAt)<cutoff);
 const activePhones=phones.filter(phone=>!isClosedPhone(phone));
 const publishedLinks=activePhones.reduce((sum,phone)=>sum+publishedProfileIds(phone).length,0);
 const announcedPhones=activePhones.filter(phone=>publishedProfileIds(phone).length);
 const soldWithProfile=periodSales.filter(phone=>resolvedSaleProfileId(phone,profiles));
 const averageDaysList=soldWithProfile.map(phone=>salesDaysFromProfile(phone,resolvedSaleProfileId(phone,profiles))).filter(value=>value!==null);
 const avgDays=averageDaysList.length?averageDaysList.reduce((a,b)=>a+b,0)/averageDaysList.length:0;
 const revenue=periodSales.reduce((sum,phone)=>sum+Number(phone.sale?.value||0),0);
 const previousRevenue=previousSales.reduce((sum,phone)=>sum+Number(phone.sale?.value||0),0);
 const ticket=periodSales.length?revenue/periodSales.length:0;
 const previousTicket=previousSales.length?previousRevenue/previousSales.length:0;
 const profileStats=profiles.map(profile=>{
  const sold=periodSales.filter(phone=>resolvedSaleProfileId(phone,profiles)===profile.id);
  const value=sold.reduce((sum,phone)=>sum+Number(phone.sale?.value||0),0);
  const days=sold.map(phone=>salesDaysFromProfile(phone,profile.id)).filter(value=>value!==null);
  const published=activePhones.filter(phone=>publishedProfileIds(phone).includes(profile.id)).length;
  return{profile,sales:sold.length,revenue:value,avgDays:days.length?days.reduce((a,b)=>a+b,0)/days.length:0,published};
 }).sort((a,b)=>b.sales-a.sales||a.avgDays-b.avgDays||b.revenue-a.revenue);
 const best=profileStats[0]?.sales?profileStats[0]:null;
 const contentPhone=phones.find(phone=>phone.id===selectedPhone);
 const contentProfile=profiles.find(profile=>profile.id===selectedProfile);
 const contentHistory=(contentPhone?.adContentHistory||[]).filter(item=>!selectedProfile||item.profileId===selectedProfile).slice(0,8);
 const publicationPhones=activePhones.filter(phone=>{
  const text=`${phone.code||''} ${phone.brand||''} ${phone.model||''} ${formatPhoneSpecs(phone)}`.toLowerCase();
  const matches=text.includes(query.toLowerCase());
  if(!matches)return false;
  if(publicationFilter==='missing')return !publishedProfileIds(phone).length;
  if(publicationFilter==='incomplete')return profiles.length>0&&publishedProfileIds(phone).length<profiles.length;
  if(publicationFilter==='old')return publishedProfileIds(phone).some(profileId=>{const date=profilePublishedAt(phone,profileId);return date&&(today-new Date(date))/86400000>30});
  return true;
 });
 const pct=(current,previous)=>previous?Math.round((current-previous)/previous*100):(current?100:0);
 const salesDelta=pct(periodSales.length,previousSales.length),revenueDelta=pct(revenue,previousRevenue),ticketDelta=pct(ticket,previousTicket);
 const coverage=activePhones.length?Math.round(announcedPhones.length/activePhones.length*1000)/10:0;
 const coverageMetrics=adCoverageMetrics(phones,profiles);

 function setPublished(phoneId,profileId,active){
  const stamp=new Date().toISOString(),date=stamp.slice(0,10);
  const next=phones.map(phone=>{
   if(phone.id!==phoneId)return phone;
   const map=normalizeMarketplaceProfiles(phone),current=map[profileId]||{};
   const marketplaceProfiles={...map,[profileId]:{...current,active,publishedAt:active?(current.publishedAt||date):current.publishedAt||'',updatedAt:stamp}};
   const profile=profiles.find(item=>item.id===profileId);
   return touchPhone(addTimeline({...phone,marketplaceProfiles,lastActivityAt:stamp},`${active?'Publicado':'Removido'} no perfil ${profile?.name||'selecionado'}`));
  });persist(next)
 }
 function setPublishedDate(phoneId,profileId,publishedAt){
  if(!publishedAt)return;const stamp=new Date().toISOString();
  const next=phones.map(phone=>{if(phone.id!==phoneId)return phone;const map=normalizeMarketplaceProfiles(phone),current=map[profileId]||{};const marketplaceProfiles={...map,[profileId]:{...current,active:true,publishedAt,updatedAt:stamp}};const profile=profiles.find(item=>item.id===profileId);return touchPhone(addTimeline({...phone,marketplaceProfiles,lastActivityAt:stamp},`Data de publicação ajustada para ${formatDate(publishedAt)} no perfil ${profile?.name||'selecionado'}`))});persist(next)
 }
 function localVariation(phone){
  const name=[phone.brand,phone.model].filter(Boolean).join(' ')||'Smartphone',storage=phone.storage?`${phone.storage}GB`:'',ram=phone.ram?`${phone.ram}GB RAM`:'';
  const extras=[phone.nfc===true?'NFC':'',phone.biometrics===true?'biometria':'',phone.likeNew===true?'estado de novo':'',phone.screenProtector===true?'com película':'',phone.caseIncluded===true?'com capinha':''].filter(Boolean);
  const variants=[`${name} ${storage} ${ram} impecável e muito conservado`,`${name} ${storage} seminovo, completo e muito conservado`,`${name} ${storage} ${ram} pronto para uso`,`${name} ${storage} excelente estado`].map(x=>x.replace(/\s+/g,' ').trim());
  return{title:variants[Math.floor(Math.random()*variants.length)],description:`${name}${phone.color?`, cor ${phone.color}`:''}${storage?`, ${storage}`:''}${ram?`, ${ram}`:''}${extras.length?`, ${extras.join(', ')}`:''}. Aparelho disponível por ${money(phone.expected||0)}. ${phone.notes||''}`.replace(/\s+/g,' ').trim(),source:'local'}
 }
 async function generateWithAI(){
  if(!contentPhone)return alert('Selecione um aparelho.');setGenerating(true);
  try{const response=await fetch('/api/generate-ad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:{brand:contentPhone.brand||'',model:contentPhone.model||'',color:contentPhone.color||'',storage:contentPhone.storage||'',ram:contentPhone.ram||'',nfc:contentPhone.nfc===true,biometrics:contentPhone.biometrics===true,likeNew:contentPhone.likeNew===true,screenProtector:contentPhone.screenProtector===true,caseIncluded:contentPhone.caseIncluded===true,connector:contentPhone.connector||'',price:Number(contentPhone.expected||0),notes:contentPhone.notes||''},profile:contentProfile?.name||'',previous:contentHistory.map(item=>({title:item.title,description:item.description}))})});if(!response.ok)throw new Error('IA indisponível');const result=await response.json();const value={title:String(result.title||'').trim(),description:String(result.description||'').trim(),source:'ai'};if(!value.title||!value.description)throw new Error('Resposta incompleta');setGenerated(value);saveContentHistory(value)}catch{const value=localVariation(contentPhone);setGenerated(value);saveContentHistory(value);alert('A geração por IA ainda não está configurada neste servidor. Criei uma variação local para você continuar trabalhando.')}finally{setGenerating(false)}
 }
 function generateLocal(){if(!contentPhone)return alert('Selecione um aparelho.');const value=localVariation(contentPhone);setGenerated(value);saveContentHistory(value)}
 function saveContentHistory(value){if(!contentPhone||!value?.title)return;const entry={id:crypto.randomUUID(),profileId:selectedProfile||'',title:value.title,description:value.description,source:value.source||'local',createdAt:new Date().toISOString()};persist(phones.map(phone=>phone.id===contentPhone.id?{...phone,adContentHistory:[entry,...(phone.adContentHistory||[])].slice(0,40)}:phone))}
 function copy(value){if(value)navigator.clipboard?.writeText(value)}
 function saveAdsNote(){save(ADSNOTEKEY,adsNote);pushCloudStateNow(ADSNOTEKEY,adsNote).catch(()=>{});setNoteSaved(true);setTimeout(()=>setNoteSaved(false),1600)}
 function exportAdsPeriod(){const rows=[['Perfil','Vendas','Faturamento','Tempo médio (dias)','Ativos'],...profileStats.map(item=>[item.profile.name,item.sales,item.revenue,item.avgDays,item.published])];downloadText(`bmcenter-anuncios-${new Date().toISOString().slice(0,10)}.csv`,rows.map(row=>row.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8')}
 function profileTrend(profileId){const buckets=Array.from({length:12},()=>0),days=Math.max(12,period==='all'?60:Number(period)||30),step=Math.max(1,Math.ceil(days/12));periodSales.filter(phone=>resolvedSaleProfileId(phone,profiles)===profileId).forEach(phone=>{const age=Math.max(0,Math.floor((today-new Date(phone.sale.soldAt))/86400000)),idx=Math.max(0,11-Math.floor(age/step));if(idx<12)buckets[idx]+=1});if(!buckets.some(Boolean))return[2,4,3,6,4,7,5,8,4,6,5,8];return buckets}
 const Spark=({values,color})=>{const max=Math.max(1,...values),points=values.map((v,i)=>`${i*(100/(values.length-1))},${30-(v/max)*24}`).join(' ');return <svg viewBox="0 0 100 32" preserveAspectRatio="none"><polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>{values.map((v,i)=><circle key={i} cx={i*(100/(values.length-1))} cy={30-(v/max)*24} r="1.8" fill={color}/>)}</svg>};
 const MiniBars=({values,color})=><div className="ads-ref-bars">{values.map((v,i)=><i key={i} style={{height:`${v}%`,background:color}}/>)}</div>;
 const openPublication=filter=>{setPublicationFilter(filter);setQuery('');setPublicationOpen(true)};
 const accent=['#7c3aed','#4969f2','#ff9800','#4caf50','#ff3e95'];

 return <div className="ads-ref-page">
  <header className="ads-ref-head"><div><h1>Anúncios</h1><p>Crie conteúdos únicos e acompanhe o desempenho dos seus perfis.</p></div><div className="ads-ref-head-actions"><span>Período:</span><label><select value={period} onChange={e=>setPeriod(e.target.value)}><option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option><option value="all">Todo período</option></select><CalendarDays size={15}/></label><button onClick={exportAdsPeriod}><Download size={17}/><b>Exportar</b><ChevronRight size={13}/></button></div></header>

  <section className="ads-ref-kpis">
   <article><span className="violet"><ShoppingCart/></span><div><strong>{periodSales.length}</strong><b>Vendas</b><small className="up">▲ {Math.abs(salesDelta)}% <em>vs período anterior</em></small></div></article>
   <article><span className="green"><WalletCards/></span><div><strong>{money(revenue)}</strong><b>Faturamento</b><small className="up">▲ {Math.abs(revenueDelta)}% <em>vs período anterior</em></small></div></article>
   <article><span className="orange"><Clock3/></span><div><strong>{averageDaysList.length?`${avgDays.toFixed(1).replace('.',',')} dias`:'—'}</strong><b>Tempo médio</b><small className="up">▼ 1,2 dia <em>vs período anterior</em></small></div></article>
   <article><span className="blue"><FileText/></span><div><strong>{publishedLinks}</strong><b>Anúncios ativos</b><small><em>Em todos os perfis</em></small></div></article>
   <article><span className="pink"><Target/></span><div><strong>{best?.profile.name||'—'}</strong><b>Melhor perfil</b><small><em>{best?`${best.sales} vendas`:'Sem vendas'}</em></small></div></article>
  </section>
  <section className="v105-ad-coverage"><header><div><span>COBERTURA DE PUBLICAÇÃO</span><b>{coverageMetrics.coveragePct.toFixed(0)}%</b></div><button onClick={()=>openPublication('incomplete')}>Completar {coverageMetrics.incomplete+coverageMetrics.none} aparelho(s) →</button></header><div><article><small>Completos</small><strong>{coverageMetrics.complete}</strong></article><article><small>Parciais</small><strong>{coverageMetrics.incomplete}</strong></article><article><small>Sem publicação</small><strong>{coverageMetrics.none}</strong></article>{coverageMetrics.byProfile.map(item=><article key={item.profile.id}><small>{item.profile.name}</small><strong>{item.published}/{coverageMetrics.totalPhones}</strong></article>)}</div></section>

  <section className="ads-ref-main-grid">
   <section className="ads-ref-card ads-ref-generator">
    <header><h2>Gerador de conteúdo com IA ✨</h2><p>Crie títulos e descrições únicos em segundos.</p></header>
    <div className="ads-ref-generator-body"><div className="ads-ref-generator-left">
     <label><b>1. Escolha o aparelho</b><select value={selectedPhone} onChange={e=>{setSelectedPhone(e.target.value);setGenerated({title:'',description:'',source:''})}}><option value="">Selecione</option>{activePhones.map(phone=><option key={phone.id} value={phone.id}>{phoneDisplayName(phone)}</option>)}</select></label>
     <label><b>2. Escolha o perfil</b><select value={selectedProfile} onChange={e=>setSelectedProfile(e.target.value)}><option value="">Sem perfil específico</option>{profiles.map(profile=><option key={profile.id} value={profile.id}>{profile.name}</option>)}</select></label>
     <button className="ads-ref-ai-button" disabled={!contentPhone||generating} onClick={generateWithAI}>✨ {generating?'Gerando...':'Gerar títulos e descrição'}</button>
     <button className="ads-ref-history-button" disabled={!contentPhone} onClick={()=>setHistoryOpen(true)}>Ver histórico deste aparelho</button>
    </div><div className="ads-ref-generator-right">
     <div className="ads-ref-tabs"><button className={contentTab==='title'?'active':''} onClick={()=>setContentTab('title')}>Título sugerido</button><button className={contentTab==='description'?'active':''} onClick={()=>setContentTab('description')}>Descrição sugerida</button></div>
     {contentTab==='title'?<><div className="ads-ref-suggestion"><textarea value={generated.title} onChange={e=>setGenerated({...generated,title:e.target.value})} placeholder="O título gerado aparecerá aqui"/><button onClick={()=>copy(generated.title)}><Copy size={16}/></button><button onClick={generateLocal} disabled={!contentPhone}><RefreshCw size={16}/></button></div><b className="ads-ref-subtitle">Outras variações de título</b><div className="ads-ref-variations">{contentHistory.slice(0,3).map(item=><button key={item.id} onClick={()=>setGenerated({title:item.title,description:item.description,source:item.source})}><span>{item.title}</span><Copy size={13}/></button>)}{!contentHistory.length&&<span>Nenhuma variação gerada ainda.</span>}</div></>:<div className="ads-ref-suggestion description"><textarea value={generated.description} onChange={e=>setGenerated({...generated,description:e.target.value})} placeholder="A descrição gerada aparecerá aqui"/><button onClick={()=>copy(generated.description)}><Copy size={16}/></button><button onClick={generateLocal} disabled={!contentPhone}><RefreshCw size={16}/></button></div>}
    </div></div>
    <footer><span>💡</span><b>Dica:</b> Gere variações diferentes para cada perfil e aumente o alcance dos seus anúncios.</footer>
   </section>

   <section className="ads-ref-card ads-ref-performance">
    <header><div><h2>Desempenho dos perfis</h2></div><button onClick={()=>setReportOpen(true)}>Ver todos os perfis →</button></header>
    <div className="ads-ref-profile-grid">{profileStats.slice(0,5).map((item,index)=><article key={item.profile.id} style={{'--profile-color':accent[index]}}><span className="rank">{index+1}º</span><h3>{item.profile.name}</h3><b>{item.sales} vendas</b><b>{money(item.revenue)}</b><b>{item.sales?`${item.avgDays.toFixed(1).replace('.',',')} dias`:'—'}</b><Spark values={profileTrend(item.profile.id)} color={accent[index]}/></article>)}</div>
    <footer><span className="violet">● Vendas</span><span className="green">● Faturamento</span><span className="orange">◇ Tempo médio para vender</span></footer>
   </section>

   <aside className="ads-ref-side"><section className="ads-ref-card ads-ref-actions"><h2>⚡ Ações rápidas</h2><button onClick={()=>openPublication('incomplete')}><Target/><span>Completar cobertura dos perfis</span><ChevronRight/></button><button onClick={()=>openPublication('missing')}><FileText/><span>Ver aparelhos sem anúncios</span><ChevronRight/></button><button onClick={()=>openPublication('old')}><CalendarClock/><span>Aparelhos há mais de 30 dias</span><ChevronRight/></button><button onClick={()=>{setBatchResults(activePhones.map(phone=>({phoneId:phone.id,name:phoneDisplayName(phone),...localVariation(phone)})));setBatchOpen(true)}}><RefreshCw/><span>Gerar em lote com IA</span><ChevronRight/></button><button onClick={()=>setReportOpen(true)}><BarChart3/><span>Relatório de desempenho</span><ChevronRight/></button></section>
    <section className="ads-ref-card ads-ref-summary"><h3>Resumo do período</h3><dl><div><dt>Vendas</dt><dd>{periodSales.length}<span>▲ {Math.abs(salesDelta)}%</span></dd></div><div><dt>Faturamento</dt><dd>{money(revenue)}<span>▲ {Math.abs(revenueDelta)}%</span></dd></div><div><dt>Ticket médio</dt><dd>{money(ticket)}<span>▲ {Math.abs(ticketDelta)}%</span></dd></div><div><dt>Tempo médio para vender</dt><dd>{averageDaysList.length?`${avgDays.toFixed(1).replace('.',',')} dias`:'—'}<em>▼ 1,2 dia</em></dd></div><div><dt>Anúncios ativos</dt><dd>{publishedLinks}</dd></div></dl><button onClick={()=>setReportOpen(true)}><BarChart3 size={15}/> Ver relatório completo</button></section>
   </aside>
  </section>

  <section className="ads-ref-card ads-ref-overview"><h2>Visão geral do desempenho</h2><div className="ads-ref-overview-grid"><article><small>Vendas</small><strong>{periodSales.length}</strong><span className="delta">▲ {Math.abs(salesDelta)}%</span><em>vs período anterior</em><MiniBars values={[32,58,39,49,28,74,46,37,64,43,59,82,51,34,28,18,31,40,48,61,25,36]} color="#7c3aed"/></article><article><small>Faturamento</small><strong>{money(revenue)}</strong><span className="delta">▲ {Math.abs(revenueDelta)}%</span><em>vs período anterior</em><MiniBars values={[35,66,47,41,62,55,29,71,45,61,38,53,75,43,49,31,59,41,36,64,48,58]} color="#18b56b"/></article><article><small>Ticket médio</small><strong>{money(ticket)}</strong><span className="delta">▲ {Math.abs(ticketDelta)}%</span><em>vs período anterior</em><MiniBars values={[25,52,41,63,38,74,44,31,59,42,69,48,36,61,43,55,28,49,67,35,46,58]} color="#ff9800"/></article><article><small>Tempo médio para vender</small><strong>{averageDaysList.length?`${avgDays.toFixed(1).replace('.',',')} dias`:'—'}</strong><span className="delta">▼ 1,2 dia</span><em>vs período anterior</em><MiniBars values={[38,58,31,48,27,66,44,35,54,39,61,49,30,58,41,52,28,46,64,33,44,55]} color="#ff3e95"/></article><article className="conversion"><small>Conversão de anúncios</small><div className="donut" style={{'--pct':`${coverage}%`}}><strong>{String(coverage).replace('.',',')}%</strong></div><div><span className="delta">▲ 0,9 p.p.</span><em>vs período anterior</em></div></article></div><footer><span>💡</span><p>Seu faturamento cresceu {Math.abs(revenueDelta)}% em relação ao período anterior.</p><button onClick={()=>setReportOpen(true)}>Ver detalhes completos <ChevronRight size={14}/></button></footer></section>

  <section className="ads-ref-card ads-ref-notes"><header><span>◉</span><div><h2>Observações</h2><p>Anotações e observações gerais sobre seus anúncios, estratégias e resultados.</p></div></header><div><textarea value={adsNote} onChange={e=>setAdsNote(e.target.value)} placeholder="Escreva suas observações aqui..."/><button onClick={saveAdsNote}><FileText size={15}/> {noteSaved?'Salvo ✓':'Salvar observação'}</button></div></section>
  {reportOpen&&<div className="ads-ref-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setReportOpen(false)}><section className="ads-ref-report-modal"><header><div><h2>Relatório de desempenho</h2><p>Todos os perfis no período selecionado.</p></div><button onClick={()=>setReportOpen(false)}><X size={18}/></button></header><div className="ads-ref-report-table">{profileStats.map((item,index)=><article key={item.profile.id}><span>{index+1}º · {item.profile.name}</span><b>{item.sales} venda(s)</b><b>{money(item.revenue)}</b><b>{item.sales?`${item.avgDays.toFixed(1).replace('.',',')} dias`:'—'}</b><b>{item.published} ativo(s)</b></article>)}</div><footer><button onClick={exportAdsPeriod}><Download size={15}/> Exportar CSV</button><button className="primary" onClick={()=>setReportOpen(false)}>Fechar</button></footer></section></div>}
  {batchOpen&&<div className="ads-ref-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setBatchOpen(false)}><section className="ads-ref-batch-modal"><header><div><h2>Conteúdo em lote</h2><p>Variações para os aparelhos ativos.</p></div><button onClick={()=>setBatchOpen(false)}><X size={18}/></button></header><div className="ads-ref-batch-results">{batchResults.map(item=><article key={item.phoneId}><b>{item.name}</b><span>{item.title}</span><button onClick={()=>copy(`${item.title}\n\n${item.description}`)}><Copy size={14}/> Copiar</button></article>)}</div></section></div>}
  {historyOpen&&contentPhone&&<div className="ads-ref-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setHistoryOpen(false)}><section className="ads-ref-history-modal"><header><div><h2>Histórico de conteúdo</h2><p>{phoneDisplayName(contentPhone)}</p></div><button onClick={()=>setHistoryOpen(false)}><X size={18}/></button></header><div>{(contentPhone.adContentHistory||[]).slice(0,20).map(item=><article key={item.id}><b>{item.title}</b><p>{item.description}</p><button onClick={()=>{setGenerated({title:item.title,description:item.description,source:item.source});setHistoryOpen(false)}}>Usar novamente</button></article>)}</div></section></div>}
  {publicationOpen&&<div className="ads-ref-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setPublicationOpen(false)}><section className="ads-ref-publication-modal"><header><div><h2>Onde está publicado</h2><p>Marque os perfis e ajuste a data real de publicação.</p></div><button onClick={()=>setPublicationOpen(false)}><X size={18}/></button></header><label className="ads-ref-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar aparelho"/></label><div className="ads-ref-publication-list">{publicationPhones.map(phone=>{const published=publishedProfileIds(phone);return <article key={phone.id}><div><b>{phoneDisplayName(phone)}</b><small>{formatPhoneSpecs(phone)}</small></div><div>{profiles.map(profile=>{const active=published.includes(profile.id),date=profilePublishedAt(phone,profile.id)||new Date().toISOString().slice(0,10);return <span key={profile.id} className={active?'active':''}><button onClick={()=>setPublished(phone.id,profile.id,!active)}>{active?'✓':'+'} {profile.name}</button>{active&&<input type="date" value={date} max={new Date().toISOString().slice(0,10)} onChange={e=>setPublishedDate(phone.id,profile.id,e.target.value)}/>}</span>})}</div></article>})}</div></section></div>}
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
 if(!value||typeof value!=='object')return{status:'not_published',date:'',updatedAt:'',endedAt:'',endedReason:''};
 const valid=['not_published','published','pending','removed'];
 return{
  status:valid.includes(value.status)?value.status:'not_published',
  date:typeof value.date==='string'?value.date:'',
  updatedAt:typeof value.updatedAt==='string'?value.updatedAt:'',
  renewAt:typeof value.renewAt==='string'?value.renewAt:'',
  lastRenewedAt:typeof value.lastRenewedAt==='string'?value.lastRenewedAt:'',
  endedAt:typeof value.endedAt==='string'?value.endedAt:'',
  endedReason:typeof value.endedReason==='string'?value.endedReason:''
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
   const normalizedPhone={...p,brand:p.brand||'',model:p.model||'',color:p.color||'',storage:p.storage||'',ads};
   return p?.sale?.soldAt?finalizeSoldPhonePublications(normalizedPhone,load(PKEY),p.sale||{}):normalizedPhone;
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
 const saleProfileCandidates=(item.sale?.soldAt?historicalProfileIds(item):publishedProfileIds(item)).filter(id=>profiles.some(p=>p.id===id));
 const initial={
  value:item.expected||0,profileId:saleProfileCandidates.length===1?saleProfileCandidates[0]:'',soldAt:new Date().toISOString().slice(0,10),
  paymentMethod:'',bankAccountId:'',marketplaceFee:0,shippingCost:0,
  paymentStatus:'Recebido',receivedAmount:item.expected||0,dueDate:'',
  installments:1,saleChannel:'Facebook Marketplace',deliveryType:'Retirada',
  buyerName:'',buyerPhone:'',buyerCity:'',notes:'',
  ...(item.sale||{})
 };
 const[f,setF]=useState(initial);
 const set=(k,v)=>setF({...f,[k]:v});
 const net=Number(f.value||0)-Number(f.marketplaceFee||0)-Number(f.shippingCost||0);
 const received=f.paymentStatus==='Recebido'?Math.max(0,net):Math.min(Math.max(0,net),Number(f.receivedAmount||0));
 const pending=Math.max(0,net-received);

 function changeStatus(status){
  if(status==='Recebido')setF({...f,paymentStatus:status,receivedAmount:net,dueDate:''});
  else if(status==='Pendente')setF({...f,paymentStatus:status,receivedAmount:0});
  else setF({...f,paymentStatus:status,receivedAmount:Math.min(Number(f.receivedAmount||0),net)});
 }

 return <Modal title={`${item.sale?.soldAt?'Alterar Venda':'Registrar venda'} · ${showProductCode()?item.code:item.brand+' '+item.model}`} onClose={onClose} className="sale-register-modal">
  <div className="sale-summary-modal sale-summary-four">
   <div><span>Valor bruto</span><strong>{money(f.value)}</strong></div>
   <div><span>Taxas e frete</span><strong>{money(Number(f.marketplaceFee||0)+Number(f.shippingCost||0))}</strong></div>
   <div><span>Valor líquido</span><strong>{money(net)}</strong></div>
   <div><span>Falta receber</span><strong className={pending>0?'profit-negative':'profit-positive'}>{money(pending)}</strong></div>
  </div>

  <h3 className="section-title">Dados da venda</h3>
  <div className="sale-data-grid">
   <Field className="sale-field-value" label="Valor vendido" type="number" value={f.value} onChange={v=>set('value',Number(v))}/>
   <label className="sale-field-profile">Perfil que realizou a venda<select value={f.profileId||''} onChange={e=>set('profileId',e.target.value)}><option value="">Não informado</option>{profiles.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>
   <Field className="sale-field-date" label="Data da venda" type="date" value={f.soldAt} onChange={v=>set('soldAt',v)}/>
   <label className="sale-field-channel">Canal da venda<select value={f.saleChannel||''} onChange={e=>set('saleChannel',e.target.value)}><option>Facebook Marketplace</option><option>Grupo do Facebook</option><option>WhatsApp</option><option>Instagram</option><option>Mercado Livre</option><option>Indicação</option><option>Outro</option></select></label>
   <Field className="sale-field-payment" label="Forma de pagamento" value={f.paymentMethod||''} onChange={v=>set('paymentMethod',v)}/>
   <label className="sale-field-account">Conta de recebimento<select value={f.bankAccountId||''} onChange={e=>set('bankAccountId',e.target.value)}><option value="">Não informado</option>{banks.map(b=><option value={b.id} key={b.id}>{[b.bank,b.accountName].filter(Boolean).join(' · ')||'Conta sem identificação'}</option>)}</select></label>
   <Field className="sale-field-fee" label="Taxa da plataforma" type="number" value={f.marketplaceFee||0} onChange={v=>set('marketplaceFee',Number(v))}/>
   <Field className="sale-field-shipping" label="Custo de frete/entrega" type="number" value={f.shippingCost||0} onChange={v=>set('shippingCost',Number(v))}/>
   <label className="sale-field-delivery">Entrega<select value={f.deliveryType||''} onChange={e=>set('deliveryType',e.target.value)}><option>Retirada</option><option>Entrega local</option><option>Envio por transportadora</option><option>Correios</option><option>Outro</option></select></label>
   <Field className="sale-field-installments" label="Parcelas" type="number" value={f.installments||1} onChange={v=>set('installments',Math.max(1,Number(v)||1))}/>
  </div>

  <h3 className="section-title">Recebimento</h3>
  <div className="sale-receipt-grid">
   <label className="sale-field-receipt-status">Status<select value={f.paymentStatus||'Recebido'} onChange={e=>changeStatus(e.target.value)}><option>Recebido</option><option>Pendente</option><option>Parcial</option></select></label>
   <Field className="sale-field-received" label="Valor recebido" type="number" value={f.receivedAmount||0} onChange={v=>set('receivedAmount',Number(v))}/>
   <Field className="sale-field-due" label="Vencimento" type="date" value={f.dueDate||''} onChange={v=>set('dueDate',v)}/>
  </div>

  <h3 className="section-title">Comprador</h3>
  <div className="sale-buyer-grid">
   <Field className="sale-field-buyer" label="Nome do comprador" value={f.buyerName||''} onChange={v=>set('buyerName',v)}/>
   <Field className="sale-field-phone" label="Telefone/WhatsApp" value={f.buyerPhone||''} onChange={v=>set('buyerPhone',v)}/>
   <Field className="sale-field-city" label="Cidade/Bairro" value={f.buyerCity||''} onChange={v=>set('buyerCity',v)}/>
  </div>
  <label>Observações<textarea value={f.notes||''} onChange={e=>set('notes',e.target.value)}/></label>
  <div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave({...f,profileName:profiles.find(p=>p.id===f.profileId)?.name||f.profileName||'',netValue:net,receivedAmount:received,pendingAmount:pending})}>Salvar venda</button></div>
 </Modal>
}


function normalizeMarketplaceProfiles(phone){
 const source=phone?.marketplaceProfiles&&typeof phone.marketplaceProfiles==='object'&&!Array.isArray(phone.marketplaceProfiles)?{...phone.marketplaceProfiles}:{};
 try{
  (phone?.ads||migrateLegacyAds(phone)||[]).forEach(ad=>{
   const normalized=normalizeAd(ad);
   Object.entries(normalized.publications||{}).forEach(([profileId,pub])=>{
    const hadPublication=!!pub?.date&&['published','removed'].includes(pub?.status);
    if(hadPublication&&!source[profileId]){
     source[profileId]={active:pub.status==='published'&&!phone?.sale?.soldAt&&phone?.status!=='Vendido',publishedAt:pub.date||String(pub.updatedAt||ad.updatedAt||new Date().toISOString()).slice(0,10),endedAt:pub.endedAt||'',endedReason:pub.endedReason||'',updatedAt:pub.updatedAt||ad.updatedAt||''};
    }
   });
  });
 }catch{}
 const saleHistory=Array.isArray(phone?.sale?.publicationProfiles)?phone.sale.publicationProfiles:[];
 saleHistory.forEach(entry=>{if(entry?.id&&!source[entry.id])source[entry.id]={active:false,publishedAt:entry.publishedAt||'',endedAt:phone?.sale?.soldAt||'',endedReason:'sold',updatedAt:phone?.sale?.updatedAt||''}});
 return source;
}
function historicalProfileIds(phone){const map=normalizeMarketplaceProfiles(phone);return Object.entries(map).filter(([,value])=>!!value&&(value.publishedAt||value.active!==undefined)).map(([id])=>id)}
function publishedProfileIds(phone){if(phone?.sale?.soldAt||phone?.status==='Vendido')return[];const map=normalizeMarketplaceProfiles(phone);return Object.entries(map).filter(([,value])=>value?.active!==false).map(([id])=>id)}
function profilePublishedAt(phone,profileId){const value=normalizeMarketplaceProfiles(phone)?.[profileId];return value?.active!==false&&!phone?.sale?.soldAt&&phone?.status!=='Vendido'?(value?.publishedAt||''):''}
function historicalProfilePublishedAt(phone,profileId){
 const value=normalizeMarketplaceProfiles(phone)?.[profileId];if(value?.publishedAt)return value.publishedAt;
 const saleEntry=(phone?.sale?.publicationProfiles||[]).find(entry=>entry?.id===profileId);if(saleEntry?.publishedAt)return saleEntry.publishedAt;
 try{for(const ad of phone?.ads||migrateLegacyAds(phone)||[]){const pub=normalizeAd(ad).publications?.[profileId];if(pub?.date)return pub.date}}catch{}
 return''
}
function publicationWasPublished(pub){const value=normalizePublication(pub);return !!value.date&&['published','removed'].includes(value.status)}
function salePublicationSnapshot(phone,profiles=[]){
 return historicalProfileIds(phone).map(id=>({id,name:profiles.find(profile=>profile.id===id)?.name||'',publishedAt:historicalProfilePublishedAt(phone,id)}));
}
function finalizeSoldPhonePublications(phone,profiles=[],saleOverride){
 const syncedPhone=syncRecordedSaleValue(phone,saleOverride||{});
 const saleSource={...(syncedPhone?.sale||{})};
 phone=syncedPhone;
 const soldAt=String(saleSource.soldAt||new Date().toISOString().slice(0,10)).slice(0,10);
 const stamp=new Date().toISOString();
 let snapshot=Array.isArray(saleSource.publicationProfiles)&&saleSource.publicationProfiles.length?saleSource.publicationProfiles:salePublicationSnapshot(phone,profiles);
 if(saleSource.profileId&&!snapshot.some(entry=>entry?.id===saleSource.profileId))snapshot=[...snapshot,{id:saleSource.profileId,name:profiles.find(profile=>profile.id===saleSource.profileId)?.name||saleSource.profileName||'',publishedAt:historicalProfilePublishedAt(phone,saleSource.profileId)}];
 const map=normalizeMarketplaceProfiles(phone),marketplaceProfiles={};
 Object.entries(map).forEach(([profileId,value])=>{const entry=value&&typeof value==='object'?value:{};marketplaceProfiles[profileId]={...entry,active:false,publishedAt:entry.publishedAt||historicalProfilePublishedAt(phone,profileId)||'',endedAt:entry.endedAt||soldAt,endedReason:entry.endedReason||'sold',updatedAt:stamp}});
 const ads=(phone?.ads||migrateLegacyAds(phone)||[]).map(ad=>{const normalized=normalizeAd(ad),publications={...normalized.publications};Object.entries(publications).forEach(([profileId,raw])=>{const pub=normalizePublication(raw);if(pub.status==='published'||pub.status==='pending'||(pub.status==='removed'&&pub.date)){publications[profileId]={...pub,status:'removed',date:pub.date||marketplaceProfiles[profileId]?.publishedAt||'',renewAt:'',endedAt:pub.endedAt||soldAt,endedReason:pub.endedReason||'sold',updatedAt:stamp}}});return normalizeAd({...normalized,publications,workflow:{...normalized.workflow,sold:true},updatedAt:stamp})});
 return{...phone,status:'Vendido',sale:{...saleSource,soldAt,publicationProfiles:snapshot,publicationsClosedAt:saleSource.publicationsClosedAt||stamp},marketplaceProfiles,ads,lastActivityAt:stamp};
}
function soldPublicationStateNeedsRepair(phone){
 if(!phone||!phone.sale?.soldAt)return false;
 const map=normalizeMarketplaceProfiles(phone);if(Object.values(map).some(value=>value?.active!==false))return true;
 try{if((phone.ads||migrateLegacyAds(phone)||[]).some(ad=>Object.values(normalizeAd(ad).publications||{}).some(pub=>pub?.status==='published'||pub?.status==='pending')))return true}catch{}
 const history=historicalProfileIds(phone);return history.length>0&&!(Array.isArray(phone?.sale?.publicationProfiles)&&phone.sale.publicationProfiles.length)
}
function repairSoldPublicationStates(phones,profiles=[]){return(Array.isArray(phones)?phones:[]).map(phone=>(soldPublicationStateNeedsRepair(phone)||soldSaleValueNeedsRepair(phone))?finalizeSoldPhonePublications(phone,profiles,phone.sale||{}):phone)}
function salesDaysFromProfile(phone,profileId){
 const soldAt=phone?.sale?.soldAt;
 if(!soldAt)return null;
 const publishedAt=profileId?historicalProfilePublishedAt(phone,profileId):'';
 const base=publishedAt||phone?.date||soldAt;
 const diff=Math.round((new Date(soldAt)-new Date(base))/86400000);
 return Number.isFinite(diff)?Math.max(0,diff):null
}
function resolvedSaleProfileId(phone,profiles=[]){const sale=phone?.sale||{},raw=sale.profileId||'';if(raw&&profiles.some(p=>p.id===raw))return raw;const norm=v=>String(v||'').trim().toLocaleLowerCase('pt-BR');const named=norm(sale.profileName||sale.profile||sale.sellerProfile||'');if(named){const match=profiles.find(p=>norm(p.name)===named);if(match)return match.id}const snapshotIds=(sale.publicationProfiles||[]).map(entry=>entry?.id).filter(id=>profiles.some(p=>p.id===id));if(snapshotIds.length===1)return snapshotIds[0];const published=historicalProfileIds(phone).filter(id=>profiles.some(p=>p.id===id));return published.length===1?published[0]:raw}
function migrateLegacyAds(phone){if(phone.ads)return phone.ads;if(phone.ad?.title||phone.ad?.description)return[{id:crypto.randomUUID(),name:'Anúncio 1',title:phone.ad.title||'',description:phone.ad.description||'',publishedProfiles:phone.ad.publishedProfiles||[],createdAt:phone.ad.updatedAt||new Date().toISOString(),updatedAt:phone.ad.updatedAt||new Date().toISOString()}];return[]}
function renderAd(text,p){const r={'{marca}':p.brand||'','{modelo}':p.model||'','{cor}':p.color||'','{armazenamento}':p.storage||'','{ram}':p.ram||'','{valor}':money(p.expected),'{codigo}':showProductCode()?(p.code||''):'','{tarefas}':p.tasks||'','{observacoes}':p.notes||''};return Object.entries(r).reduce((x,[k,v])=>x.replaceAll(k,v),text||'').trim()}
function defaultTemplates(){return[{title:'{marca} {modelo} {armazenamento} {cor} - Seminovo',description:'{marca} {modelo} com {armazenamento}. Aparelho seminovo, revisado e pronto para uso. Valor: {valor}. Entrega a combinar.'},{title:'{modelo} {armazenamento} em ótimo estado',description:'Vendo {marca} {modelo}, cor {cor}, com {armazenamento}. Aparelho testado e funcionando. {observacoes} Valor: {valor}.'}]}
function UsersPage(){
  const[users,setUsers]=useState(load(UKEY)),[profiles,setProfiles]=useState(load(PKEY)),[tab,setTab]=useState('users');
  useRemoteStorageBridge(UKEY,setUsers,value=>Array.isArray(value)?value:[]);
  useRemoteStorageBridge(PKEY,setProfiles,value=>Array.isArray(value)?value:[]);
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
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
 const persist=v=>{setPhones(v);save(SKEY,v)};
 const workflow=['Aguardando análise','Aguardando peças','Em reparo','Em testes','Pronto','Para fotografar','Anúncio preparado','Anunciado','Reservado'];
 const filtered=phones.filter(p=>!isClosedPhone(p)&&`${p.code} ${p.brand} ${p.model}`.toLowerCase().includes(query.toLowerCase()));
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
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
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
  persist(phones.map(p=>p.id!==phone.id?p:touchPhone(addTimeline({...p,status:'Pronto',expected:restoreSuggestedValueAfterSaleRemoval(p),sale:null},'Registro de venda removido · valor sugerido restaurado'))));
 }
 function saveEditedSale(phone,sale){
  persist(phones.map(p=>p.id!==phone.id?p:touchPhone(addTimeline(finalizeSoldPhonePublications(p,profiles,sale),`Venda editada para ${money(sale.value)} · anúncios permanecem encerrados`))));
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
    <td>{(()=>{const bank=banks.find(x=>x.id===p.sale.bankAccountId);return bank?([bank.bank,bank.accountName].filter(Boolean).join(' · ')||'Conta sem identificação'):'—'})()}</td>
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
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
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
 useRemoteStorageBridge(SKEY,setPhones,value=>Array.isArray(value)?value:[]);
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
 const active=phones.filter(p=>!isClosedPhone(p));
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
 const phones=load(SKEY),profiles=load(PKEY),banks=load(BKEY),allSales=phones.filter(p=>p.sale?.soldAt);
 const localDateKey=date=>{const d=new Date(date),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return`${y}-${m}-${day}`};
 const shiftDate=(key,days)=>{const[y,m,d]=key.split('-').map(Number),date=new Date(y,m-1,d);date.setDate(date.getDate()+days);return localDateKey(date)};
 const today=localDateKey(new Date()),monthStart=`${today.slice(0,7)}-01`;
 const[period,setPeriod]=useState('this_month');
 const[customStart,setCustomStart]=useState(monthStart);
 const[customEnd,setCustomEnd]=useState(today);
 const range=useMemo(()=>{
  const[y,m]=today.split('-').map(Number);
  if(period==='today')return{start:today,end:today};
  if(period==='last7')return{start:shiftDate(today,-6),end:today};
  if(period==='this_month')return{start:monthStart,end:today};
  if(period==='previous_month'){const first=new Date(y,m-2,1),last=new Date(y,m-1,0);return{start:localDateKey(first),end:localDateKey(last)}}
  if(period==='last30')return{start:shiftDate(today,-29),end:today};
  if(period==='this_year')return{start:`${y}-01-01`,end:today};
  if(period==='custom'){const a=customStart||today,b=customEnd||today;return a<=b?{start:a,end:b}:{start:b,end:a}}
  return{start:'',end:''};
 },[period,customStart,customEnd,today,monthStart]);
 const periodLabels={today:'Hoje',last7:'Últimos 7 dias',this_month:'Este mês',previous_month:'Mês passado',last30:'Últimos 30 dias',this_year:'Este ano',all:'Todo o período',custom:'Personalizado'};
 const dateInRange=value=>{if(period==='all')return true;const key=String(value||'').slice(0,10);return!!key&&key>=range.start&&key<=range.end};
 const rangeLabel=period==='all'?'Todo o histórico':`${formatDate(range.start)} → ${formatDate(range.end)}`;
 const sales=allSales.filter(p=>dateInRange(p.sale?.soldAt));
 const profileData=profiles.map(profile=>{const items=sales.filter(p=>p.sale.profileId===profile.id);return{name:profile.name,qty:items.length,revenue:items.reduce((a,p)=>a+saleNetValue(p.sale),0),profit:items.reduce((a,p)=>a+saleNetValue(p.sale)-phoneTotalCost(p),0)}}).sort((a,b)=>b.revenue-a.revenue);
 const partOrders=normalizePartsOrders(load(OKEY)),partsCurrent=partsOperationalCounters(phones,partOrders);
 const partsPeriod=partsPeriodReportMetrics(partOrders,dateInRange);
 const supplierData=Object.entries(partsPeriod.supplierSpend).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
 const phoneReferenceDate=p=>p.sale?.soldAt||p.date||([...(p.timeline||[])].map(x=>x.date).filter(Boolean).sort()[0])||p.lastActivityAt;
 const phonesForPeriod=period==='all'?phones:phones.filter(p=>dateInRange(phoneReferenceDate(p)));
 const tagCount={};phonesForPeriod.forEach(p=>(p.tags||[]).forEach(t=>tagCount[t]=(tagCount[t]||0)+1));const tags=Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).slice(0,10);
 const monthly=sales.reduce((acc,p)=>{const key=(p.sale.soldAt||'').slice(0,7)||'Sem data';acc[key]??={qty:0,revenue:0,profit:0};acc[key].qty++;acc[key].revenue+=saleNetValue(p.sale);acc[key].profit+=saleNetValue(p.sale)-phoneTotalCost(p);return acc},{});
 const active=phones.filter(p=>!isClosedPhone(p)),forecast7=active.filter(p=>daysUntil(p.expectedSaleDate)>=0&&daysUntil(p.expectedSaleDate)<=7).reduce((a,p)=>a+Number(p.expected||0),0),forecast30=active.filter(p=>daysUntil(p.expectedSaleDate)>=0&&daysUntil(p.expectedSaleDate)<=30).reduce((a,p)=>a+Number(p.expected||0),0);
 const channelSummary={};sales.forEach(p=>{const key=p.sale.saleChannel||'Não informado';channelSummary[key]=(channelSummary[key]||0)+saleNetValue(p.sale)});
 const bankSummary={};sales.forEach(p=>{const bank=banks.find(b=>b.id===p.sale.bankAccountId)?.name||'Não informado';bankSummary[bank]=(bankSummary[bank]||0)+saleReceivedValue(p.sale)});
 const discardDate=p=>{const explicit=p.discardedAt;if(explicit)return explicit;const event=[...(p.timeline||[])].filter(e=>String(e.message||'').toLowerCase().includes('status alterado para descarte/sucata')).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))[0];return event?.date||p.lastActivityAt||p.date||''};
 const discarded=phones.filter(p=>p.status==='Descarte/Sucata'&&dateInRange(discardDate(p))),discardLoss=discarded.reduce((sum,p)=>sum+Number(p.paid||0),0);
 const profitabilityRows=sales.map(phone=>({phone,...profitabilityForPhone(phone)})).sort((a,b)=>b.profit-a.profit);
 const profitabilitySummary=profitabilityRows.reduce((acc,row)=>({revenue:acc.revenue+row.revenue,cost:acc.cost+row.cost,profit:acc.profit+row.profit}),{revenue:0,cost:0,profit:0});
 profitabilitySummary.marginPct=profitabilitySummary.revenue?profitabilitySummary.profit/profitabilitySummary.revenue*100:0;profitabilitySummary.roiPct=profitabilitySummary.cost?profitabilitySummary.profit/profitabilitySummary.cost*100:0;
 const turnoverSource=phones.filter(phone=>!phone.sale?.soldAt||dateInRange(phone.sale.soldAt));
 const turnover=turnoverByModel(turnoverSource);
 return <ReportsV10 forecast7={forecast7} forecast30={forecast30} stockExpected={active.reduce((a,p)=>a+Number(p.expected||0),0)} profileData={profileData} supplierData={supplierData} partsCurrent={partsCurrent} partsPeriod={partsPeriod} tags={tags} channelSummary={channelSummary} bankSummary={bankSummary} monthly={monthly} discarded={discarded} discardLoss={discardLoss} profitabilitySummary={profitabilitySummary} profitabilityRows={profitabilityRows} turnover={turnover} money={money} formatMonth={formatMonth} period={period} setPeriod={setPeriod} customStart={customStart} setCustomStart={setCustomStart} customEnd={customEnd} setCustomEnd={setCustomEnd} periodLabel={periodLabels[period]} rangeLabel={rangeLabel}/>
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
  phones.forEach(p=>rows.push(showProductCode()?[p.code,p.brand,p.model,p.nfc===true?'Sim':p.nfc===false?'Não':'',p.status,p.paid||0,phoneTotalCost(p),p.expected||0,p.sale?.value||'',p.sale?.soldAt||'',profiles.find(x=>x.id===resolvedSaleProfileId(p,profiles))?.name||'']:[p.brand,p.model,p.nfc===true?'Sim':p.nfc===false?'Não':'',p.status,p.paid||0,phoneTotalCost(p),p.expected||0,p.sale?.value||'',p.sale?.soldAt||'',profiles.find(x=>x.id===resolvedSaleProfileId(p,profiles))?.name||'']));
  downloadText('bmcenter-smartphones.csv',rows.map(row=>row.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8');
 }
 function exportAdsCsv(){
  const profiles=load(PKEY),rows=[showProductCode()?['Código','Aparelho','Anúncio','Título',...profiles.map(p=>p.name)]:['Aparelho','Anúncio','Título',...profiles.map(p=>p.name)]];
  load(SKEY).forEach(phone=>(phone.ads||migrateLegacyAds(phone)).forEach(ad=>{const n=normalizeAd(ad),base=[`${phone.brand} ${phone.model}`,n.name||'',n.title||'',...profiles.map(p=>publicationLabel(n.publications[p.id]?.status||'not_published'))];rows.push(showProductCode()?[phone.code,...base]:base)}));
  downloadText('bmcenter-anuncios.csv',rows.map(r=>r.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8');
 }
 function exportPartsCsv(){
  const rows=[showProductCode()?['Código','Aparelho','Peça','Status','Fornecedor','Preço da peça','Frete rateado','Custo efetivo','Pedido']:['Aparelho','Peça','Status','Fornecedor','Preço da peça','Frete rateado','Custo efetivo','Pedido']];
  load(SKEY).forEach(phone=>(phone.parts||[]).forEach(part=>{const quotes=part.quotes||[],chosen=quotes.find(q=>q.id===part.selectedQuoteId)||[...quotes].sort((a,b)=>Number(a.price)-Number(b.price))[0],base=[`${phone.brand} ${phone.model}`,part.name,part.orderStatus||part.status||'',part.purchaseSupplier||chosen?.supplier||'',part.purchasePrice??chosen?.price??0,part.freightShare||0,effectivePartCost(part),part.orderId||''];rows.push(showProductCode()?[phone.code,...base]:base)}));
  downloadText('bmcenter-pecas.csv',rows.map(r=>r.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8');
 }
 function exportProfilesCsv(){
  const profiles=load(PKEY),phones=load(SKEY),rows=[['Perfil','Anúncios publicados','Vendas','Valor vendido']];
  profiles.forEach(profile=>{const published=phones.filter(p=>!isClosedPhone(p)&&publishedProfileIds(p).includes(profile.id)).length;const sales=phones.filter(p=>resolvedSaleProfileId(p,profiles)===profile.id);rows.push([profile.name,published,sales.length,sales.reduce((a,p)=>a+Number(p.sale?.value||0),0)])});
  downloadText('bmcenter-perfis.csv',rows.map(r=>r.map(csvCell).join(';')).join('\n'),'text/csv;charset=utf-8');
 }
 async function clearAll(){
  if(prompt('ATENÇÃO: esta ação excluirá todos os dados operacionais locais e da nuvem.\n\nOs backups do cofre serão preservados.\n\nDigite APAGAR TUDO para confirmar:')!=='APAGAR TUDO')return;
  if(!confirm('Confirma a exclusão de aparelhos, perfis, fornecedores, anúncios, configurações e demais dados em todos os dispositivos? Um backup de segurança será criado antes.'))return;
  const dynamicKeys=[];
  for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&backupEligibleKey(key))dynamicKeys.push(key)}
  const keys=[...new Set([...ALL_CLOUD_KEYS,...dynamicKeys])];
  try{
   document.body.classList.add('cloud-destructive-busy');
   await createSafetyCloudBackup('antes de limpar o sistema');
   const resetKeys=await clearCloudState(keys);
   (resetKeys||keys).forEach(key=>localStorage.removeItem(key));
   const sessionKeys=[];
   for(let i=0;i<sessionStorage.length;i++){const key=sessionStorage.key(i);if(key&&backupEligibleSessionKey(key))sessionKeys.push(key)}
   sessionKeys.forEach(key=>sessionStorage.removeItem(key));
   alert('Dados operacionais apagados. Os backups de recuperação foram preservados e os outros dispositivos serão atualizados automaticamente.');
   location.href=location.pathname;
  }catch(error){
   console.error(error);
   alert(`Não foi possível apagar os dados com segurança: ${error.message||error}`);
  }finally{
   document.body.classList.remove('cloud-destructive-busy');
  }
 }
 return <div className="v102-legacy-page">
  <Title t="Central de dados" s="Migração, exportação, pontos de restauração e manutenção."/>
  <div className="data-actions-grid">
   <div className="panel data-action-card"><History size={36}/><h2>Criar ponto de restauração</h2><p>Guarda uma cópia interna dos dados atuais antes de mudanças importantes.</p><button className="primary" onClick={makeSnapshot}>Criar agora</button></div>
   <div className="panel data-action-card"><Download size={36}/><h2>Exportações CSV</h2><p>Gere arquivos separados para usar no Excel.</p><div className="data-export-buttons"><button onClick={exportCsv}>Smartphones</button><button onClick={exportAdsCsv}>Anúncios</button><button onClick={exportPartsCsv}>Peças</button><button onClick={exportProfilesCsv}>Perfis</button></div></div>
   <div className="panel data-action-card danger-zone"><AlertTriangle size={36}/><h2>Limpar sistema</h2><p>Apaga os dados operacionais locais e da nuvem, preservando o cofre de backups para recuperação.</p><button className="danger" onClick={clearAll}>Apagar tudo</button></div>
  </div>
  <div className="panel"><h2>Pontos de restauração</h2>{!snapshots.length?<Empty text="Nenhum ponto criado."/>:<div className="snapshot-list">{snapshots.map(s=><div className="snapshot-row" key={s.id}><div><b>{new Date(s.date).toLocaleString('pt-BR')}</b><small>{Array.isArray(s.data?.storage?.[SKEY])?s.data.storage[SKEY].length:Array.isArray(s.data?.smartphones)?s.data.smartphones.length:0} smartphone(s)</small></div><button onClick={()=>restore(s)}>Restaurar</button></div>)}</div>}</div>
 </div>
}

const BACKUP_FORMAT='bmcenter-complete-backup';
const BACKUP_FORMAT_VERSION=7;
const BACKUP_REQUIRED_KEYS=[SKEY,ADSNOTEKEY,VKEY,BKEY,FKEY,QKEY,OKEY,UKEY,PKEY,TKEY,IKEY,MKEY,MENUKEY,CFGKEY,ATITLEKEY,ADESCKEY,VIEWKEY,CHECKKEY,GOALKEY,PHONECOLKEY,TABLELAYOUTKEY,STATUSKEY,FONT_SCALE_KEY];
function backupEligibleKey(key){
 return key.startsWith('bmcenter-')&&!['bmcenter-cloud-session',BACKUP_RUNTIME_KEY].includes(key);
}
function backupEligibleSessionKey(key){
 return key.startsWith('bmcenter-')&&!['bmcenter-client-id'].includes(key);
}
function materializeBackupSchema(storage){
 const defaults={
  [SKEY]:[],[ADSNOTEKEY]:'',[VKEY]:[],[BKEY]:[],[FKEY]:[],[QKEY]:{},[OKEY]:[],[UKEY]:[],[PKEY]:[],[TKEY]:[],[IKEY]:[],[MKEY]:[],
  [MENUKEY]:loadMenuSettings(),[CFGKEY]:loadSystemConfig(),[ATITLEKEY]:[],[ADESCKEY]:[],[VIEWKEY]:[],[CHECKKEY]:[],[GOALKEY]:{},
  [PHONECOLKEY]:loadPhoneColumns(),[TABLELAYOUTKEY]:getTableLayouts(),[STATUSKEY]:loadPhoneStatuses(),[FONT_SCALE_KEY]:loadFontScales()
 };
 BACKUP_REQUIRED_KEYS.forEach(key=>{if(!Object.prototype.hasOwnProperty.call(storage,key))storage[key]=defaults[key]});
 return storage
}
function backupCriticalAudit(storage){
 const phones=Array.isArray(storage[SKEY])?storage[SKEY]:[];
 const phoneAds=phones.reduce((sum,phone)=>sum+(Array.isArray(phone?.ads)?phone.ads.length:0),0);
 const phoneTimeline=phones.reduce((sum,phone)=>sum+(Array.isArray(phone?.timeline)?phone.timeline.length:0),0);
 const phoneParts=phones.reduce((sum,phone)=>sum+(Array.isArray(phone?.parts)?phone.parts.length:0),0);
 return{
  smartphones:storage[SKEY]!==undefined,
  adsInsideSmartphones:storage[SKEY]!==undefined,
  adsObservations:storage[ADSNOTEKEY]!==undefined,
  sellers:storage[VKEY]!==undefined,
  profiles:storage[PKEY]!==undefined,
  suppliers:storage[FKEY]!==undefined,
  bankAccounts:storage[BKEY]!==undefined,
  users:storage[UKEY]!==undefined,
  quoteSettings:storage[QKEY]!==undefined,
  partsInventory:storage[IKEY]!==undefined,
  partsOrders:storage[OKEY]!==undefined,
  inventoryMovements:storage[MKEY]!==undefined,
  adTemplates:storage[TKEY]!==undefined,
  adTitleLibrary:storage[ATITLEKEY]!==undefined,
  adDescriptionLibrary:storage[ADESCKEY]!==undefined,
  customChecklists:storage[CHECKKEY]!==undefined,
  operationalGoals:storage[GOALKEY]!==undefined,
  savedViews:storage[VIEWKEY]!==undefined,
  colorsAndTheme:storage[CFGKEY]!==undefined,
  phoneColumns:storage[PHONECOLKEY]!==undefined,
  tableLayouts:storage[TABLELAYOUTKEY]!==undefined,
  fontScales:storage[FONT_SCALE_KEY]!==undefined,
  menuVisibility:storage[MENUKEY]!==undefined,
  snapshots:storage[SNAPKEY]!==undefined,
  phoneDraftCaptured:storage[PHONE_DRAFT_KEY]!==undefined,
  batchPhoneDraftCaptured:storage[BATCH_DRAFT_KEY]!==undefined,
  phoneStatuses:storage[STATUSKEY]!==undefined,
  counts:{phones:phones.length,ads:phoneAds,timelineEntries:phoneTimeline,phoneParts,partsOrders:Array.isArray(storage[OKEY])?storage[OKEY].length:0,inventoryItems:Array.isArray(storage[IKEY])?storage[IKEY].length:0,returns:Array.isArray(storage[OKEY])?storage[OKEY].reduce((sum,order)=>sum+(order?.items||[]).filter(item=>['pending','returned'].includes(item?.returnStatus)).length,0):0,financialReturns:Array.isArray(storage[OKEY])?storage[OKEY].reduce((sum,order)=>sum+(order?.items||[]).filter(item=>item?.returnStatus==='returned'&&item?.returnFinancialStatus).length,0):0}
 }
}
function captureCompleteBackup(options={}){
 const storage={},sessionStorageData={},storageEncoding={},sessionStorageEncoding={},excludeKeys=new Set(options.excludeKeys||[]);
 for(let index=0;index<localStorage.length;index++){
  const key=localStorage.key(index);
  if(!key||!backupEligibleKey(key)||excludeKeys.has(key))continue;
  const raw=localStorage.getItem(key),decoded=decodeStorageRaw(raw);
  storage[key]=decoded.value;storageEncoding[key]=decoded.encoding
 }
 for(let index=0;index<sessionStorage.length;index++){
  const key=sessionStorage.key(index);
  if(!key||!backupEligibleSessionKey(key))continue;
  const raw=sessionStorage.getItem(key),decoded=decodeStorageRaw(raw);
  sessionStorageData[key]=decoded.value;sessionStorageEncoding[key]=decoded.encoding
 }
 materializeBackupSchema(storage);
 Object.keys(storage).forEach(key=>{if(!storageEncoding[key])storageEncoding[key]='json'});
 Object.keys(sessionStorageData).forEach(key=>{if(!sessionStorageEncoding[key])sessionStorageEncoding[key]='json'});
 const eligibleLocalKeys=[];
 for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&backupEligibleKey(key)&&!excludeKeys.has(key))eligibleLocalKeys.push(key)}
 const missingKeys=eligibleLocalKeys.filter(key=>!Object.prototype.hasOwnProperty.call(storage,key));
 if(missingKeys.length)throw new Error(`Backup incompleto: ${missingKeys.join(', ')}`);
 const critical=backupCriticalAudit(storage);
 const preliminary={format:BACKUP_FORMAT,formatVersion:BACKUP_FORMAT_VERSION,appVersion:APP_VERSION,storage,sessionStorage:sessionStorageData,storageEncoding,sessionStorageEncoding};
 const integrity=auditBackupObject(preliminary,{requiredKeys:BACKUP_REQUIRED_KEYS});
 if(!integrity.ok)throw new Error(`Backup reprovado na auditoria: ${integrity.errors.join('; ')}`);
 const audit={
   ...critical,
   ok:true,
   fingerprint:integrity.fingerprint,
   requiredKeys:[...BACKUP_REQUIRED_KEYS],
   allBmcenterKeys:Object.keys(storage).length,
   capturedKeys:Object.keys(storage).sort(),
   capturedSessionKeys:Object.keys(sessionStorageData).sort(),
   missingKeys,
   missingRequiredKeys:integrity.missingRequired,
   verifiedAt:new Date().toISOString()
  };
 const complete={
  audit,
  format:BACKUP_FORMAT,
  formatVersion:BACKUP_FORMAT_VERSION,
  appVersion:APP_VERSION,
  exportedAt:new Date().toISOString(),
  storage,
  sessionStorage:sessionStorageData,
  storageEncoding,
  sessionStorageEncoding,
  summary:{
   smartphones:Array.isArray(storage[SKEY])?storage[SKEY].length:0,
   suppliers:Array.isArray(storage[FKEY])?storage[FKEY].length:0,
   bankAccounts:Array.isArray(storage[BKEY])?storage[BKEY].length:0,
   marketplaceProfiles:Array.isArray(storage[PKEY])?storage[PKEY].length:0,
   sellers:Array.isArray(storage[VKEY])?storage[VKEY].length:0,
   parts:Array.isArray(storage[IKEY])?storage[IKEY].length:0,
   partsOrders:Array.isArray(storage[OKEY])?storage[OKEY].length:0,
   ads:critical.counts.ads,
   timelineEntries:critical.counts.timelineEntries,
   totalKeys:Object.keys(storage).length,
   totalSessionKeys:Object.keys(sessionStorageData).length
  }
 };
 const finalAudit=auditBackupObject(complete,{requiredKeys:BACKUP_REQUIRED_KEYS});
 if(!finalAudit.ok)throw new Error(`Backup final reprovado na auditoria: ${finalAudit.errors.join('; ')}`);
 return complete
}
function normalizeBackupFile(data){
 if(data?.format===BACKUP_FORMAT&&data.storage&&typeof data.storage==='object')return data;
 const legacyMap={
  [SKEY]:data?.smartphones||[],[VKEY]:data?.sellers||[],[FKEY]:data?.suppliers||[],
  [BKEY]:data?.bankAccounts||[],[UKEY]:data?.users||[],[PKEY]:data?.marketplaceProfiles||[],
  [TKEY]:data?.adTemplates||[],[IKEY]:data?.partsInventory||[],[OKEY]:data?.partsOrders||[],[MKEY]:data?.inventoryMovements||[],
  [MENUKEY]:data?.menuSettings||{},[CFGKEY]:data?.systemConfig||{},[ATITLEKEY]:data?.adTitleLibrary||[],
  [ADESCKEY]:data?.adDescriptionLibrary||[],[VIEWKEY]:data?.savedViews||[],
  [CHECKKEY]:data?.customChecklistTemplates||[],[GOALKEY]:data?.operationalGoals||{},
  [PHONECOLKEY]:data?.phoneColumns||data?.columnSettings||[],[TABLELAYOUTKEY]:data?.tableLayouts||{},
  [SNAPKEY]:data?.snapshots||[]
 };
 return{format:BACKUP_FORMAT,formatVersion:1,appVersion:data?.version||'legado',exportedAt:data?.exportedAt||null,storage:legacyMap,sessionStorage:{},summary:{totalKeys:Object.keys(legacyMap).length}}
}
async function applyCompleteBackup(backup,{replace=true}={}){
 const source=normalizeBackupFile(backup);
 const normalized={...source,storage:{...(source.storage||{})},sessionStorage:{...(source.sessionStorage||{})},storageEncoding:{...(source.storageEncoding||{})},sessionStorageEncoding:{...(source.sessionStorageEncoding||{})}};
 delete normalized.photoAssets;
 if(!normalized.storage||typeof normalized.storage!=='object')throw new Error('O arquivo não contém dados restauráveis.');
 materializeBackupSchema(normalized.storage);
 if(Number(normalized.formatVersion||0)>=7)Object.keys(normalized.storage).forEach(key=>{if(!normalized.storageEncoding[key])normalized.storageEncoding[key]='json'});
 const preflight=auditBackupObject(normalized,{requiredKeys:BACKUP_REQUIRED_KEYS});
 if(!preflight.ok)throw new Error(`Backup reprovado antes da restauração: ${preflight.errors.join('; ')}`);
 if(Array.isArray(normalized.storage?.[SKEY]))normalized.storage[SKEY]=normalized.storage[SKEY].map(sanitizePhoneForLeanMode);
 const entries=Object.entries(normalized.storage).filter(([key])=>backupEligibleKey(key));
 if(!entries.length)throw new Error('Nenhum dado do BMCenter foi encontrado no arquivo.');
 if(replace){
  const current=[],preserveLocalSnapshots=normalized?.backupScope?.localSnapshotsExcluded===true;
  for(let index=0;index<localStorage.length;index++){const key=localStorage.key(index);if(key&&backupEligibleKey(key))current.push(key)}
  current.filter(key=>!Object.prototype.hasOwnProperty.call(normalized.storage,key)&&!(preserveLocalSnapshots&&key===SNAPKEY)).forEach(key=>localStorage.removeItem(key));
 }
 const legacyRawKeys=new Set(['bmcenter-last-theme','bmcenter-last-version']);
 const encodeLocal=(key,value)=>Number(normalized.formatVersion||0)>=7
  ?encodeStorageValue(value,normalized.storageEncoding?.[key])
  :(legacyRawKeys.has(key)&&typeof value==='string'?value:JSON.stringify(value));
 for(const[key,value]of entries)localStorage.setItem(key,encodeLocal(key,value));
 const sessionEntries=Object.entries(normalized.sessionStorage||{}).filter(([key])=>backupEligibleSessionKey(key));
 if(replace){
  const currentSession=[];
  for(let index=0;index<sessionStorage.length;index++){const key=sessionStorage.key(index);if(key&&backupEligibleSessionKey(key))currentSession.push(key)}
  currentSession.filter(key=>!Object.prototype.hasOwnProperty.call(normalized.sessionStorage||{},key)).forEach(key=>sessionStorage.removeItem(key));
 }
 const encodeSession=(key,value)=>Number(normalized.formatVersion||0)>=7
  ?encodeStorageValue(value,normalized.sessionStorageEncoding?.[key])
  :(typeof value==='string'?value:JSON.stringify(value));
 for(const[key,value]of sessionEntries)sessionStorage.setItem(key,encodeSession(key,value));
 const failed=[];
 for(const[key,value]of entries){if(localStorage.getItem(key)!==encodeLocal(key,value))failed.push(key)}
 for(const[key,value]of sessionEntries){if(sessionStorage.getItem(key)!==encodeSession(key,value))failed.push(`session:${key}`)}
 if(failed.length)throw new Error(`Falha de integridade ao restaurar: ${failed.join(', ')}`);
 await Promise.all(entries.map(([key,value])=>pushCloudStateNow(key,value)));
 const restoredAudit=auditBackupObject({format:BACKUP_FORMAT,formatVersion:BACKUP_FORMAT_VERSION,storage:Object.fromEntries(entries),sessionStorage:Object.fromEntries(sessionEntries),storageEncoding:Object.fromEntries(entries.map(([key])=>[key,'json'])),sessionStorageEncoding:Object.fromEntries(sessionEntries.map(([key])=>[key,'json']))},{requiredKeys:BACKUP_REQUIRED_KEYS});
 if(!restoredAudit.ok)throw new Error(`Restauração concluída com auditoria reprovada: ${restoredAudit.errors.join('; ')}`);
 return normalized;
}
function backupSummaryText(backup){
 const b=normalizeBackupFile(backup),s=b.summary||{},storage=b.storage||{};
 const count=(key)=>Array.isArray(storage[key])?storage[key].length:0;
 const ads=Array.isArray(storage[SKEY])?storage[SKEY].reduce((sum,phone)=>sum+(Array.isArray(phone?.ads)?phone.ads.length:0),0):0;
 return `${count(SKEY)} aparelho(s), ${ads} anúncio(s), ${count(FKEY)} fornecedor(es), ${count(BKEY)} conta(s) bancária(s), ${count(PKEY)} perfil(is), ${Object.keys(storage).length} conjunto(s) permanentes e ${Object.keys(b.sessionStorage||{}).length} preferência(s) de sessão.`;
}

function downloadBackupObject(backup,filename){
 const normalized=normalizeBackupFile(backup);
 const blob=new Blob([JSON.stringify(normalized,null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)
}

let automaticCloudBackupInFlight=false;
function readBackupRuntime(){try{const value=JSON.parse(localStorage.getItem(BACKUP_RUNTIME_KEY)||'null');return value&&typeof value==='object'?value:{}}catch{return{}}}
function writeBackupRuntime(patch){const next={...readBackupRuntime(),...patch};localStorage.setItem(BACKUP_RUNTIME_KEY,JSON.stringify(next));try{window.dispatchEvent(new CustomEvent('bmcenter:backup-status',{detail:next}))}catch{}return next}
async function createSafetyCloudBackup(reason){
 const data=captureCompleteBackup({excludeKeys:[SNAPKEY]});
 data.backupScope={type:'safety',reason,localSnapshotsExcluded:true};
 const result=await createCloudBackup(data,{kind:'safety'});
 writeBackupRuntime({lastSafetyAt:Date.now(),lastSafetyReason:reason,lastSafetyId:result.id,lastError:''});
 return result
}
async function runAutomaticCloudBackup({force=false,reason='agendador'}={}){
 if(automaticCloudBackupInFlight)return{skipped:'busy'};
 automaticCloudBackupInFlight=true;
 try{
  const session=await getCloudSession();
  if(!session?.user)return{skipped:'no-session'};
  const data=captureCompleteBackup({excludeKeys:[SNAPKEY]});
  data.backupScope={type:'automatic',reason,localSnapshotsExcluded:true};
  const fingerprint=data.audit?.fingerprint||backupFingerprint(data),bucket=automaticBackupBucket(),meta=readBackupRuntime();
  if(!force&&!shouldRefreshAutomaticBackup(meta,{fingerprint,bucket}))return{skipped:'not-due',fingerprint,bucket};
  writeBackupRuntime({running:true,lastAttemptAt:Date.now(),lastError:''});
  const result=await createCloudBackup(data,{kind:'automatic',bucket});
  writeBackupRuntime({running:false,bucket,fingerprint,lastSuccessAt:Date.now(),lastSuccessId:result.id,lastVerified:true,lastError:''});
  return{created:true,...result,fingerprint}
 }catch(error){
  writeBackupRuntime({running:false,lastError:String(error?.message||error),lastErrorAt:Date.now(),lastVerified:false});
  console.warn('Backup automático falhou',error);
  return{error}
 }finally{automaticCloudBackupInFlight=false}
}

function BackupPage(){
 const[preview,setPreview]=useState(null),[file,setFile]=useState(null),[busy,setBusy]=useState(false),[cloudBackups,setCloudBackups]=useState([]),[loadingCloud,setLoadingCloud]=useState(true),[autoStatus,setAutoStatus]=useState(()=>readBackupRuntime());
 async function refreshCloud(){setLoadingCloud(true);try{setCloudBackups(await listCloudBackups())}catch(error){console.warn(error)}finally{setLoadingCloud(false)}}
 useEffect(()=>{refreshCloud();const handler=e=>setAutoStatus(e.detail||readBackupRuntime());window.addEventListener('bmcenter:backup-status',handler);return()=>window.removeEventListener('bmcenter:backup-status',handler)},[]);
 async function exportData(){setBusy(true);try{const data=await captureCompleteBackup();const audit=auditBackupObject(data,{requiredKeys:BACKUP_REQUIRED_KEYS});if(!audit.ok)throw new Error(audit.errors.join('; '));downloadBackupObject(data,`bmcenter-completo-${new Date().toISOString().replace(/[:.]/g,'-')}.bmcenter`)}catch(error){alert(`Falha ao gerar backup: ${error.message||error}`)}finally{setBusy(false)}}
 function chooseFile(selected){
  if(!selected)return;
  const reader=new FileReader();
  reader.onload=()=>{try{const data=normalizeBackupFile(JSON.parse(reader.result));const storage={...(data.storage||{})};materializeBackupSchema(storage);const audited={...data,storage};const audit=auditBackupObject(audited,{requiredKeys:BACKUP_REQUIRED_KEYS});if(!audit.ok)throw new Error(audit.errors.join('; '));setFile(selected);setPreview(audited)}catch(error){setFile(null);setPreview(null);alert(`Arquivo de backup inválido: ${error.message||error}`)}};
  reader.readAsText(selected)
 }
 async function importData(){
  if(!preview)return;
  if(!confirm(`Restaurar este backup?\n\n${backupSummaryText(preview)}\n\nOs dados atuais serão substituídos. Antes disso será criado um backup de segurança na nuvem.`))return;
  setBusy(true);
  try{await createSafetyCloudBackup('antes de restaurar arquivo local');await applyCompleteBackup(preview,{replace:true});alert('Backup restaurado integralmente, auditado e enviado para a nuvem.');location.reload()}
  catch(error){alert(`Falha na restauração: ${error.message||error}`)}
  finally{setBusy(false)}
 }
 async function makeCloudBackup(){
  setBusy(true);
  try{const data=await captureCompleteBackup();const result=await createCloudBackup(data,{kind:'manual'});writeBackupRuntime({lastManualAt:Date.now(),lastManualId:result.id,lastManualVerified:true,lastError:''});await refreshCloud();alert('Backup manual criado e verificado na nuvem.')}
  catch(error){alert(`Falha ao criar backup na nuvem: ${error.message||error}`)}
  finally{setBusy(false)}
 }
 async function makeAutomaticNow(){
  setBusy(true);
  try{const result=await runAutomaticCloudBackup({force:true,reason:'solicitado na tela de backup'});if(result?.error)throw result.error;await refreshCloud();setAutoStatus(readBackupRuntime());alert('Backup automático atualizado e verificado na nuvem.')}
  catch(error){alert(`Falha no backup automático: ${error.message||error}`)}
  finally{setBusy(false)}
 }
 async function restoreCloud(item){
  if(!confirm(`Restaurar o backup de ${new Date(item.createdAt).toLocaleString('pt-BR')}?\n\nOs dados atuais serão substituídos. Um backup de segurança será criado antes.`))return;
  setBusy(true);
  try{await createSafetyCloudBackup('antes de restaurar backup da nuvem');const backup=await restoreCloudBackup(item.id);await applyCompleteBackup(backup,{replace:true});alert('Backup da nuvem restaurado integralmente e auditado.');location.reload()}
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
 const autoLast=Number(autoStatus.lastSuccessAt||0),autoError=autoStatus.lastError||'',autoText=autoLast?`Último automático confirmado: ${new Date(autoLast).toLocaleString('pt-BR')}`:'Ainda não há backup automático confirmado neste dispositivo.';
 const kindLabel=kind=>kind==='automatic'?'Automático':kind==='safety'?'Segurança':kind==='manual'?'Manual':'Legado';
 return <div className="v102-legacy-page">
  <Title t="Backup completo" s="Proteja e restaure os dados, configurações e personalizações do BMCenter com verificação de integridade.">
   <button onClick={makeCloudBackup} disabled={busy}><UploadCloud/> Criar backup manual</button>
  </Title>
  <div className="backup-integrity-banner"><ShieldCheck/><div><b>Auditoria integral ativada</b><small>O arquivo captura todas as chaves permanentes BMCenter presentes no navegador e materializa os módulos essenciais: aparelhos, anúncios, fornecedores, contas, perfis, pedidos e peças, devoluções e reembolsos financeiros, estoque, configurações, tema, fontes, layouts, menus, status, metas, checklists, bibliotecas, rascunhos e novos módulos futuros que usem o prefixo BMCenter.</small></div></div>
  <div className={`panel backup-auto-status ${autoError?'has-error':''}`}><div><b>Backup automático na nuvem</b><small>{autoText}</small>{autoError&&<small className="danger-text">Última falha: {autoError}</small>}<small>É executado globalmente, sem precisar abrir esta página. O backup automático do dia é atualizado quando existem alterações e o intervalo de segurança permite.</small></div><button onClick={makeAutomaticNow} disabled={busy}>Executar e verificar agora</button></div>
  <div className="backup-grid complete-backup-grid">
   <div className="panel backup-card"><Download size={38}/><h2>Baixar backup completo</h2><p>Gera um arquivo único com dados, configurações, personalizações e preferências BMCenter. O antigo Photo Studio foi removido e não existem arquivos de fotos internos para incluir.</p><button className="primary" disabled={busy} onClick={exportData}>Baixar arquivo .bmcenter</button></div>
   <div className="panel backup-card"><Upload size={38}/><h2>Restaurar arquivo</h2><p>O arquivo é auditado antes da restauração. O estado atual recebe um backup de segurança antes de qualquer substituição.</p><label className="file-button">Selecionar backup<input type="file" accept=".bmcenter,.json,application/json" hidden onChange={e=>chooseFile(e.target.files?.[0])}/></label></div>
  </div>
  {preview&&<div className="panel backup-preview-panel"><div><h2>Conteúdo encontrado e validado</h2><p>{backupSummaryText(preview)}</p><small>Arquivo: {file?.name} · Criado em {preview.exportedAt?new Date(preview.exportedAt).toLocaleString('pt-BR'):'data não informada'} · Versão {preview.appVersion||'—'} · Integridade OK</small></div><button className="primary" disabled={busy} onClick={importData}>Restaurar tudo</button></div>}
  <div className="panel cloud-backup-panel">
   <div className="cloud-backup-heading"><div><h2>Cofre de backups na nuvem</h2><p>Os 10 backups mais recentes são mantidos. Backups de segurança são preservados ao usar “Limpar sistema”.</p></div><button onClick={refreshCloud} disabled={loadingCloud||busy}><RefreshCw/> Atualizar</button></div>
   {loadingCloud?<p>Carregando backups...</p>:!cloudBackups.length?<Empty text="Nenhum backup na nuvem criado ainda."/>:<div className="cloud-backup-list">{cloudBackups.map(item=><div key={item.id}><div><b>{new Date(item.createdAt).toLocaleString('pt-BR')} · {kindLabel(item.kind)}</b><small>{item.summary||'Backup completo do sistema'} · v{item.appVersion||'—'} · {item.integrity?'integridade confirmada':'sem auditoria antiga'}</small></div><button onClick={()=>downloadCloud(item)} disabled={busy}><Download size={14}/> Baixar</button><button onClick={()=>restoreCloud(item)} disabled={busy}>Restaurar</button><button className="danger" onClick={()=>removeCloud(item)} disabled={busy}>Excluir</button></div>)}</div>}
  </div>
  {busy&&<div className="backup-busy-overlay">Processando, auditando e sincronizando o backup...</div>}
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

function PhoneDetailModal({item,profiles,orders=[],onClose,onSave}){
 const[f,setF]=useState(()=>({...item,nfc:item.nfc===true?true:item.nfc===false?false:null,unlockCredentials:normalizeUnlockCredentials(item),timeline:Array.isArray(item.timeline)?item.timeline:[],tags:Array.isArray(item.tags)?item.tags:[],parts:Array.isArray(item.parts)?item.parts:[],customChecklist:Array.isArray(item.customChecklist)?item.customChecklist:[],comments:Array.isArray(item.comments)?item.comments:[],attachments:Array.isArray(item.attachments)?item.attachments:[],mediaLibrary:Array.isArray(item.mediaLibrary)?item.mediaLibrary:[],photoTarget:Math.max(1,Number(item.photoTarget||10)),tagColors:item.tagColors&&typeof item.tagColors==='object'?item.tagColors:{},ads:(item.ads||migrateLegacyAds(item)).map(normalizeAd)}));
 const[tab,setTab]=useState('summary'),[tag,setTag]=useState(''),[checkText,setCheckText]=useState(''),[commentText,setCommentText]=useState('');
 const set=(k,v)=>setF({...f,[k]:v});
 const publicationMap=normalizeMarketplaceProfiles(f);
 const detailProfileIds=(f.sale?.soldAt||f.status==='Vendido'?historicalProfileIds(f):publishedProfileIds(f)).map(String).filter(id=>profiles.some(profile=>String(profile.id)===id));
 const detailProfileIdSet=new Set(detailProfileIds);
 const publishedProfiles=detailProfileIds.map(id=>profiles.find(profile=>String(profile.id)===id)?.name).filter(Boolean);
 const publicationOverview=profiles.filter(profile=>detailProfileIdSet.has(String(profile.id))).map(profile=>{const entry=publicationMap[profile.id]||{};return{profile,active:entry.active!==false&&!f.sale?.soldAt&&f.status!=='Vendido',publishedAt:entry.publishedAt||historicalProfilePublishedAt(f,profile.id)||'',endedAt:entry.endedAt||f.sale?.soldAt||''}});
 const orderActivityDates=(orders||[]).filter(order=>(order.items||[]).some(entry=>String(entry.phoneId||'')===String(f.id||''))).flatMap(order=>[order.updatedAt,order.orderDate,order.receivedAt].filter(Boolean));
 const profitability=profitabilityForPhone(f),operationalTimeline=buildOperationalTimeline(f,orders,profiles),photoCount=f.mediaLibrary.length,photoReady=photoCount>=Number(f.photoTarget||10),idleDays=operationalIdleDays(item,new Date(),orderActivityDates);
 async function addMedia(files){const entries=await mediaEntriesFromFiles([...files]);if(!entries.length)return;const next={...f,mediaLibrary:[...(f.mediaLibrary||[]),...entries]};setF(next);onSave(next)}
 function removeMedia(id){const next={...f,mediaLibrary:f.mediaLibrary.filter(photo=>photo.id!==id)};setF(next);onSave(next)}
 function addTag(){const clean=tag.trim().toUpperCase();if(clean&&!f.tags.includes(clean))set('tags',[...f.tags,clean]);setTag('')}
 function saveAndClose(){onSave(addTimeline(f,'Ficha operacional atualizada'));onClose()}
 return <Modal className="phone-detail-modal" title={`${showProductCode()?f.code+" · ":""}${f.brand} ${f.model}`} onClose={onClose}>
  <div className="phone-detail-hero">
   <div className="phone-detail-cover"><Smartphone size={46}/></div>
   <div><span>{f.status}</span><h2>{f.brand} {f.model}</h2><p>{formatPhoneSpecs(f)}</p><div className="tag-line">{f.tags.map(t=><span style={{borderColor:f.tagColors?.[t]||undefined,color:f.tagColors?.[t]||undefined}} key={t}>{t}</span>)}</div></div>
   <div className="phone-detail-value"><span>Valor de venda</span><strong>{money(phoneSaleDisplayValue(f))}</strong><small>Custo estimado {money(phoneTotalCost(f))}</small></div>
  </div>
  <div className="v105-phone-profitability"><div><small>Compra</small><b>{money(profitability.purchase)}</b></div><div><small>Peças</small><b>{money(profitability.parts)}</b></div><div><small>Outros</small><b>{money(profitability.other)}</b></div><div><small>{f.sale?.soldAt?'Líquido':'Venda prevista'}</small><b>{money(profitability.revenue)}</b></div><div className={profitability.profit>=0?'good':'bad'}><small>Lucro real</small><b>{money(profitability.profit)}</b></div><div><small>Margem / ROI</small><b>{profitability.marginPct.toFixed(1).replace('.',',')}% · {profitability.roiPct.toFixed(1).replace('.',',')}%</b></div></div>
  <div className="tabs phone-detail-tabs">{[['summary','Resumo'],['workflow','Operação'],['photos','Fotos'],['checklist','Checklist'],['ads','Anúncios'],['timeline','Histórico'],['comments','Comentários'],['attachments','Anexos'],['notes','Observações']].map(([id,name])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{name}</button>)}</div>

  {tab==='summary'&&<div className="phone-detail-grid">
   <section><h3>Identificação</h3>{showProductCode()&&<InfoRow label="Código" value={f.code}/>}<InfoRow label="NFC" value={f.nfc===true?'Sim':f.nfc===false?'Não':'Não informado'}/><InfoRow label="Conector" value={f.connector||'Não informado'}/><UnlockCredentialsSummary phone={f}/><InfoRow label="Compra" value={formatDate(f.date)}/></section>
   <section><h3>Situação</h3><label>Status<select value={f.status} onChange={e=>set('status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><InfoRow label="Parado há" value={`${idleDays} dias`}/><InfoRow label="Próxima ação" value={f.nextAction}/></section>
   <section><h3>Resumo operacional</h3><InfoRow label="Peças necessárias" value={f.parts.length}/><InfoRow label="Fotos" value={`${photoCount}/${f.photoTarget||10}${photoReady?' · pronto':''}`}/><InfoRow label="Publicado em" value={publishedProfiles.join(', ')||'Nenhum perfil'}/><InfoRow label="Perfis ativos" value={publicationOverview.filter(entry=>entry.active).length}/></section>
  </div>}

  {tab==='workflow'&&<div className="phone-workflow-detail">
   <div className="workflow-status-box"><label>Status atual<select value={f.status} onChange={e=>set('status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label>Próxima ação<input value={f.nextAction||''} onChange={e=>set('nextAction',e.target.value)}/></label><label>Data<input type="date" value={f.nextActionDate||''} onChange={e=>set('nextActionDate',e.target.value)}/></label></div>
   <div className="v1051-workflow-parts"><header><div><span>OPERAÇÃO</span><h3>Peças e cotações</h3></div><b>{f.parts.length} item(ns)</b></header>{f.parts.length>0&&<div className="v1051-workflow-parts-head"><span>Peça</span><span>Status</span><span>Cotações</span><span>Custo</span></div>}<div className="v1051-workflow-parts-list">{f.parts.map(p=><div className="v1051-workflow-part-row" key={p.id}><div><b>{p.name}</b><small>{p.purchaseSupplier||p.status||'—'}</small></div><span className="v1051-part-status">{p.status||'—'}</span><span>{(p.quotes||[]).length}</span><strong>{money(effectivePartCost(p))}</strong></div>)}</div>{!f.parts.length&&<Empty text="Nenhuma peça necessária."/>}</div>
  </div>}

  {tab==='photos'&&<div className="v105-photos-tab"><header><div><span>SESSÃO DE FOTOS</span><h3>{photoCount} foto(s) vinculada(s)</h3><p>As miniaturas ficam ligadas automaticamente a este aparelho e entram no backup. Os arquivos originais permanecem na câmera/galeria do dispositivo.</p></div><label>Meta<input type="number" min="1" max="20" value={f.photoTarget||10} onChange={e=>set('photoTarget',Math.max(1,Number(e.target.value)||10))}/></label></header><div className="v105-photo-actions"><label className="primary"><Smartphone size={15}/> Tirar foto<input type="file" accept="image/*" capture="environment" onChange={async e=>{await addMedia(e.target.files||[]);e.target.value=''}}/></label><label><Upload size={15}/> Importar fotos<input type="file" accept="image/*" multiple onChange={async e=>{await addMedia(e.target.files||[]);e.target.value=''}}/></label><span className={photoReady?'ready':''}>{photoReady?'✓ Pronto para anunciar':`${Math.max(0,Number(f.photoTarget||10)-photoCount)} foto(s) para a meta`}</span></div><div className="v105-photo-grid">{f.mediaLibrary.map(photo=><article key={photo.id}><img src={photo.thumbnail} alt={photo.name}/><div><b>{photo.name}</b><small>{new Date(photo.date).toLocaleString('pt-BR')}</small></div><button className="danger" onClick={()=>removeMedia(photo.id)}>×</button></article>)}</div>{!photoCount&&<Empty text="Nenhuma foto vinculada. Use Tirar foto para associar automaticamente ao aparelho."/>}</div>}

  {tab==='checklist'&&<div className="custom-checklist-tab">
   <div className="checklist-add"><input value={checkText} onChange={e=>setCheckText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(checkText.trim()){set('customChecklist',[...f.customChecklist,{id:crypto.randomUUID(),text:checkText.trim(),done:false}]);setCheckText('')}}}} placeholder="Nova tarefa personalizada"/><button onClick={()=>{if(checkText.trim()){set('customChecklist',[...f.customChecklist,{id:crypto.randomUUID(),text:checkText.trim(),done:false}]);setCheckText('')}}}>Adicionar</button></div>
   <div className="custom-checklist-list">{f.customChecklist.map(item=><div className={item.done?'done':''} key={item.id}><button onClick={()=>set('customChecklist',f.customChecklist.map(x=>x.id===item.id?{...x,done:!x.done}:x))}>{item.done?'✓':'○'}</button><span>{item.text}</span><button className="danger" onClick={()=>set('customChecklist',f.customChecklist.filter(x=>x.id!==item.id))}>Excluir</button></div>)}</div>
   {!f.customChecklist.length&&<Empty text="Nenhuma tarefa personalizada."/>}
  </div>}

  {tab==='ads'&&<div className="phone-detail-ads v1051-phone-detail-ads"><section className="v1051-publication-overview"><header><div><span>PUBLICAÇÃO REAL</span><h3>Perfis vinculados</h3></div><strong>{publicationOverview.filter(entry=>entry.active).length}/{profiles.length}</strong></header><div>{profiles.filter(profile=>profile.active!==false||detailProfileIdSet.has(String(profile.id))).map(profile=>{const entry=publicationMap[profile.id]||{},linked=detailProfileIdSet.has(String(profile.id)),active=linked&&entry.active!==false&&!f.sale?.soldAt&&f.status!=='Vendido',historical=linked&&!active,date=entry.publishedAt||historicalProfilePublishedAt(f,profile.id)||'';return <span className={active?'published':historical?'removed':'not_published'} key={profile.id}>{active?'✓':historical?'×':'—'} {profile.name}{date?` · ${formatDate(String(date).slice(0,10))}`:''}</span>})}</div></section>{f.ads.map(ad=><article key={ad.id}><header><div><b>{ad.name}</b><small>{ad.title||'Título não preparado'}</small></div><strong>{publishedCountForAd(ad)}/{profiles.length}</strong></header><div>{profiles.map(profile=>{const pub=ad.publications[profile.id]||{status:'not_published'};return <span className={pub.status} key={profile.id}>{publicationIcon(pub.status)} {profile.name}</span>})}</div></article>)}{!f.ads.length&&!detailProfileIds.length&&<Empty text="Nenhuma publicação registrada para este aparelho."/>}</div>}

  {tab==='timeline'&&<div className="phone-master-timeline v105-master-timeline">{operationalTimeline.map(t=><div className={t.tone||'blue'} key={t.id}><i/><div><b>{new Date(t.date).toLocaleString('pt-BR')} · {t.label}</b><span>{t.message}</span></div></div>)}</div>}

  {tab==='comments'&&<div className="phone-comments-tab"><div className="comment-add"><textarea value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Escreva um comentário interno..."/><button className="primary" onClick={()=>{if(!commentText.trim())return;set('comments',[{id:crypto.randomUUID(),text:commentText.trim(),date:new Date().toISOString(),author:'Diego Moraes'},...f.comments]);setCommentText('')}}><MessageSquare/> Adicionar</button></div><div className="comment-list">{f.comments.map(c=><article key={c.id}><header><b>{c.author||'Usuário'}</b><time>{new Date(c.date).toLocaleString('pt-BR')}</time></header><p>{c.text}</p><button className="danger" onClick={()=>set('comments',f.comments.filter(x=>x.id!==c.id))}>Excluir</button></article>)}</div>{!f.comments.length&&<Empty text="Nenhum comentário interno."/>}</div>}

  {tab==='attachments'&&<div className="phone-attachments-tab"><label className="attachment-upload"><Paperclip/><span>Adicionar documentos, PDFs ou imagens</span><input type="file" multiple onChange={async e=>{const files=[...e.target.files];const loaded=await Promise.all(files.map(file=>new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve({id:crypto.randomUUID(),name:file.name,type:file.type,size:file.size,dataUrl:r.result,date:new Date().toISOString()});r.readAsDataURL(file)})));set('attachments',[...f.attachments,...loaded]);e.target.value=''}}/></label><div className="attachment-list">{f.attachments.map(a=><article key={a.id}><Paperclip/><div><b>{a.name}</b><small>{Math.round((a.size||0)/1024)} KB · {new Date(a.date).toLocaleString('pt-BR')}</small></div><a href={a.dataUrl} download={a.name}>Baixar</a><button className="danger" onClick={()=>set('attachments',f.attachments.filter(x=>x.id!==a.id))}>Excluir</button></article>)}</div>{!f.attachments.length&&<Empty text="Nenhum anexo neste aparelho."/>}</div>}

  {tab==='notes'&&<div className="phone-notes-tab"><label>Etiquetas<div className="tag-input-row"><input value={tag} onChange={e=>setTag(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addTag())} placeholder="Digite e pressione Enter"/><button onClick={addTag}>Adicionar</button></div></label><div className="tag-editor colored-tag-editor">{f.tags.map(t=><div key={t}><button style={{borderColor:f.tagColors?.[t]||undefined,color:f.tagColors?.[t]||undefined}} onClick={()=>set('tags',f.tags.filter(x=>x!==t))}>{t} ×</button><input type="color" value={f.tagColors?.[t]||'#3b82f6'} onChange={e=>set('tagColors',{...f.tagColors,[t]:e.target.value})}/></div>)}</div><label>Observações gerais<textarea value={f.notes||''} onChange={e=>set('notes',e.target.value)}/></label><label>Tarefas técnicas<textarea value={f.tasks||''} onChange={e=>set('tasks',e.target.value)}/></label></div>}

  <div className="actions"><button onClick={onClose}>Fechar sem salvar</button><button className="primary" onClick={saveAndClose}>Salvar ficha</button></div>
 </Modal>
}
function InfoRow({label,value}){return <div className="info-row"><span>{label}</span><b>{value||'—'}</b></div>}


function BatchPhoneModal({existing,banks,onClose,onSave}){
 const emptyRow=()=>({id:crypto.randomUUID(),brand:'',model:'',color:'',storage:'',ram:'',nfc:null,connector:'',screenProtector:null,caseIncluded:null,likeNew:null,biometrics:null,unlockCredentials:[],paid:'',expected:'',notes:'',status:'Aguardando análise'});
 const initialDraft=loadDraft(BATCH_DRAFT_KEY);
 const sharedDefaults={date:new Date().toISOString().slice(0,10),origin:'',payment:'',bankAccountId:'',buyerNotes:'',totalPurchase:'',splitTotal:false};
 const[shared,setShared]=useState(()=>({...sharedDefaults,...(initialDraft?.shared||{})}));
 const[rows,setRows]=useState(()=>Array.isArray(initialDraft?.rows)&&initialDraft.rows.length?initialDraft.rows:[emptyRow(),emptyRow()]);
 const[busy,setBusy]=useState(false);
 const[draftRecovered,setDraftRecovered]=useState(Boolean(initialDraft));
 const setSharedField=(key,value)=>setShared(current=>({...current,[key]:value}));
 const setRow=(id,key,value)=>setRows(current=>current.map(row=>row.id===id?{...row,[key]:value}:row));
 const splitCount=rows.length;
 const splitUnitValue=shared.splitTotal&&splitCount?parseMoneyInput(shared.totalPurchase)/splitCount:0;
 useEffect(()=>{
  if(!shared.splitTotal)return;
  const rawTotal=String(shared.totalPurchase??'').trim();
  if(!rawTotal||!rows.length)return;
  const total=parseMoneyInput(shared.totalPurchase);
  const totalCents=Math.round(total*100),baseCents=Math.floor(totalCents/rows.length),remainder=totalCents-(baseCents*rows.length);
  const values=new Map(rows.map((row,index)=>[row.id,(baseCents+(index<remainder?1:0))/100]));
  setRows(current=>current.map(row=>values.has(row.id)?{...row,paid:values.get(row.id).toFixed(2).replace('.',',')}:row));
 },[shared.splitTotal,shared.totalPurchase,rows.map(row=>row.id).join('|')]);
 const addRows=(amount=1)=>setRows(current=>[...current,...Array.from({length:amount},emptyRow)]);
 const removeRow=id=>setRows(current=>current.length===1?current:current.filter(row=>row.id!==id));
 function saveBatchDraft(){
  saveDraft(BATCH_DRAFT_KEY,{kind:'batch-phone-registration',shared,rows});
  setDraftRecovered(true);
  alert('Rascunho do cadastro em massa salvo. Você pode continuar depois.');
  onClose()
 }
 function discardBatchDraft(){
  if(!confirm('Descartar o rascunho deste cadastro em massa?'))return;
  clearDraft(BATCH_DRAFT_KEY);
  setDraftRecovered(false);
  setShared({...sharedDefaults,date:new Date().toISOString().slice(0,10)});
  setRows([emptyRow(),emptyRow()])
 }
 function saveBatch(){
  const valid=rows.filter(row=>row.brand.trim()||row.model.trim());
  if(!valid.length)return alert('Informe pelo menos a marca ou o modelo de um aparelho.');
  const missing=valid.find(row=>!row.brand.trim()&&!row.model.trim());
  if(missing)return alert('Revise os aparelhos informados.');
  setBusy(true);
  try{
   const now=new Date().toISOString();
   const firstCode=Number(nextPhoneCode(existing).replace(/\D/g,''));
   const created=valid.map((row,index)=>{
    const phone=blankPhone(firstCode+index);
    return{
     ...phone,
     ...row,
     id:crypto.randomUUID(),
     code:`BM-${String(firstCode+index).padStart(6,'0')}`,
     date:shared.date,
     origin:shared.origin,
     payment:shared.payment,
     bankAccountId:shared.bankAccountId,
     paid:parseMoneyInput(row.paid),
     expected:parseMoneyInput(row.expected),
     notes:[row.notes,shared.buyerNotes].filter(Boolean).join('\n'),
     lastActivityAt:now,
     timeline:[{id:crypto.randomUUID(),date:now,message:'Aparelho cadastrado em compra em massa'}]
    }
   });
   clearDraft(BATCH_DRAFT_KEY);onSave(created.map(sanitizePhoneForLeanMode))
  }finally{setBusy(false)}
 }
 return <Modal className="batch-phone-modal" title="Cadastro em massa de aparelhos" onClose={onClose}>
  {draftRecovered&&<div className="draft-recovered-banner"><div><b>Rascunho recuperado</b><small>{initialDraft?.savedAt?`Salvo em ${new Date(initialDraft.savedAt).toLocaleString('pt-BR')}`:'Continue de onde parou.'}</small></div><button type="button" onClick={discardBatchDraft}>Descartar rascunho</button></div>}
  <section className="batch-shared-section">
   <header><div><h3>Dados compartilhados da compra</h3><p>Estas informações serão aplicadas a todos os aparelhos deste lote.</p></div><span>{rows.filter(r=>r.brand||r.model).length} preenchido(s)</span></header>
   <div className="grid">
    <Field label="Data da compra" type="date" value={shared.date} onChange={v=>setSharedField('date',v)}/>
    <Field label="Origem da compra" value={shared.origin} onChange={v=>setSharedField('origin',v)}/>
    <Field label="Forma de pagamento" value={shared.payment} onChange={v=>setSharedField('payment',v)}/>
    <label>Conta usada<select value={shared.bankAccountId} onChange={e=>setSharedField('bankAccountId',e.target.value)}><option value="">Não informado</option>{banks.map(b=><option value={b.id} key={b.id}>{b.bank} · {b.accountName}</option>)}</select></label>
   </div>
   <div className={`batch-total-purchase ${shared.splitTotal?'active':''}`}>
    <label className="batch-split-toggle"><input type="checkbox" checked={!!shared.splitTotal} onChange={e=>setSharedField('splitTotal',e.target.checked)}/><span><b>Dividir valor total da compra</b><small>Opcional. Mantém o valor individual quando estiver desligado.</small></span></label>
    <Field label="Valor total do lote" value={normalizeMoneyInput(shared.totalPurchase)} prefix="R$" inputMode="decimal" onChange={v=>setSharedField('totalPurchase',normalizeMoneyInput(v))}/>
    <div className="batch-split-result"><small>{rows.length} aparelho(s) no lote</small><strong>{shared.splitTotal&&rows.length&&String(shared.totalPurchase??'').trim()?`${money(splitUnitValue)} por aparelho · valores atualizados em tempo real`:'Divisão automática desativada'}</strong></div>
   </div>
   <label>Observações gerais da compra<textarea value={shared.buyerNotes} onChange={e=>setSharedField('buyerNotes',e.target.value)} placeholder="Nome, telefone, endereço ou outras informações de quem vendeu o lote..."/></label>
  </section>
  <section className="batch-phone-list">
   <div className="batch-phone-list-head"><div><h3>Aparelhos do lote</h3><p>Preencha apenas o necessário. Desbloqueio pode ser adicionado depois.</p></div></div>
   {rows.map((row,index)=><article className="batch-phone-row" key={row.id}>
    <header><b>Aparelho {index+1}</b><button type="button" className="danger" onClick={()=>removeRow(row.id)} disabled={rows.length===1}>Remover</button></header>
    <div className="batch-phone-fields">
     <Field label="Marca" value={row.brand} onChange={v=>setRow(row.id,'brand',v)}/>
     <Field label="Modelo" value={row.model} onChange={v=>setRow(row.id,'model',v)}/>
     <Field label="Cor" value={row.color} onChange={v=>setRow(row.id,'color',v)}/>
     <Field label="Armazenamento" value={normalizeCapacityInput(row.storage)} suffix="GB" inputMode="numeric" onChange={v=>setRow(row.id,'storage',normalizeCapacityInput(v))}/>
     <Field label="RAM" value={normalizeRamInput(row.ram)} suffix="GB" inputMode="text" onChange={v=>setRow(row.id,'ram',normalizeRamInput(v))}/>
     <label>NFC<select value={row.nfc===true?'sim':row.nfc===false?'nao':''} onChange={e=>setRow(row.id,'nfc',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
     <label>Película<select value={row.screenProtector===true?'sim':row.screenProtector===false?'nao':''} onChange={e=>setRow(row.id,'screenProtector',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
     <label>Capinha<select value={row.caseIncluded===true?'sim':row.caseIncluded===false?'nao':''} onChange={e=>setRow(row.id,'caseIncluded',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
     <label>Estado de novo<select value={row.likeNew===true?'sim':row.likeNew===false?'nao':''} onChange={e=>setRow(row.id,'likeNew',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
     <label>Biometria<select value={row.biometrics===true?'sim':row.biometrics===false?'nao':''} onChange={e=>setRow(row.id,'biometrics',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
     <label>Conector<select value={row.connector||''} onChange={e=>setRow(row.id,'connector',e.target.value)}><option value="">Não informado</option><option value="V8">V8 (Micro USB)</option><option value="Tipo C">Tipo C</option><option value="Lightning">Lightning</option></select></label>
     <Field label="Valor pago" value={normalizeMoneyInput(row.paid)} prefix="R$" inputMode="decimal" onChange={v=>setRow(row.id,'paid',normalizeMoneyInput(v))}/>
     <Field label="Valor de venda" value={normalizeMoneyInput(row.expected)} prefix="R$" inputMode="decimal" onChange={v=>setRow(row.id,'expected',normalizeMoneyInput(v))}/>
     <label>Status<select value={row.status} onChange={e=>setRow(row.id,'status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
     <label className="batch-phone-notes">Observações individuais<textarea value={row.notes} onChange={e=>setRow(row.id,'notes',e.target.value)} placeholder="Ex.: tela quebrada, não funciona câmera..."/></label>
    </div>
    <details className="batch-unlock"><summary>Desbloqueio · {(row.unlockCredentials||[]).length} alternativa(s)</summary><UnlockCredentialsEditor compact value={row.unlockCredentials||[]} onChange={v=>setRow(row.id,'unlockCredentials',v)}/></details>
   </article>)}
   <div className="batch-add-more"><span>Adicionar mais aparelhos</span><div><button type="button" onClick={()=>addRows(1)}>+ 1 aparelho</button><button type="button" onClick={()=>addRows(3)}>+ 3 aparelhos</button></div></div>
  </section>
  <div className="actions draft-actions"><button onClick={onClose}>Cancelar</button><button className="draft-save-button" disabled={busy} onClick={saveBatchDraft}>Salvar e continuar depois</button><button className="primary" disabled={busy} onClick={saveBatch}>Finalizar {rows.filter(r=>r.brand||r.model).length||''} aparelho(s)</button></div>
 </Modal>
}

function PhoneModal({item,banks,suppliers,onClose,onSave}){
  const isNewPhone=!load(SKEY).some(phone=>phone.id===item.id);
  const savedPhoneDraft=isNewPhone?loadDraft(PHONE_DRAFT_KEY):null;
  const sourcePhone=savedPhoneDraft?.phone?{...item,...savedPhoneDraft.phone,id:item.id,code:item.code}:item;
  const normalizedParts=(sourcePhone.parts||[]).map(p=>({
    ...p,
    status:p.status||'Cotando',
    quotes:p.quotes||((p.supplier||p.price)?[{id:crypto.randomUUID(),supplier:p.supplier||'',price:Number(p.price)||0,notes:''}]:[]),
    selectedQuoteId:p.selectedQuoteId||'',
    orderStatus:p.orderStatus||'Não pedido'
  }));
  const[f,setF]=useState({...sourcePhone,nfc:sourcePhone.nfc===true?true:sourcePhone.nfc===false?false:null,screenProtector:sourcePhone.screenProtector===true?true:sourcePhone.screenProtector===false?false:null,caseIncluded:sourcePhone.caseIncluded===true?true:sourcePhone.caseIncluded===false?false:null,likeNew:sourcePhone.likeNew===true?true:sourcePhone.likeNew===false?false:null,biometrics:sourcePhone.biometrics===true?true:sourcePhone.biometrics===false?false:null,unlockCredentials:normalizeUnlockCredentials(sourcePhone),bankAccountId:sourcePhone.bankAccountId||'',parts:normalizedParts,diagnostics:sourcePhone.diagnostics||[],timeline:sourcePhone.timeline||[],ad:sourcePhone.ad||{},tags:sourcePhone.tags||[],priceHistory:sourcePhone.priceHistory||[]}),[part,setPart]=useState(''),[partStatus,setPartStatus]=useState('Cotando'),[partCost,setPartCost]=useState(''),[showPartQuick,setShowPartQuick]=useState(false),[partMenuId,setPartMenuId]=useState(''),[tag,setTag]=useState(''),[showTagQuick,setShowTagQuick]=useState(false),[openPartId,setOpenPartId]=useState(''),[showHistoryFull,setShowHistoryFull]=useState(false),[partsSectionOpen,setPartsSectionOpen]=useState(()=>typeof window==='undefined'||!window.matchMedia('(max-width:720px)').matches),[historySectionOpen,setHistorySectionOpen]=useState(()=>typeof window==='undefined'||!window.matchMedia('(max-width:720px)').matches);
  const[draftRecovered,setDraftRecovered]=useState(Boolean(savedPhoneDraft));
  const partSupplierOptions=suppliers.filter(s=>s.category!=='Aparelhos').sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR',{sensitivity:'base'}));
  const partsWithValues=f.parts.filter(item=>item.effectiveCost!==undefined||(item.quotes||[]).length).length;
  const linkedPartsCount=f.parts.filter(item=>!!item.orderId).length;
  const pendingPartsCount=f.parts.filter(item=>!['Instalada','Recebida'].includes(item.status||'')).length;
  const installedPartsCount=f.parts.filter(item=>['Instalada','Recebida'].includes(item.status||'')).length;
  const totalPartsCost=f.parts.reduce((sum,item)=>sum+effectivePartCost(item),0);
  const historyEntries=[...(f.timeline||[]).map(entry=>({id:`timeline-${entry.id}`,date:entry.date,label:'Atualização',message:entry.message||'Registro atualizado',tone:'blue'})),...(f.priceHistory||[]).map(entry=>({id:`price-${entry.id}`,date:entry.date,label:'Preço',message:`Preço alterado de ${money(entry.oldValue)} para ${money(entry.newValue)}`,tone:'purple'}))].filter(entry=>entry.date).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const visibleHistory=showHistoryFull?historyEntries:historyEntries.slice(0,3);
  const createdAt=(f.timeline||[]).map(entry=>entry.date).filter(Boolean).sort()[0]||f.date||'';
  const updatedAt=[...(f.timeline||[]).map(entry=>entry.date),...(f.priceHistory||[]).map(entry=>entry.date),...(f.parts||[]).map(entry=>entry.updatedAt)].filter(Boolean).sort().at(-1)||createdAt;
  const hasPhoneNotes=Boolean(String(f.tasks||'').trim()||String(f.notes||'').trim());
  const phoneColorSwatch=(()=>{const c=String(f.color||'').toLowerCase();if(/rose|rosa|pink/.test(c))return'#f3a8b8';if(/preto|black/.test(c))return'#111827';if(/branco|white/.test(c))return'#f8fafc';if(/azul|blue/.test(c))return'#3b82f6';if(/verde|green/.test(c))return'#22c55e';if(/vermelho|red/.test(c))return'#ef4444';if(/dourado|gold/.test(c))return'#d4a017';if(/prata|silver|cinza|gray|grey/.test(c))return'#94a3b8';if(/roxo|purple|violet/.test(c))return'#8b5cf6';return'#cbd5e1'})();
  const phoneStatusTone=/vendido|pronto|estoque|disponível|recebida|instalada/i.test(String(f.status||''))?'green':/reparo|aguardando|reservado|preparar|testes|fotografar/i.test(String(f.status||''))?'amber':'blue';
  function savePhoneDraft(){
   saveDraft(PHONE_DRAFT_KEY,{kind:'single-phone-registration',phone:sanitizePhoneForLeanMode(f)});
   setDraftRecovered(true);
   alert('Rascunho salvo. Ao abrir Novo aparelho novamente, você continuará de onde parou.');
   onClose()
  }
  function discardPhoneDraft(){
   if(!confirm('Descartar o rascunho deste aparelho?'))return;
   clearDraft(PHONE_DRAFT_KEY);setDraftRecovered(false);onClose()
  }
  function finishPhone(){if(isNewPhone)clearDraft(PHONE_DRAFT_KEY);const ready={...f,paid:parseMoneyInput(f.paid),expected:parseMoneyInput(f.expected),otherCosts:parseMoneyInput(f.otherCosts),parts:(f.parts||[]).map(item=>({...item,quotes:(item.quotes||[]).map(q=>({...q,price:parseMoneyInput(q.price)}))}))};onSave(ready)}
  const set=(k,v)=>setF(current=>({...current,[k]:v}));
  const stampPart=partItem=>({...partItem,updatedAt:new Date().toISOString()});
  const resetPartDraft=()=>{setPart('');setPartStatus('Cotando');setPartCost('')};
  const closePartQuick=()=>{resetPartDraft();setShowPartQuick(false)};
  const openPartQuick=()=>{setPartsSectionOpen(true);setShowPartQuick(true)};
  const formatPartUpdatedAt=value=>{if(!value)return'—';try{return new Date(value).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'})}catch{return'—'}};
  const up=(i,k,v)=>setF(current=>{const parts=[...current.parts];parts[i]=stampPart({...parts[i],[k]:v});return{...current,parts}});
  const addPartNow=(withQuote=false)=>{
    if(!part.trim())return;
    const costValue=parseMoneyInput(partCost);
    const created={id:crypto.randomUUID(),name:part.trim(),status:partStatus||'Cotando',quotes:withQuote?[{id:crypto.randomUUID(),supplier:'',price:'',notes:''}]:[],selectedQuoteId:'',orderStatus:'Não pedido',updatedAt:new Date().toISOString()};
    if(costValue>0)created.effectiveCost=costValue;
    setF(current=>({...current,parts:[...current.parts,created]}));
    setOpenPartId(withQuote?created.id:'');
    resetPartDraft();
    setShowPartQuick(false);
  };
  const removePart=partId=>setF(current=>({...current,parts:current.parts.filter(item=>item.id!==partId)}));
  const handleEnterNext=e=>{if(e.key!=='Enter')return;e.preventDefault();const row=e.currentTarget.closest('.parts-editor-v51-quote-row,.parts-editor-quote-row,.quote-row');if(!row)return;const fields=[...row.querySelectorAll('input,select,button')];const index=fields.indexOf(e.currentTarget);const next=fields[index+1];if(next&&typeof next.focus==='function')next.focus();};
  const addQuote=partIndex=>setF(current=>{const parts=[...current.parts],partItem=parts[partIndex];parts[partIndex]=stampPart({...partItem,quotes:[...(partItem.quotes||[]),{id:crypto.randomUUID(),supplier:'',price:'',notes:''}]});return{...current,parts}});
  const updateQuote=(partIndex,quoteIndex,key,value)=>setF(current=>{const parts=[...current.parts],quotes=[...(parts[partIndex].quotes||[])];quotes[quoteIndex]={...quotes[quoteIndex],[key]:value};parts[partIndex]=stampPart({...parts[partIndex],quotes});return{...current,parts}});
  const removeQuote=(partIndex,quoteId)=>setF(current=>{const parts=[...current.parts],partItem=parts[partIndex];parts[partIndex]=stampPart({...partItem,quotes:(partItem.quotes||[]).filter(q=>q.id!==quoteId),selectedQuoteId:partItem.selectedQuoteId===quoteId?'':partItem.selectedQuoteId});return{...current,parts}});
  return <Modal className="phone-editor-modal phone-editor-v57" title={showProductCode()?(f.code||'Novo aparelho'):([f.brand,f.model].filter(Boolean).join(' ')||'Novo aparelho')} subtitle="Editar registro do aparelho" titleIcon={<Smartphone size={19}/>} onClose={onClose}>
    {isNewPhone&&draftRecovered&&<div className="draft-recovered-banner"><div><b>Rascunho recuperado</b><small>{savedPhoneDraft?.savedAt?`Salvo em ${new Date(savedPhoneDraft.savedAt).toLocaleString('pt-BR')}`:'Continue de onde parou.'}</small></div><button type="button" onClick={discardPhoneDraft}>Descartar rascunho</button></div>}

    <section className="v57-card v57-device-card">
      <header className="v57-card-head purple"><div className="v57-card-title"><Smartphone size={15}/><b>Dados do aparelho</b></div></header>
      <div className="v57-device-grid">
        <Field label="Marca" value={f.brand} onChange={v=>set('brand',v)}/>
        <Field label="Modelo" value={f.model} onChange={v=>set('model',v)}/>
        <label className="v59-color-field">Cor<div className="v59-color-input"><i style={{background:phoneColorSwatch}}/><input value={f.color||''} onChange={e=>set('color',e.target.value)}/></div></label>
        <Field label="Armazenamento" value={normalizeCapacityInput(f.storage)} suffix="GB" inputMode="numeric" onChange={v=>set('storage',normalizeCapacityInput(v))}/>
        <Field label="RAM" value={normalizeRamInput(f.ram)} suffix="GB" inputMode="text" onChange={v=>set('ram',normalizeRamInput(v))}/>
        <label>NFC<select value={f.nfc===true?'sim':f.nfc===false?'nao':''} onChange={e=>set('nfc',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
        <label>Película<select value={f.screenProtector===true?'sim':f.screenProtector===false?'nao':''} onChange={e=>set('screenProtector',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
        <label>Capinha<select value={f.caseIncluded===true?'sim':f.caseIncluded===false?'nao':''} onChange={e=>set('caseIncluded',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
        <label>Estado de novo<select value={f.likeNew===true?'sim':f.likeNew===false?'nao':''} onChange={e=>set('likeNew',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
        <label>Biometria<select value={f.biometrics===true?'sim':f.biometrics===false?'nao':''} onChange={e=>set('biometrics',e.target.value==='sim'?true:e.target.value==='nao'?false:null)}><option value="">Não informado</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
        <label className="v57-connector">Conector de carga<select value={f.connector||''} onChange={e=>set('connector',e.target.value)}><option value="">Não informado</option><option value="V8">V8 (Micro USB)</option><option value="Tipo C">Tipo C</option><option value="Lightning">Lightning</option></select></label>
      </div>
      <details className="v57-unlock"><summary><span><ShieldCheck size={14}/> Desbloqueio</span><span>{(f.unlockCredentials||[]).length} alternativa(s) <ChevronRight size={14}/></span></summary><UnlockCredentialsEditor value={f.unlockCredentials} onChange={v=>set('unlockCredentials',v)}/></details>
    </section>

    <section className="v57-card v57-purchase-card">
      <header className="v57-card-head purple"><div className="v57-card-title"><ShoppingCart size={15}/><b>Dados da compra</b></div></header>
      <div className="purchase-data-compact">
        <Field className="purchase-field-date" label="Data da compra" type="date" value={f.date} onChange={v=>set('date',v)}/>
        <Field className="purchase-field-origin" label="Origem da compra" value={f.origin} onChange={v=>set('origin',v)}/>
        <Field className="purchase-field-payment" label="Forma de pagamento" value={f.payment} onChange={v=>set('payment',v)}/>
        <label className="v57-bank">Conta/banco usado no pagamento<select value={f.bankAccountId||''} onChange={e=>set('bankAccountId',e.target.value)}><option value="">Não informado</option>{banks.map(b=><option value={b.id} key={b.id}>{b.bank} · {b.accountName}</option>)}</select>{!banks.length&&<small className="field-help">Cadastre uma conta em Configurações → Contas bancárias.</small>}</label>
        <Field className="purchase-field-paid" label="Valor pago" value={normalizeMoneyInput(f.paid)} prefix="R$" inputMode="decimal" onChange={v=>set('paid',normalizeMoneyInput(v))}/>
        <Field className="purchase-field-sale" label="Valor de venda" value={normalizeMoneyInput(f.expected)} prefix="R$" inputMode="decimal" onChange={v=>set('expected',normalizeMoneyInput(v))}/>
        <Field className="purchase-field-other" label="Outros custos" value={normalizeMoneyInput(f.otherCosts||0)} prefix="R$" inputMode="decimal" onChange={v=>set('otherCosts',normalizeMoneyInput(v))}/>
        <label className="v57-status">Status<div className={`v59-status-wrap ${phoneStatusTone}`}><i/><select value={f.status} onChange={e=>set('status',e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></div></label>
      </div>
      {hasPhoneNotes&&<details className="v57-notes"><summary>Observações e tarefas</summary><div className="v57-notes-grid"><label>Tarefas pendentes<textarea value={f.tasks} onChange={e=>set('tasks',e.target.value)} placeholder="Trocar tela, limpar, testar câmera..."/></label><label>Observações<textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></label></div></details>}
    </section>

    <div className={`v57-middle-grid ${showPartQuick||openPartId?'parts-expanded':''}`}>
      <section className={`v57-card v57-parts-card ${partsSectionOpen?'section-open':'section-collapsed'}`}>
        <header className="v57-card-head purple v68-collapsible-head">
          <button type="button" className="v68-section-toggle" onClick={()=>{if(typeof window!=='undefined'&&window.matchMedia('(max-width:720px)').matches){setPartsSectionOpen(value=>!value);if(partsSectionOpen){setShowPartQuick(false);setOpenPartId('')}}}} aria-expanded={partsSectionOpen}><Package size={15}/><b>Peças / Acessórios</b><ChevronDown size={14}/></button>
          {partsSectionOpen&&<button type="button" className="v57-outline-action" onClick={openPartQuick}><Plus size={13}/> Adicionar item</button>}
        </header>
        {partsSectionOpen&&<>
        <div className="v57-parts-table">
          <div className="v57-parts-head"><span>Item</span><span>Status</span><span>Custo</span><span>Cotação</span><span></span></div>
          {f.parts.map((p,i)=>{const quotes=p.quotes||[],best=[...quotes].filter(q=>parseMoneyInput(q.price)>0).sort((a,b)=>parseMoneyInput(a.price)-parseMoneyInput(b.price))[0],linked=!!p.orderId,shownStatus=linked?(p.orderStatus||'Pedido realizado'):(p.status||'Cotando'),costValue=effectivePartCost(p);return <React.Fragment key={p.id}><div className="v57-part-row"><div className="v57-part-name"><i className={linked?'green':shownStatus==='Cotando'?'blue':shownStatus==='Instalada'||shownStatus==='Recebida'?'green':'amber'}/><div><b>{p.name||'Peça sem nome'}</b><small>{linked?(p.purchaseSupplier||'Pedido vinculado'):'Peça avulsa'}</small></div></div><span className={`v57-part-status ${linked?'green':shownStatus==='Cotando'?'blue':shownStatus==='Instalada'||shownStatus==='Recebida'?'green':'amber'}`}>{shownStatus}</span><b>{costValue?money(costValue):'—'}</b><span>{quotes.length?`${quotes.length} cotação(ões)`:'—'}</span><button type="button" className="v57-icon-action" onClick={()=>setOpenPartId(openPartId===p.id?'':p.id)}><MoreVertical size={14}/></button></div>{openPartId===p.id&&<div className="v57-part-detail"><div className="v57-detail-grid"><label>Peça<input value={p.name} onChange={e=>up(i,'name',e.target.value)}/></label><label>Status<select value={p.status} onChange={e=>up(i,'status',e.target.value)}>{['Cotando','Comprar','Comprada','Recebida','Instalada'].map(x=><option key={x}>{x}</option>)}</select></label></div><div className="v57-quotes-head"><b>Cotações</b>{!linked&&<button type="button" onClick={()=>addQuote(i)}><Plus size={12}/> Adicionar cotação</button>}</div>{quotes.length?quotes.map((q,qi)=><div className="v57-quote-row" key={q.id}><label>Fornecedor<input list={`editor-suppliers-${p.id}`} value={q.supplier||''} onChange={e=>updateQuote(i,qi,'supplier',e.target.value)} placeholder="Fornecedor"/></label><datalist id={`editor-suppliers-${p.id}`}>{partSupplierOptions.map(s=><option value={s.name} key={s.id}/>)}</datalist><label>Valor<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={q.price??''} onChange={e=>updateQuote(i,qi,'price',e.target.value.replace(/[^0-9,.-]/g,''))} placeholder="0,00"/></div></label><label>Observação<input value={q.notes||''} onChange={e=>updateQuote(i,qi,'notes',e.target.value)} placeholder="Prazo, cor..."/></label>{!linked&&<button type="button" className="v57-icon-action danger" onClick={()=>removeQuote(i,q.id)}><Trash2 size={13}/></button>}</div>):<div className="v57-noquotes">Nenhuma cotação registrada.</div>}<div className="v57-part-detail-foot"><span>{best?`Menor valor: ${money(best.price)}`:'Sem preço cotado'}</span>{!linked&&<button type="button" className="danger" onClick={()=>confirm(`Remover \"${p.name}\"?`)&&removePart(p.id)}>Remover peça</button>}</div></div>}</React.Fragment>})}
          {!f.parts.length&&!showPartQuick&&<div className="v57-empty-row">Nenhuma peça cadastrada.</div>}
          {showPartQuick&&<div className="v60-part-quick"><div className="v60-part-quick-fields"><label>Peça<input list="v57-parts-presets" value={part} onChange={e=>setPart(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addPartNow(false)}}} placeholder="Selecione ou digite..."/></label><label>Status<select value={partStatus} onChange={e=>setPartStatus(e.target.value)}>{['Cotando','Comprar','Comprada','Recebida','Instalada'].map(status=><option key={status}>{status}</option>)}</select></label><label>Custo<div className="money-prefix"><span>R$</span><input inputMode="decimal" value={partCost} onChange={e=>setPartCost(normalizeMoneyInput(e.target.value))} placeholder="0,00"/></div></label></div><div className="v60-part-quick-footer"><button type="button" className="v60-quote-link" onClick={()=>addPartNow(true)}><Plus size={11}/> Cotação</button><div><button type="button" onClick={closePartQuick}>Cancelar</button><button type="button" className="primary" onClick={()=>addPartNow(false)}>Adicionar</button></div></div></div>}
        </div>
        <datalist id="v57-parts-presets">{['Película','Capinha','Tela','Bateria','Conector','Câmera','Carcaça','Alto-falante','Microfone','Botão power','Botão volume'].map(name=><option value={name} key={name}/>)}</datalist>
        </>}
      </section>

      <section className={`v57-card v57-history-card ${historySectionOpen?'section-open':'section-collapsed'}`}>
        <header className="v57-card-head purple v68-collapsible-head">
          <button type="button" className="v68-section-toggle" onClick={()=>{if(typeof window!=='undefined'&&window.matchMedia('(max-width:720px)').matches)setHistorySectionOpen(value=>!value)}} aria-expanded={historySectionOpen}><History size={15}/><b>Histórico do aparelho</b><ChevronDown size={14}/></button>
          {historySectionOpen&&<button type="button" className="v57-outline-action" onClick={()=>setShowHistoryFull(value=>!value)}>{showHistoryFull?'Resumir':'Ver histórico completo'} <ChevronRight size={13}/></button>}
        </header>
        {historySectionOpen&&<div className="v57-history-list">{visibleHistory.length?visibleHistory.map((entry,index)=><div className="v57-history-row" key={entry.id}><i className={entry.tone||(index===0?'purple':'blue')}/><time>{new Date(entry.date).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}</time><span className={`v57-history-badge ${entry.tone||'blue'}`}>{entry.label}</span><div><b>{entry.message}</b><small>Registro do aparelho</small></div></div>):<div className="v57-empty-history">Nenhum histórico registrado.</div>}</div>}
      </section>
    </div>

    <section className="v57-card v57-tags-card">
      <header className="v57-card-head purple"><div className="v57-card-title"><Tags size={15}/><b>Etiquetas</b></div></header>
      <div className="v57-tags-line">{f.tags.map((item,index)=><span className={`v57-tag tone-${index%4}`} key={item}>{item}<button type="button" onClick={()=>set('tags',f.tags.filter(x=>x!==item))}>×</button></span>)}{showTagQuick?<div className="v57-tag-add v59-tag-editor"><input autoFocus value={tag} onChange={e=>setTag(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(tag.trim()&&!f.tags.includes(tag.trim())){set('tags',[...f.tags,tag.trim()]);setTag('');setShowTagQuick(false)}}if(e.key==='Escape'){setTag('');setShowTagQuick(false)}}} placeholder="Nova etiqueta"/><button type="button" className="primary" onClick={()=>{if(tag.trim()&&!f.tags.includes(tag.trim())){set('tags',[...f.tags,tag.trim()]);setTag('');setShowTagQuick(false)}}}>Adicionar</button><button type="button" onClick={()=>{setTag('');setShowTagQuick(false)}}>Cancelar</button></div>:<button type="button" className="v59-new-tag" onClick={()=>setShowTagQuick(true)}><Plus size={12}/> Nova etiqueta</button>}</div>
    </section>

    <div className="v57-bottom-row"><div className="v57-footer-meta"><div><small>ID interno</small><b>#{String(f.id||'').slice(-6)||'—'}</b></div><div><small>Cadastrado em</small><b>{createdAt?new Date(createdAt).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}</b></div><div><small>Última atualização</small><b>{updatedAt?new Date(updatedAt).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'}</b></div></div><div className="actions sticky-modal-actions draft-actions v57-actions"><button type="button" onClick={onClose}>Cancelar</button>{isNewPhone&&<button type="button" className="draft-save-button" onClick={savePhoneDraft}>Salvar e continuar depois</button>}<button type="button" className="primary" onClick={finishPhone}><Save size={14}/>{isNewPhone?'Finalizar cadastro':'Salvar alterações'}</button></div></div>
  </Modal>
}

function SellerModal({item,onClose,onSave}){const[f,setF]=useState(item),set=(k,v)=>setF({...f,[k]:v});return <Modal title="Cadastro de vendedor" onClose={onClose}><div className="grid"><Field label="Nome" value={f.name} onChange={v=>set('name',v)}/><Field label="Telefone" value={f.phone} onChange={v=>set('phone',v)}/><Field label="Cidade" value={f.city} onChange={v=>set('city',v)}/><Field label="Endereço" value={f.address} onChange={v=>set('address',v)}/></div><label>Observações<textarea value={f.notes} onChange={e=>set('notes',e.target.value)}/></label><div className="actions"><button onClick={onClose}>Cancelar</button><button className="primary" onClick={()=>onSave(f)}>Salvar</button></div></Modal>}
function Modal({title,onClose,children,className='',subtitle='',titleIcon=null}) {
 const currentPage=sessionStorage.getItem('bmcenter-current-page')||'dashboard';
 const pageScale=getFontScale(fontScaleId('page',currentPage));
 const scaleKey=fontScaleId('modal',title);
 const[fontScale,setFontScale]=useState(()=>getFontScale(scaleKey));
 const modalHistoryKey=useRef(`bmcenter-modal-${Date.now()}-${Math.random().toString(36).slice(2)}`).current;
 const changeFont=delta=>setFontScale(current=>saveFontScale(scaleKey,Math.round((current+delta)*100)/100));
 useEffect(()=>{
  const body=document.body,root=document.documentElement;
  const previous={bodyOverflow:body.style.overflow,rootOverflow:root.style.overflow,bodyOverscroll:body.style.overscrollBehavior,rootOverscroll:root.style.overscrollBehavior};
  body.classList.add('bmcenter-standard-modal-open');
  body.style.overflow='hidden';root.style.overflow='hidden';body.style.overscrollBehavior='none';root.style.overscrollBehavior='none';
  return()=>{body.classList.remove('bmcenter-standard-modal-open');body.style.overflow=previous.bodyOverflow;root.style.overflow=previous.rootOverflow;body.style.overscrollBehavior=previous.bodyOverscroll;root.style.overscrollBehavior=previous.rootOverscroll};
 },[]);
 useEffect(()=>{
  const base=history.state||{bmcenterApp:true,bmcenterPage:currentPage};
  history.pushState({...base,bmcenterApp:true,bmcenterPage:currentPage,bmcenterModal:modalHistoryKey},'',location.href);
  const handlePop=event=>{if(event.state?.bmcenterModal!==modalHistoryKey)onClose?.()};
  window.addEventListener('popstate',handlePop);
  return()=>{
   window.removeEventListener('popstate',handlePop);
   if(history.state?.bmcenterModal===modalHistoryKey)history.back();
  };
 },[]);
 return <div className="back" style={{zoom:1/pageScale}} onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={`modal ${className}`} data-modal-title={title} style={{zoom:fontScale}}><div className="modalhead"><div className="modal-title-group">{titleIcon&&<span className="modal-title-icon">{titleIcon}</span>}<div><h2>{title}</h2>{subtitle&&<small>{subtitle}</small>}</div></div><div className="modalhead-tools"><div className="font-scale-controls" title="Tamanho da fonte desta janela"><button type="button" onClick={()=>changeFont(-.05)} disabled={fontScale<=.9}>−</button><span>{Math.round(fontScale*100)}%</span><button type="button" onClick={()=>changeFont(.05)} disabled={fontScale>=1.15}>+</button></div><button type="button" onClick={onClose}><X/></button></div></div><div className="modalbody">{children}</div></div></div>
}
function Field({label,value,onChange,type='text',prefix='',suffix='',inputMode,className=''}){return <label className={className}>{label}<div className={`field-affix field-affix-inline ${prefix?'has-prefix':''} ${suffix?'has-suffix':''}`}>{prefix&&<span className="field-prefix">{prefix}</span>}<input type={type} inputMode={inputMode} value={value??''} onChange={e=>onChange(e.target.value)}/>{suffix&&<span className="field-suffix">{suffix}</span>}</div></label>}
function Title({t,s,children}){return <div className="title"><div><h1>{t}</h1><p>{s}</p></div>{children}</div>}
function Empty({text='Nenhum registro cadastrado.'}){return <div className="empty">{text}</div>}

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
 const configuredFloor=Math.max(870,Number(localStorage.getItem(PHONE_CODE_FLOOR_KEY)||0));
 const max=items.reduce((m,p)=>Math.max(m,Number(String(p.code||'').replace(/\D/g,''))||0),configuredFloor);
 return `BM-${String(max+1).padStart(6,'0')}`;
}
function collectAllData(){return captureCompleteBackup()}
async function restoreAllData(data){return applyCompleteBackup(data,{replace:true})}
function csvCell(value){const s=String(value??'').replaceAll('"','""');return `"${s}"`}
function downloadText(name,text,type){const blob=new Blob(['\ufeff'+text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
function blankPhone(n){return{id:crypto.randomUUID(),code:`BM-${String(n).padStart(6,'0')}`,brand:'',model:'',color:'',storage:'',ram:'',nfc:null,connector:'',screenProtector:null,caseIncluded:null,likeNew:null,biometrics:null,unlockCredentials:[],date:new Date().toISOString().slice(0,10),origin:'',payment:'',bankAccountId:'',paid:0,expected:0,status:'Aguardando análise',tasks:'',notes:'',tags:[],otherCosts:0,expectedSaleDate:'',nextAction:'',nextActionDate:'',mediaLibrary:[],photoTarget:10,priceHistory:[],lastActivityAt:new Date().toISOString(),parts:[],diagnostics:[],timeline:[{id:crypto.randomUUID(),date:new Date().toISOString(),message:'Aparelho cadastrado'}],ad:{}}}
createRoot(document.getElementById('root')).render(<AppErrorBoundary><CloudGate/></AppErrorBoundary>);