
/**
 * Floor plan type definitions
 * @module types/floorPlanTypes
 */
import { Point } from './geometryTypes';

// Re-export Point type
export type { Point };

/**
 * Stroke data for drawing paths
 */
export interface Stroke {
  id: string;
  points: Point[];
  type: string;
  color: string;
  thickness: number;
}

/**
 * Wall object in floor plan
 */
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  connected?: boolean;
  roomId?: string;
}

/**
 * Room object in floor plan
 */
export interface Room {
  id: string;
  points: Point[];
  name: string;
  area: number;
  color: string;
}

/**
 * Paper size options
 */
export type PaperSize = 'A4' | 'A3' | 'A2' | 'A1' | 'A0' | 'Letter' | 'Legal' | 'Tabloid' | 'infinite';

/**
 * Floor plan data
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  /** Floor plan name */
  name: string;
  /** Display label */
  label: string;
  /** Gross internal area */
  gia: number;
  /** Floor level */
  level?: number;
  /** Wall objects */
  walls: Wall[];
  /** Room objects */
  rooms: Room[];
  /** Drawing strokes */
  strokes: Stroke[];
  /** Raw canvas data */
  canvasData?: any; // Will be improved in future updates
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Canvas drawing object types
 */
export type DrawingObjectType = 'stroke' | 'wall' | 'room' | 'text' | 'measurement';

/**
 * Drawing settings
 */
export interface DrawingSettings {
  lineColor: string;
  lineThickness: number;
  fillColor: string;
  opacity: number;
  snapToGrid: boolean;
}

/**
 * Floor plan metadata
 */
export interface FloorPlanMetadata {
  paperSize: PaperSize;
  scale: number;
  propertyId?: string;
  floorLevel: number;
  isTemplate: boolean;
}

/**
 * Create a default FloorPlan object with required properties
 * @param id - Optional ID for the floor plan
 * @param name - Optional name for the floor plan
 * @returns A new FloorPlan object with default values
 */
export const createDefaultFloorPlan = (id?: string, name?: string): FloorPlan => {
  const now = new Date().toISOString();
  return {
    id: id || Math.random().toString(36).substring(2, 9),
    name: name || 'New Floor Plan',
    label: name || 'New Floor Plan',
    gia: 0,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    createdAt: now,
    updatedAt: now
  };
};
