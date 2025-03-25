
/**
 * Utility module for converting between Fabric.js points and application-specific points
 * @module fabricPointConverter
 */
import { Point as FabricPoint } from 'fabric';
import { Point as CustomPoint } from './drawingTypes';

/**
 * Converts our custom Point type to Fabric.js Point
 * @param {CustomPoint} point - Our custom point
 * @returns {FabricPoint} Fabric.js Point
 */
export const toFabricPoint = (point: CustomPoint): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Converts Fabric.js Point to our custom Point type
 * @param {FabricPoint} point - Fabric.js Point
 * @returns {CustomPoint} Our custom Point
 */
export const toCustomPoint = (point: FabricPoint): CustomPoint => {
  return { x: point.x, y: point.y };
};

/**
 * Creates a simple {x, y} object from values
 * (Used when we need a simple point object but not a full Fabric.js Point)
 * @param {number} x - X coordinate 
 * @param {number} y - Y coordinate
 * @returns {CustomPoint} Custom point object
 */
export const createSimplePoint = (x: number, y: number): CustomPoint => {
  return { x, y };
};
