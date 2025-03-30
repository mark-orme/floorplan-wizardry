
/**
 * Types related to floor plans
 * @module types/floorPlanTypes
 */

/**
 * Floor plan metadata
 */
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: string;
  level: number;
  [key: string]: any; // Additional metadata properties
}

/**
 * Wall object in a floor plan
 */
export interface Wall {
  id: string;
  points: { x: number; y: number }[];
  thickness?: number;
  length?: number;
  [key: string]: any; // Additional wall properties
}

/**
 * Room object in a floor plan
 */
export interface Room {
  id: string;
  name?: string;
  points: { x: number; y: number }[];
  area?: number;
  [key: string]: any; // Additional room properties
}

/**
 * Stroke (drawn path) in a floor plan
 */
export interface Stroke {
  id: string;
  points: { x: number; y: number }[];
  color?: string;
  thickness?: number;
  [key: string]: any; // Additional stroke properties
}

/**
 * Floor plan object
 */
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  gia: number;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  canvasData: any | null;
  canvasJson: any | null;
  createdAt: string;
  updatedAt: string;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
}

/**
 * Create a default floor plan
 * @param {number} index Floor index
 * @returns {FloorPlan} Default floor plan
 */
export const createDefaultFloorPlan = (index: number = 0): FloorPlan => {
  const now = new Date().toISOString();
  const name = `Floor ${index + 1}`;
  
  return {
    id: `floor-${Date.now()}-${index}`,
    name,
    label: name,
    gia: 0,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    level: index,
    index,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: index
    }
  };
};

/**
 * Calculate GIA (Gross Internal Area) for a floor plan
 * @param {FloorPlan} floorPlan Floor plan to calculate GIA for
 * @returns {number} Calculated GIA
 */
export const calculateFloorPlanGIA = (floorPlan: FloorPlan): number => {
  // Simple implementation - in a real app, this would calculate
  // the sum of all room areas or use a more complex algorithm
  return floorPlan.rooms.reduce((total, room) => total + (room.area || 0), 0);
};
