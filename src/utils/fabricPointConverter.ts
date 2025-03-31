
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
