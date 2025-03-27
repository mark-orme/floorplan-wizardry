
/**
 * Geometric type definitions
 * @module core/Geometry
 */

/**
 * Represents a point in 2D space
 * @interface Point
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Canvas dimensions type
 * Represents the width and height of the canvas
 * @interface CanvasDimensions
 */
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}

/**
 * Type guard to check if a value is a Point
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a valid Point
 */
export function isPoint(value: unknown): value is Point {
  return typeof value === 'object' && 
         value !== null && 
         'x' in value && 
         'y' in value &&
         typeof (value as Point).x === 'number' &&
         typeof (value as Point).y === 'number';
}

/**
 * Type guard to check if a value is CanvasDimensions
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is valid CanvasDimensions
 */
export function isCanvasDimensions(value: unknown): value is CanvasDimensions {
  return typeof value === 'object' && 
         value !== null && 
         'width' in value && 
         'height' in value &&
         typeof (value as CanvasDimensions).width === 'number' &&
         typeof (value as CanvasDimensions).height === 'number';
}
