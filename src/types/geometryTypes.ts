
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
