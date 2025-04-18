
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";

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
