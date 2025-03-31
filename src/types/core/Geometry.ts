
/**
 * Core geometry types for the drawing application
 * Provides standardized interfaces for spatial operations
 * @module types/core/Geometry
 */

/**
 * Point interface for x,y coordinates
 * Represents a position in 2D space
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Size interface for width and height
 * Represents dimensions in 2D space
 */
export interface Size {
  /** Width measurement */
  width: number;
  /** Height measurement */
  height: number;
}

/**
 * Canvas dimensions type
 * Specialized size type for canvas elements
 */
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}

/**
 * Rectangle interface with position and size
 * Combines Point and Size to represent a rectangular area
 */
export interface Rectangle extends Point, Size {}

/**
 * Line interface with start and end points
 * Represents a straight line between two points
 */
export interface Line {
  /** Starting point of the line */
  start: Point;
  /** Ending point of the line */
  end: Point;
}

/**
 * Check if two points are equal
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Whether the points are equal
 */
export function arePointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between the points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
