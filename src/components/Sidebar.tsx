import React from 'react';
import { FURNITURE_DEFS, CATEGORIES } from '../data';

export function Sidebar() {
  const handleDragStart = (e: React.DragEvent, defId: string) => {
    e.dataTransfer.setData('text/plain', defId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">家具列表</div>
      {CATEGORIES.map(cat => (
        <div key={cat}>
          <div className="category-title">{cat}</div>
          {FURNITURE_DEFS.filter(f => f.category === cat).map(def => (
            <div
              key={def.id}
              className="furniture-item"
              draggable
              onDragStart={(e) => handleDragStart(e, def.id)}
            >
              <div className="furniture-icon" style={{ background: def.defaultColor + '33' }}>
                {def.icon}
              </div>
              <div className="furniture-info">
                <div className="furniture-name">{def.name}</div>
                <div className="furniture-size">
                  {def.size.w}m × {def.size.d}m × {def.size.h}m
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
