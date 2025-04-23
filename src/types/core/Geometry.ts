
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

/**
 * Represents a polygon as an array of points
 */
export type Polygon = Point[];

/**
 * Re-export Point to ensure it's available for imports
 */
export type { Point };

/**
 * Represents canvas dimensions
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}
