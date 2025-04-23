
export interface FloorPlan {
  id: string;
  name: string;
  level: number;
  walls: any[];
  rooms: any[];
  strokes: any[];
  updatedAt: string;
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
