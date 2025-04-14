
/**
 * Grid visibility utilities
 * Functions to ensure grid is always visible
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createCompleteGrid } from './gridRenderers';
import logger from '@/utils/logger';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';

/**
 * Ensure grid is visible
 * @param canvas Fabric canvas instance
 * @returns Whether operation was successful
 */
export function ensureGridVisibility(canvas: FabricCanvas): boolean {
  if (!canvas) {
    return false;
  }
  
  try {
    // Find all grid objects
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length < GRID_CONSTANTS.MIN_GRID_OBJECTS) {
      logger.warn(`Grid appears to be missing, only ${gridObjects.length} grid objects found`);
      return forceGridCreationAndVisibility(canvas);
    }
    
    // Make sure all grid objects are visible
    let visibilityChanged = false;
    
    gridObjects.forEach(obj => {
      if (!obj.visible) {
        obj.set('visible', true);
        visibilityChanged = true;
      }
    });
    
    if (visibilityChanged) {
      logger.info("Some grid objects were invisible, fixed visibility");
      canvas.requestRenderAll();
    }
    
    // Ensure grid objects are at the back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    return true;
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
    return false;
  }
}

/**
 * Set grid visibility
 * @param canvas Fabric canvas instance
 * @param visible Whether grid should be visible
 */
export function setGridVisibility(canvas: FabricCanvas, visible: boolean): void {
  if (!canvas) return;
  
  try {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length === 0 && visible) {
      // If grid doesn't exist but should be visible, create it
      forceGridCreationAndVisibility(canvas);
      return;
    }
    
    gridObjects.forEach(obj => {
      obj.set('visible', visible);
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Error setting grid visibility:", error);
  }
}

/**
 * Force grid creation and visibility
 * @param canvas Fabric canvas instance
 * @returns Whether operation was successful
 */
export function forceGridCreationAndVisibility(canvas: FabricCanvas): boolean {
  if (!canvas) {
    return false;
  }
  
  try {
    // Remove any existing grid objects
    const existingGrids = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    existingGrids.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Create new grid
    const gridObjects = createCompleteGrid(canvas);
    
    if (gridObjects.length === 0) {
      logger.error("Failed to create grid");
      return false;
    }
    
    // Ensure all grid objects are visible
    gridObjects.forEach(obj => {
      obj.set('visible', true);
      canvas.sendObjectToBack(obj);
    });
    
    // Force render
    canvas.requestRenderAll();
    
    return true;
  } catch (error) {
    logger.error("Error forcing grid creation:", error);
    return false;
  }
}

// Expose emergency grid fix function to window for debugging
if (typeof window !== 'undefined') {
  (window as any).fixGrid = () => {
    if (!(window as any).fabricCanvas) {
      toast.error("No canvas found for emergency fix");
      return false;
    }
    
    const canvas = (window as any).fabricCanvas;
    
    return forceGridCreationAndVisibility(canvas);
  };
}
