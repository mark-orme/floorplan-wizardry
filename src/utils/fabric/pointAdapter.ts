
/**
 * Point adapter utility
 * Converts between various point formats used in the application
 */
import { Point as FabricPoint } from 'fabric';

/**
 * Simple point interface
 */
export interface SimplePoint {
  x: number;
  y: number;
}

/**
 * Creates a Fabric.js Point from a simple point object
 * @param point Simple point with x and y coordinates
 * @returns Fabric.js Point object
 */
export function toFabricPoint(point: SimplePoint): FabricPoint {
  return new FabricPoint(point.x, point.y);
}

/**
 * Converts a Fabric.js Point to a simple point object
 * @param point Fabric.js Point object
 * @returns Simple point with x and y coordinates
 */
export function fromFabricPoint(point: FabricPoint): SimplePoint {
  return { x: point.x, y: point.y };
}

/**
 * Creates an array of Fabric.js Points from an array of simple points
 * @param points Array of simple points
 * @returns Array of Fabric.js Points
 */
export function toFabricPoints(points: SimplePoint[]): FabricPoint[] {
  return points.map(point => toFabricPoint(point));
}

/**
 * Converts an array of Fabric.js Points to an array of simple points
 * @param points Array of Fabric.js Points
 * @returns Array of simple points
 */
export function fromFabricPoints(points: FabricPoint[]): SimplePoint[] {
  return points.map(point => fromFabricPoint(point));
}
