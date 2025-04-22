
/**
 * Geometry types
 * Provides consistent type definitions for geometry operations
 */

/**
 * Point type
 * Represents a 2D point with x and y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Line type
 * Represents a line between two points
 */
export interface Line {
  start: Point;
  end: Point;
}

/**
 * LineSegment type
 * Represents a line segment with start and end points
 */
export interface LineSegment {
  start: Point;
  end: Point;
}

/**
 * Rectangle type
 * Represents a rectangle with top-left coordinates, width, and height
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * BoundingBox type
 * Represents a rectangular bounding box
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circle type
 * Represents a circle with center coordinates and radius
 */
export interface Circle {
  center: Point;
  radius: number;
}

/**
 * Polyline type
 * Represents a series of connected points
 */
export interface Polyline {
  points: Point[];
}

/**
 * Polygon type
 * Represents a closed shape consisting of points
 */
export interface Polygon {
  points: Point[];
}

/**
 * Canvas Dimensions type
 * Represents the dimensions of a canvas
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Transform Matrix type
 * Represents a 2D transformation matrix
 */
export interface TransformMatrix {
  a: number; // scale x
  b: number; // skew y
  c: number; // skew x
  d: number; // scale y
  e: number; // translate x
  f: number; // translate y
}

/**
 * Transform type
 * Represents a 2D transformation with scale, rotation, and translation
 */
export interface Transform {
  scaleX: number;
  scaleY: number;
  rotation: number; // in radians
  translateX: number;
  translateY: number;
  matrix?: TransformMatrix;
}
