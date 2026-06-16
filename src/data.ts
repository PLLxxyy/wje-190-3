import type { FurnitureDef, RoomType, StylePreset, StyleColors } from './types';

export const ROOM_CONFIGS: Record<RoomType, { label: string; size: { w: number; d: number; h: number } }> = {
  living:   { label: '客厅', size: { w: 8, d: 6, h: 3 } },
  bedroom:  { label: '卧室', size: { w: 5, d: 5, h: 3 } },
  kitchen:  { label: '厨房', size: { w: 4, d: 4, h: 3 } },
  bathroom: { label: '卫生间', size: { w: 3, d: 3, h: 3 } },
};

export const FURNITURE_DEFS: FurnitureDef[] = [
  // 沙发
  { id: 'sofa-3seat',  name: '三人沙发', category: '沙发', icon: '🛋️', defaultColor: '#5c6bc0', size: { w: 2.2, h: 0.8, d: 0.9 }, primitive: 'box' },
  { id: 'sofa-1seat',  name: '单人沙发', category: '沙发', icon: '💺', defaultColor: '#5c6bc0', size: { w: 0.9, h: 0.8, d: 0.9 }, primitive: 'box' },
  { id: 'sofa-long',   name: '贵妃椅',   category: '沙发', icon: '🛋️', defaultColor: '#5c6bc0', size: { w: 1.6, h: 0.7, d: 0.7 }, primitive: 'box' },
  // 床
  { id: 'bed-double',  name: '双人床',   category: '床', icon: '🛏️', defaultColor: '#8d6e63', size: { w: 2.0, h: 0.5, d: 1.8 }, primitive: 'box' },
  { id: 'bed-single',  name: '单人床',   category: '床', icon: '🛏️', defaultColor: '#8d6e63', size: { w: 1.2, h: 0.5, d: 2.0 }, primitive: 'box' },
  // 桌子
  { id: 'table-dining', name: '餐桌',   category: '桌子', icon: '🪑', defaultColor: '#a1887f', size: { w: 1.6, h: 0.75, d: 0.9 }, primitive: 'box' },
  { id: 'table-coffee', name: '茶几',   category: '桌子', icon: '☕', defaultColor: '#a1887f', size: { w: 1.2, h: 0.4, d: 0.6 }, primitive: 'box' },
  { id: 'table-desk',   name: '书桌',   category: '桌子', icon: '📝', defaultColor: '#a1887f', size: { w: 1.4, h: 0.75, d: 0.7 }, primitive: 'box' },
  { id: 'table-kitchen', name: '料理台', category: '桌子', icon: '🔪', defaultColor: '#bdbdbd', size: { w: 1.5, h: 0.9, d: 0.6 }, primitive: 'box' },
  // 柜子
  { id: 'cabinet-wardrobe', name: '衣柜', category: '柜子', icon: '🚪', defaultColor: '#795548', size: { w: 1.8, h: 2.0, d: 0.6 }, primitive: 'box' },
  { id: 'cabinet-tv',       name: '电视柜', category: '柜子', icon: '📺', defaultColor: '#795548', size: { w: 2.0, h: 0.5, d: 0.4 }, primitive: 'box' },
  { id: 'cabinet-shelf',    name: '书架',   category: '柜子', icon: '📚', defaultColor: '#795548', size: { w: 1.0, h: 1.8, d: 0.35 }, primitive: 'box' },
  { id: 'cabinet-bathroom', name: '浴室柜', category: '柜子', icon: '🚿', defaultColor: '#e0e0e0', size: { w: 0.8, h: 0.8, d: 0.45 }, primitive: 'box' },
  // 灯具
  { id: 'lamp-floor',   name: '落地灯',   category: '灯具', icon: '💡', defaultColor: '#ffd54f', size: { w: 0.3, h: 1.6, d: 0.3 }, primitive: 'cylinder' },
  { id: 'lamp-table',   name: '台灯',     category: '灯具', icon: '💡', defaultColor: '#ffd54f', size: { w: 0.2, h: 0.5, d: 0.2 }, primitive: 'cylinder' },
  // 电器
  { id: 'tv-screen',    name: '电视',     category: '电器', icon: '📺', defaultColor: '#263238', size: { w: 1.4, h: 0.8, d: 0.05 }, primitive: 'box' },
  { id: 'fridge',       name: '冰箱',     category: '电器', icon: '🧊', defaultColor: '#eceff1', size: { w: 0.7, h: 1.7, d: 0.7 }, primitive: 'box' },
  { id: 'washer',       name: '洗衣机',   category: '电器', icon: '🫧', defaultColor: '#eceff1', size: { w: 0.6, h: 0.85, d: 0.6 }, primitive: 'cylinder' },
  // 其他
  { id: 'plant',        name: '绿植',     category: '其他', icon: '🪴', defaultColor: '#4caf50', size: { w: 0.4, h: 0.8, d: 0.4 }, primitive: 'cylinder' },
  { id: 'rug',          name: '地毯',     category: '其他', icon: '🟫', defaultColor: '#d7ccc8', size: { w: 2.0, h: 0.02, d: 1.5 }, primitive: 'box' },
  { id: 'chair',        name: '餐椅',     category: '其他', icon: '🪑', defaultColor: '#8d6e63', size: { w: 0.45, h: 0.9, d: 0.45 }, primitive: 'box' },
  { id: 'bathtub',      name: '浴缸',     category: '其他', icon: '🛁', defaultColor: '#e0f7fa', size: { w: 1.7, h: 0.6, d: 0.75 }, primitive: 'box' },
];

export const CATEGORIES = [...new Set(FURNITURE_DEFS.map(f => f.category))];

export const COLOR_PALETTE = [
  '#5c6bc0', '#7e57c2', '#e53935', '#fb8c00', '#fdd835',
  '#43a047', '#00acc1', '#8d6e63', '#546e7a', '#ec407a',
  '#263238', '#eceff1', '#d7ccc8', '#a1887f', '#ffd54f',
];

export const STYLE_PRESETS: Record<StylePreset, StyleColors> = {
  modern: {
    name: '现代简约',
    wall: '#f5f5f5',
    floor: '#d7ccc8',
    accent: '#263238',
    furniture: {
      'sofa-3seat': '#455a64', 'sofa-1seat': '#455a64', 'sofa-long': '#455a64',
      'bed-double': '#eceff1', 'bed-single': '#eceff1',
      'table-dining': '#fafafa', 'table-coffee': '#e0e0e0', 'table-desk': '#fafafa',
      'cabinet-wardrobe': '#eceff1', 'cabinet-tv': '#424242', 'cabinet-shelf': '#eceff1',
      'chair': '#9e9e9e', 'rug': '#e0e0e0', 'lamp-floor': '#ffd54f',
    },
  },
  nordic: {
    name: '北欧风格',
    wall: '#faf8f5',
    floor: '#c8b89a',
    accent: '#7ec8e3',
    furniture: {
      'sofa-3seat': '#b0bec5', 'sofa-1seat': '#b0bec5', 'sofa-long': '#b0bec5',
      'bed-double': '#d7ccc8', 'bed-single': '#d7ccc8',
      'table-dining': '#a1887f', 'table-coffee': '#a1887f', 'table-desk': '#a1887f',
      'cabinet-wardrobe': '#d7ccc8', 'cabinet-tv': '#795548', 'cabinet-shelf': '#d7ccc8',
      'chair': '#a1887f', 'rug': '#e8d5c4', 'lamp-floor': '#ffd54f',
    },
  },
  chinese: {
    name: '中式风格',
    wall: '#f5ebe0',
    floor: '#6d4c41',
    accent: '#b71c1c',
    furniture: {
      'sofa-3seat': '#5d4037', 'sofa-1seat': '#5d4037', 'sofa-long': '#5d4037',
      'bed-double': '#4e342e', 'bed-single': '#4e342e',
      'table-dining': '#3e2723', 'table-coffee': '#4e342e', 'table-desk': '#3e2723',
      'cabinet-wardrobe': '#3e2723', 'cabinet-tv': '#4e342e', 'cabinet-shelf': '#3e2723',
      'chair': '#4e342e', 'rug': '#d4a574', 'lamp-floor': '#ff8f00',
    },
  },
};

export function getFurnitureDef(defId: string): FurnitureDef | undefined {
  return FURNITURE_DEFS.find(f => f.id === defId);
}
