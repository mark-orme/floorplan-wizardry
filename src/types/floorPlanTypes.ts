
/**
 * Unified floor plan types to resolve conflicts between utility and type definitions
 * @module floorPlanTypes
 */

import { Point, CanvasDimensions } from './drawingTypes';

/**
 * Paper size options for floor plans
 * @typedef {('A4'|'A3'|'infinite')} PaperSize
 */
export type PaperSize = 'A4' | 'A3' | 'infinite';

/**
 * Canvas object data that can be serialized and stored
 * @typedef {Object} SerializedCanvasObject
 */
export type SerializedCanvasObject = Record<string, unknown>;

/**
 * Unified FloorPlan interface that satisfies both type systems
 * @interface FloorPlan
 */
export interface FloorPlan {
  /** Unique identifier for the floor plan */
  id: string;
  
  /** Name of the floor plan */
  name: string;
  
  /** Display label for the floor plan */
  label: string;
  
  /** Gross internal area in square meters */
  gia: number;
  
  /** Array of strokes (each a sequence of points) */
  strokes: Point[][];
  
  /** Paper size for printing */
  paperSize?: PaperSize;
  
  /** SVG data representation */
  svgData?: string;
  
  /** Serialized canvas data */
  canvas?: string;
  
  /** Timestamp when the floor plan was created or last modified */
  timestamp?: number;
  
  /** Canvas dimensions */
  dimensions?: CanvasDimensions;
  
  /** Serialized canvas objects */
  objects?: SerializedCanvasObject[];
  
  /** Areas (optional) */
  areas?: number[];
  
  /** Rooms (optional) */
  rooms?: string[];
  
  /** Creation date */
  createdAt?: Date;
  
  /** Last update date */
  updatedAt?: Date;
}

/**
 * Floor plan template options for creating new floor plans
 * @interface FloorPlanTemplate
 */
export interface FloorPlanTemplate {
  /** Template identifier */
  id: string;
  
  /** Template name */
  name: string;
  
  /** Default paper size */
  paperSize: PaperSize;
  
  /** Default canvas dimensions */
  dimensions: CanvasDimensions;
}

/**
 * Floor plan storage model for database operations
 * @interface FloorPlanStorageModel
 * @extends FloorPlan
 */
export interface FloorPlanStorageModel extends FloorPlan {
  /** Property ID this floor plan belongs to */
  propertyId?: string;
  
  /** User ID who created this floor plan */
  userId?: string;
  
  /** Flag indicating if this floor plan is synchronized to cloud */
  synced?: boolean;
  
  /** Version number for concurrency control */
  version?: number;
}
