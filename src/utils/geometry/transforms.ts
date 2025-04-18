
/**
 * Geometry Transforms
 * Utilities for transforming geometric objects
 */

import { Point, Polygon, Rect } from './engine';

/**
 * Rotate a point around a center point
 * @param point The point to rotate
 * @param center The center point to rotate around
 * @param angle The angle in degrees
 */
export function rotatePoint(point: Point, center: Point, angle: number): Point {
  // Convert angle to radians
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  // Translate point to origin
  const x = point.x - center.x;
  const y = point.y - center.y;
  
  // Rotate point
  const rotatedX = x * cos - y * sin;
  const rotatedY = x * sin + y * cos;
  
  // Translate point back
  return {
    x: rotatedX + center.x,
    y: rotatedY + center.y
  };
}

/**
 * Scale a point from a center point
 * @param point The point to scale
 * @param center The center point to scale from
 * @param scaleX The x scale factor
 * @param scaleY The y scale factor
 */
export function scalePoint(
  point: Point, 
  center: Point, 
  scaleX: number, 
  scaleY: number
): Point {
  return {
    x: center.x + (point.x - center.x) * scaleX,
    y: center.y + (point.y - center.y) * scaleY
  };
}

/**
 * Rotate a polygon around a center point
 * @param polygon The polygon to rotate
 * @param center The center point to rotate around
 * @param angle The angle in degrees
 */
export function rotatePolygon(polygon: Polygon, center: Point, angle: number): Polygon {
  return polygon.map(point => rotatePoint(point, center, angle));
}

/**
 * Scale a polygon from a center point
 * @param polygon The polygon to scale
 * @param center The center point to scale from
 * @param scaleX The x scale factor
 * @param scaleY The y scale factor
 */
export function scalePolygon(
  polygon: Polygon, 
  center: Point, 
  scaleX: number, 
  scaleY: number
): Polygon {
  return polygon.map(point => scalePoint(point, center, scaleX, scaleY));
}

/**
 * Translate a point by a vector
 * @param point The point to translate
 * @param dx The x distance to translate
 * @param dy The y distance to translate
 */
export function translatePoint(point: Point, dx: number, dy: number): Point {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

/**
 * Translate a polygon by a vector
 * @param polygon The polygon to translate
 * @param dx The x distance to translate
 * @param dy The y distance to translate
 */
export function translatePolygon(polygon: Polygon, dx: number, dy: number): Polygon {
  return polygon.map(point => translatePoint(point, dx, dy));
}

/**
 * Convert from rectangle to polygon (4 corner points)
 * @param rect The rectangle to convert
 */
export function rectToPolygon(rect: Rect): Polygon {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height }
  ];
}

/**
 * Matrix transformation utilities for 2D transformations
 */

// 3x3 transformation matrix (represented as array of 6 elements in column-major order)
export type TransformMatrix = [number, number, number, number, number, number];

/**
 * Create an identity transform matrix
 */
export function createIdentityMatrix(): TransformMatrix {
  return [1, 0, 0, 1, 0, 0];
}

/**
 * Apply a matrix transformation to a point
 */
export function transformPoint(point: Point, matrix: TransformMatrix): Point {
  const x = point.x;
  const y = point.y;
  
  return {
    x: matrix[0] * x + matrix[2] * y + matrix[4],
    y: matrix[1] * x + matrix[3] * y + matrix[5]
  };
}

/**
 * Create a translation matrix
 */
export function createTranslationMatrix(dx: number, dy: number): TransformMatrix {
  return [1, 0, 0, 1, dx, dy];
}

/**
 * Create a rotation matrix
 */
export function createRotationMatrix(angle: number): TransformMatrix {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  
  return [cos, sin, -sin, cos, 0, 0];
}

/**
 * Create a scale matrix
 */
export function createScaleMatrix(sx: number, sy: number): TransformMatrix {
  return [sx, 0, 0, sy, 0, 0];
}

/**
 * Multiply two transformation matrices
 */
export function multiplyMatrices(a: TransformMatrix, b: TransformMatrix): TransformMatrix {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5]
  ];
}
