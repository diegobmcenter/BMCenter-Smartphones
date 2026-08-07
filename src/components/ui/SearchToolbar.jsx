import React from 'react';
import {Search} from 'lucide-react';

export default function SearchToolbar({query,onQueryChange,children,count,placeholder='Buscar'}){
  return <div className="v62-search-toolbar">
    <label className="v62-search-box">
      <Search size={16}/>
      <input value={query} onChange={e=>onQueryChange(e.target.value)} placeholder={placeholder}/>
    </label>
    <div className="v62-search-tools">{children}</div>
    {count!==undefined&&<span className="v62-count">{count}</span>}
  </div>
}
