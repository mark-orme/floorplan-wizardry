
/**
 * Enhanced canvas layer ordering utility
 * Provides robust functionality for handling z-order of canvas objects
 * @module useCanvasLayerOrdering
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import { captureError } from "@/utils/sentry";

/**
 * Ensure all grid elements are visible and added to canvas 
 * with proper z-ordering
 * 
 * @param {FabricCanvas | null} fabricCanvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} - Whether the operation was successful
 */
export const ensureGridVisibility = (
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!fabricCanvas) {
    logger.debug("ensureGridVisibility: Canvas is null");
    return false;
  }
  
  if (!gridLayerRef.current || gridLayerRef.current.length === 0) {
    logger.debug("ensureGridVisibility: No grid elements in reference");
    return false;
  }
  
  try {
    // First ensure all grid elements are added to canvas
    let addedElements = 0;
    gridLayerRef.current.forEach(gridObj => {
      if (!fabricCanvas.contains(gridObj)) {
        try {
          fabricCanvas.add(gridObj);
          addedElements++;
        } catch (error) {
          logger.error("Error adding grid element to canvas:", error);
          captureError(error instanceof Error ? error : new Error(String(error)), 'grid-element-add');
        }
      }
    });
    
    if (addedElements > 0) {
      logger.debug(`Added ${addedElements} missing grid elements to canvas`);
    }
    
    // Then arrange them in proper z-order
    const gridLines = gridLayerRef.current.filter(obj => 
      obj.type === 'line' && (!obj.strokeWidth || Number(obj.strokeWidth) < 1.2)
    );
    
    const gridMarkers = gridLayerRef.current.filter(obj => 
      obj.type === 'text' || (obj.type === 'line' && obj.strokeWidth && Number(obj.strokeWidth) >= 1.2)
    );
    
    // Send grid lines to back
    gridLines.forEach(line => {
      if (!fabricCanvas.contains(line)) return;
      
      try {
        // Try multiple approaches to send grid lines to back
        if (typeof fabricCanvas.sendObjectToBack === 'function') {
          fabricCanvas.sendObjectToBack(line);
        } else if (typeof fabricCanvas.sendToBack === 'function') {
          fabricCanvas.sendToBack(line);
        } else if (typeof fabricCanvas.bringToBack === 'function') {
          fabricCanvas.bringToBack(line);
        } else if (line && typeof line.moveTo === 'function') {
          // Move to bottom of stack if possible
          line.moveTo(0); 
        } else if (line && typeof line.sendToBack === 'function') {
          line.sendToBack();
        } else {
          logger.warn('No supported method found to send grid lines to back');
        }
      } catch (e) {
        logger.warn('Could not send grid line to back:', e);
        captureError(e instanceof Error ? e : new Error(String(e)), 'grid-line-ordering');
      }
    });
    
    // Bring grid markers to front of grid elements
    gridMarkers.forEach(marker => {
      if (!fabricCanvas.contains(marker)) return;
      
      try {
        // Try multiple approaches to bring grid markers to front
        if (typeof fabricCanvas.bringObjectToFront === 'function') {
          fabricCanvas.bringObjectToFront(marker);
        } else if (typeof fabricCanvas.bringToFront === 'function') {
          fabricCanvas.bringToFront(marker);
        } else if (typeof fabricCanvas.bringForward === 'function') {
          fabricCanvas.bringForward(marker);
        } else if (marker && typeof marker.moveTo === 'function') {
          // Alternative approach if methods aren't available
          const objectCount = fabricCanvas._objects ? fabricCanvas._objects.length - 1 : 0;
          marker.moveTo(objectCount > 0 ? objectCount - 1 : 0);
        } else if (marker && typeof marker.bringToFront === 'function') {
          marker.bringToFront();
        } else {
          logger.warn('No supported method found to bring grid markers to front');
        }
      } catch (e) {
        logger.warn('Could not bring grid marker to front:', e);
        captureError(e instanceof Error ? e : new Error(String(e)), 'grid-marker-ordering');
      }
    });
    
    // Request a render to make grid changes visible
    try {
      fabricCanvas.requestRenderAll();
    } catch (error) {
      logger.error("Error rendering canvas after grid ordering:", error);
      captureError(error instanceof Error ? error : new Error(String(error)), 'grid-render');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
    captureError(error instanceof Error ? error : new Error(String(error)), 'grid-visibility');
    return false;
  }
};

/**
 * Perform layer ordering with retry mechanism
 * Will attempt multiple times to ensure grid is visible
 * 
 * @param {FabricCanvas | null} fabricCanvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const arrangeGridElementsWithRetry = (
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!fabricCanvas || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return;
  }
  
  let attempts = 0;
  const maxAttempts = 3;
  
  /**
   * Recursive function to attempt grid arrangement with exponential backoff
   */
  const attemptArrangement = () => {
    const success = ensureGridVisibility(fabricCanvas, gridLayerRef);
    attempts++;
    
    if (!success && attempts < maxAttempts) {
      // Retry after a short delay with exponential backoff
      const delay = 100 * Math.pow(2, attempts - 1);
      logger.debug(`Grid arrangement attempt ${attempts} failed, retrying in ${delay}ms`);
      setTimeout(attemptArrangement, delay);
    } else if (!success) {
      logger.warn(`Failed to arrange grid elements after ${maxAttempts} attempts`);
      captureError(new Error(`Grid arrangement failed after ${maxAttempts} attempts`), 'grid-arrangement');
    } else {
      logger.debug(`Grid arrangement succeeded on attempt ${attempts}`);
    }
  };
  
  attemptArrangement();
};

export default {
  ensureGridVisibility,
  arrangeGridElementsWithRetry
};
