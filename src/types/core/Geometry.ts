
/**
 * Geometry type definitions
 * @module core/Geometry
 */

/**
 * Coordinates interface
 */
export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Dimension interface
 */
export interface Dimension {
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
 * Size interface
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Vector interface
 */
export interface Vector {
  x: number;
  y: number;
  magnitude?: number;
  direction?: number;
}

/**
 * Bounds interface
 */
export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Line segment interface
 */
export interface LineSegment {
  start: Coordinates;
  end: Coordinates;
}

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Operation result interface
 */
export interface OperationResult {
  success: boolean;
  message?: string;
  data?: any;
}
