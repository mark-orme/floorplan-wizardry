
/**
 * Point type definitions
 * @module types/core/Point
 */

/**
 * Point interface representing coordinates in 2D space
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  
  /** Y coordinate */
  y: number;
}

/**
 * Simple point type for plain object representation
 */
export interface PlainPoint {
  x: number;
  y: number;
}

/**
 * Create a new Point
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns A new Point object
 */
export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};

/**
 * Convert a plain object to a Point
 * @param obj Object with x,y properties
 * @returns A Point object
 */
export const toPoint = (obj: { x: number; y: number }): Point => {
  return { x: obj.x, y: obj.y };
};

/**
 * Calculate distance between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between points
 */
export const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if two points are equal within a tolerance
 * @param p1 - First point
 * @param p2 - Second point
 * @param tolerance - Distance tolerance
 * @returns Whether points are equal
 */
export const pointsEqual = (p1: Point, p2: Point, tolerance: number = 0.001): boolean => {
  return distance(p1, p2) <= tolerance;
};

/**
 * Interpolate between two points
 * @param p1 - Start point
 * @param p2 - End point
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated point
 */
export const interpolate = (p1: Point, p2: Point, t: number): Point => {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
};

/**
 * Add two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Sum of points
 */
export const addPoints = (p1: Point, p2: Point): Point => {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y
  };
};

/**
 * Subtract second point from first
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Difference of points
 */
export const subtractPoints = (p1: Point, p2: Point): Point => {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
};

/**
 * Scale a point by a factor
 * @param p - Point to scale
 * @param factor - Scale factor
 * @returns Scaled point
 */
export const scalePoint = (p: Point, factor: number): Point => {
  return {
    x: p.x * factor,
    y: p.y * factor
  };
};

/**
 * Calculate midpoint between two points
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Midpoint
 */
export const midpoint = (p1: Point, p2: Point): Point => {
  return interpolate(p1, p2, 0.5);
};

// Add these methods for Fabric.js Point compatibility
Point.prototype = {
  add: function(point: Point): Point {
    return addPoints(this, point);
  },
  addEquals: function(point: Point): Point {
    this.x += point.x;
    this.y += point.y;
    return this;
  },
  scalarAdd: function(scalar: number): Point {
    return { x: this.x + scalar, y: this.y + scalar };
  },
  scalarAddEquals: function(scalar: number): Point {
    this.x += scalar;
    this.y += scalar;
    return this;
  }
} as any;
