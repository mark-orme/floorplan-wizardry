
/**
 * FloorPlan type definitions
 */

export interface Point {
  x: number;
  y: number;
}

export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'text';

export interface Room {
  id: string;
  name: string;
  vertices: Point[];
  area: number;
  roomType: RoomTypeLiteral;
}

export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'other';

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
}

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  label?: string;
  level: number;
  updatedAt: string;
  strokes: Stroke[];
  walls: Wall[];
  rooms: Room[];
  width: number;
  height: number;
  backgroundColor: string;
}

export const createEmptyFloorPlan = (): FloorPlan => ({
  id: '',
  name: 'New Floor Plan',
  level: 1,
  updatedAt: new Date().toISOString(),
  strokes: [],
  walls: [],
  rooms: [],
  width: 1000,
  height: 800,
  backgroundColor: '#ffffff'
});

export const createWall = (start: Point, end: Point): Wall => ({
  id: crypto.randomUUID(),
  start,
  end,
  thickness: 10,
  color: '#000000'
});
