
/**
 * Point definition
 * @module types/core/Point
 */

/**
 * Point interface with x and y coordinates
 */
export interface Point {
  /** X coordinate */
  x: number;
  
  /** Y coordinate */
  y: number;
}

/**
 * Create a new point
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns A Point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate distance between two points
 * @param a - First point
 * @param b - Second point
 * @returns Distance between points
 */
export function distance(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if two points are equal
 * @param a - First point
 * @param b - Second point
 * @returns Whether points are equal
 */
export function arePointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

// Export Point type from unifiedTypes for compatibility
export { Point as IPoint } from '../floor-plan/unifiedTypes';
