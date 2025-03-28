
/**
 * Core grid management utilities
 * @module grid/core
 */
import { Canvas, Object as FabricObject, Line, Text } from "fabric";
import { Point } from "@/types/core/Point";
import { GRID_SPACING, SNAP_THRESHOLD } from "@/constants/numerics";

/**
 * Check if an object is a grid element
 * @param obj - Object to check
 * @returns Whether object is a grid element
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return obj.objectType === 'grid';
};

/**
 * Filter grid objects from an array
 * @param objects - Array of objects
 * @returns Array of grid objects
 */
export const filterGridObjects = (objects: FabricObject[]): FabricObject[] => {
  return objects.filter(isGridObject);
};

/**
 * Hide all grid objects on canvas
 * @param canvas - Canvas to hide grid on
 */
export const hideGrid = (canvas: Canvas): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(isGridObject);
  
  gridObjects.forEach(obj => {
    obj.visible = false;
  });
  
  canvas.requestRenderAll();
};

/**
 * Show all grid objects on canvas
 * @param canvas - Canvas to show grid on
 */
export const showGrid = (canvas: Canvas): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(isGridObject);
  
  gridObjects.forEach(obj => {
    obj.visible = true;
  });
  
  canvas.requestRenderAll();
};

/**
 * Snap a point to grid
 * @param point - Point to snap
 * @param gridSize - Grid size
 * @returns Snapped point
 */
export const snapToGrid = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Find nearest grid point
 * @param point - Reference point
 * @param gridSize - Grid size
 * @returns Nearest grid point
 */
export const findNearestGridPoint = (point: Point, gridSize: number): Point => {
  return snapToGrid(point, gridSize);
};

/**
 * Check if point is near a grid intersection
 * @param point - Point to check
 * @param gridSize - Grid size
 * @param threshold - Proximity threshold
 * @returns Whether point is near grid intersection
 */
export const isNearGridIntersection = (
  point: Point,
  gridSize: number,
  threshold: number = SNAP_THRESHOLD
): boolean => {
  const nearestPoint = findNearestGridPoint(point, gridSize);
  const dx = Math.abs(point.x - nearestPoint.x);
  const dy = Math.abs(point.y - nearestPoint.y);
  
  return dx <= threshold && dy <= threshold;
};

/**
 * Snap object to grid
 * @param obj - Object to snap
 * @param gridSize - Grid size
 */
export const snapObjectToGrid = (obj: FabricObject, gridSize: number): void => {
  if (!obj) return;
  
  // Get current position
  const x = obj.left || 0;
  const y = obj.top || 0;
  
  // Snap to nearest grid point
  const snapped = snapToGrid({ x, y }, gridSize);
  
  // Update position
  obj.set({
    left: snapped.x,
    top: snapped.y
  });
  
  // Update coordinates
  obj.setCoords();
};

/**
 * Calculate grid dimensions
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Grid dimensions
 */
export const calculateGridDimensions = (width: number, height: number): {
  width: number;
  height: number;
  smallGridSize: number;
  largeGridSize: number;
} => {
  return {
    width,
    height,
    smallGridSize: GRID_SPACING.SMALL,
    largeGridSize: GRID_SPACING.LARGE
  };
};
