
export interface FloorPlan {
  id: string;
  name: string;
  level: number;
  width: number;
  height: number;
  label?: string;
  walls: any[];
  rooms: any[];
  strokes: any[];
  updatedAt: string;
  canvasJson?: string;
}

// For drawing hooks/tests
export type Point = { x: number; y: number };
export type StrokeTypeLiteral = 'line' | 'arc' | 'rectangle' | 'curve' | 'freehand' | 'circle';
export interface Stroke {
  id: string;
  type: StrokeTypeLiteral;
  points: Point[];
  color: string;
  thickness: number;
  width: number;
}

export function createEmptyFloorPlan(): FloorPlan {
  return {
    id: crypto.randomUUID(),
    name: '',
    level: 0,
    width: 800,
    height: 600,
    walls: [],
    rooms: [],
    strokes: [],
    updatedAt: new Date().toISOString()
  };
}
