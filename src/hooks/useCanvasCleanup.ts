
/**
 * Custom hook for cleaning up canvas instances
 * @module useCanvasCleanup
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";
import { 
  isCanvasElementInitialized, 
  markCanvasAsInitialized,
  isCanvasElementInDOM
} from "@/utils/fabric";

/**
 * Hook for canvas cleanup operations
 * @returns Canvas cleanup utilities
 */
export const useCanvasCleanup = () => {
  /**
   * Clean up a Fabric canvas instance
   * @param {FabricCanvas | null} canvas - Canvas to clean up
   */
  const cleanupCanvas = useCallback((canvas: FabricCanvas | null) => {
    if (!canvas) return;

    try {
      // Remove all event listeners and dispose objects
      canvas.dispose();
      logger.info("Canvas disposed successfully");
    } catch (error) {
      logger.error("Error during canvas cleanup:", error);
    }
  }, []);

  return {
    cleanupCanvas,
    isCanvasElementInitialized,
    markCanvasAsInitialized,
    isCanvasElementInDOM
  };
};

