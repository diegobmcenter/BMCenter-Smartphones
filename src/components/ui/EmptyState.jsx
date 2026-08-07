import React from 'react';

export default function EmptyState({icon,title,description}){
  return <div className="v62-empty">
    {icon&&<div className="v62-empty-icon">{icon}</div>}
    <strong>{title}</strong>
    {description&&<span>{description}</span>}
  </div>
}
