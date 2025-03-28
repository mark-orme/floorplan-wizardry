
/**
 * Geometry transformation utilities
 * @module geometry/transformations
 */
import { Point } from '@/types';

/**
 * Rotate a point around another point
 * 
 * @param {Point} point - Point to rotate
 * @param {Point} center - Center point for rotation
 * @param {number} angle - Angle in radians
 * @returns {Point} Rotated point
 */
export const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  // Translate point back to origin
  const x = point.x - center.x;
  const y = point.y - center.y;
  
  // Rotate point
  const xNew = x * cos - y * sin;
  const yNew = x * sin + y * cos;
  
  // Translate point back
  return {
    x: xNew + center.x,
    y: yNew + center.y
  } as Point;
};

/**
 * Translate a point by a given offset
 * 
 * @param {Point} point - Point to translate
 * @param {number} dx - X offset
 * @param {number} dy - Y offset
 * @returns {Point} Translated point
 */
export const translatePoint = (point: Point, dx: number, dy: number): Point => {
  return {
    x: point.x + dx,
    y: point.y + dy
  } as Point;
};

/**
 * Scale a point from a center point
 * 
 * @param {Point} point - Point to scale
 * @param {Point} center - Center point for scaling
 * @param {number} scaleX - X scale factor
 * @param {number} scaleY - Y scale factor
 * @returns {Point} Scaled point
 */
export const scalePoint = (
  point: Point, 
  center: Point, 
  scaleX: number, 
  scaleY: number = scaleX
): Point => {
  // Translate to origin
  const x = point.x - center.x;
  const y = point.y - center.y;
  
  // Scale
  const xNew = x * scaleX;
  const yNew = y * scaleY;
  
  // Translate back
  return {
    x: xNew + center.x,
    y: yNew + center.y
  } as Point;
};
