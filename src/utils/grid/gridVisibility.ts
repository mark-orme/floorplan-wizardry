
/**
 * Grid visibility utilities
 * @module utils/grid/gridVisibility
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

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
  if (!canvas) {
    logger.warn('Cannot ensure grid visibility: Canvas is null');
    return false;
  }
  
  try {
    // Use provided grid objects or find them from canvas
    const gridItems = gridObjects || canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid'
    );
    
    if (gridItems.length === 0) {
      logger.warn('No grid objects found to ensure visibility');
      return false;
    }
    
    // Check if any grid object is not visible
    let visibilityFixed = false;
    
    gridItems.forEach(obj => {
      if (!obj.visible) {
        obj.set('visible', true);
        visibilityFixed = true;
      }
      
      // Always ensure grid objects are at the back
      canvas.sendObjectToBack(obj);
    });
    
    // Only render if changes were made
    if (visibilityFixed) {
      canvas.requestRenderAll();
      logger.info(`Ensured visibility for ${gridItems.length} grid objects`);
    }
    
    return visibilityFixed;
  } catch (error) {
    logger.error('Error ensuring grid visibility:', error);
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
    logger.warn('Cannot set grid visibility: Canvas is null');
    return false;
  }
  
  try {
    // Use provided grid objects or find them from canvas
    const gridItems = gridObjects || canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid'
    );
    
    if (gridItems.length === 0) {
      logger.warn('No grid objects found to set visibility');
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
