
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
  // Add fields for compatibility
  points?: Point[];
  color?: string;
  type?: string;
}

export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'office' | 'other';

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  // Add fields for compatibility with floorPlanTypes
  startPoint: Point;
  endPoint: Point;
  points?: Point[];
  roomIds?: string[];
  length?: number;
  height?: number;
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
  // Add required fields for compatibility with floorPlanTypes
  canvasData: string | null;
  canvasJson: string | null;
  createdAt: string;
  gia?: number;
  index?: number;
  metadata?: any;
  data: any;
  userId: string;
  canvasState?: any;
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
  backgroundColor: '#ffffff',
  canvasData: null,
  canvasJson: null,
  createdAt: new Date().toISOString(),
  data: {}, // Add required data property
  userId: 'default-user' // Add required userId property
});

export const createWall = (start: Point, end: Point): Wall => ({
  id: crypto.randomUUID(),
  start,
  end,
  thickness: 10,
  color: '#000000',
  // Add required compatibility fields
  startPoint: start,
  endPoint: end
});
