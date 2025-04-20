
import { Point } from '@/types/canvas';

/**
 * Line segment representation
 */
export interface LineSegment {
  start: Point;
  end: Point;
}

/**
 * Polygon representation
 */
export interface Polygon {
  points: Point[];
}

/**
 * Rectangle representation
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circle representation
 */
export interface Circle {
  center: Point;
  radius: number;
}

/**
 * Types of geometric objects
 */
export enum GeometryType {
  POINT = 'point',
  LINE = 'line',
  POLYGON = 'polygon',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle'
}
