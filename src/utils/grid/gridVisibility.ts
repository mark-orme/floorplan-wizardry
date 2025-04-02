
/**
 * Grid visibility utilities
 * @module utils/grid/gridVisibility
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';
import { createBasicEmergencyGrid } from './gridRenderers';

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
  // Throttle checks to once per 5 seconds maximum to reduce console spam
  const now = Date.now();
  if (now - lastCheckTime.value < 5000) {
    return false;
  }
  lastCheckTime.value = now;

  if (!canvas) {
    return false;
  }
  
  try {
    // Use provided grid objects or find them from canvas
    let gridItems = gridObjects || canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // If no grid items found, create an emergency grid
    if (gridItems.length === 0) {
      console.log('No grid found, creating emergency grid');
      gridItems = createBasicEmergencyGrid(canvas);
      
      if (gridItems.length === 0) {
        console.error('Failed to create emergency grid');
        return false;
      }
      
      console.log(`Created emergency grid with ${gridItems.length} items`);
    }
    
    // Check if any grid object is not visible
    let visibilityChanged = false;
    
    gridItems.forEach(obj => {
      // Fix visibility
      if (!obj.visible) {
        obj.set('visible', true);
        visibilityChanged = true;
      }
      
      // Ensure grid objects are at the back (only if needed)
      const index = canvas.getObjects().indexOf(obj);
      if (index > 0) {
        try {
          canvas.sendToBack(obj);
        } catch (err) {
          console.warn('Error using sendToBack, trying alternative methods');
          try {
            // For fabric.js v6
            canvas.sendObjectToBack(obj);
          } catch (innerErr) {
            // Last resort, manually move to back
            canvas.remove(obj);
            canvas.add(obj);
          }
        }
      }
    });
    
    // Only render if changes were made
    if (visibilityChanged) {
      // Force render to ensure changes are applied
      canvas.renderAll();
      canvas.requestRenderAll();
      logger.info(`Fixed visibility for ${gridItems.length} grid objects`);
    }
    
    return visibilityChanged;
  } catch (error) {
    console.error('Error ensuring grid visibility:', error);
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
    return false;
  }
  
  try {
    // Use provided grid objects or find them from canvas
    let gridItems = gridObjects || canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridItems.length === 0) {
      // If no grid items found and we want to make grid visible, create an emergency grid
      if (visible) {
        console.log('No grid found while setting visibility, creating emergency grid');
        gridItems = createBasicEmergencyGrid(canvas);
        
        if (gridItems.length === 0) {
          logger.error('Failed to create emergency grid while setting visibility');
          return false;
        }
        
        logger.info(`Created emergency grid with ${gridItems.length} items`);
      } else {
        return false;
      }
    }
    
    // Set visibility for all grid objects
    gridItems.forEach(obj => {
      obj.set('visible', visible);
    });
    
    // Force render to ensure changes are applied
    canvas.renderAll();
    canvas.requestRenderAll();
    logger.info(`Set visibility to ${visible} for ${gridItems.length} grid objects`);
    
    return true;
  } catch (error) {
    logger.error('Error setting grid visibility:', error);
    console.error('Error setting grid visibility:', error);
    return false;
  }
}

/**
 * Force grid creation and visibility
 * This is a more aggressive approach that ensures a grid exists and is visible
 * @param canvas - Fabric canvas
 * @returns Whether operation succeeded
 */
export function forceGridCreationAndVisibility(
  canvas: FabricCanvas
): boolean {
  if (!canvas) {
    console.error('Cannot force grid: Canvas is null');
    return false;
  }
  
  try {
    // Clear any existing grid objects that might be problematic
    const existingGrid = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (existingGrid.length > 0) {
      console.log(`Removing ${existingGrid.length} existing grid objects`);
      existingGrid.forEach(obj => {
        canvas.remove(obj);
      });
    }
    
    // Create new emergency grid
    console.log('Creating forced emergency grid');
    const gridItems = createBasicEmergencyGrid(canvas);
    
    if (gridItems.length === 0) {
      console.error('Failed to create forced emergency grid');
      return false;
    }
    
    // Ensure grid items are visible and at the back
    gridItems.forEach(obj => {
      obj.set('visible', true);
      canvas.sendToBack(obj);
    });
    
    // Force render
    canvas.renderAll();
    canvas.requestRenderAll();
    
    console.log(`Successfully created forced grid with ${gridItems.length} objects`);
    return true;
  } catch (error) {
    console.error('Error forcing grid creation:', error);
    return false;
  }
}
