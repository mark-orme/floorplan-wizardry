
/**
 * Geometry Engine Types
 * Core types for geometric operations
 */

// Basic 2D point
export interface Point {
  x: number;
  y: number;
}

// Line segment between two points
export interface LineSegment {
  p1: Point;
  p2: Point;
}

// General line equation (ax + by + c = 0)
export interface Line {
  a: number;
  b: number;
  c: number;
}

// Worker message data structure
export interface WorkerMessageData {
  type: 'calculate' | 'transform' | 'snap' | 'simplify';
  points: Point[];
  options?: any;
}

// Worker response data structure
export interface WorkerResponseData {
  type: string;
  result: any;
  error?: string;
}
