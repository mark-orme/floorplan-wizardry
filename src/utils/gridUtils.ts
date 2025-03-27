
/**
 * Grid utility functions
 * @module utils/gridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { GRID_SPACING } from "@/constants/numerics";
import { Point } from "@/types/core/Point";

/**
 * Check if the canvas has an existing grid
 * @param canvas - The Fabric canvas
 * @returns Whether the canvas has a grid
 */
export const hasExistingGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  return canvas.getObjects().some((obj) => obj.data?.type === 'grid');
};

/**
 * Remove all grid objects from the canvas
 * @param canvas - The Fabric canvas
 * @returns Array of removed grid objects
 */
export const removeGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  const gridObjects = canvas.getObjects().filter((obj) => obj.data?.type === 'grid');
  
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  canvas.renderAll();
  return gridObjects;
};

/**
 * Set the visibility of the grid
 * @param canvas - The Fabric canvas
 * @param visible - Whether the grid should be visible
 */
export const setGridVisibility = (canvas: FabricCanvas, visible: boolean): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter((obj) => obj.data?.type === 'grid');
  
  gridObjects.forEach(obj => {
    obj.visible = visible;
  });
  
  canvas.renderAll();
};

/**
 * Filter grid objects from an array of objects
 * @param objects - Array of Fabric objects
 * @returns Array of grid objects
 */
export const filterGridObjects = (objects: FabricObject[]): FabricObject[] => {
  return objects.filter(obj => obj.data?.type === 'grid');
};

/**
 * Get the nearest grid point to a given point
 * @param point - The reference point
 * @param gridSize - The grid size
 * @returns The nearest grid point
 */
export const getNearestGridPoint = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Get the nearest grid intersection
 * @param point - The reference point
 * @param gridSize - The grid size
 * @returns The nearest grid intersection
 */
export const getNearestGridIntersection = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return getNearestGridPoint(point, gridSize);
};

/**
 * Calculate distance to nearest grid line
 * @param point - The reference point
 * @param gridSize - The grid size
 * @returns Object with distances to nearest horizontal and vertical grid lines
 */
export const distanceToNearestGridLine = (point: Point, gridSize: number = GRID_SPACING.SMALL): { x: number, y: number } => {
  const nearestX = Math.round(point.x / gridSize) * gridSize;
  const nearestY = Math.round(point.y / gridSize) * gridSize;
  
  return {
    x: Math.abs(point.x - nearestX),
    y: Math.abs(point.y - nearestY)
  };
};

/**
 * Create a grid on the canvas
 * @param canvas - The Fabric canvas
 * @param config - Grid configuration
 * @returns Created grid objects
 */
export const createGrid = (canvas: FabricCanvas, config: any = {}): FabricObject[] => {
  if (!canvas) return [];
  
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  const smallGridSize = GRID_SPACING.SMALL;
  const largeGridSize = GRID_SPACING.LARGE;
  
  const gridObjects: FabricObject[] = [];
  
  // Create small grid
  for (let x = 0; x <= width; x += smallGridSize) {
    const line = new fabric.Line([x, 0, x, height], {
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      data: { type: 'grid', size: 'small' }
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let y = 0; y <= height; y += smallGridSize) {
    const line = new fabric.Line([0, y, width, y], {
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      data: { type: 'grid', size: 'small' }
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create large grid
  for (let x = 0; x <= width; x += largeGridSize) {
    const line = new fabric.Line([x, 0, x, height], {
      stroke: '#b0b0b0',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'grid', size: 'large' }
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let y = 0; y <= height; y += largeGridSize) {
    const line = new fabric.Line([0, y, width, y], {
      stroke: '#b0b0b0',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      data: { type: 'grid', size: 'large' }
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  canvas.renderAll();
  return gridObjects;
};
