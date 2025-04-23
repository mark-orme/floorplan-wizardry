
export interface FloorPlan {
  id: string;
  name: string;
  level: number;
  width: number;
  height: number;
  walls: any[];
  rooms: any[];
  strokes: any[];
  updatedAt: string;
  canvasJson?: string;
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
