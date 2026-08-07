import React from 'react';
import {Bell,Menu,Search,X} from 'lucide-react';

export default function AppFrameV8({
  mobileOpen,setMobileOpen,menuItems,visibleMenus,page,navigate,
  alerts,version,userEmail,children,onLogout
}){
  const visible=id=>visibleMenus[id]!==false;
  const ordered=['dashboard','today','phones','ads','batch','activity','suppliers','banks','profileAnalytics','parts','dataQuality','reports','data','backup','settings'];
  const entries=ordered.map(id=>menuItems.find(x=>x.id===id)).filter(Boolean).filter(x=>visible(x.id)||x.id==='phones'||x.id==='settings');
  const current=menuItems.find(x=>x.id===page)||{text:'BMCenter'};

  return <div className="v8-shell">
    <aside className={`v8-rail ${mobileOpen?'open':''}`}>
      <button className="v8-brand-button" onClick={()=>navigate('dashboard')} title="BMCenter">
        <span className="v8-brand-glyph"><i/><i/><i/></span>
        <b>BM</b>
      </button>

      <nav className="v8-rail-nav">
        {entries.map(item=><button
          key={item.id}
          className={page===item.id?'active':''}
          onClick={()=>navigate(item.id)}
          title={item.text}
        >
          <span>{item.icon}</span>
          <small>{item.text.replace('Contas bancárias','Contas').replace('Peças e acessórios','Peças').replace('Qualidade dos dados','Qualidade').replace('Ações em lote','Lote')}</small>
          {item.id==='today'&&alerts>0&&<em>{alerts}</em>}
        </button>)}
      </nav>

      <div className="v8-rail-user">
        <button title={userEmail||'Conta'}><span>DM</span></button>
      </div>
      <button className="v8-mobile-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button>
    </aside>

    <section className="v8-stage">
      <header className="v8-commandbar">
        <div className="v8-command-left">
          <button className="v8-mobile-menu" onClick={()=>setMobileOpen(v=>!v)}><Menu size={18}/></button>
          <div className="v8-current"><small>BMCenter</small><b>{current.text}</b></div>
        </div>

        <button className="v8-global-search"><Search size={15}/><span>Pesquisar no BMCenter</span><kbd>Ctrl K</kbd></button>

        <div className="v8-command-right">
          <button className="v8-bell"><Bell size={16}/>{alerts>0&&<em>{alerts}</em>}</button>
          <span className="v8-version">v{version}</span>
          <button className="v8-account" onClick={onLogout} title="Sair"><span>DM</span><i/></button>
        </div>
      </header>

      <main className="v8-main">{children}</main>
    </section>

    {mobileOpen&&<button className="v8-backdrop" onClick={()=>setMobileOpen(false)}/>}
  </div>
}
