
/**
 * Point type definition
 * @module types/core/Point
 */

/**
 * Represents a point in 2D space
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Create a simple Point object
 * Helper function to create points without all the extra methods
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns A simple Point object
 */
export const createPoint = (x: number, y: number): Point => ({ x, y });
