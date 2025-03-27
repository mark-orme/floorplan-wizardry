
/**
 * Geometry type definitions
 * @module types/geometryTypes
 */

/**
 * Point interface with basic 2D coordinates
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  
  // Add required methods to satisfy fabric.js Point compatibility
  add?: (point: Point) => Point;
  addEquals?: (point: Point) => Point;
  scalarAdd?: (scalar: number) => Point;
  scalarAddEquals?: (scalar: number) => Point;
  subtract?: (point: Point) => Point;
  subtractEquals?: (point: Point) => Point;
  scalarSubtract?: (scalar: number) => Point;
  scalarSubtractEquals?: (scalar: number) => Point;
  multiply?: (scalar: number) => Point;
  multiplyEquals?: (scalar: number) => Point;
  divide?: (scalar: number) => Point;
  divideEquals?: (scalar: number) => Point;
  eq?: (point: Point) => boolean;
  lt?: (point: Point) => boolean;
  gt?: (point: Point) => boolean;
  lte?: (point: Point) => boolean;
  gte?: (point: Point) => boolean;
  lerp?: (point: Point, t: number) => Point;
  distanceFrom?: (point: Point) => number;
  midPointFrom?: (point: Point) => Point;
  min?: (point: Point) => Point;
  max?: (point: Point) => Point;
  toString?: () => string;
  setXY?: (x: number, y: number) => Point;
  setX?: (x: number) => Point;
  setY?: (y: number) => Point;
  setFromPoint?: (point: Point) => Point;
  swap?: (point: Point) => Point;
  clone?: () => Point;
}

/**
 * Create a simple Point object
 * Helper function to create points without all the extra methods
 * 
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns A simple Point object
 */
export const createPoint = (x: number, y: number): Point => ({ x, y });

/**
 * Canvas dimensions type
 * @interface CanvasDimensions
 */
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}

/**
 * Rectangle dimensions
 * @interface Rectangle
 */
export interface Rectangle {
  /** X coordinate of top-left corner */
  x: number;
  /** Y coordinate of top-left corner */
  y: number;
  /** Width of rectangle */
  width: number;
  /** Height of rectangle */
  height: number;
}

/**
 * Line segment defined by two points
 * @interface Line
 */
export interface Line {
  /** Start point */
  start: Point;
  /** End point */
  end: Point;
}

/**
 * Circle geometry
 * @interface Circle
 */
export interface Circle {
  /** Center point */
  center: Point;
  /** Radius */
  radius: number;
}

/**
 * Utility functions for working with Points
 */
export const PointUtils = {
  /**
   * Add two points
   * @param p1 First point
   * @param p2 Second point
   * @returns New point with coordinates added
   */
  add: (p1: Point, p2: Point): Point => ({
    x: p1.x + p2.x,
    y: p1.y + p2.y
  }),

  /**
   * Subtract second point from first
   * @param p1 First point
   * @param p2 Second point to subtract
   * @returns New point with coordinates subtracted
   */
  subtract: (p1: Point, p2: Point): Point => ({
    x: p1.x - p2.x,
    y: p1.y - p2.y
  }),

  /**
   * Multiply point coordinates by scalar
   * @param p Point
   * @param scalar Scalar value
   * @returns New point with coordinates multiplied
   */
  multiply: (p: Point, scalar: number): Point => ({
    x: p.x * scalar,
    y: p.y * scalar
  }),

  /**
   * Calculate distance between two points
   * @param p1 First point
   * @param p2 Second point
   * @returns Distance between points
   */
  distance: (p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Calculate midpoint between two points
   * @param p1 First point
   * @param p2 Second point
   * @returns Midpoint
   */
  midpoint: (p1: Point, p2: Point): Point => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  })
};
