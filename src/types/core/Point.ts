
/**
 * Point interface representing a 2D coordinate
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a new Point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Check if two points are equal
 * @param p1 First point
 * @param p2 Second point
 * @returns True if points are equal
 */
export function pointsEqual(p1: Point | null | undefined, p2: Point | null | undefined): boolean {
  if (!p1 || !p2) return false;
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Calculate the distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance in pixels
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
