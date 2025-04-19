
import { Point } from 'fabric';

/**
 * Convert a simple {x, y} object to a Fabric.js Point
 * @param point Simple point object with x and y coordinates
 * @returns Fabric.js Point instance
 */
export function toFabricPoint(point: {x: number, y: number}): Point {
  return new Point(point.x, point.y);
}

/**
 * Convert a Fabric.js Point to a simple {x, y} object
 * @param point Fabric.js Point instance
 * @returns Simple object with x and y properties
 */
export function fromFabricPoint(point: Point): {x: number, y: number} {
  return {x: point.x, y: point.y};
}
