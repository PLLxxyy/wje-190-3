import React from 'react';
import { useStore } from '../store';
import { ROOM_CONFIGS, STYLE_PRESETS } from '../data';
import type { RoomType, StylePreset } from '../types';

const ROOMS: RoomType[] = ['living', 'bedroom', 'kitchen', 'bathroom'];
const STYLES: StylePreset[] = ['modern', 'nordic', 'chinese'];

export function Toolbar() {
  const currentRoom = useStore(s => s.currentRoom);
  const setCurrentRoom = useStore(s => s.setCurrentRoom);
  const currentStyle = useStore(s => s.currentStyle);
  const setCurrentStyle = useStore(s => s.setCurrentStyle);
  const cameraView = useStore(s => s.cameraView);
  const setCameraView = useStore(s => s.setCameraView);
  const setShowSaveModal = useStore(s => s.setShowSaveModal);

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">3D 家居设计</span>
        <div className="toolbar-rooms">
          {ROOMS.map(r => (
            <button
              key={r}
              className={`room-btn ${currentRoom === r ? 'active' : ''}`}
              onClick={() => setCurrentRoom(r)}
            >
              {ROOM_CONFIGS[r].label}
            </button>
          ))}
        </div>
      </div>
      <div className="toolbar-right">
        <button
          className={`view-btn ${cameraView === 'perspective' ? 'active' : ''}`}
          onClick={() => setCameraView('perspective')}
        >
          平视
        </button>
        <button
          className={`view-btn ${cameraView === 'top' ? 'active' : ''}`}
          onClick={() => setCameraView('top')}
        >
          俯视
        </button>
        <span style={{ width: 1, height: 20, background: '#2a2a4a', margin: '0 4px' }} />
        {STYLES.map(s => (
          <button
            key={s}
            className={`style-btn ${currentStyle === s ? 'active' : ''}`}
            onClick={() => setCurrentStyle(s)}
          >
            {STYLE_PRESETS[s].name}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: '#2a2a4a', margin: '0 4px' }} />
        <button className="save-btn" onClick={() => setShowSaveModal(true)}>
          保存方案
        </button>
      </div>
    </div>
  );
}
