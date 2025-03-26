
/**
 * Custom hook for proper canvas cleanup
 * @module useCanvasCleanup
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { disposeCanvas, isCanvasValid } from "@/utils/fabricCanvas";

/**
 * Hook to handle proper cleanup of canvas resources
 */
export const useCanvasCleanup = () => {
  /**
   * Properly dispose of canvas resources
   */
  const cleanupCanvas = useCallback((fabricCanvas: FabricCanvas | null) => {
    if (!fabricCanvas) {
      console.log("No canvas to clean up - already null");
      return;
    }
    
    try {
      // Before disposing, check if the canvas is valid
      if (!isCanvasValid(fabricCanvas)) {
        console.log("Canvas instance appears to be invalid or already disposed");
        return;
      }
      
      // Add a timeout to ensure we're not in the middle of a render cycle
      // This helps prevent the "Cannot read properties of undefined (reading 'el')" error
      setTimeout(() => {
        try {
          disposeCanvas(fabricCanvas);
        } catch (error) {
          console.error("Error during delayed canvas cleanup:", error);
        }
      }, 100); // Increased from 10ms to 100ms for more safety
    } catch (error) {
      console.error("Error during canvas cleanup:", error);
    }
  }, []);

  return {
    cleanupCanvas
  };
};
