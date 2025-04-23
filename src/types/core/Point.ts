
/**
 * Point interface representing coordinates on the canvas
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a point
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Determine if two points are effectively the same (within a small tolerance)
 * @param p1 - First point
 * @param p2 - Second point
 * @param tolerance - Distance tolerance
 * @returns True if points are effectively equal
 */
export function pointsEqual(p1: Point, p2: Point, tolerance = 0.001): boolean {
  return distance(p1, p2) < tolerance;
}
