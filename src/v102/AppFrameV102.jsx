import React from 'react';
import {Bell,BookOpen,ChevronRight,LogOut,Menu,Moon,SlidersHorizontal,Sun,X} from 'lucide-react';

export default function AppFrameV102({mobileOpen,setMobileOpen,menuItems,visibleMenus,page,navigate,alerts,version,userEmail,children,onLogout,config,onConfigChange}){
 const theme=config?.themeMode==='light'?'light':'dark';
 const [comfortOpen,setComfortOpen]=React.useState(false);
 const brightness=Math.min(100,Math.max(65,Number(config?.brightness??100)));
 const readingMode=!!config?.readingMode;
 const dimOpacity=((100-brightness)/100)*0.62;
 const visible=id=>visibleMenus[id]!==false||id==='phones'||id==='settings';
 const current=menuItems.find(x=>x.id===page)||{text:'BMCenter'};
 const groups=[
  {title:'Operação',ids:['dashboard','today','phones','ads','batch','activity']},
  {title:'Gestão',ids:['profileAnalytics','parts','dataQuality','reports']},
  {title:'Dados e sistema',ids:['data','backup','settings']}
 ];
 const toggleTheme=()=>onConfigChange?.({...config,themeMode:theme==='light'?'dark':'light',accent:'v102',applyThemeGlobally:true});
 return <div className={`v102-app theme-${theme} ${readingMode?'reading-mode':''}`} style={{'--v102-dim':dimOpacity}}>
  <aside className={`v102-sidebar ${mobileOpen?'open':''}`}>
   <div className="v102-brand-row">
    <button className="v102-brand" onClick={()=>navigate('dashboard')}><span className="v102-mark"><i/><i/><i/></span><span><b>BMCenter</b><small>SMARTPHONES</small></span></button>
    <button className="v102-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button>
   </div>
   <nav className="v102-navigation">
    {groups.map(group=><section key={group.title}><small>{group.title}</small>{group.ids.map(id=>{const item=menuItems.find(x=>x.id===id);if(!item||!visible(id))return null;const active=page===id;return <button key={id} className={active?'active':''} onClick={()=>navigate(id)}><i>{item.icon}</i><span>{item.text}</span>{id==='today'&&alerts>0&&<em>{alerts}</em>}{active&&<ChevronRight size={14}/>}</button>})}</section>)}
   </nav>
   <div className="v102-user"><span>DM</span><div><b>Diego Moraes</b><small>{userEmail||'Administrador'}</small></div><button onClick={onLogout}><LogOut size={15}/></button></div>
  </aside>
  <section className="v102-stage">
   <header className="v102-topbar">
    <div className="v102-top-left"><button className="v102-mobile-menu" onClick={()=>setMobileOpen(v=>!v)}><Menu size={19}/></button><div className="v102-crumb"><span>BMCenter</span><ChevronRight size={12}/><b>{current.text}</b></div></div>
    <button className="v102-global-search" onClick={()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'k',ctrlKey:true}))}>Pesquisar no BMCenter <kbd>Ctrl K</kbd></button>
    <div className="v102-top-right"><button className="v102-theme-icon" onClick={toggleTheme} title={theme==='light'?'Ativar tema escuro':'Ativar tema claro'}>{theme==='light'?<Moon size={17}/>:<Sun size={17}/>}</button><div className="v102-comfort-anchor"><button className={`v102-comfort-button ${readingMode||brightness<100?'active':''}`} onClick={()=>setComfortOpen(v=>!v)} title="Conforto visual"><SlidersHorizontal size={16}/></button>{comfortOpen&&<div className="v102-comfort-popover"><header><div><b>Conforto visual</b><small>Ideal para trabalhar à noite</small></div><button onClick={()=>setComfortOpen(false)}><X size={14}/></button></header><label><span>Brilho <b>{brightness}%</b></span><input type="range" min="65" max="100" step="5" value={brightness} onChange={e=>onConfigChange?.({...config,brightness:Number(e.target.value)})}/></label><button className={`v102-reading-toggle ${readingMode?'active':''}`} onClick={()=>onConfigChange?.({...config,readingMode:!readingMode})}><BookOpen size={15}/><span><b>Modo leitura</b><small>{readingMode?'Ativado · luz mais confortável':'Reduz o cansaço visual no escuro'}</small></span><i>{readingMode?'ON':'OFF'}</i></button><button className="v102-comfort-reset" onClick={()=>onConfigChange?.({...config,brightness:100,readingMode:false})}>Restaurar conforto padrão</button></div>}</div><button className="v102-bell"><Bell size={16}/>{alerts>0&&<em>{alerts}</em>}</button><span className="v102-version">v{version}</span><span className="v102-avatar">DM</span></div>
   </header>
   <main className="v102-main">{children}</main>
  </section>
  {mobileOpen&&<button className="v102-backdrop" onClick={()=>setMobileOpen(false)}/>}
  <div className="v102-reading-warmth"/><div className="v102-screen-dimmer"/>
 </div>
}
