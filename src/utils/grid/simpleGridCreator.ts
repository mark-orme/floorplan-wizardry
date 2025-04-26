
/**
 * Simple grid creator module
 * Provides streamlined grid creation utilities
 * @module utils/grid/simpleGridCreator
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';
import { createGrid } from './gridRenderers';

// Define a function type for creating a basic emergency grid
type EmergencyGridCreator = (canvas: FabricCanvas) => FabricObject[];

/**
 * Create a reliable grid with error handling
 * @param canvas - Fabric canvas
 * @returns Created grid objects
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
 * Create a basic emergency grid
 * Fallback function when regular grid creation fails
 * @param canvas - Canvas to create grid on
 * @returns Created grid objects
 */
export const createBasicEmergencyGrid: EmergencyGridCreator = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  const width = canvas.width || 1000;
  const height = canvas.height || 1000;
  const gridSize = 50; // Large grid size for emergency grid
  const result: FabricObject[] = [];
  
  try {
    // Create minimal number of lines for horizontal grid
    for (let y = 0; y < height; y += gridSize) {
      const line = new window.fabric.Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.DEFAULT_GRID_COLOR || '#cccccc',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      canvas.add(line);
      result.push(line);
    }
    
    // Create minimal number of lines for vertical grid
    for (let x = 0; x < width; x += gridSize) {
      const line = new window.fabric.Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.DEFAULT_GRID_COLOR || '#cccccc',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      canvas.add(line);
      result.push(line);
    }
    
    // Send all grid lines to back
    result.forEach(obj => canvas.sendToBack(obj));
    canvas.requestRenderAll();
    
    return result;
  } catch (error) {
    logger.error("Error in emergency grid creation:", error);
    return result; // Return whatever we managed to create
  }
};

/**
 * Ensure grid is visible on canvas
 * @param canvas - Fabric canvas
 * @returns Whether operation succeeded
 */
export const ensureGridVisibility = (canvas: FabricCanvas): boolean => {
  if (!canvas) {
    return false;
  }
  
  try {
    // Find grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as { objectType?: string }).objectType === 'grid' || (obj as { isGrid?: boolean }).isGrid === true
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
      canvas.sendToBack(obj);
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
