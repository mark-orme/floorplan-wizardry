
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
