
/**
 * FloorPlan type definitions
 * @module types/core/FloorPlan
 */

import { Point } from './Point';

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
 * Convert string to PaperSize enum
 * @param paperSizeString - String representation of paper size
 * @returns PaperSize enum value
 */
export const stringToPaperSize = (paperSizeString: string): PaperSize => {
  // Check if the string is a valid PaperSize value
  if (Object.values(PaperSize).includes(paperSizeString as PaperSize)) {
    return paperSizeString as PaperSize;
  }
  
  // Default to A4 if not valid
  return PaperSize.A4;
};

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  /** Date when the floor plan was created */
  createdAt: string;
  
  /** Date when the floor plan was last updated */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize;
  
  /** Floor level (0 = ground floor) */
  level: number;
}

/**
 * Wall interface for floor plan
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Start point coordinates */
  start: Point;
  
  /** End point coordinates */
  end: Point;
  
  /** Wall thickness in pixels */
  thickness: number;
  
  /** Wall color */
  color: string;
}

/**
 * Room type enum
 */
export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Room interface for floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomType;
  
  /** Room area in square meters */
  area: number;
  
  /** Boundary points */
  points: Point[];
  
  /** Fill color */
  color: string;
}

/**
 * Stroke type enum
 */
export type StrokeType = 'line' | 'wall' | 'room' | 'freehand' | 'polyline';

/**
 * Stroke interface for annotations
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Stroke points */
  points: Point[];
  
  /** Stroke type */
  type: StrokeType;
  
  /** Stroke color */
  color: string;
  
  /** Stroke thickness */
  thickness: number;
}

/**
 * Floor interface representing a level
 */
export interface Floor {
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Floor name */
  name: string;
}

/**
 * Floor plan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label */
  label: string;
  
  /** Walls in the floor plan */
  walls: Wall[];
  
  /** Rooms in the floor plan */
  rooms: Room[];
  
  /** Annotations and drawings */
  strokes: Stroke[];
  
  /** Serialized canvas data (optional) */
  canvasData: string | null;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Gross internal area in square meters */
  gia: number;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Metadata */
  metadata: FloorPlanMetadata;
}
