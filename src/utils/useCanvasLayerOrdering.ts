
/**
 * Enhanced canvas layer ordering utility
 * Provides robust functionality for handling z-order of canvas objects
 * @module useCanvasLayerOrdering
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

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
        fabricCanvas.add(gridObj);
        addedElements++;
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
      if (fabricCanvas.contains(line)) {
        try {
          if (typeof fabricCanvas.sendObjectToBack === 'function') {
            fabricCanvas.sendObjectToBack(line);
          } else if (typeof fabricCanvas.sendToBack === 'function') {
            fabricCanvas.sendToBack(line);
          } else {
            // If neither method is available, try a different approach
            if (line && typeof line.moveTo === 'function') {
              line.moveTo(0); // Move to bottom of stack if possible
            }
          }
        } catch (e) {
          console.warn('Could not send grid line to back:', e);
        }
      }
    });
    
    // Bring grid markers to front of grid elements
    gridMarkers.forEach(marker => {
      if (fabricCanvas.contains(marker)) {
        try {
          // Use bringObjectToFront instead of bringForward for Fabric.js v6 compatibility
          if (typeof fabricCanvas.bringObjectToFront === 'function') {
            fabricCanvas.bringObjectToFront(marker);
          } else if (typeof fabricCanvas.bringToFront === 'function') {
            fabricCanvas.bringToFront(marker);
          } else {
            // Alternative approach if methods aren't available
            if (marker && typeof marker.moveTo === 'function') {
              // Move near the top of the stack but not absolute top
              const objectCount = fabricCanvas._objects ? fabricCanvas._objects.length - 1 : 0;
              marker.moveTo(objectCount > 0 ? objectCount - 1 : 0);
            }
          }
        } catch (e) {
          console.warn('Could not bring grid marker to front:', e);
        }
      }
    });
    
    // Request a render to make grid changes visible
    fabricCanvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
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
      // Retry after a short delay
      setTimeout(attemptArrangement, 100 * attempts);
    }
  };
  
  attemptArrangement();
};

export default {
  ensureGridVisibility,
  arrangeGridElementsWithRetry
};
