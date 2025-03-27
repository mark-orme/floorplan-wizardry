
/**
 * Grid utilities to be used by other grid-related modules
 * @module utils/grid/gridUtils
 */
import { GRID_SPACING } from '@/constants/numerics';
import { Point } from '@/types/core/Point';

/**
 * Get the small grid spacing value
 * @returns small grid spacing in pixels
 */
export const getSmallGridSpacing = (): number => {
  return GRID_SPACING.SMALL;
};

/**
 * Get the large grid spacing value
 * @returns large grid spacing in pixels
 */
export const getLargeGridSpacing = (): number => {
  return GRID_SPACING.LARGE;
};

/**
 * Convert object that may contain GRID_SPACING to actual number values
 * @param value - Value which may be a GRID_SPACING object or a number
 * @param defaultValue - Default value to return if conversion fails
 * @returns A number value
 */
export const ensureGridSpacingNumber = (value: any, defaultValue: number = 10): number => {
  if (typeof value === 'number') {
    return value;
  }
  
  if (value && typeof value === 'object' && 'SMALL' in value) {
    return value.SMALL;
  }
  
  return defaultValue;
};

/**
 * Convert grid spacing to meters
 * @param pixels - Grid spacing in pixels
 * @returns Grid spacing in meters
 */
export const gridSpacingToMeters = (pixels: number): number => {
  return pixels / getLargeGridSpacing();
};

/**
 * Convert meters to grid spacing
 * @param meters - Distance in meters
 * @returns Distance in pixels
 */
export const metersToGridSpacing = (meters: number): number => {
  return meters * getLargeGridSpacing();
};

/**
 * Check if a grid exists on the canvas
 * @param canvas - Fabric canvas
 * @returns True if grid exists
 */
export const hasExistingGrid = (canvas: any): boolean => {
  if (!canvas) return false;
  
  const objects = canvas.getObjects();
  return objects.some((obj: any) => obj.objectType === 'grid');
};

/**
 * Remove grid from canvas
 * @param canvas - Fabric canvas
 */
export const removeGrid = (canvas: any): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter((obj: any) => 
    obj.objectType === 'grid');
  
  gridObjects.forEach((obj: any) => canvas.remove(obj));
  canvas.renderAll();
};

/**
 * Set visibility of grid objects
 * @param canvas - Fabric canvas
 * @param visible - Whether grid should be visible
 */
export const setGridVisibility = (canvas: any, visible: boolean): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter((obj: any) => 
    obj.objectType === 'grid');
  
  gridObjects.forEach((obj: any) => obj.set({ visible }));
  canvas.renderAll();
};

/**
 * Filter grid objects from canvas objects
 * @param objects - Array of canvas objects
 * @returns Non-grid objects
 */
export const filterGridObjects = (objects: any[]): any[] => {
  return objects.filter(obj => !obj.objectType || obj.objectType !== 'grid');
};

/**
 * Get the nearest grid point to a given point
 * @param point - The reference point
 * @param gridSize - Grid size to snap to
 * @returns The nearest grid point
 */
export const getNearestGridPoint = (point: { x: number, y: number }, gridSize: number): { x: number, y: number } => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Get the nearest grid intersection to a point
 * @param point - The reference point
 * @param gridSize - Grid size to snap to
 * @returns The nearest grid intersection point
 */
export const getNearestGridIntersection = (point: { x: number, y: number }, gridSize: number): { x: number, y: number } => {
  return getNearestGridPoint(point, gridSize);
};

/**
 * Calculate distance to the nearest grid line
 * @param point - The reference point
 * @param gridSize - Grid size
 * @returns Distance to the nearest grid line
 */
export const distanceToNearestGridLine = (point: { x: number, y: number }, gridSize: number): number => {
  const xDist = point.x % gridSize;
  const yDist = point.y % gridSize;
  
  const xDistToLine = Math.min(xDist, gridSize - xDist);
  const yDistToLine = Math.min(yDist, gridSize - yDist);
  
  return Math.min(xDistToLine, yDistToLine);
};
