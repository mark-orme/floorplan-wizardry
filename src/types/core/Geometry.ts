
/**
 * Core geometry types
 * @module types/core/Geometry
 */

/**
 * Point interface for x,y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Size interface for width and height
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Canvas dimensions type
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Rectangle interface with position and size
 */
export interface Rectangle extends Point, Size {}

/**
 * Line interface with start and end points
 */
export interface Line {
  start: Point;
  end: Point;
}
