
/**
 * Type definitions for geometry engine
 * @module geometry-engine/types
 */

export interface Point {
  x: number;
  y: number;
}

export interface LineSegment {
  start: Point;
  end: Point;
}

export interface Polygon {
  points: Point[];
}

export interface GeometryOperationOptions {
  tolerance?: number;
  maxIterations?: number;
}

