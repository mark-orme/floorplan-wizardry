
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
 * Create a new point with x and y coordinates
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns New Point object
 */
export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};
