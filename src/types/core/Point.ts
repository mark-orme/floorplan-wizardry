
/**
 * Point type definitions
 * @module core/Point
 */

/**
 * Point interface with basic 2D coordinates
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Plain point type without methods for simpler structures
 */
export type PlainPoint = {
  x: number;
  y: number;
};

/**
 * Create a point object
 * Helper function to create points
 * 
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns A Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Convert plain object to Point
 * 
 * @param obj - Object with x and y properties
 * @returns A Point object
 */
export function toPoint(obj: { x: number; y: number }): Point {
  return { x: obj.x, y: obj.y };
}
