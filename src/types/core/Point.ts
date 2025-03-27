
/**
 * Point data type for 2D coordinates
 * @module types/core/Point
 */

/**
 * Basic point interface for 2D coordinates
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Simple point interface for plain objects
 */
export interface PlainPoint {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Create a new point with x and y coordinates
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns New Point object
 */
export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};

/**
 * Convert a plain object with x/y properties to a Point
 * @param obj - Object with x and y properties
 * @returns Point object
 */
export const toPoint = (obj: { x: number, y: number }): Point => {
  return { x: obj.x, y: obj.y };
};
