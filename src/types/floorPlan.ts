
/**
 * FloorPlan type definitions
 */

export interface Point {
  x: number;
  y: number;
}

export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'text';

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number; // Add this property
  width: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  level: number; // Add this property
  updatedAt: string; // Add this property
  strokes: Stroke[];
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
  width: 1000,
  height: 800,
  backgroundColor: '#ffffff'
});
