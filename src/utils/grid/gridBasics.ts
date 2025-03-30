
/**
 * Grid basic utilities
 * Core functions for basic grid operations
 * @module utils/grid/gridBasics
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Create a basic grid with simple styling
 * @param canvas Fabric canvas
 * @returns Array of created grid objects
 */
export const createBasicGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) return [];
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create vertical lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating basic grid:", error);
    return [];
  }
};

/**
 * Clear grid objects from canvas
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects to clear
 */
export const clearGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) return;
  
  try {
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Error clearing grid:", error);
  }
};

/**
 * Check if canvas is valid for grid creation
 * @param canvas Fabric canvas
 * @returns Whether canvas is valid for grid
 */
export const isCanvasValidForGrid = (
  canvas: FabricCanvas
): boolean => {
  return !!canvas && !!canvas.width && !!canvas.height && 
         canvas.width > 0 && canvas.height > 0;
};

/**
 * Create a simple grid on canvas
 * @param canvas Fabric canvas
 * @returns Array of created grid objects
 */
export const createSimpleGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!isCanvasValidForGrid(canvas)) {
    console.error("Cannot create simple grid: Invalid canvas");
    return [];
  }
  
  return createBasicGrid(canvas);
};
