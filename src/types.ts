export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bathroom';

export type StylePreset = 'modern' | 'nordic' | 'chinese';

export type MaterialType = 'wood' | 'metal' | 'fabric' | 'marble' | 'plastic';

export interface FurnitureDef {
  id: string;
  name: string;
  category: string;
  icon: string;
  defaultColor: string;
  size: { w: number; h: number; d: number };
  primitive: 'box' | 'cylinder';
  /** Extra parts for more complex shapes */
  parts?: FurniturePart[];
}

export interface FurniturePart {
  type: 'box' | 'cylinder';
  offset: [number, number, number];
  size: [number, number, number];
  color?: string; // if omitted, use parent color
}

export interface PlacedFurniture {
  instanceId: string;
  defId: string;
  position: [number, number, number];
  rotation: number; // degrees around Y
  color: string;
  material: MaterialType;
}

export interface RoomData {
  type: RoomType;
  size: { w: number; d: number; h: number };
  wallColor: string;
  floorColor: string;
}

export interface DesignScheme {
  id: string;
  name: string;
  createdAt: number;
  rooms: Record<RoomType, {
    furniture: PlacedFurniture[];
  }>;
}

export interface StyleColors {
  name: string;
  wall: string;
  floor: string;
  accent: string;
  furniture: Record<string, string>;
}
