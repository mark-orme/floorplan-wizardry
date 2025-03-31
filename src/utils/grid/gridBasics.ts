
/**
 * Grid basics utilities
 * Provides core grid creation and management functions
 * @module utils/grid/gridBasics
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

/**
 * Create a basic grid
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create grid: Canvas is null");
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridSize = GRID_CONSTANTS.GRID_SIZE;
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.GRID_COLOR,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.GRID_COLOR,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid:", error);
    return [];
  }
};

/**
 * Create a simple grid on canvas
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create simple grid: Canvas is null");
    return [];
  }
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: 'default'
      });
      
      // Add metadata to identify as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating simple grid:", error);
    return [];
  }
};

/**
 * Clear grid objects from canvas
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {boolean} Whether cleanup was successful
 */
export const clearGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) {
    return false;
  }
  
  try {
    // Find grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length === 0) {
      return true;
    }
    
    // Remove grid objects
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error cleaning up grid:", error);
    return false;
  }
};

/**
 * Check if canvas is valid for grid creation
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {boolean} Whether canvas is valid
 */
export const isCanvasValidForGrid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  return Boolean(
    canvas && 
    canvas.width && 
    canvas.height && 
    canvas.width > 0 && 
    canvas.height > 0
  );
};

/**
 * Reorder grid objects to be at the back of canvas
 * @param {FabricCanvas} canvas - Fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 */
export const reorderGridObjects = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) return;
  
  try {
    // Move all grid objects to the back
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.sendObjectToBack(obj);
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Error reordering grid objects:", error);
  }
};
