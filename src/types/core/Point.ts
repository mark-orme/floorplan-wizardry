
/**
 * Point type definition
 * @module types/core/Point
 */

/**
 * Point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A new Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}
