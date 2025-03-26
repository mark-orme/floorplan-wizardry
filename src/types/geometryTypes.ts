
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
