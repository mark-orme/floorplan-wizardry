
/**
 * Custom hook for proper canvas cleanup
 * @module useCanvasCleanup
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { disposeCanvas, isCanvasValid } from "@/utils/fabricCanvas";
import logger from "@/utils/logger";

// Flag to track if canvas disposal is in progress globally
let disposalInProgress = false;

// Track recently disposed canvases to prevent dispose/recreate loops
const recentlyDisposedCanvases = new Set<number>();
const DISPOSAL_COOLDOWN_MS = 2000;

/**
 * Hook to handle proper cleanup of canvas resources
 */
export const useCanvasCleanup = () => {
  /**
   * Properly dispose of canvas resources
   */
  const cleanupCanvas = useCallback((fabricCanvas: FabricCanvas | null) => {
    if (!fabricCanvas) {
      logger.debug("No canvas to clean up - already null");
      return;
    }
    
    // Generate a unique identifier for this canvas instance
    const canvasId = Date.now();
    
    // Check if we're in a disposal cooldown period to prevent loops
    if (recentlyDisposedCanvases.size > 3) {
      logger.warn("Too many canvas disposals in short time, possible loop detected");
      console.warn("CANVAS CLEANUP: Possible disposal loop detected, skipping cleanup");
      return;
    }
    
    // Prevent concurrent disposals
    if (disposalInProgress) {
      logger.debug("Canvas disposal already in progress, skipping");
      return;
    }
    
    disposalInProgress = true;
    
    try {
      // Before disposing, check if the canvas is valid
      if (!isCanvasValid(fabricCanvas)) {
        logger.debug("Canvas instance appears to be invalid or already disposed");
        disposalInProgress = false;
        return;
      }
      
      // Track this disposal to detect loops
      recentlyDisposedCanvases.add(canvasId);
      
      // Clear tracked disposals after cooldown period
      setTimeout(() => {
        recentlyDisposedCanvases.delete(canvasId);
      }, DISPOSAL_COOLDOWN_MS);
      
      // Add a timeout to ensure we're not in the middle of a render cycle
      // This helps prevent the "Cannot read properties of undefined (reading 'el')" error
      setTimeout(() => {
        try {
          // Add additional check to ensure canvas is still valid right before disposal
          if (fabricCanvas && isCanvasValid(fabricCanvas)) {
            disposeCanvas(fabricCanvas);
            logger.info("Canvas disposed successfully");
          }
        } catch (error) {
          logger.error("Error during delayed canvas cleanup:", error);
        } finally {
          // Always reset the flag
          disposalInProgress = false;
        }
      }, 100); // Reduced to 100ms for faster cleanup
    } catch (error) {
      logger.error("Error during canvas cleanup:", error);
      disposalInProgress = false;
    }
  }, []);

  return {
    cleanupCanvas
  };
};
