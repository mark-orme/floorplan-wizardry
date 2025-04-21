
/**
 * Geometry type definitions
 * @module types/core/Geometry
 */

/**
 * Point interface representing a 2D coordinate
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
 * Rectangle interface representing a rectangular area
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Polygon interface representing a closed shape
 */
export interface Polygon {
  points: Point[];
}

/**
 * Line interface representing a line segment
 */
export interface Line {
  start: Point;
  end: Point;
}

/**
 * Circle interface representing a circle
 */
export interface Circle {
  center: Point;
  radius: number;
}

/**
 * Area calculation result
 */
export interface AreaCalculationResult {
  /** Area in square pixels */
  areaPx: number;
  /** Area in square meters */
  areaM2: number;
  /** Scale factor used (pixels per meter) */
  scale: number;
}
