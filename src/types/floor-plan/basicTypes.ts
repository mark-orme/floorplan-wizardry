
/**
 * Basic types for floor plans
 * @module types/floor-plan/basicTypes
 */

/**
 * Paper size enum for printing
 */
export enum PaperSize {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
  LETTER = 'Letter',
  LEGAL = 'Legal',
  TABLOID = 'Tabloid'
}

/**
 * Point interface for coordinates
 * Note: Re-exported from core/Point for compatibility
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a point with the given coordinates
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Stroke type enum as string literals
 */
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation';

/**
 * Room type enum as string literals
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Floor plan metadata with all required fields
 */
export interface FloorPlanMetadata {
  /** Creation date timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Version of the floor plan */
  version: string;
  
  /** Author of the floor plan */
  author: string;
  
  /** Creation date (formatted) */
  dateCreated: string;
  
  /** Last modified date (formatted) */
  lastModified: string;
  
  /** Additional notes */
  notes: string;
}

/**
 * Create a complete metadata object with all required fields
 */
export function createCompleteMetadata(partial: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  
  return {
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    paperSize: partial.paperSize || PaperSize.A4,
    level: partial.level || 0,
    version: partial.version || '1.0',
    author: partial.author || 'System',
    dateCreated: partial.dateCreated || now,
    lastModified: partial.lastModified || now,
    notes: partial.notes || ''
  };
}
