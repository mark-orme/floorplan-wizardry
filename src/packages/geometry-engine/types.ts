
/**
 * Type definitions for the geometry engine
 * @module geometry-engine/types
 */

/**
 * Point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Line segment between two points
 */
export interface LineSegment {
  start: Point;
  end: Point;
}

/**
 * Line definition (can be infinite)
 */
export interface Line {
  point: Point;
  angle: number; // In radians
}

/**
 * Worker message data interface
 */
export interface WorkerMessageData {
  id: string;
  operation: 'simplifyPolyline' | 'calculateIntersections' | 'other';
  data: any;
}

/**
 * Worker response data interface
 */
export interface WorkerResponseData {
  id: string;
  status: 'success' | 'error';
  result?: any;
  error?: string;
}
