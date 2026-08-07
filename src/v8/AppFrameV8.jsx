import React from 'react';
import {Bell,Menu,Search,X} from 'lucide-react';

export default function AppFrameV8({
  mobileOpen,setMobileOpen,menuItems,visibleMenus,page,navigate,
  alerts,version,userEmail,children,onLogout,config
}){
  const visible=id=>visibleMenus[id]!==false;
  const ordered=['dashboard','today','phones','ads','batch','activity','suppliers','banks','profileAnalytics','parts','dataQuality','reports','data','backup','settings'];
  const entries=ordered.map(id=>menuItems.find(x=>x.id===id)).filter(Boolean).filter(x=>visible(x.id)||x.id==='phones'||x.id==='settings');
  const current=menuItems.find(x=>x.id===page)||{text:'BMCenter'};
  const light=config?.themeMode==='light';
  const themeStyle={
    '--8-bg': light ? '#f3f6fa' : (config?.surfaceColor||'#0b0d10'),
    '--8-bg-soft': light ? '#ffffff' : (config?.panelColor||'#0f1216'),
    '--8-surface': light ? '#ffffff' : (config?.panelColor||'#14181e'),
    '--8-surface2': light ? '#f7f9fc' : (config?.cardColor||'#191e26'),
    '--8-surface3': light ? '#eef2f7' : (config?.cardColor||'#202732'),
    '--8-line': config?.borderColor|| (light?'#dce3eb':'rgba(255,255,255,.075)'),
    '--8-line2': config?.borderColor|| (light?'#cbd5e1':'rgba(255,255,255,.12)'),
    '--8-text': light ? '#172033' : (config?.textColor||'#f4f6f8'),
    '--8-muted': light ? '#667085' : (config?.mutedTextColor||'#8993a1'),
    '--8-faint': light ? '#98a2b3' : (config?.mutedTextColor||'#5f6977'),
    '--8-accent': config?.primaryColor||'#7c8cff',
    '--8-cyan': config?.highlightColor||'#31c5d9',
    '--8-green': config?.highlightColor||'#55d68f',
    '--8-violet': config?.secondaryColor||'#a785ff',
    '--app-primary': config?.primaryColor||'#7c8cff',
    '--app-secondary': config?.secondaryColor||'#5c67d9',
    '--app-highlight': config?.highlightColor||'#31c5d9',
    '--app-surface': light ? '#f3f6fa' : (config?.surfaceColor||'#0b0d10'),
    '--app-panel': light ? '#ffffff' : (config?.panelColor||'#14181e'),
    '--app-card': light ? '#f7f9fc' : (config?.cardColor||'#191e26'),
    '--app-border': config?.borderColor|| (light?'#dce3eb':'#2a3344'),
    '--app-text': light ? '#172033' : (config?.textColor||'#f4f6f8'),
    '--app-muted': light ? '#667085' : (config?.mutedTextColor||'#8993a1'),
    '--app-radius': `${config?.borderRadius??12}px`,
    '--v8-radius': `${config?.borderRadius??12}px`,
  };
  const densityClass=`density-${config?.density||'comfortable'}`;
  const transitionClass=config?.themeTransitions===false?'no-theme-transition':'theme-transition';

  return <div className={`v8-shell ${light?'v8-light':'v8-dark'} ${densityClass} ${transitionClass}`} style={themeStyle}>
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
