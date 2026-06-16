import React, { useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { Scene } from './components/Scene';
import { PropertyPanel } from './components/PropertyPanel';
import { useStore } from './store';

function SaveModal() {
  const [name, setName] = useState('');
  const showSaveModal = useStore(s => s.showSaveModal);
  const setShowSaveModal = useStore(s => s.setShowSaveModal);
  const saveScheme = useStore(s => s.saveScheme);

  if (!showSaveModal) return null;

  const handleSave = () => {
    const schemeName = name.trim() || `方案 ${new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}`;
    saveScheme(schemeName);
    setName('');
  };

  return (
    <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">保存设计方案</div>
        <input
          className="modal-input"
          placeholder="输入方案名称..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          autoFocus
        />
        <div className="modal-actions">
          <button className="modal-cancel" onClick={() => setShowSaveModal(false)}>取消</button>
          <button className="modal-confirm" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
}

function Toast() {
  const toastMsg = useStore(s => s.toastMsg);
  if (!toastMsg) return null;
  return <div className="toast">{toastMsg}</div>;
}

export default function App() {
  return (
    <div className="app-layout">
      <Toolbar />
      <div className="main-area">
        <Sidebar />
        <div className="canvas-container">
          <Scene />
        </div>
        <PropertyPanel />
      </div>
      <SaveModal />
      <Toast />
    </div>
  );
}
