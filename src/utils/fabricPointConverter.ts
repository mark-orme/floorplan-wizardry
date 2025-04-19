
import { Point as FabricPoint } from 'fabric';

/**
 * Interface for a simple point object
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Convert a simple point object to a Fabric.js Point
 * @param point The simple point object
 * @returns A Fabric.js Point
 */
export function toFabricPoint(point: Point): FabricPoint {
  return new FabricPoint(point.x, point.y);
}

/**
 * Convert a Fabric.js Point to a simple point object
 * @param fabricPoint The Fabric.js Point
 * @returns A simple point object
 */
export function fromFabricPoint(fabricPoint: FabricPoint): Point {
  return { x: fabricPoint.x, y: fabricPoint.y };
}

/**
 * Determine if an object is a valid point
 * @param point The object to check
 * @returns Whether the object is a valid point
 */
export function isValidPoint(point: any): point is Point {
  return (
    point !== null &&
    typeof point === 'object' &&
    typeof point.x === 'number' &&
    typeof point.y === 'number'
  );
}
