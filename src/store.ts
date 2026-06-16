import { create } from 'zustand';
import type { RoomType, StylePreset, PlacedFurniture, DesignScheme } from './types';
import { STYLE_PRESETS } from './data';

interface AppState {
  // Room
  currentRoom: RoomType;
  setCurrentRoom: (r: RoomType) => void;

  // Style
  currentStyle: StylePreset;
  setCurrentStyle: (s: StylePreset) => void;

  // Camera view
  cameraView: 'perspective' | 'top';
  setCameraView: (v: 'perspective' | 'top') => void;

  // Furniture in each room
  roomFurniture: Record<RoomType, PlacedFurniture[]>;
  addFurniture: (room: RoomType, item: PlacedFurniture) => void;
  updateFurniture: (room: RoomType, instanceId: string, changes: Partial<PlacedFurniture>) => void;
  removeFurniture: (room: RoomType, instanceId: string) => void;

  // Selection
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  // Schemes
  schemes: DesignScheme[];
  activeSchemeId: string | null;
  saveScheme: (name: string) => void;
  loadScheme: (id: string) => void;
  deleteScheme: (id: string) => void;

  // Toast
  toastMsg: string;
  showToast: (msg: string) => void;

  // Modal
  showSaveModal: boolean;
  setShowSaveModal: (v: boolean) => void;
}

function loadSchemes(): DesignScheme[] {
  try {
    const raw = localStorage.getItem('home3d-schemes');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function persistSchemes(schemes: DesignScheme[]) {
  localStorage.setItem('home3d-schemes', JSON.stringify(schemes));
}

export const useStore = create<AppState>((set, get) => ({
  currentRoom: 'living',
  setCurrentRoom: (r) => set({ currentRoom: r, selectedId: null }),

  currentStyle: 'modern',
  setCurrentStyle: (s) => {
    const preset = STYLE_PRESETS[s];
    set((state) => {
      const newRooms = { ...state.roomFurniture };
      for (const roomKey of Object.keys(newRooms) as RoomType[]) {
        newRooms[roomKey] = {
          furniture: newRooms[roomKey].furniture.map(f => ({
            ...f,
            color: preset.furniture[f.defId] || f.color,
          })),
        };
      }
      return { currentStyle: s, roomFurniture: newRooms };
    });
  },

  cameraView: 'perspective',
  setCameraView: (v) => set({ cameraView: v }),

  roomFurniture: {
    living: { furniture: [] },
    bedroom: { furniture: [] },
    kitchen: { furniture: [] },
    bathroom: { furniture: [] },
  },

  addFurniture: (room, item) => set((state) => ({
    roomFurniture: {
      ...state.roomFurniture,
      [room]: { furniture: [...state.roomFurniture[room].furniture, item] },
    },
  })),

  updateFurniture: (room, instanceId, changes) => set((state) => ({
    roomFurniture: {
      ...state.roomFurniture,
      [room]: {
        furniture: state.roomFurniture[room].furniture.map(f =>
          f.instanceId === instanceId ? { ...f, ...changes } : f
        ),
      },
    },
  })),

  removeFurniture: (room, instanceId) => set((state) => ({
    roomFurniture: {
      ...state.roomFurniture,
      [room]: {
        furniture: state.roomFurniture[room].furniture.filter(f => f.instanceId !== instanceId),
      },
    },
    selectedId: state.selectedId === instanceId ? null : state.selectedId,
  })),

  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),

  schemes: loadSchemes(),
  activeSchemeId: null,

  saveScheme: (name) => {
    const state = get();
    const scheme: DesignScheme = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      createdAt: Date.now(),
      rooms: {
        living: { furniture: [...state.roomFurniture.living.furniture] },
        bedroom: { furniture: [...state.roomFurniture.bedroom.furniture] },
        kitchen: { furniture: [...state.roomFurniture.kitchen.furniture] },
        bathroom: { furniture: [...state.roomFurniture.bathroom.furniture] },
      },
    };
    const newSchemes = [...state.schemes, scheme];
    persistSchemes(newSchemes);
    set({ schemes: newSchemes, activeSchemeId: scheme.id, showSaveModal: false });
    get().showToast(`方案「${name}」已保存`);
  },

  loadScheme: (id) => {
    const state = get();
    const scheme = state.schemes.find(s => s.id === id);
    if (!scheme) return;
    set({
      roomFurniture: {
        living: { furniture: [...scheme.rooms.living.furniture] },
        bedroom: { furniture: [...scheme.rooms.bedroom.furniture] },
        kitchen: { furniture: [...scheme.rooms.kitchen.furniture] },
        bathroom: { furniture: [...scheme.rooms.bathroom.furniture] },
      },
      activeSchemeId: id,
      selectedId: null,
    });
    get().showToast(`已加载方案「${scheme.name}」`);
  },

  deleteScheme: (id) => {
    const state = get();
    const newSchemes = state.schemes.filter(s => s.id !== id);
    persistSchemes(newSchemes);
    set({
      schemes: newSchemes,
      activeSchemeId: state.activeSchemeId === id ? null : state.activeSchemeId,
    });
  },

  toastMsg: '',
  showToast: (msg) => {
    set({ toastMsg: '' });
    setTimeout(() => set({ toastMsg: msg }), 10);
    setTimeout(() => set({ toastMsg: '' }), 2200);
  },

  showSaveModal: false,
  setShowSaveModal: (v) => set({ showSaveModal: v }),
}));
