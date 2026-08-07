import React from 'react';
import {Bell,ChevronRight,LogOut,Menu,Moon,Search,Sun,X} from 'lucide-react';

export default function AppFrameV10({
  mobileOpen,setMobileOpen,menuItems,visibleMenus,page,navigate,
  alerts,version,userEmail,children,onLogout,config,onConfigChange
}){
  const theme=config?.themeMode==='light'?'light':'dark';
  const visible=id=>visibleMenus[id]!==false||id==='phones'||id==='settings';
  const current=menuItems.find(x=>x.id===page)||{text:'BMCenter'};
  const groups=[
    {title:'Operação',ids:['dashboard','today','phones','ads','batch','activity']},
    {title:'Gestão',ids:['suppliers','banks','profileAnalytics','parts','dataQuality','reports']},
    {title:'Dados e sistema',ids:['data','backup','settings']}
  ];
  const setTheme=next=>onConfigChange?.({...config,themeMode:next,accent:'v10',applyThemeGlobally:true});

  return <div className={`v10-app theme-${theme}`}>
    <aside className={`v10-sidebar ${mobileOpen?'open':''}`}>
      <div className="v10-brand-row">
        <button className="v10-brand" onClick={()=>navigate('dashboard')}>
          <span className="v10-mark"><i/><i/><i/></span>
          <span><b>BMCenter</b><small>SMARTPHONES</small></span>
        </button>
        <button className="v10-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button>
      </div>

      <button className="v10-search-shortcut"><Search size={16}/><span>Pesquisar</span><kbd>Ctrl K</kbd></button>

      <nav className="v10-navigation">
        {groups.map(group=><section key={group.title}>
          <small>{group.title}</small>
          {group.ids.map(id=>{
            const item=menuItems.find(x=>x.id===id);
            if(!item||!visible(id))return null;
            const active=page===id;
            return <button key={id} className={active?'active':''} onClick={()=>navigate(id)}>
              <i>{item.icon}</i><span>{item.text}</span>
              {id==='today'&&alerts>0&&<em>{alerts}</em>}
              {active&&<ChevronRight size={14}/>}
            </button>
          })}
        </section>)}
      </nav>

      <div className="v10-sidebar-footer">
        <div className="v10-theme-switch">
          <button className={theme==='light'?'active':''} onClick={()=>setTheme('light')}><Sun size={15}/> Claro</button>
          <button className={theme==='dark'?'active':''} onClick={()=>setTheme('dark')}><Moon size={15}/> Escuro</button>
        </div>
        <div className="v10-user">
          <span>DM</span>
          <div><b>Diego Moraes</b><small>{userEmail||'Administrador'}</small></div>
          <button onClick={onLogout}><LogOut size={15}/></button>
        </div>
      </div>
    </aside>

    <section className="v10-stage">
      <header className="v10-topbar">
        <div className="v10-top-left">
          <button className="v10-mobile-menu" onClick={()=>setMobileOpen(v=>!v)}><Menu size={19}/></button>
          <div className="v10-crumb"><span>BMCenter</span><ChevronRight size={12}/><b>{current.text}</b></div>
        </div>
        <button className="v10-global-search"><Search size={16}/><span>Pesquisar no BMCenter</span><kbd>Ctrl K</kbd></button>
        <div className="v10-top-right">
          <button className="v10-bell"><Bell size={16}/>{alerts>0&&<em>{alerts}</em>}</button>
          <span className="v10-version">v{version}</span>
          <span className="v10-avatar">DM</span>
        </div>
      </header>
      <main className="v10-main">{children}</main>
    </section>

    {mobileOpen&&<button className="v10-backdrop" onClick={()=>setMobileOpen(false)}/>}
  </div>
}
