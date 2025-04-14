
import { Point as FabricPoint } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Convert a Point to a FabricPoint
 * @param point The point to convert
 * @returns A FabricPoint instance
 */
export const toFabricPoint = (point: Point): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Convert a FabricPoint to a Point
 * @param fabricPoint The FabricPoint to convert
 * @returns A Point object
 */
export const fromFabricPoint = (fabricPoint: FabricPoint): Point => {
  return { x: fabricPoint.x, y: fabricPoint.y };
};
