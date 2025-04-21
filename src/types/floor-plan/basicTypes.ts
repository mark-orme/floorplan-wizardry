
/**
 * Basic types for floor plans
 * @module types/floor-plan/basicTypes
 */

/**
 * Paper size enum for printing
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
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
