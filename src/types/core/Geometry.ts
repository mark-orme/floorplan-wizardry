
/**
 * Core geometry types
 * @module types/core/Geometry
 */

/**
 * Point interface representing x,y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Size interface representing width and height
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Rectangle interface representing position and size
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Line interface representing start and end points
 */
export interface Line {
  start: Point;
  end: Point;
}
