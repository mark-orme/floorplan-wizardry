
/**
 * Custom hook for proper canvas cleanup
 * @module useCanvasCleanup
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { disposeCanvas } from "@/utils/fabricCanvas";

/**
 * Hook to handle proper cleanup of canvas resources
 */
export const useCanvasCleanup = () => {
  /**
   * Properly dispose of canvas resources
   */
  const cleanupCanvas = useCallback((fabricCanvas: FabricCanvas) => {
    if (!fabricCanvas) return;
    
    disposeCanvas(fabricCanvas);
    console.log("Canvas disposed successfully");
  }, []);

  return {
    cleanupCanvas
  };
};
