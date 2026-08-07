import React from 'react';

export default function PageHeader({eyebrow,title,subtitle,actions}){
  return <header className="v62-page-header">
    <div className="v62-page-heading">
      {eyebrow&&<span className="v62-eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {subtitle&&<p>{subtitle}</p>}
    </div>
    {actions&&<div className="v62-page-actions">{actions}</div>}
  </header>
}
