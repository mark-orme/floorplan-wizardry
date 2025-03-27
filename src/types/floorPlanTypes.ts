
/**
 * Floor plan type definitions
 * @module types/floorPlanTypes
 */

/**
 * Point coordinates
 */
export interface Point {
  x: number;
  y: number;
}

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
  id: string;
  name: string;
  label: string;
  gia: number;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  canvasData?: any; // Will be improved in future updates
  createdAt: string;
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
