
/**
 * Grid Utilities
 * Common utility functions for grid operations
 * @module utils/grid/gridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GridLine, GridObject, isGridObject } from './gridTypes';

/**
 * Filter grid objects from a list of fabric objects
 * @param objects Array of fabric objects
 * @returns Array of grid objects
 */
export function filterGridObjects(objects: FabricObject[]): GridObject[] {
  return objects.filter(isGridObject) as GridObject[];
}

/**
 * Check if an object is a grid line
 * @param obj Fabric object to check
 * @returns True if the object is a grid line
 */
export function isGridLine(obj: FabricObject): obj is GridLine {
  return isGridObject(obj) && 'x1' in obj && 'y1' in obj && 'x2' in obj && 'y2' in obj;
}

/**
 * Find all grid objects on a canvas
 * @param canvas Fabric canvas
 * @returns Array of grid objects
 */
export function findGridObjects(canvas: FabricCanvas): GridObject[] {
  const allObjects = canvas.getObjects();
  return filterGridObjects(allObjects);
}

/**
 * Remove all grid objects from a canvas
 * @param canvas Fabric canvas
 * @returns Number of objects removed
 */
export function removeAllGridObjects(canvas: FabricCanvas): number {
  const gridObjects = findGridObjects(canvas);
  
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  canvas.requestRenderAll();
  
  return gridObjects.length;
}

/**
 * Snap a point to the nearest grid point
 * @param point Point to snap
 * @param gridSize Grid size
 * @returns Snapped point
 */
export function snapToGrid(point: { x: number; y: number }, gridSize: number): { x: number; y: number } {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Calculate the distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance
 */
export function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find the closest grid line to a point
 * @param point Point to check
 * @param gridLines Array of grid lines
 * @param threshold Maximum distance to consider
 * @returns Closest grid line or null if none found
 */
export function findClosestGridLine(
  point: { x: number; y: number },
  gridLines: GridLine[],
  threshold: number = 10
): GridLine | null {
  let closest: GridLine | null = null;
  let minDistance = threshold;
  
  for (const line of gridLines) {
    // For horizontal lines
    if (line.y1 === line.y2) {
      const d = Math.abs(point.y - line.y1);
      if (d < minDistance && point.x >= line.x1 && point.x <= line.x2) {
        minDistance = d;
        closest = line;
      }
    } 
    // For vertical lines
    else if (line.x1 === line.x2) {
      const d = Math.abs(point.x - line.x1);
      if (d < minDistance && point.y >= line.y1 && point.y <= line.y2) {
        minDistance = d;
        closest = line;
      }
    }
  }
  
  return closest;
}

/**
 * Show or hide all grid objects
 * @param canvas Fabric canvas
 * @param visible Whether grid should be visible
 */
export function setGridVisibility(canvas: FabricCanvas, visible: boolean): void {
  const gridObjects = findGridObjects(canvas);
  
  gridObjects.forEach(obj => {
    obj.set('visible', visible);
  });
  
  canvas.requestRenderAll();
}
