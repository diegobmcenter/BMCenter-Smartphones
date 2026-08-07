import React from 'react';
import {
  Bell,ChevronRight,Command,LogOut,Menu,Moon,Search,Sun,X
} from 'lucide-react';

export default function AppFrameV9({
  mobileOpen,setMobileOpen,menuItems,visibleMenus,page,navigate,
  alerts,version,userEmail,children,onLogout,config,onConfigChange
}){
  const visible=id=>visibleMenus[id]!==false || id==='phones' || id==='settings';
  const current=menuItems.find(x=>x.id===page)||{text:'BMCenter'};
  const theme=config?.themeMode==='light'?'light':'dark';

  const groups=[
    {label:'Trabalho',ids:['dashboard','today','phones','ads','batch','activity']},
    {label:'Negócio',ids:['suppliers','banks','profileAnalytics','parts','dataQuality','reports']},
    {label:'Sistema',ids:['data','backup','settings']}
  ];

  const setTheme=next=>onConfigChange?.({...config,themeMode:next,accent:'v9',applyThemeGlobally:true});

  return <div className={`v9-app theme-${theme}`}>
    <aside className={`v9-sidebar ${mobileOpen?'open':''}`}>
      <div className="v9-brand-row">
        <button className="v9-brand" onClick={()=>navigate('dashboard')}>
          <span className="v9-brand-mark"><i/><i/><i/></span>
          <span><b>BMCenter</b><small>Smartphones</small></span>
        </button>
        <button className="v9-sidebar-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button>
      </div>

      <button className="v9-side-search">
        <Search size={16}/><span>Pesquisar</span><kbd>⌘ K</kbd>
      </button>

      <nav className="v9-nav">
        {groups.map(group=><section key={group.label}>
          <span className="v9-nav-label">{group.label}</span>
          {group.ids.map(id=>{
            const item=menuItems.find(x=>x.id===id);
            if(!item||!visible(id))return null;
            return <button key={id} className={page===id?'active':''} onClick={()=>navigate(id)}>
              <i>{item.icon}</i>
              <span>{item.text}</span>
              {id==='today'&&alerts>0&&<em>{alerts}</em>}
              {page===id&&<ChevronRight className="v9-active-arrow" size={14}/>}
            </button>
          })}
        </section>)}
      </nav>

      <div className="v9-sidebar-bottom">
        <div className="v9-theme-switch" aria-label="Tema">
          <button className={theme==='light'?'active':''} onClick={()=>setTheme('light')} title="Tema claro"><Sun size={15}/><span>Claro</span></button>
          <button className={theme==='dark'?'active':''} onClick={()=>setTheme('dark')} title="Tema escuro"><Moon size={15}/><span>Escuro</span></button>
        </div>
        <div className="v9-user">
          <span className="v9-avatar">DM</span>
          <div><b>Diego Moraes</b><small>{userEmail||'Administrador'}</small></div>
          <button onClick={onLogout} title="Sair"><LogOut size={15}/></button>
        </div>
      </div>
    </aside>

    <section className="v9-stage">
      <header className="v9-topbar">
        <div className="v9-topbar-left">
          <button className="v9-menu" onClick={()=>setMobileOpen(v=>!v)}><Menu size={19}/></button>
          <div className="v9-breadcrumb"><span>BMCenter</span><ChevronRight size={13}/><b>{current.text}</b></div>
        </div>
        <button className="v9-command-search"><Search size={16}/><span>Buscar aparelho, anúncio ou ação...</span><kbd><Command size={12}/> K</kbd></button>
        <div className="v9-topbar-right">
          <button className="v9-bell"><Bell size={17}/>{alerts>0&&<em>{alerts}</em>}</button>
          <span className="v9-version">v{version}</span>
          <span className="v9-mini-avatar">DM</span>
        </div>
      </header>
      <main className="v9-main">{children}</main>
    </section>

    {mobileOpen&&<button className="v9-backdrop" onClick={()=>setMobileOpen(false)}/>}
  </div>
}
