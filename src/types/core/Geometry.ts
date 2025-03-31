
/**
 * Core geometry types
 * Contains fundamental geometric types used throughout the application
 * @module types/core/Geometry
 */

/**
 * Represents a point in 2D space
 * Used for all coordinate-based operations
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
 * Converts a Point from fabric.js to our internal Point interface
 * Ensures consistent usage of point coordinates across the application
 * 
 * @param point - fabric.js Point object
 * @returns Plain Point object compatible with our application
 */
export const fromFabricPoint = (point: { x: number; y: number }): Point => {
  return { x: point.x, y: point.y };
};

/**
 * Converts our Point interface to a fabric.js Point
 * Enables seamless integration with fabric.js methods that require Point objects
 * 
 * @param point - Plain Point object from our application
 * @returns Point object compatible with fabric.js
 */
export const toFabricPoint = (point: Point): { x: number; y: number } => {
  // Use a generic object with x,y properties instead of relying on fabric namespace
  return { x: point.x, y: point.y };
};
