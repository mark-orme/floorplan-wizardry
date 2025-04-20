
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

export interface Line extends LineSegment {
  slope?: number;
  yIntercept?: number;
}

export interface Polygon {
  points: Point[];
}

export interface GeometryOperationOptions {
  tolerance?: number;
  maxIterations?: number;
}

export interface WorkerMessageData {
  operation: string;
  payload: any;
  id: string;
}

export interface WorkerResponse {
  result: any;
  id: string;
  error?: string;
}
