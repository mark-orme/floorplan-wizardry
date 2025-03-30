
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { Line } from 'fabric';

/**
 * Create a simple grid on the canvas
 * @param canvas Fabric canvas instance
 * @returns Array of created grid objects
 */
export const createSimpleGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) return [];
  
  try {
    // Get canvas dimensions
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
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
        objectType: 'grid',
        isGrid: true
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
        objectType: 'grid',
        isGrid: true
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
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Force render
    canvas.requestRenderAll();
    console.log(`Created ${gridObjects.length} grid objects`);
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating grid:", error);
    return [];
  }
};

/**
 * Clear grid from canvas
 * @param canvas Fabric canvas instance
 * @param gridObjects Grid objects to remove
 */
export const clearGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) return;
  
  try {
    // Remove each grid object
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    // Force render
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Error clearing grid:", error);
  }
};

/**
 * Check if canvas is valid for grid creation
 * @param canvas Fabric canvas instance
 * @returns Whether canvas is valid for grid
 */
export const isCanvasValidForGrid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  // Check if canvas has valid dimensions
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    return false;
  }
  
  return true;
};
