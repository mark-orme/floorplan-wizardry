
/**
 * Represents a point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a new Point instance
 * 
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Point object
 */
export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};
