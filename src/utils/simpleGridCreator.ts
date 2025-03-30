
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";

/**
 * Snap a point to the nearest grid point
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} [gridSize] - Optional grid size to snap to (defaults to small grid size)
 * @returns {{ x: number, y: number }} Snapped coordinates
 */
export const snapPointToGrid = (x: number, y: number, gridSize?: number): { x: number, y: number } => {
  const snapSize = gridSize || GRID_CONSTANTS.SMALL_GRID_SIZE;
  
  return {
    x: Math.round(x / snapSize) * snapSize,
    y: Math.round(y / snapSize) * snapSize
  };
};

/**
 * Create a simple grid on the canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Create small grid lines
  for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
    const line = new Line([i, 0, i, height], {
      stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
    const line = new Line([0, i, width, i], {
      stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create large grid lines
  for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const line = new Line([i, 0, i, height], {
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const line = new Line([0, i, width, i], {
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  canvas.requestRenderAll();
  return gridObjects;
};

/**
 * Ensure grid is visible on canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @returns {boolean} Whether any fixes were applied
 */
export const ensureGridVisible = (canvas: FabricCanvas, gridObjects: FabricObject[]): boolean => {
  if (!canvas || !gridObjects.length) return false;
  
  let fixesApplied = false;
  
  // Check if each grid object is on canvas
  gridObjects.forEach(obj => {
    if (!canvas.contains(obj)) {
      canvas.add(obj);
      fixesApplied = true;
    }
  });
  
  if (fixesApplied) {
    canvas.requestRenderAll();
  }
  
  return fixesApplied;
};

/**
 * Force grid recreation when needed
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {FabricObject[]} currentGrid - Current grid objects
 * @returns {FabricObject[]} New grid objects
 */
export const forceGridRecreation = (canvas: FabricCanvas, currentGrid: FabricObject[]): FabricObject[] => {
  if (!canvas) return [];
  
  // Remove existing grid objects
  if (currentGrid.length > 0) {
    currentGrid.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
  }
  
  // Create new grid
  return createSimpleGrid(canvas);
};
