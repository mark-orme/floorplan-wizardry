
/**
 * Bounding box representing a rectangular area
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Point interface for coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Canvas dimensions interface
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Transform matrix for 2D transformations
 * [a, b, c, d, tx, ty]
 * where:
 * a, d: scale x, y
 * b, c: skew
 * tx, ty: translate
 */
export type TransformMatrix = [number, number, number, number, number, number];

/**
 * Line segment between two points
 */
export interface LineSegment {
  start: Point;
  end: Point;
}

/**
 * Transform object for handling object transformations
 */
export interface Transform {
  matrix: TransformMatrix;
  flipX?: boolean;
  flipY?: boolean;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  translateX?: number;
  translateY?: number;
}
