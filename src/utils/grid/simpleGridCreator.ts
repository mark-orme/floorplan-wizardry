
/**
 * Simple grid creator module
 * Provides streamlined grid creation utilities
 * @module utils/grid/simpleGridCreator
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';
import { createGrid } from './gridBasics';
import { createBasicEmergencyGrid } from './gridRenderers';

/**
 * Create a reliable grid with error handling
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create reliable grid: Invalid canvas");
    return [];
  }
  
  try {
    // Try standard grid creation first
    const gridObjects = createGrid(canvas);
    
    // If successful, return the grid objects
    if (gridObjects.length > 0) {
      return gridObjects;
    }
    
    // If standard grid creation fails, try emergency grid
    logger.warn("Standard grid creation failed, trying emergency grid");
    return createBasicEmergencyGrid(canvas);
  } catch (error) {
    logger.error("Error creating reliable grid:", error);
    
    // Try emergency grid on error
    try {
      return createBasicEmergencyGrid(canvas);
    } catch (emergencyError) {
      logger.error("Emergency grid creation also failed:", emergencyError);
      return [];
    }
  }
};

/**
 * Ensure grid is visible on canvas
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {boolean} Whether operation succeeded
 */
export const ensureGridVisibility = (canvas: FabricCanvas): boolean => {
  if (!canvas) {
    return false;
  }
  
  try {
    // Find grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length === 0) {
      // No grid objects found, create a new grid
      const newGridObjects = createReliableGrid(canvas);
      return newGridObjects.length > 0;
    }
    
    // Set all grid objects to visible
    let visibilityChanged = false;
    gridObjects.forEach(obj => {
      if (!obj.visible) {
        obj.set('visible', true);
        visibilityChanged = true;
      }
      
      // Also ensure grid objects are at the back
      canvas.sendObjectToBack(obj);
    });
    
    // Render if visibility changed
    if (visibilityChanged) {
      canvas.requestRenderAll();
    }
    
    return true;
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
    return false;
  }
};
