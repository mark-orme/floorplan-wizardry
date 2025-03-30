
/**
 * Simple Grid Creation Utility
 * A reliable and simplified grid creation utility
 * @module utils/grid/simpleGrid
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

/**
 * Creates a simple, reliable grid on the canvas
 * 
 * @param {FabricCanvas} canvas - The canvas to add grid to
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    console.error("Cannot create grid: Invalid canvas dimensions");
    return [];
  }
  
  console.log("Creating simple grid with dimensions:", canvas.width, "x", canvas.height);
  
  // Get dimensions for grid calculation
  const width = canvas.getWidth ? canvas.getWidth() : canvas.width;
  const height = canvas.getHeight ? canvas.getHeight() : canvas.height;
  
  const gridObjects: FabricObject[] = [];
  
  try {
    // Create small grid lines
    const smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    
    // Create horizontal small grid lines
    for (let y = 0; y <= height; y += smallGridSize) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Add custom properties for identification
      Object.assign(line, { objectType: 'grid', gridType: 'small' });
      
      canvas.add(line);
      // Use sendObjectToBack instead of sendToBack
      if (canvas.sendObjectToBack) {
        canvas.sendObjectToBack(line);
      }
      gridObjects.push(line);
    }
    
    // Create vertical small grid lines
    for (let x = 0; x <= width; x += smallGridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Add custom properties for identification
      Object.assign(line, { objectType: 'grid', gridType: 'small' });
      
      canvas.add(line);
      // Use sendObjectToBack instead of sendToBack
      if (canvas.sendObjectToBack) {
        canvas.sendObjectToBack(line);
      }
      gridObjects.push(line);
    }
    
    // Create large grid lines
    const largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
    
    // Create horizontal large grid lines
    for (let y = 0; y <= height; y += largeGridSize) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Add custom properties for identification
      Object.assign(line, { objectType: 'grid', gridType: 'large' });
      
      canvas.add(line);
      // Use sendObjectToBack instead of sendToBack
      if (canvas.sendObjectToBack) {
        canvas.sendObjectToBack(line);
      }
      gridObjects.push(line);
    }
    
    // Create vertical large grid lines
    for (let x = 0; x <= width; x += largeGridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Add custom properties for identification
      Object.assign(line, { objectType: 'grid', gridType: 'large' });
      
      canvas.add(line);
      // Use sendObjectToBack instead of sendToBack
      if (canvas.sendObjectToBack) {
        canvas.sendObjectToBack(line);
      }
      gridObjects.push(line);
    }
    
    // Force render all
    canvas.requestRenderAll();
    
    console.log(`Grid created successfully with ${gridObjects.length} lines`);
    return gridObjects;
  } catch (error) {
    console.error("Error creating grid:", error);
    return [];
  }
};

/**
 * Clears all grid objects from the canvas
 * 
 * @param {FabricCanvas} canvas - The canvas to clear grid from
 * @param {FabricObject[]} gridObjects - Grid objects to clear
 */
export const clearGrid = (canvas: FabricCanvas, gridObjects: FabricObject[]): void => {
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
 * 
 * @param {FabricCanvas} canvas - Canvas to check
 * @returns {boolean} Whether canvas is valid
 */
export const isCanvasValidForGrid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    const width = canvas.getWidth ? canvas.getWidth() : canvas.width;
    const height = canvas.getHeight ? canvas.getHeight() : canvas.height;
    
    return width > 0 && height > 0 && !canvas.disposed;
  } catch (error) {
    console.error("Error validating canvas:", error);
    return false;
  }
};
