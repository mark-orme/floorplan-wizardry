
/**
 * Core geometry types for the application
 */

/**
 * Basic 2D point
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Line segment defined by two points
 */
export interface Line {
  start: Point;
  end: Point;
}

/**
 * Rectangle defined by position and dimensions
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circle defined by center point and radius
 */
export interface Circle {
  center: Point;
  radius: number;
}

/**
 * Polygon defined by array of points
 */
export interface Polygon {
  points: Point[];
}

/**
 * Bounding box defined by min/max points
 */
export interface BoundingBox {
  min: Point;
  max: Point;
}

/**
 * Transform matrix (3x3 for 2D transforms)
 */
export type TransformMatrix = [number, number, number, number, number, number];
