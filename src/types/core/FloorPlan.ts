
/**
 * Floor plan types
 * @module types/core/FloorPlan
 */
import { Point } from './Point';

/**
 * Paper size enum
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A2 = 'A2',
  A1 = 'A1',
  A0 = 'A0',
  CUSTOM = 'CUSTOM'
}

/**
 * Floor options interface
 */
export interface FloorOptions {
  /** Floor ID */
  id?: string;
  /** Floor name */
  name?: string;
  /** Floor level (0 = ground floor) */
  level?: number;
  /** Floor label for display */
  label?: string;
  /** Floor GIA (Gross Internal Area) in m² */
  gia?: number;
}

/**
 * Stroke object representing a drawn path
 */
export interface Stroke {
  /** Stroke ID */
  id: string;
  /** Array of points making up the stroke */
  points: Point[];
  /** Stroke type */
  type: 'line' | 'polyline' | 'bezier';
  /** Stroke color */
  color: string;
  /** Stroke thickness */
  thickness: number;
}

/**
 * Wall object representing a wall element
 */
export interface Wall {
  /** Wall ID */
  id: string;
  /** Start point */
  start: Point;
  /** End point */
  end: Point;
  /** Wall thickness in meters */
  thickness: number;
  /** Wall type */
  type?: string;
}

/**
 * Room object representing a room
 */
export interface Room {
  /** Room ID */
  id: string;
  /** Room name */
  name: string;
  /** Room type */
  type: string;
  /** Room area in m² */
  area: number;
  /** Room perimeter in meters */
  perimeter: number;
  /** Array of points defining the room boundary */
  points: Point[];
}

/**
 * Floor metadata interface
 */
export interface FloorMetadata {
  /** Paper size */
  paperSize: PaperSize;
  /** Paper width in mm */
  paperWidth: number;
  /** Paper height in mm */
  paperHeight: number;
  /** Scale (e.g., 1:50) */
  scale: number;
  /** Last modified timestamp */
  lastModified: string;
  /** Created timestamp */
  created: string;
  /** Grid spacing in meters */
  gridSpacing: number;
}

/**
 * Floor plan interface
 */
export interface FloorPlan {
  /** Floor plan ID */
  id: string;
  /** Floor plan name */
  name: string;
  /** Floor plan label for display */
  label: string;
  /** Floor level (0 = ground floor) */
  level: number;
  /** Gross Internal Area in m² */
  gia: number;
  /** Array of strokes */
  strokes: Stroke[];
  /** Array of walls */
  walls: Wall[];
  /** Array of rooms */
  rooms: Room[];
  /** Serialized canvas data */
  canvasData: string | null;
  /** Created timestamp */
  createdAt: string;
  /** Updated timestamp */
  updatedAt: string;
  /** Floor metadata */
  metadata?: FloorMetadata;
}

/**
 * Create a new floor plan
 * @param options Floor options
 * @returns New floor plan object
 */
export const createFloorPlan = (options: FloorOptions = {}): FloorPlan => {
  const now = new Date().toISOString();
  return {
    id: options.id || `floor-${Date.now()}`,
    name: options.name || 'New Floor Plan',
    label: options.label || 'New Floor Plan',
    level: options.level !== undefined ? options.level : 0,
    gia: options.gia || 0,
    strokes: [],
    walls: [],
    rooms: [],
    canvasData: null,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Convert string to PaperSize enum
 * @param value String value to convert
 * @returns Corresponding PaperSize or CUSTOM if not matched
 */
export const stringToPaperSize = (value: string): PaperSize => {
  // Check if the value is a valid PaperSize
  if (Object.values(PaperSize).includes(value as PaperSize)) {
    return value as PaperSize;
  }
  return PaperSize.CUSTOM;
};
