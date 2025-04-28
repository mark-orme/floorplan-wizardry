
/**
 * Core geometry interfaces and types
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
 * Rectangle interface
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Line interface
 */
export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Circle interface
 */
export interface Circle {
  x: number;
  y: number;
  radius: number;
}

/**
 * Polygon interface
 */
export interface Polygon {
  points: Point[];
}
