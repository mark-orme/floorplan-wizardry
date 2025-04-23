
import { Point } from './Point';

/**
 * Represents a line defined by two points
 */
export interface Line {
  start: Point;
  end: Point;
}

/**
 * Represents a rectangle
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Represents a circle
 */
export interface Circle {
  center: Point;
  radius: number;
}
