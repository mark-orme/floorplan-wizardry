
/**
 * Represents a 2D point
 */
export interface Point {
  /** X coordinate */
  x: number;
  
  /** Y coordinate */
  y: number;
}

/**
 * Creates a new Point object
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A Point object
 */
export const createPoint = (x: number, y: number): Point => ({ x, y });
