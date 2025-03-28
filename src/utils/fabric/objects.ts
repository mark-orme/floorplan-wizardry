
/**
 * Fabric object utilities
 * @module utils/fabric/objects
 */

import { Canvas, Object as FabricObject, Point as FabricPoint } from 'fabric';
import { Point } from '@/types/geometryTypes';
import { isCanvasValid } from './canvasValidation';

/**
 * Create a point object from coordinates
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Fabric point
 */
export function createFabricPoint(x: number, y: number): FabricPoint {
  return new FabricPoint(x, y);
}

/**
 * Convert a regular point to a Fabric point
 * @param point Regular point
 * @returns Fabric point
 */
export function toFabricPoint(point: Point): FabricPoint {
  return new FabricPoint(point.x, point.y);
}

/**
 * Convert a Fabric point to a regular point
 * @param point Fabric point
 * @returns Regular point
 */
export function fromFabricPoint(point: FabricPoint): Point {
  return { x: point.x, y: point.y };
}

/**
 * Check if an object is selectable
 * @param obj Fabric object
 * @returns True if object is selectable
 */
export function isObjectSelectable(obj: FabricObject): boolean {
  return obj.selectable || false;
}

/**
 * Set object selectability
 * @param obj Fabric object
 * @param selectable Selectable flag
 */
export function setObjectSelectable(obj: FabricObject, selectable: boolean): void {
  obj.selectable = selectable;
}

/**
 * Get all selectable objects from canvas
 * @param canvas Fabric canvas
 * @returns Array of selectable objects
 */
export function getSelectableObjects(canvas: Canvas | null): FabricObject[] {
  if (!isCanvasValid(canvas)) return [];
  
  return canvas!.getObjects().filter(isObjectSelectable);
}

/**
 * Set multiple objects' selectability
 * @param objects Array of Fabric objects
 * @param selectable Selectable flag
 */
export function setObjectsSelectable(objects: FabricObject[], selectable: boolean): void {
  objects.forEach(obj => setObjectSelectable(obj, selectable));
}

/**
 * Check if an object is a grid object
 * @param obj Fabric object
 * @returns True if object is a grid object
 */
export function isGridObject(obj: FabricObject): boolean {
  return (obj as any).isGrid === true;
}

/**
 * Get non-grid objects from canvas
 * @param canvas Fabric canvas
 * @returns Array of non-grid objects
 */
export function getNonGridObjects(canvas: Canvas | null): FabricObject[] {
  if (!isCanvasValid(canvas)) return [];
  
  return canvas!.getObjects().filter(obj => !isGridObject(obj));
}
