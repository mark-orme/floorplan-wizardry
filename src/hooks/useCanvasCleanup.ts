
/**
 * Custom hook for proper canvas cleanup
 * @module useCanvasCleanup
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { disposeCanvas, isCanvasValid } from "@/utils/fabricCanvas";

// Flag to track if canvas disposal is in progress globally
let disposalInProgress = false;

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
    
    // Prevent concurrent disposals
    if (disposalInProgress) {
      console.log("Canvas disposal already in progress, skipping");
      return;
    }
    
    disposalInProgress = true;
    
    try {
      // Before disposing, check if the canvas is valid
      if (!isCanvasValid(fabricCanvas)) {
        console.log("Canvas instance appears to be invalid or already disposed");
        disposalInProgress = false;
        return;
      }
      
      // Add a timeout to ensure we're not in the middle of a render cycle
      // This helps prevent the "Cannot read properties of undefined (reading 'el')" error
      setTimeout(() => {
        try {
          // Add additional check to ensure canvas is still valid right before disposal
          if (fabricCanvas && isCanvasValid(fabricCanvas)) {
            disposeCanvas(fabricCanvas);
            console.log("Canvas disposed successfully");
          }
        } catch (error) {
          console.error("Error during delayed canvas cleanup:", error);
        } finally {
          // Always reset the flag
          disposalInProgress = false;
        }
      }, 100); // Reduced to 100ms for faster cleanup
    } catch (error) {
      console.error("Error during canvas cleanup:", error);
      disposalInProgress = false;
    }
  }, []);

  return {
    cleanupCanvas
  };
};
