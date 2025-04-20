
/**
 * Point utility types and functions
 * @module types/core/Point
 */

// Use proper export type syntax for isolated modules
export type Point = {
  x: number;
  y: number;
};

/**
 * Create a new point with the given coordinates
 * @param x X coordinate
 * @param y Y coordinate
 * @returns New point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate the distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between the points
 */
export function distanceBetween(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the angle between two points in degrees
 * @param p1 First point
 * @param p2 Second point
 * @returns Angle in degrees
 */
export function angleBetween(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/**
 * Create a copy of the given point
 * @param point Point to copy
 * @returns Copy of the point
 */
export function copyPoint(point: Point): Point {
  return { x: point.x, y: point.y };
}

/**
 * Check if two points are equal
 * @param p1 First point
 * @param p2 Second point
 * @returns True if the points are equal, false otherwise
 */
export function arePointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

// Re-export the Point type for convenience
// Use proper export type syntax for isolated modules
export type { Point as IPoint };
