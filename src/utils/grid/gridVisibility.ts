/**
 * Grid visibility utilities
 * Functions to ensure grid is always visible
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createCompleteGrid } from './gridRenderers';
import logger from '@/utils/logger';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';

// Track visibility checks to avoid too many console warnings
const visibilityChecks = {
  lastWarningTime: 0,
  warningCount: 0,
  fixCount: 0
};

/**
 * Find all grid objects in canvas
 * @param canvas Fabric canvas instance
 * @returns Array of grid objects
 */
function findGridObjects(canvas: FabricCanvas): FabricObject[] {
  return canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
}

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
    const gridObjects = findGridObjects(canvas);
    
    // Check if enough grid objects
    if (gridObjects.length < GRID_CONSTANTS.MIN_GRID_OBJECTS) {
      // Throttle warnings to avoid console spam
      const now = Date.now();
      if (now - visibilityChecks.lastWarningTime > 5000) {
        logger.warn(`Grid appears to be missing, only ${gridObjects.length} grid objects found`);
        visibilityChecks.lastWarningTime = now;
        visibilityChecks.warningCount++;
      }
      
      // Only recreate automatically if enabled and not too many warnings
      if (GRID_CONSTANTS.AUTO_RECREATE_ON_EMPTY && visibilityChecks.warningCount < 10) {
        return forceGridCreationAndVisibility(canvas);
      }
      
      return false;
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
      visibilityChecks.fixCount++;
    }
    
    // Ensure grid objects are at the back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    return visibilityChanged;
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
    const gridObjects = findGridObjects(canvas);
    
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
    const existingGrids = findGridObjects(canvas);
    
    if (existingGrids.length > 0) {
      logger.info(`Removing ${existingGrids.length} existing grid objects`);
      
      existingGrids.forEach(obj => {
        canvas.remove(obj);
      });
    }
    
    // Create new grid
    const gridObjects = createCompleteGrid(canvas);
    
    if (gridObjects.length === 0) {
      logger.error("Failed to create grid");
      return false;
    }
    
    // Ensure all grid objects are visible
    gridObjects.forEach(obj => {
      obj.set('visible', true);
      obj.set('selectable', false); // Ensure grid is not selectable
      obj.set('evented', false); // Ensure grid doesn't receive events
      obj.set('hasControls', false); // No controls
      obj.set('hasBorders', false); // No borders
      canvas.sendObjectToBack(obj);
    });
    
    // Force render
    canvas.requestRenderAll();
    
    // Reset visibility check counters
    visibilityChecks.warningCount = 0;
    visibilityChecks.fixCount = 0;
    
    logger.info(`Created new grid with ${gridObjects.length} objects`);
    
    return true;
  } catch (error) {
    logger.error("Error forcing grid creation:", error);
    return false;
  }
}

/**
 * Helper function to diagnose grid state
 * @param canvas Fabric canvas instance
 * @returns Diagnostic information
 */
export function diagnoseGridState(canvas: FabricCanvas): any {
  if (!canvas) {
    return { error: "No canvas provided" };
  }
  
  try {
    const allObjects = canvas.getObjects();
    const gridObjects = findGridObjects(canvas);
    const visibleGridObjects = gridObjects.filter(obj => obj.visible);
    const invisibleGridObjects = gridObjects.filter(obj => !obj.visible);
    
    return {
      totalObjects: allObjects.length,
      gridObjectsCount: gridObjects.length,
      visibleGridCount: visibleGridObjects.length,
      invisibleGridCount: invisibleGridObjects.length,
      otherObjectsCount: allObjects.length - gridObjects.length,
      canvasDimensions: {
        width: canvas.width,
        height: canvas.height
      },
      warningCount: visibilityChecks.warningCount,
      fixCount: visibilityChecks.fixCount,
      gridSamples: gridObjects.slice(0, 3).map(obj => ({
        type: (obj as any).objectType || "unknown",
        visible: obj.visible,
        selectable: obj.selectable,
        coords: {
          left: obj.left,
          top: obj.top
        }
      }))
    };
  } catch (error) {
    return { error: String(error) };
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
    const result = forceGridCreationAndVisibility(canvas);
    
    if (result) {
      toast.success("Grid fixed successfully!");
    } else {
      toast.error("Failed to fix grid");
    }
    
    return result;
  };
  
  // Also expose grid diagnostics
  (window as any).diagnoseGrid = () => {
    if (!(window as any).fabricCanvas) {
      console.error("No canvas found for diagnostics");
      return null;
    }
    
    const canvas = (window as any).fabricCanvas;
    const diagnostics = diagnoseGridState(canvas);
    console.log("Grid diagnostics:", diagnostics);
    return diagnostics;
  };
}
