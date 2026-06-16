import React from 'react';
import { useStore } from '../store';
import { getFurnitureDef, COLOR_PALETTE } from '../data';
import type { MaterialType } from '../types';

const MATERIALS: { key: MaterialType; label: string }[] = [
  { key: 'wood', label: '木质' },
  { key: 'metal', label: '金属' },
  { key: 'fabric', label: '布艺' },
  { key: 'marble', label: '大理石' },
  { key: 'plastic', label: '塑料' },
];

export function PropertyPanel() {
  const selectedId = useStore(s => s.selectedId);
  const currentRoom = useStore(s => s.currentRoom);
  const roomFurniture = useStore(s => s.roomFurniture);
  const updateFurniture = useStore(s => s.updateFurniture);
  const removeFurniture = useStore(s => s.removeFurniture);
  const schemes = useStore(s => s.schemes);
  const activeSchemeId = useStore(s => s.activeSchemeId);
  const loadScheme = useStore(s => s.loadScheme);
  const deleteScheme = useStore(s => s.deleteScheme);

  const furniture = roomFurniture[currentRoom]?.furniture || [];
  const selected = furniture.find(f => f.instanceId === selectedId);
  const def = selected ? getFurnitureDef(selected.defId) : undefined;

  return (
    <div className="property-panel">
      <div className="panel-header">属性面板</div>

      {/* Selected furniture properties */}
      {selected && def ? (
        <>
          <div className="panel-section">
            <div className="panel-section-title">基本信息</div>
            <div className="prop-row">
              <span className="prop-label">名称</span>
              <span className="prop-value">{def.name}</span>
            </div>
            <div className="prop-row">
              <span className="prop-label">尺寸</span>
              <span className="prop-value">{def.size.w} × {def.size.d} × {def.size.h} m</span>
            </div>
            <div className="prop-row">
              <span className="prop-label">材质</span>
              <span className="prop-value">{MATERIALS.find(m => m.key === selected.material)?.label || '木质'}</span>
            </div>
            <div className="prop-row">
              <span className="prop-label">位置</span>
              <span className="prop-value">
                ({selected.position[0].toFixed(1)}, {selected.position[2].toFixed(1)})
              </span>
            </div>
            <div className="prop-row">
              <span className="prop-label">旋转</span>
              <span className="prop-value">{selected.rotation}°</span>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">颜色方案</div>
            <div className="color-grid">
              {COLOR_PALETTE.map(color => (
                <div
                  key={color}
                  className={`color-swatch ${selected.color === color ? 'active' : ''}`}
                  style={{ background: color }}
                  onClick={() => updateFurniture(currentRoom, selectedId!, { color })}
                />
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">材质</div>
            <div className="material-grid">
              {MATERIALS.map(m => (
                <button
                  key={m.key}
                  className={`material-btn ${selected.material === m.key ? 'active' : ''}`}
                  onClick={() => updateFurniture(currentRoom, selectedId!, { material: m.key })}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">旋转</div>
            <div className="rotate-control">
              <button
                className="rotate-btn"
                onClick={() => updateFurniture(currentRoom, selectedId!, {
                  rotation: (selected.rotation - 15 + 360) % 360,
                })}
              >
                ↺
              </button>
              <span className="prop-value" style={{ flex: 1, textAlign: 'center' }}>
                {selected.rotation}°
              </span>
              <button
                className="rotate-btn"
                onClick={() => updateFurniture(currentRoom, selectedId!, {
                  rotation: (selected.rotation + 15) % 360,
                })}
              >
                ↻
              </button>
            </div>
          </div>

          <div className="panel-section">
            <button
              className="delete-btn"
              onClick={() => removeFurniture(currentRoom, selectedId!)}
            >
              删除家具
            </button>
          </div>
        </>
      ) : (
        <div className="empty-hint">
          从左侧拖拽家具到场景中<br />
          点击选中家具查看属性<br />
          拖动调整位置，旋转按钮调整角度
        </div>
      )}

      {/* Schemes */}
      <div className="panel-section" style={{ borderTop: '1px solid #2a2a4a' }}>
        <div className="panel-section-title">保存的方案</div>
        <div className="scheme-list">
          {schemes.length === 0 && (
            <div className="empty-hint" style={{ padding: '8px 0' }}>
              暂无保存的方案
            </div>
          )}
          {schemes.map(scheme => (
            <div
              key={scheme.id}
              className={`scheme-item ${activeSchemeId === scheme.id ? 'active' : ''}`}
              onClick={() => loadScheme(scheme.id)}
            >
              <span className="scheme-name">{scheme.name}</span>
              <button
                className="scheme-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteScheme(scheme.id);
                }}
                title="删除方案"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
