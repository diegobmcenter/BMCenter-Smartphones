import React from 'react';
import {Bell,ChevronRight,LogOut,Menu,Moon,Sun,X} from 'lucide-react';

export default function AppFrameV102({mobileOpen,setMobileOpen,menuItems,visibleMenus,page,navigate,alerts,version,userEmail,children,onLogout,config,onConfigChange}){
 const theme=config?.themeMode==='light'?'light':'dark';
 const visible=id=>visibleMenus[id]!==false||id==='phones'||id==='settings';
 const current=menuItems.find(x=>x.id===page)||{text:'BMCenter'};
 const groups=[
  {title:'Operação',ids:['dashboard','today','phones','ads','batch','activity']},
  {title:'Gestão',ids:['profileAnalytics','parts','dataQuality','reports']},
  {title:'Dados e sistema',ids:['data','backup','settings']}
 ];
 const toggleTheme=()=>onConfigChange?.({...config,themeMode:theme==='light'?'dark':'light',accent:'v102',applyThemeGlobally:true});
 return <div className={`v102-app theme-${theme}`}>
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
    <div className="v102-top-right"><button className="v102-theme-icon" onClick={toggleTheme} title={theme==='light'?'Ativar tema escuro':'Ativar tema claro'}>{theme==='light'?<Moon size={17}/>:<Sun size={17}/>}</button><button className="v102-bell"><Bell size={16}/>{alerts>0&&<em>{alerts}</em>}</button><span className="v102-version">v{version}</span><span className="v102-avatar">DM</span></div>
   </header>
   <main className="v102-main">{children}</main>
  </section>
  {mobileOpen&&<button className="v102-backdrop" onClick={()=>setMobileOpen(false)}/>} 
 </div>
}
