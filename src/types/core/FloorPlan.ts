
/**
 * Floor plan types module
 * Defines core floor plan data structures
 * @module types/core/FloorPlan
 */
import { Point } from './Point';

/**
 * Paper size enum
 * Standard paper sizes for printing
 */
export enum PaperSize {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4'
}

/**
 * Convert string to PaperSize enum
 * @param paperSizeString - String representation of paper size
 * @returns PaperSize enum value or default A4
 */
export const stringToPaperSize = (paperSizeString: string): PaperSize => {
  if (Object.values(PaperSize).includes(paperSizeString as PaperSize)) {
    return paperSizeString as PaperSize;
  }
  return PaperSize.A4;
};

/**
 * Floor plan metadata interface
 * Contains information about the floor plan document
 */
export interface FloorPlanMetadata {
  /** Creator user ID */
  createdBy?: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Paper size for printing */
  paperSize: PaperSize;
  /** Floor level (0 for ground floor, positive for upper floors, negative for basements) */
  level: number;
}

/**
 * Stroke type enumeration
 * Defines the type of stroke for drawings
 */
export type StrokeType = 'line' | 'polyline' | 'bezier';

/**
 * Room type enumeration
 * Defines the type of room for floor plan
 */
export type RoomType = 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'dining' | 'hallway' | 'other';

/**
 * Stroke interface
 * Represents a drawing stroke on the floor plan
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  /** Array of points that define the stroke */
  points: Point[];
  /** Type of stroke */
  type: StrokeType;
  /** Stroke color */
  color: string;
  /** Stroke thickness */
  thickness: number;
}

/**
 * Wall interface
 * Represents a wall on the floor plan
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  /** Start point of the wall */
  start: Point;
  /** End point of the wall */
  end: Point;
  /** Wall thickness in pixels */
  thickness: number;
  /** Wall height in meters (optional) */
  height?: number;
}

/**
 * Room interface
 * Represents a room on the floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  /** Room name */
  name: string;
  /** Room type */
  type: RoomType;
  /** Points defining the room shape */
  points: Point[];
  /** Room area in square meters */
  area: number;
}

/**
 * Floor interface
 * Represents a floor in a building
 */
export interface Floor {
  /** Floor level (0 for ground floor, positive for upper floors, negative for basements) */
  level: number;
  /** Floor name */
  name: string;
  /** Floor height in meters */
  height?: number;
}

/**
 * Floor plan interface
 * Represents a complete floor plan with all its elements
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  /** Floor plan name */
  name: string;
  /** Floor plan display label */
  label: string;
  /** Array of walls */
  walls: Wall[];
  /** Array of rooms */
  rooms: Room[];
  /** Array of strokes */
  strokes: Stroke[];
  /** Serialized canvas data */
  canvasData: any;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Gross Internal Area in square meters */
  gia: number;
  /** Floor level */
  level: number;
  /** Floor plan metadata */
  metadata?: FloorPlanMetadata;
}
