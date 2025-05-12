
/**
 * Simple Point interface for coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a new Point
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if two points are equal
 */
export function pointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}
