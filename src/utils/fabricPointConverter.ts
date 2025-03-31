
/**
 * Fabric point conversion utilities
 * @module utils/fabricPointConverter
 */
import { Point as FabricPoint } from 'fabric';
import type { Point } from '@/types/core/Point';

/**
 * Convert a Fabric Point to our Point type
 * @param fabricPoint - Fabric.js Point object
 * @returns Point object in our format
 */
export const fromFabricPoint = (fabricPoint: FabricPoint): Point => {
  return {
    x: fabricPoint.x,
    y: fabricPoint.y
  };
};

/**
 * Convert our Point type to a Fabric Point
 * @param point - Point in our format
 * @returns Fabric.js Point object
 */
export const toFabricPoint = (point: Point): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Create a Fabric Point from coordinates
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Fabric.js Point object
 */
export const createFabricPoint = (x: number, y: number): FabricPoint => {
  return new FabricPoint(x, y);
};

/**
 * Convert our Point type to a generic application point
 * (This is an alias for backward compatibility)
 * @param point - Point in our format
 * @returns Same point (for API compatibility)
 */
export const toAppPoint = (point: Point): Point => {
  return { x: point.x, y: point.y };
};

/**
 * Extract a Point from a mouse or touch event
 * @param event - Mouse or touch event
 * @returns Point with x and y coordinates
 */
export const getPointFromEvent = (event: MouseEvent | TouchEvent): Point => {
  if ('touches' in event) {
    // Touch event
    const touch = event.touches[0] || event.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  } else {
    // Mouse event
    return { x: event.clientX, y: event.clientY };
  }
};

/**
 * Type guard to check if a value is a valid Point
 * @param value - Value to check
 * @returns Whether the value is a valid Point
 */
export const isAppPoint = (value: any): value is Point => {
  return value && 
    typeof value === 'object' && 
    'x' in value && 
    'y' in value && 
    typeof value.x === 'number' && 
    typeof value.y === 'number';
};
