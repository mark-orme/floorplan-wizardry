
/**
 * Core Point type definition
 * Represents a point in 2D space
 * @module types/core/Point
 */

/**
 * Represents a point in 2D space
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Create a new point
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns A new Point object
 */
export const createPoint = (x: number, y: number): Point => ({
  x,
  y
});

/**
 * Check if two points are equal
 * @param p1 - First point
 * @param p2 - Second point
 * @returns True if points are equal
 */
export const arePointsEqual = (p1: Point, p2: Point): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};
