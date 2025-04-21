
/**
 * Core geometry type definitions
 * @module types/core/Geometry
 */

/**
 * Point interface representing a 2D coordinate
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Line segment defined by two points
 */
export interface LineSegment {
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
 * Polygon defined by an array of points
 */
export interface Polygon {
  points: Point[];
}

/**
 * Bounding box with position and dimensions
 */
export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * Canvas dimensions with width and height
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Transform matrix (2D)
 */
export interface Transform {
  a: number; // scale x
  b: number; // shear y
  c: number; // shear x
  d: number; // scale y
  e: number; // translate x
  f: number; // translate y
}

/**
 * Paper size definition
 */
export interface PaperSize {
  name: string;
  width: number;
  height: number;
  displayName: string;
}
