
/**
 * Grid basics utilities
 * Provides core grid creation and management functions
 * @module utils/grid/gridBasics
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createGrid, createSimpleGrid, createBasicEmergencyGrid } from "./gridRenderers";
import logger from "@/utils/logger";

/**
 * Create a simple grid on canvas
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createSimpleGridOnCanvas = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create simple grid: Canvas is null");
    return [];
  }
  
  return createSimpleGrid(canvas);
};

/**
 * Create a standard grid on canvas
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createGridOnCanvas = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create grid: Canvas is null");
    return [];
  }
  
  return createGrid(canvas);
};

/**
 * Create an emergency grid on canvas
 * Used when normal grid creation fails
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Grid objects
 */
export const createEmergencyGridOnCanvas = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create emergency grid: Canvas is null");
    return [];
  }
  
  return createBasicEmergencyGrid(canvas);
};

/**
 * Toggle grid visibility
 * @param {FabricCanvas} canvas - Fabric canvas
 * @param {boolean} visible - Whether grid should be visible
 * @returns {boolean} Whether toggle was successful
 */
export const toggleGridVisibility = (
  canvas: FabricCanvas, 
  visible: boolean
): boolean => {
  if (!canvas) {
    return false;
  }
  
  try {
    // Find grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length === 0) {
      return false;
    }
    
    // Set visibility
    gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });
    
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error toggling grid visibility:", error);
    return false;
  }
};

/**
 * Cleanup grid objects
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {boolean} Whether cleanup was successful
 */
export const cleanupGrid = (canvas: FabricCanvas): boolean => {
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

// Export all core functions
export { createSimpleGrid, createGrid, createBasicEmergencyGrid };
