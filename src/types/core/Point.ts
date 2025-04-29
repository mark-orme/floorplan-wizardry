
/**
 * Basic point type with x and y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Creates a new point
 */
export const createPoint = (x: number, y: number): Point => ({
  x,
  y
});
