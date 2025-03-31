
/**
 * Core geometry types
 * Contains fundamental geometric types used throughout the application
 * @module types/core/Geometry
 */

/**
 * Represents a point in 2D space
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
 */
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Height height in pixels */
  height: number;
}

/**
 * Converts a fabric.js Point to our Point interface
 * @param point - fabric.js Point object
 * @returns Plain Point object
 */
export const fromFabricPoint = (point: fabric.Point): Point => {
  return { x: point.x, y: point.y };
};

/**
 * Converts our Point interface to a fabric.js Point
 * @param point - Plain Point object
 * @returns fabric.js Point object
 */
export const toFabricPoint = (point: Point): fabric.Point => {
  return new fabric.Point(point.x, point.y);
};
