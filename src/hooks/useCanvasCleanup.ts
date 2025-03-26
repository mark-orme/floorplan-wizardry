
/**
 * Custom hook for cleaning up canvas instances
 * Manages proper disposal of Fabric.js canvas resources
 * @module useCanvasCleanup
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";
import { 
  isCanvasElementInitialized, 
  markCanvasAsInitialized,
  isCanvasElementInDOM 
} from "@/utils/fabric/canvasCleanup";

/**
 * Hook for canvas cleanup operations
 * Provides utilities for safe canvas disposal and initialization tracking
 * Ensures proper memory management for canvas instances
 * 
 * @returns {Object} Canvas cleanup utilities
 * 
 * @example
 * const { cleanupCanvas, isCanvasElementInitialized } = useCanvasCleanup();
 * 
 * // When unmounting component:
 * useEffect(() => {
 *   return () => {
 *     cleanupCanvas(canvasRef.current);
 *   };
 * }, []);
 */
export const useCanvasCleanup = () => {
  /**
   * Clean up a Fabric canvas instance
   * Safely disposes canvas and its resources to prevent memory leaks
   * 
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
