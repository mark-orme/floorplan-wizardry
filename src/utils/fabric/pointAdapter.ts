
/**
 * Point adapter for Fabric.js Point conversion
 * Provides utilities to convert between Fabric.js Point and our custom Point interface
 */
import { Point as FabricPoint } from 'fabric';
import { Point as CustomPoint } from '@/types/core/Point';

/**
 * Convert a standard {x, y} object to a Fabric.js Point
 */
export function toFabricPoint(point: { x: number; y: number }): FabricPoint {
  return new FabricPoint(point.x, point.y);
}

/**
 * Convert a Fabric.js Point to our standard Point interface
 */
export function toCustomPoint(fabricPoint: FabricPoint): CustomPoint {
  return { x: fabricPoint.x, y: fabricPoint.y };
}

/**
 * Check if an object is a Fabric.js Point
 */
export function isFabricPoint(point: any): point is FabricPoint {
  return point && point.type === 'point' && typeof point.x === 'number' && typeof point.y === 'number';
}

/**
 * Create a compatible Point object based on the context
 * Uses Fabric.js Point for Fabric.js operations, and CustomPoint for our app
 */
export function createCompatiblePoint(x: number, y: number, forFabric = false): FabricPoint | CustomPoint {
  return forFabric ? new FabricPoint(x, y) : { x, y };
}

/**
 * Safely handle a point that could be either type
 */
export function ensureCompatiblePoint(point: FabricPoint | CustomPoint | { x: number; y: number }): CustomPoint {
  if (isFabricPoint(point)) {
    return toCustomPoint(point);
  }
  return { x: point.x, y: point.y };
}
