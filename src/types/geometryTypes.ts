
/**
 * Type definitions for geometric elements
 * Provides types and constants for geometry operations
 * @module geometryTypes
 */

import { 
  GRID_SPACING,
  PIXELS_PER_METER,
  SMALL_GRID,
  LARGE_GRID
} from "@/constants/numerics";

/**
 * Represents a 2D point in the drawing
 * Used for coordinates in the canvas space
 * 
 * @typedef {Object} Point
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */
export type Point = { x: number; y: number };

/**
 * Represents a stroke (sequence of points) in the drawing
 * Used for freehand drawing paths
 * 
 * @typedef {Array<Point>} Stroke
 */
export type Stroke = Point[];

/**
 * Canvas dimensions type
 * Represents the width and height of the canvas
 * 
 * @typedef {Object} CanvasDimensions
 * @property {number} width - Canvas width in pixels
 * @property {number} height - Canvas height in pixels
 */
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}

// Re-export constants for backward compatibility
export { GRID_SPACING, PIXELS_PER_METER, SMALL_GRID, LARGE_GRID };

/**
 * Drawing element types
 * Identifies different types of drawing elements
 */
export enum DrawingElementType {
  /** Wall element type */
  WALL = 'wall',
  
  /** Room element type */
  ROOM = 'room',
  
  /** Door element type */
  DOOR = 'door',
  
  /** Window element type */
  WINDOW = 'window',
  
  /** Generic element type */
  GENERIC = 'generic'
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
 * Type guard to check if a value is a Stroke
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a valid Stroke
 */
export function isStroke(value: unknown): value is Stroke {
  return Array.isArray(value) && 
         value.every(point => isPoint(point));
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
