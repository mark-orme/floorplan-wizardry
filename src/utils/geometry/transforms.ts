
/**
 * Geometry transforms
 * Utilities for geometric transformations
 * @module utils/geometry/transforms
 */

import { Point } from '@/types/core/Geometry';

/**
 * Identity transform matrix
 */
export const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];

/**
 * Transform a point using a matrix
 * @param point Point to transform
 * @param matrix Transformation matrix [a, b, c, d, tx, ty]
 * @returns Transformed point
 */
export function transformPoint(point: Point, matrix: number[]): Point {
  const [a, b, c, d, tx, ty] = matrix;
  
  return {
    x: a * point.x + c * point.y + tx,
    y: b * point.x + d * point.y + ty
  };
}

/**
 * Create a rotation matrix
 * @param angle Angle in radians
 * @returns Rotation matrix
 */
export function createRotationMatrix(angle: number): number[] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  return [cos, sin, -sin, cos, 0, 0];
}

/**
 * Create a translation matrix
 * @param tx X translation
 * @param ty Y translation
 * @returns Translation matrix
 */
export function createTranslationMatrix(tx: number, ty: number): number[] {
  return [1, 0, 0, 1, tx, ty];
}

/**
 * Create a scaling matrix
 * @param sx X scale factor
 * @param sy Y scale factor
 * @returns Scaling matrix
 */
export function createScaleMatrix(sx: number, sy: number = sx): number[] {
  return [sx, 0, 0, sy, 0, 0];
}

/**
 * Multiply two matrices
 * @param m1 First matrix
 * @param m2 Second matrix
 * @returns Result matrix
 */
export function multiplyMatrices(m1: number[], m2: number[]): number[] {
  const [a1, b1, c1, d1, tx1, ty1] = m1;
  const [a2, b2, c2, d2, tx2, ty2] = m2;
  
  return [
    a1 * a2 + b1 * c2,      // a
    a1 * b2 + b1 * d2,      // b
    c1 * a2 + d1 * c2,      // c
    c1 * b2 + d1 * d2,      // d
    tx1 * a2 + ty1 * c2 + tx2, // tx
    tx1 * b2 + ty1 * d2 + ty2  // ty
  ];
}

/**
 * Invert a matrix
 * @param matrix Matrix to invert
 * @returns Inverted matrix
 */
export function invertMatrix(matrix: number[]): number[] {
  const [a, b, c, d, tx, ty] = matrix;
  
  const det = a * d - b * c;
  
  if (Math.abs(det) < 0.00001) {
    // Singular matrix, cannot invert
    return [...IDENTITY_MATRIX];
  }
  
  const invDet = 1 / det;
  
  return [
    d * invDet,           // a
    -b * invDet,          // b
    -c * invDet,          // c
    a * invDet,           // d
    (c * ty - d * tx) * invDet, // tx
    (b * tx - a * ty) * invDet  // ty
  ];
}
