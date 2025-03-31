
/**
 * Utility functions for converting between application Point and Fabric.js Point types
 * Ensures consistent point conversion throughout the application
 * 
 * @module utils/fabricPointConverter
 */
import { Point as FabricPoint } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Convert application Point to Fabric.js Point
 * Creates a new Fabric.js Point object from x,y coordinates
 * 
 * @param {Point} point - Application point object
 * @returns {FabricPoint} Fabric.js Point instance
 */
export function toFabricPoint(point: Point): FabricPoint {
  return new FabricPoint(point.x, point.y);
}

/**
 * Alias for toFabricPoint for backward compatibility
 * @deprecated Use toFabricPoint instead
 */
export const createFabricPoint = toFabricPoint;

/**
 * Convert Fabric.js Point to application Point
 * Extracts x,y coordinates from Fabric.js Point object
 * 
 * @param {FabricPoint} fabricPoint - Fabric.js Point instance
 * @returns {Point} Application point object with x,y coordinates
 */
export function toAppPoint(fabricPoint: FabricPoint): Point {
  return { x: fabricPoint.x, y: fabricPoint.y };
}

/**
 * Alias for toAppPoint for backward compatibility
 * @deprecated Use toAppPoint instead
 */
export const fromFabricPoint = toAppPoint;

/**
 * Safely convert a potentially null or undefined point
 * Provides a fallback for invalid points
 * 
 * @param {Point | null | undefined} point - Point to convert
 * @param {Point} defaultPoint - Default point to use if input is null/undefined
 * @returns {FabricPoint} Fabric.js Point instance
 */
export function safeToFabricPoint(
  point: Point | null | undefined, 
  defaultPoint: Point = { x: 0, y: 0 }
): FabricPoint {
  if (!point) {
    return new FabricPoint(defaultPoint.x, defaultPoint.y);
  }
  return new FabricPoint(point.x, point.y);
}

/**
 * Convert an array of application Points to an array of Fabric.js Points
 * 
 * @param {Point[]} points - Array of application points
 * @returns {FabricPoint[]} Array of Fabric.js Points
 */
export function pointsArrayToFabric(points: Point[]): FabricPoint[] {
  return points.map(point => toFabricPoint(point));
}

/**
 * Convert an array of Fabric.js Points to an array of application Points
 * 
 * @param {FabricPoint[]} fabricPoints - Array of Fabric.js Points
 * @returns {Point[]} Array of application points
 */
export function fabricPointsToAppPoints(fabricPoints: FabricPoint[]): Point[] {
  return fabricPoints.map(point => toAppPoint(point));
}

/**
 * Check if a value is an application Point
 * 
 * @param {unknown} value - Value to check
 * @returns {boolean} Whether the value is an application Point
 */
export function isAppPoint(value: unknown): value is Point {
  return Boolean(
    value && 
    typeof value === 'object' && 
    'x' in value && 
    'y' in value &&
    typeof (value as Point).x === 'number' &&
    typeof (value as Point).y === 'number'
  );
}

/**
 * Extract a Point from a mouse or touch event
 * 
 * @param {MouseEvent | TouchEvent} event - Event to extract point from
 * @returns {Point | null} Extracted point or null if not possible
 */
export function getPointFromEvent(event: MouseEvent | TouchEvent): Point | null {
  if ('touches' in event && event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  } else if ('clientX' in event && 'clientY' in event) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }
  return null;
}
