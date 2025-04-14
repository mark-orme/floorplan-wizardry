
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
 * Create a new Point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A Point object
 */
export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};

