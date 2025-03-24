
import { Point as FabricPoint } from 'fabric';
import { Point as CustomPoint } from './drawingTypes';

/**
 * Converts our custom Point type to Fabric.js Point
 * @param point Our custom point
 * @returns Fabric.js Point
 */
export const toFabricPoint = (point: CustomPoint): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Converts Fabric.js Point to our custom Point type
 * @param point Fabric.js Point
 * @returns Our custom Point
 */
export const toCustomPoint = (point: FabricPoint): CustomPoint => {
  return { x: point.x, y: point.y };
};

/**
 * Creates a simple {x, y} object from values
 * (Used when we need a simple point object but not a full Fabric.js Point)
 */
export const createSimplePoint = (x: number, y: number): CustomPoint => {
  return { x, y };
};
