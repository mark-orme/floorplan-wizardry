
/**
 * Core geometry types
 * @module geometry-engine/types
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
 * Line segment defined by two points
 */
export interface Line {
  /** Start point */
  start: Point;
  /** End point */
  end: Point;
}

/**
 * Polygon defined by an array of points
 */
export type Polygon = Point[];

/**
 * Rectangle interface
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
 * Circle geometry
 */
export interface Circle {
  /** Center point */
  center: Point;
  /** Radius */
  radius: number;
}

/**
 * Transform matrix for 2D operations
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
  /** Horizontal translation */
  e: number;
  /** Vertical translation */
  f: number;
}

/**
 * Available calculation types for worker operations
 */
export type CalculationType = 
  | 'calculateArea'
  | 'calculateDistance'
  | 'optimizePoints'
  | 'snapToGrid'
  | 'isPointInPolygon'
  | 'findIntersections';

/**
 * Worker message data structure
 */
export interface WorkerMessageData {
  /** Unique ID for the request */
  id: string;
  /** Type of calculation to perform */
  type: CalculationType;
  /** Payload data for the calculation */
  payload: any;
}

/**
 * Worker response data structure
 */
export interface WorkerResponseData {
  /** ID matching the original request */
  id: string;
  /** Whether the operation was successful */
  success: boolean;
  /** Result data (if successful) */
  result?: any;
  /** Error message (if unsuccessful) */
  error?: string;
}
