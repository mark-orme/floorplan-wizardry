
/**
 * Grid visibility utilities
 * @module utils/grid/gridVisibility
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

// Track the last time grid visibility was checked to prevent excessive checks
const lastCheckTime = {
  value: 0
};

/**
 * Ensure grid is visible on canvas
 * @param canvas - Fabric canvas
 * @param gridObjects - Optional array of grid objects to check
 * @returns Whether visibility fixes were applied
 */
export function ensureGridVisibility(
  canvas: FabricCanvas,
  gridObjects?: FabricObject[]
): boolean {
  // Throttle checks to once per second maximum
  const now = Date.now();
  if (now - lastCheckTime.value < 1000) {
    return false;
  }
  lastCheckTime.value = now;

  if (!canvas) {
    return false;
  }
  
  try {
    // Use provided grid objects or find them from canvas
    const gridItems = gridObjects || canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridItems.length === 0) {
      // Only log at a reasonable interval
      if (now % 10000 < 1000) { // Log roughly every 10 seconds
        logger.warn('No grid objects found to ensure visibility');
      }
      return false;
    }
    
    // Check if any grid object is not visible
    let visibilityFixed = false;
    let backOrderFixed = false;
    
    gridItems.forEach(obj => {
      // Fix visibility
      if (!obj.visible) {
        obj.set('visible', true);
        visibilityFixed = true;
      }
      
      // Always ensure grid objects are at the back
      // but only count as a fix if the object was not already at the back
      if (canvas.getObjects().indexOf(obj) > 0) {
        canvas.sendObjectToBack(obj);
        backOrderFixed = true;
      }
    });
    
    // Only render if changes were made
    if (visibilityFixed || backOrderFixed) {
      canvas.requestRenderAll();
      logger.info(`Fixed visibility for ${gridItems.length} grid objects`);
    }
    
    return visibilityFixed || backOrderFixed;
  } catch (error) {
    // Only log errors once per minute to avoid spam
    if (now % 60000 < 1000) {
      logger.error('Error ensuring grid visibility:', error);
    }
    return false;
  }
}

/**
 * Set visibility of grid objects
 * @param canvas - Fabric canvas
 * @param visible - Whether grid should be visible
 * @param gridObjects - Optional array of grid objects
 * @returns Whether operation succeeded
 */
export function setGridVisibility(
  canvas: FabricCanvas,
  visible: boolean,
  gridObjects?: FabricObject[]
): boolean {
  if (!canvas) {
    return false;
  }
  
  try {
    // Use provided grid objects or find them from canvas
    const gridItems = gridObjects || canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridItems.length === 0) {
      return false;
    }
    
    // Set visibility for all grid objects
    gridItems.forEach(obj => {
      obj.set('visible', visible);
    });
    
    canvas.requestRenderAll();
    logger.info(`Set visibility to ${visible} for ${gridItems.length} grid objects`);
    
    return true;
  } catch (error) {
    logger.error('Error setting grid visibility:', error);
    return false;
  }
}
