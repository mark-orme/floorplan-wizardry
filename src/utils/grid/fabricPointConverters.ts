
/**
 * Fabric.js point conversion utilities
 * Provides functions for converting between application points and Fabric.js points
 * @module grid/fabricPointConverters
 */
import { Point as FabricPoint } from "fabric";
import { Point } from "@/types/drawingTypes";

/**
 * Conversion constants
 */
export const POINT_CONVERSION = {
  /**
   * Default x-coordinate for fallback
   * @constant {number}
   */
  DEFAULT_X: 0,
  
  /**
   * Default y-coordinate for fallback
   * @constant {number}
   */
  DEFAULT_Y: 0,
  
  /**
   * Tolerance for point equality comparison
   * @constant {number}
   */
  EQUALITY_TOLERANCE: 0.001
};

/**
 * Creates a Fabric.js point from application point
 * @param {Point} point - Application point with x,y coordinates
 * @returns {FabricPoint} Fabric.js compatible point
 */
export const createFabricPoint = (point: Point): FabricPoint => {
  const x = typeof point.x === 'number' ? point.x : POINT_CONVERSION.DEFAULT_X;
  const y = typeof point.y === 'number' ? point.y : POINT_CONVERSION.DEFAULT_Y;
  return new FabricPoint(x, y);
};

/**
 * Converts an application Point to raw coordinates object
 * @param {Point} point - Application point with x,y coordinates
 * @returns Object with x,y coordinates compatible with Fabric.js
 */
export const toFabricPointCoords = (point: Point): {x: number, y: number} => {
  return {
    x: typeof point.x === 'number' ? point.x : POINT_CONVERSION.DEFAULT_X,
    y: typeof point.y === 'number' ? point.y : POINT_CONVERSION.DEFAULT_Y
  };
};

/**
 * Converts a Fabric.js point to application Point
 * @param {FabricPoint | {x: number, y: number}} fabricPoint - Fabric.js point
 * @returns {Point} Application point
 */
export const fromFabricPoint = (fabricPoint: FabricPoint | {x: number, y: number}): Point => {
  return {
    x: typeof fabricPoint.x === 'number' ? fabricPoint.x : POINT_CONVERSION.DEFAULT_X,
    y: typeof fabricPoint.y === 'number' ? fabricPoint.y : POINT_CONVERSION.DEFAULT_Y
  };
};

/**
 * Checks if two points are approximately equal
 * @param {Point} point1 - First point
 * @param {Point} point2 - Second point
 * @param {number} [tolerance] - Tolerance for equality comparison
 * @returns {boolean} True if points are approximately equal
 */
export const arePointsEqual = (
  point1: Point, 
  point2: Point, 
  tolerance = POINT_CONVERSION.EQUALITY_TOLERANCE
): boolean => {
  return (
    Math.abs(point1.x - point2.x) < tolerance &&
    Math.abs(point1.y - point2.y) < tolerance
  );
};
