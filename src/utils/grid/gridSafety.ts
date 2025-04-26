
/**
 * Grid safety module
 * Manages safety timeouts and cleanup for grid operations
 * @module grid/gridSafety
 */
import { Canvas, Object as FabricObject } from "fabric";
import logger from "../logger";

// Safety timeout reference
let safetyTimeout: number | null = null;

/**
 * Maximum allowed time for grid creation in milliseconds
 * Used to prevent freezing or hanging during grid creation
 */
const MAX_GRID_CREATION_TIME = 10000; // 10 seconds

/**
 * Acquire a safety lock for grid creation with timeout
 * Sets a timeout to release lock if grid creation takes too long
 * 
 * @param releaseCallback Function to call when lock is released
 * @returns True if lock acquired successfully
 */
export const acquireGridLockWithSafety = (releaseCallback: () => void): boolean => {
  // Clear existing timeout if any
  if (safetyTimeout !== null) {
    window.clearTimeout(safetyTimeout);
    safetyTimeout = null;
  }
  
  // Set new safety timeout
  safetyTimeout = window.setTimeout(() => {
    logger.warn(`Grid creation took more than ${MAX_GRID_CREATION_TIME}ms, forcing release of lock`);
    releaseCallback();
    safetyTimeout = null;
  }, MAX_GRID_CREATION_TIME);
  
  return true;
};

/**
 * Clean up grid resources and release locks
 * Called when grid creation completes or component unmounts
 * 
 * @param gridLayerRef Reference to grid objects
 * @param canvas The fabric canvas instance
 */
export const cleanupGridResources = (
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  canvas: Canvas | null
): void => {
  // Clear safety timeout
  if (safetyTimeout !== null) {
    window.clearTimeout(safetyTimeout);
    safetyTimeout = null;
  }
  
  // Remove existing grid objects if canvas exists
  if (canvas && gridLayerRef.current.length > 0) {
    try {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Clear grid layer reference
      gridLayerRef.current = [];
      
      // Render canvas
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error cleaning up grid resources:", error);
    }
  }
};
