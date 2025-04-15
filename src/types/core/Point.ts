
/**
 * Interface for simple 2D points
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Creates a new Point object
 * 
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns A new Point object
 */
export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};
