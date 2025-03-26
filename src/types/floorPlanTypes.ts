
/**
 * Type definitions for floor plans
 * @module floorPlanTypes
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Wall definition in a floor plan
 * @interface Wall
 */
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness?: number;
  height?: number;
  type?: 'interior' | 'exterior' | 'partition';
}

/**
 * Room definition in a floor plan
 * @interface Room
 */
export interface Room {
  id: string;
  name: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  area?: number;
  type?: string;
}

/**
 * Paper size for printing
 * @interface PaperSize
 */
export type PaperSize = 'A4' | 'A3' | 'infinite';

/**
 * Floor plan definition
 * @interface FloorPlan
 */
export interface FloorPlan {
  id: string;
  name: string;
  walls?: Wall[];
  rooms?: Room[];
  level?: number;
  gia?: number;
  scale?: number;
  updatedAt?: string;
  meta?: {
    [key: string]: any;
  };
  // Properties needed from drawingTypes.FloorPlan
  label: string;
  strokes: Point[][];
  areas?: number[];
  createdAt?: Date;
}

// Storage model for IndexedDB
export interface FloorPlanStorageModel {
  id: string;
  data: FloorPlan[];
}
