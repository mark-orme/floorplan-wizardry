
/**
 * Point type definitions
 * @module types/core/Point
 */

/**
 * Interface for a 2D point with x and y coordinates
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  
  /** Y coordinate */
  y: number;
  
  /** For fabric compatibility - add operation */
  add?: (point: Point) => Point;
  
  /** For fabric compatibility - add in place */
  addEquals?: (point: Point) => Point;
  
  /** For fabric compatibility - scalar add */
  scalarAdd?: (scalar: number) => Point;
  
  /** For fabric compatibility - scalar add in place */
  scalarAddEquals?: (scalar: number) => Point;
  
  /** For fabric compatibility - subtract operation */
  subtract?: (point: Point) => Point;
  
  /** For fabric compatibility - subtract in place */
  subtractEquals?: (point: Point) => Point;
  
  /** For fabric compatibility - scalar subtract */
  scalarSubtract?: (scalar: number) => Point;
  
  /** For fabric compatibility - scalar subtract in place */
  scalarSubtractEquals?: (scalar: number) => Point;
  
  /** For fabric compatibility - multiply operation */
  multiply?: (scalar: number) => Point;
  
  /** For fabric compatibility - multiply in place */
  multiplyEquals?: (scalar: number) => Point;
  
  /** For fabric compatibility - divide operation */
  divide?: (scalar: number) => Point;
  
  /** For fabric compatibility - divide in place */
  divideEquals?: (scalar: number) => Point;
  
  /** For fabric compatibility - get distance to another point */
  distanceFrom?: (point: Point) => number;
  
  /** For fabric compatibility - get midpoint between this point and another */
  midPointFrom?: (point: Point) => Point;
  
  /** For fabric compatibility - set values */
  setXY?: (x: number, y: number) => Point;
  
  /** For fabric compatibility - set x value */
  setX?: (x: number) => Point;
  
  /** For fabric compatibility - set y value */
  setY?: (y: number) => Point;
  
  /** For fabric compatibility - clone point */
  clone?: () => Point;
  
  /** For fabric compatibility - get point coordinates as array */
  toArray?: () => number[];
  
  /** For fabric compatibility - rotate point around origin */
  rotate?: (radians: number) => Point;
  
  /** For fabric compatibility - rotate point around another point */
  rotateAround?: (radians: number, origin: Point) => Point;
  
  /** For fabric compatibility - flip point around x-axis */
  flipX?: () => Point;
  
  /** For fabric compatibility - flip point around y-axis */
  flipY?: () => Point;
  
  /** For fabric compatibility - convert to string */
  toString?: () => string;
  
  /** For fabric compatibility - equals method */
  eq?: (point: Point) => boolean;
  
  /** For fabric compatibility - greater than comparison */
  gt?: (point: Point) => boolean;
  
  /** For fabric compatibility - less than comparison */
  lt?: (point: Point) => boolean;
  
  /** For fabric compatibility - greater than or equal comparison */
  gte?: (point: Point) => boolean;
  
  /** For fabric compatibility - less than or equal comparison */
  lte?: (point: Point) => boolean;
}

/**
 * Create a new Point object
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Point object
 */
export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};

/**
 * Plain point type without fabric methods
 * Used for simpler type signatures
 */
export interface PlainPoint {
  x: number;
  y: number;
}

/**
 * Convert a plain object to a Point
 * @param obj - Object with x and y properties
 * @returns Point object
 */
export function toPoint(obj: { x: number; y: number }): Point {
  return { x: obj.x, y: obj.y };
}
