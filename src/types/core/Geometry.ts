
/**
 * Basic point type with x and y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Rectangle type defined by two points
 */
export interface Rect {
  topLeft: Point;
  bottomRight: Point;
}

/**
 * Create a point
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns A new point
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate distance between two points
 * @param a First point
 * @param b Second point
 * @returns Distance between points
 */
export function distance(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if two points are equal
 * @param a First point
 * @param b Second point
 * @returns True if points are equal
 */
export function pointsEqual(a: Point | null, b: Point | null): boolean {
  if (!a || !b) return false;
  return a.x === b.x && a.y === b.y;
}
