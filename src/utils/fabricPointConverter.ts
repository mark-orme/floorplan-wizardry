
/**
 * Utilities for converting between application points and Fabric.js points
 * @module utils/fabricPointConverter
 */
import { Point as FabricPoint } from 'fabric';

/**
 * Convert a plain point object to a Fabric.js Point
 * @param point Plain object with x and y coordinates
 * @returns Fabric.js Point
 */
export const toFabricPoint = (point: { x: number; y: number }): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Convert a Fabric.js Point to a plain point object
 * @param point Fabric.js Point
 * @returns Plain object with x and y coordinates
 */
export const fromFabricPoint = (point: FabricPoint): { x: number; y: number } => {
  return { x: point.x, y: point.y };
};
