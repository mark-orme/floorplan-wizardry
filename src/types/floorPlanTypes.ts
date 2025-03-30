
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
 * Paper size enum
 */
export enum PaperSize {
  A3 = "A3",
  A4 = "A4",
  A5 = "A5",
  Letter = "Letter",
  Legal = "Legal",
  Tabloid = "Tabloid",
  Custom = "Custom"
}

/**
 * Stroke type enum
 */
export enum StrokeType {
  LINE = "line",
  POLYLINE = "polyline",
  WALL = "wall",
  ROOM = "room",
  FREEHAND = "freehand"
}

/**
 * Stroke type literals for compatibility
 */
export type StrokeTypeLiteral = "line" | "polyline" | "wall" | "room" | "freehand";

/**
 * Room type literal that matches core/FloorPlan.RoomType
 */
export type RoomTypeLiteral = "living" | "bedroom" | "kitchen" | "bathroom" | "office" | "other";

/**
 * Wall object in a floor plan
 */
export interface Wall {
  id: string;
  points: { x: number; y: number }[];
  startPoint: { x: number; y: number }; // Required for compatibility
  endPoint: { x: number; y: number }; // Required for compatibility
  start: { x: number; y: number }; // Required for compatibility with core/FloorPlan.Wall
  end: { x: number; y: number }; // Required for compatibility with core/FloorPlan.Wall
  thickness: number; // Changed from optional to required
  length?: number;
  height?: number;
  color: string; // Required for compatibility with core/FloorPlan.Wall
  roomIds?: string[];
  [key: string]: any; // Additional wall properties
}

/**
 * Room object in a floor plan
 */
export interface Room {
  id: string;
  name: string; // Changed from optional to required for compatibility with core/FloorPlan.Room
  type?: RoomTypeLiteral; // Changed from string to RoomTypeLiteral for compatibility
  points: { x: number; y: number }[];
  area?: number;
  color?: string;
  level?: number;
  [key: string]: any; // Additional room properties
}

/**
 * Stroke (drawn path) in a floor plan
 */
export interface Stroke {
  id: string;
  points: { x: number; y: number }[];
  type?: StrokeTypeLiteral;
  color?: string;
  thickness?: number;
  width?: number;
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
  canvasJson: any | null; // Required field
  createdAt: string;
  updatedAt: string;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
  paperSize?: string | PaperSize; // Optional property
  objects?: any[]; // Optional for some implementations
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
    canvasJson: null, // Include required field
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
