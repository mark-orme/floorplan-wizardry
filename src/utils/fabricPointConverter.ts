
/**
 * Utility functions for converting between different point formats
 * @module fabricPointConverter
 */
import { Point as FabricPoint } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Converts a Point to a FabricPoint
 * @param {Point} point - The point to convert
 * @returns {FabricPoint} The FabricPoint
 */
export const toFabricPoint = (point: Point): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Converts a FabricPoint to a Point
 * @param {FabricPoint} point - The fabric point to convert
 * @returns {Point} The Point
 */
export const fromFabricPoint = (point: FabricPoint): Point => {
  return { x: point.x, y: point.y };
};

/**
 * Creates a FabricPoint-compatible object
 * For use when a full FabricPoint instance is not needed
 * @param {Point} point - The point to convert
 * @returns {object} A plain object with x,y coordinates
 */
export const toFabricPointLike = (point: Point): {x: number, y: number} => {
  return {x: point.x, y: point.y};
};

/**
 * Safely ensures a value is a valid Point
 * @param {any} value - The value to check and normalize
 * @returns {Point} A valid Point
 */
export const normalizePoint = (value: any): Point => {
  if (!value) return {x: 0, y: 0};
  
  return {
    x: typeof value.x === 'number' ? value.x : 0,
    y: typeof value.y === 'number' ? value.y : 0
  };
};
