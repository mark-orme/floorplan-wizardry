
/**
 * Core geometry types
 * @module types/core/Geometry
 */

/**
 * Point interface representing a 2D point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Size interface representing dimensions
 */
export interface Size {
  /** Width */
  width: number;
  /** Height */
  height: number;
}

/**
 * Rectangle interface representing a rectangle
 */
export interface Rectangle {
  /** Left position */
  left: number;
  /** Top position */
  top: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
}

/**
 * Line interface representing a line between two points
 */
export interface Line {
  /** Start point */
  start: Point;
  /** End point */
  end: Point;
}

/**
 * Path interface representing a series of connected points
 */
export interface Path {
  /** Array of points in the path */
  points: Point[];
  /** Whether the path is closed (forms a polygon) */
  closed: boolean;
}

/**
 * Circle interface representing a circle
 */
export interface Circle {
  /** Center point */
  center: Point;
  /** Radius */
  radius: number;
}

/**
 * Polygon interface representing a closed shape
 */
export interface Polygon {
  /** Array of points forming the polygon */
  points: Point[];
}

/**
 * Transformation matrix
 */
export interface Transform {
  /** Horizontal scaling */
  a: number;
  /** Horizontal skewing */
  b: number;
  /** Vertical skewing */
  c: number;
  /** Vertical scaling */
  d: number;
  /** Horizontal moving */
  e: number;
  /** Vertical moving */
  f: number;
}

/**
 * Bounding box
 */
export interface BoundingBox {
  /** Left position */
  left: number;
  /** Top position */
  top: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
}
