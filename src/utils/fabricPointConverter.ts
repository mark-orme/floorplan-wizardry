
import { Point as FabricPoint } from 'fabric';
import { Point } from '@/types/core/Point';
import { createPoint } from '@/types/core/Point';

/**
 * Convert a Point to a FabricPoint
 * @param point The point to convert
 * @returns A FabricPoint instance
 */
export const toFabricPoint = (point: Point): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Create a FabricPoint from a Point (alias for toFabricPoint)
 * @param point The point to convert
 * @returns A FabricPoint instance
 */
export const createFabricPoint = (point: Point): FabricPoint => {
  return toFabricPoint(point);
};

/**
 * Convert a FabricPoint to a Point
 * @param fabricPoint The FabricPoint to convert
 * @returns A Point object
 */
export const fromFabricPoint = (fabricPoint: FabricPoint): Point => {
  return createPoint(fabricPoint.x, fabricPoint.y);
};

/**
 * Alias for fromFabricPoint
 */
export const toAppPoint = fromFabricPoint;

/**
 * Safely convert a possibly null/undefined point to a FabricPoint
 * @param point The point to convert, or null/undefined
 * @param defaultPoint Optional default point to use if point is null/undefined
 * @returns A FabricPoint instance
 */
export const safeToFabricPoint = (point: Point | null | undefined, defaultPoint?: Point): FabricPoint => {
  if (!point) {
    return new FabricPoint(defaultPoint?.x || 0, defaultPoint?.y || 0);
  }
  return toFabricPoint(point);
};

/**
 * Convert an array of Points to an array of FabricPoints
 * @param points Array of Points to convert
 * @returns Array of FabricPoints
 */
export const pointsArrayToFabric = (points: Point[]): FabricPoint[] => {
  return points.map(point => toFabricPoint(point));
};

/**
 * Convert an array of FabricPoints to an array of Points
 * @param fabricPoints Array of FabricPoints to convert
 * @returns Array of Points
 */
export const fabricPointsToAppPoints = (fabricPoints: FabricPoint[]): Point[] => {
  return fabricPoints.map(point => fromFabricPoint(point));
};

/**
 * Extract a Point from a mouse or touch event
 * @param event The mouse or touch event
 * @returns A Point or null if event is invalid
 */
export const getPointFromEvent = (event: MouseEvent | TouchEvent): Point | null => {
  if ('clientX' in event && 'clientY' in event) {
    // Mouse event
    return createPoint(event.clientX, event.clientY);
  } else if ('touches' in event && event.touches.length > 0) {
    // Touch event
    return createPoint(event.touches[0].clientX, event.touches[0].clientY);
  }
  return null;
};

/**
 * Check if an object is a valid Point
 * @param point The object to check
 * @returns True if object is a valid Point
 */
export const isAppPoint = (point: any): point is Point => {
  return point !== null 
    && typeof point === 'object'
    && 'x' in point 
    && 'y' in point
    && typeof point.x === 'number'
    && typeof point.y === 'number';
};
