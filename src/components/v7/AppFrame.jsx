import React from 'react';
import {Bell,ChevronRight,Menu,Search,X} from 'lucide-react';

export default function AppFrame({
  mobileOpen,setMobileOpen,menuItems,visibleMenus,page,navigate,
  alerts,version,userEmail,children,onLogout
}){
  const visible=id=>visibleMenus[id]!==false;
  const current=menuItems.find(x=>x.id===page)||menuItems[0];

  const mainIds=['dashboard','today','phones','ads','batch','activity'];
  const businessIds=['suppliers','banks','profiles','parts','quality','reports'];
  const systemIds=['backup','settings'];

  const navGroup=(title,ids)=><div className="v7-nav-group">
    <span>{title}</span>
    {ids.map(id=>{
      const item=menuItems.find(x=>x.id===id);
      if(!item||!visible(id)) return null;
      return <button key={id} className={page===id?'active':''} onClick={()=>navigate(id)}>
        <i>{item.icon}</i><b>{item.text}</b>
        {id==='today'&&alerts>0&&<em>{alerts}</em>}
      </button>
    })}
  </div>;

  return <div className="v7-app">
    <aside className={`v7-sidebar ${mobileOpen?'open':''}`}>
      <div className="v7-brand">
        <div className="v7-logo"><i/><i/><i/></div>
        <div><strong>BM<span>CENTER</span></strong><small>SMARTPHONES</small></div>
        <button className="v7-mobile-close" onClick={()=>setMobileOpen(false)}><X size={17}/></button>
      </div>

      <div className="v7-quick-search"><Search size={14}/><span>Pesquisar</span><kbd>Ctrl K</kbd></div>

      <nav>
        {navGroup('VISÃO GERAL',mainIds)}
        {navGroup('NEGÓCIO',businessIds)}
        {navGroup('SISTEMA',systemIds)}
      </nav>

      <div className="v7-user-card">
        <div className="v7-avatar">DM</div>
        <div><b>Diego Moraes</b><span>{userEmail||'Administrador'}</span></div>
        <button onClick={onLogout}>↗</button>
      </div>
    </aside>

    <div className="v7-workspace">
      <header className="v7-topbar">
        <div className="v7-top-left">
          <button className="v7-menu-btn" onClick={()=>setMobileOpen(v=>!v)}><Menu size={17}/></button>
          <div className="v7-breadcrumb">
            <span>BMCenter</span><ChevronRight size={12}/><b>{current?.text||'Dashboard'}</b>
          </div>
        </div>
        <div className="v7-top-actions">
          <button className="v7-icon-btn"><Bell size={15}/>{alerts>0&&<em>{alerts}</em>}</button>
          <span className="v7-version">v{version}</span>
          <div className="v7-top-avatar">DM<i/></div>
        </div>
      </header>

      <main className="v7-content">{children}</main>
    </div>

    {mobileOpen&&<button className="v7-overlay" onClick={()=>setMobileOpen(false)}/>}
  </div>
}
