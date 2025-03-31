
/**
 * Point interface representing coordinates in 2D space
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Creates a new Point object
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns New Point object
 */
export const createPoint = (x: number, y: number): Point => ({
  x,
  y
});

/**
 * Check if two points are equal
 * @param p1 - First point
 * @param p2 - Second point
 * @returns True if points have the same coordinates
 */
export const pointsEqual = (p1: Point, p2: Point): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};

/**
 * Clone a point object
 * @param point - The point to clone
 * @returns A new point with the same coordinates
 */
export const clonePoint = (point: Point): Point => ({
  x: point.x,
  y: point.y
});
