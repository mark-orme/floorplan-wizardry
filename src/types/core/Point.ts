
/**
 * Point type definitions and utilities
 * Provides a consistent interface for point operations
 * @module types/core/Point
 */

/**
 * Basic Point interface
 * Represents a point in 2D space
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Create a new Point
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Point} A new Point object
 */
export const createPoint = (x: number, y: number): Point => ({
  x,
  y
});

/**
 * Calculate distance between two points
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @returns {number} Distance between points
 */
export const getDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Convert fabric Point to our Point type
 * @param {any} fabricPoint - Fabric.js Point object
 * @returns {Point} Our Point object
 */
export const fromFabricPoint = (fabricPoint: any): Point => {
  return {
    x: fabricPoint.x,
    y: fabricPoint.y
  };
};

/**
 * Determine if a value is a valid Point
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a valid Point
 */
export const isPoint = (value: any): value is Point => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'x' in value &&
    'y' in value &&
    typeof value.x === 'number' &&
    typeof value.y === 'number'
  );
};
