
/**
 * Geometry Type Definitions
 * 
 * This module provides type definitions for geometry-related operations
 * throughout the application, including points, lines, polygons, and
 * transformation matrices.
 * 
 * @module types/core/Geometry
 */

/**
 * Represents a point in 2D space.
 */
export interface Point {
  /**
   * X-coordinate
   */
  x: number;
  
  /**
   * Y-coordinate
   */
  y: number;
}

/**
 * Represents a rectangle in 2D space.
 */
export interface Rectangle {
  /**
   * X-coordinate of the top-left corner
   */
  x: number;
  
  /**
   * Y-coordinate of the top-left corner
   */
  y: number;
  
  /**
   * Width of the rectangle
   */
  width: number;
  
  /**
   * Height of the rectangle
   */
  height: number;
}

/**
 * Represents a circle in 2D space.
 */
export interface Circle {
  /**
   * Center point of the circle
   */
  center: Point;
  
  /**
   * Radius of the circle
   */
  radius: number;
}

/**
 * Represents a polygon as an array of points.
 */
export type Polygon = Point[];

/**
 * Represents the bounding box of an object or selection.
 */
export interface BoundingBox {
  /**
   * X-coordinate of the top-left corner
   */
  x: number;
  
  /**
   * Y-coordinate of the top-left corner
   */
  y: number;
  
  /**
   * Width of the bounding box
   */
  width: number;
  
  /**
   * Height of the bounding box
   */
  height: number;
}

/**
 * Represents a line segment between two points.
 */
export interface LineSegment {
  /**
   * Start point of the line segment
   */
  start: Point;
  
  /**
   * End point of the line segment
   */
  end: Point;
}

/**
 * Represents a 2D transformation matrix.
 * [a c e]
 * [b d f]
 * [0 0 1]
 */
export type TransformMatrix = [number, number, number, number, number, number];

/**
 * Represents the dimensions of a canvas.
 */
export interface CanvasDimensions {
  /**
   * Width of the canvas in pixels
   */
  width: number;
  
  /**
   * Height of the canvas in pixels
   */
  height: number;
}

/**
 * Represents a geometric transform with position, scale and rotation.
 */
export interface Transform {
  /**
   * X-coordinate of the transform origin
   */
  x: number;
  
  /**
   * Y-coordinate of the transform origin
   */
  y: number;
  
  /**
   * X-scale factor
   */
  scaleX: number;
  
  /**
   * Y-scale factor
   */
  scaleY: number;
  
  /**
   * Rotation angle in radians
   */
  rotation: number;
}

/**
 * Create a point with the given coordinates.
 * 
 * @param x - X-coordinate
 * @param y - Y-coordinate
 * @returns A Point object
 * 
 * @example
 * ```typescript
 * const point = createPoint(10, 20);
 * ```
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate the distance between two points.
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between the points
 * 
 * @example
 * ```typescript
 * const distance = calculateDistance(point1, point2);
 * ```
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the angle between two points in radians.
 * 
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Angle in radians
 * 
 * @example
 * ```typescript
 * const angle = calculateAngle(point1, point2);
 * ```
 */
export function calculateAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}
