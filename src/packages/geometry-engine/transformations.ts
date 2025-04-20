
/**
 * Geometry transformation functions
 * @module geometry-engine/transformations
 */
import { Point, Transform } from './types';

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Point to rotate around
 * @param angleDegrees Angle in degrees
 * @returns Rotated point
 */
export function rotatePoint(point: Point, origin: Point, angleDegrees: number): Point {
  // Convert angle to radians
  const angleRadians = (angleDegrees * Math.PI) / 180;
  
  // Translate point to origin
  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;
  
  // Rotate point
  const rotatedX = translatedX * Math.cos(angleRadians) - translatedY * Math.sin(angleRadians);
  const rotatedY = translatedX * Math.sin(angleRadians) + translatedY * Math.cos(angleRadians);
  
  // Translate point back
  return {
    x: rotatedX + origin.x,
    y: rotatedY + origin.y
  };
}

/**
 * Translate a point by a specified offset
 * @param point Point to translate
 * @param offsetX X offset
 * @param offsetY Y offset
 * @returns Translated point
 */
export function translatePoint(point: Point, offsetX: number, offsetY: number): Point {
  return {
    x: point.x + offsetX,
    y: point.y + offsetY
  };
}

/**
 * Scale a point from an origin
 * @param point Point to scale
 * @param origin Origin point
 * @param scaleX X scale factor
 * @param scaleY Y scale factor
 * @returns Scaled point
 */
export function scalePoint(
  point: Point, 
  origin: Point, 
  scaleX: number, 
  scaleY: number = scaleX
): Point {
  // Translate to origin
  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;
  
  // Scale
  const scaledX = translatedX * scaleX;
  const scaledY = translatedY * scaleY;
  
  // Translate back
  return {
    x: scaledX + origin.x,
    y: scaledY + origin.y
  };
}

/**
 * Apply a transform matrix to a point
 * @param point Point to transform
 * @param transform Transform matrix
 * @returns Transformed point
 */
export function applyTransform(point: Point, transform: Transform): Point {
  return {
    x: transform.a * point.x + transform.c * point.y + transform.e,
    y: transform.b * point.x + transform.d * point.y + transform.f
  };
}

/**
 * Create a transform matrix for operations
 * @returns Identity transform
 */
export function createTransform(): Transform {
  return {
    a: 1, // Horizontal scaling
    b: 0, // Horizontal skewing
    c: 0, // Vertical skewing
    d: 1, // Vertical scaling
    e: 0, // Horizontal moving
    f: 0  // Vertical moving
  };
}

/**
 * Combine two transforms by multiplying their matrices
 * @param t1 First transform
 * @param t2 Second transform
 * @returns Combined transform
 */
export function combineTransforms(t1: Transform, t2: Transform): Transform {
  return {
    a: t1.a * t2.a + t1.c * t2.b,
    b: t1.b * t2.a + t1.d * t2.b,
    c: t1.a * t2.c + t1.c * t2.d,
    d: t1.b * t2.c + t1.d * t2.d,
    e: t1.a * t2.e + t1.c * t2.f + t1.e,
    f: t1.b * t2.e + t1.d * t2.f + t1.f
  };
}

/**
 * Snap points to a grid
 * @param points Array of points to snap
 * @param gridSize Grid size
 * @returns Array of snapped points
 */
export function snapPointsToGrid(points: Point[], gridSize: number): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}
