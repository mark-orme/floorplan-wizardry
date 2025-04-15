
/**
 * Geometry type definitions
 * @module types/core/Geometry
 */

/**
 * Basic point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Size interface
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Rectangle interface
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Line interface
 */
export interface Line {
  start: Point;
  end: Point;
}

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}
