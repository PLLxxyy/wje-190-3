import React from 'react';
import { FURNITURE_DEFS, CATEGORIES, ROOM_PRESETS, ROOM_CONFIGS } from '../data';
import { useStore } from '../store';

export function Sidebar() {
  const currentRoom = useStore(s => s.currentRoom);
  const applyPreset = useStore(s => s.applyPreset);
  const clearRoomFurniture = useStore(s => s.clearRoomFurniture);
  const showToast = useStore(s => s.showToast);
  const presets = ROOM_PRESETS[currentRoom] || [];
  const roomLabel = ROOM_CONFIGS[currentRoom].label;

  const handleDragStart = (e: React.DragEvent, defId: string) => {
    e.dataTransfer.setData('text/plain', defId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleApplyPreset = (preset: typeof presets[0]) => {
    applyPreset(currentRoom, preset.furniture, true);
    showToast(`已应用「${preset.name}」方案到${roomLabel}`);
  };

  const handleClearRoom = () => {
    clearRoomFurniture(currentRoom);
    showToast(`${roomLabel}已清空`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">家具列表</div>

      <div className="presets-section">
        <div className="category-title">
          <span>{roomLabel}快捷方案</span>
          <button className="clear-btn" onClick={handleClearRoom} title="清空当前房间">
            清空
          </button>
        </div>
        <div className="presets-grid">
          {presets.map(preset => (
            <div
              key={preset.id}
              className="preset-card"
              onClick={() => handleApplyPreset(preset)}
              title={preset.description}
            >
              <div className="preset-thumbnail">{preset.thumbnail}</div>
              <div className="preset-info">
                <div className="preset-name">{preset.name}</div>
                <div className="preset-desc">{preset.description}</div>
                <div className="preset-count">{preset.furniture.length} 件家具</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

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
