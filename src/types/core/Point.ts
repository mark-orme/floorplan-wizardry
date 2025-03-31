
/**
 * Point type definition
 * Represents a point in 2D space
 * @module types/core/Point
 */

/**
 * Point interface
 * Core type used throughout the application for 2D coordinates
 */
export interface Point {
  /** X coordinate */
  x: number;
  
  /** Y coordinate */
  y: number;
}

/**
 * Create a new point
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Point} New point object
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Calculate distance between two points
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {number} Distance between points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Check if two points are equal
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {boolean} Whether points are equal
 */
export function pointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Add two points
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} Resulting point
 */
export function addPoints(p1: Point, p2: Point): Point {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

/**
 * Subtract second point from first
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} Resulting point
 */
export function subtractPoints(p1: Point, p2: Point): Point {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

/**
 * Scale a point by a factor
 * @param {Point} p - Point to scale
 * @param {number} factor - Scale factor
 * @returns {Point} Scaled point
 */
export function scalePoint(p: Point, factor: number): Point {
  return { x: p.x * factor, y: p.y * factor };
}
