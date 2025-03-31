
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
 * Create a Point object
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns A Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}
