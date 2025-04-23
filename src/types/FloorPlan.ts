
import { Point } from './core/Point';

export interface FloorPlan {
  id: string;
  name: string;
  level: number;
  label?: string;
  walls: any[];
  rooms: any[];
  strokes: any[];
  updatedAt: string;
}

export type StrokeTypeLiteral = 'line' | 'curve' | 'freehand' | 'rectangle' | 'circle';

export interface Stroke {
  id: string;
  type: StrokeTypeLiteral;
  points: Point[];
  color: string;
  thickness: number;
}

export function createEmptyFloorPlan(): FloorPlan {
  return {
    id: crypto.randomUUID(),
    name: '',
    level: 0,
    walls: [],
    rooms: [],
    strokes: [],
    updatedAt: new Date().toISOString()
  };
}
