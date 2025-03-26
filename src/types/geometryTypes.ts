
/**
 * Type definitions for geometric elements
 * @module geometryTypes
 */

/**
 * Represents a 2D point in the drawing
 * @typedef {Object} Point
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */
export type Point = { x: number; y: number };

/**
 * Represents a stroke (sequence of points) in the drawing
 * @typedef {Array<Point>} Stroke
 */
export type Stroke = Point[];

/**
 * Canvas dimensions type
 * @typedef {Object} CanvasDimensions
 * @property {number} width - Canvas width
 * @property {number} height - Canvas height
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

// Scale factors
/**
 * Size of the small grid in meters
 * @constant {number}
 */
export const GRID_SIZE = 0.1; // 0.1m grid

/**
 * Number of pixels per meter (scale factor)
 * @constant {number}
 */
export const PIXELS_PER_METER = 100; // 1 meter = 100 pixels

/**
 * Size of the small grid in pixels
 * @constant {number}
 */
export const SMALL_GRID = GRID_SIZE * PIXELS_PER_METER; // 0.1m grid = 10px

/**
 * Size of the large grid in pixels
 * @constant {number}
 */
export const LARGE_GRID = 1.0 * PIXELS_PER_METER; // 1.0m grid = 100px
