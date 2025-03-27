
/**
 * Hook for grid creation debugging
 * Provides utilities for diagnosing and fixing grid-related issues
 */
import { useCallback, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { createBasicEmergencyGrid } from "@/utils/grid/gridDebugUtils";
import { dumpGridState } from "@/utils/grid/gridDebugUtils";

/**
 * Interface for grid health information
 */
interface GridHealth {
  exists: boolean;
  size: number;
  objectsOnCanvas: number;
  missingObjects: number;
}

/**
 * Hook for debugging grid creation issues
 * @param fabricCanvasRef Reference to the fabric canvas
 * @param gridLayerRef Reference to grid objects
 * @returns Debugging utilities
 */
export const useGridCreationDebug = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
) => {
  const [debugMode, setDebugMode] = useState(false);
  const [isWaitingForCanvas, setIsWaitingForCanvas] = useState(false);

  /**
   * Toggle debug mode
   */
  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => !prev);
    
    if (!debugMode) {
      toast.info("Grid debug mode enabled");
      dumpGridState(fabricCanvasRef.current!, gridLayerRef);
    } else {
      toast.info("Grid debug mode disabled");
    }
  }, [debugMode, fabricCanvasRef, gridLayerRef]);

  /**
   * Check grid health
   * @returns Grid health information or false if canvas not available
   */
  const checkGridHealth = useCallback((): GridHealth | false => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setIsWaitingForCanvas(true);
      console.log("Canvas not available for grid health check");
      return false;
    }
    
    setIsWaitingForCanvas(false);
    
    const gridObjects = gridLayerRef.current;
    const gridOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
    
    return {
      exists: gridObjects.length > 0,
      size: gridObjects.length,
      objectsOnCanvas: gridOnCanvas.length,
      missingObjects: gridObjects.length - gridOnCanvas.length
    };
  }, [fabricCanvasRef, gridLayerRef]);

  /**
   * Force grid creation
   * @returns Array of created grid objects or false if canvas not available
   */
  const forceGridCreation = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setIsWaitingForCanvas(true);
      return false;
    }
    
    setIsWaitingForCanvas(false);
    
    try {
      // Clear any existing grid objects
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Reset grid layer reference
      gridLayerRef.current = [];
      
      // Create new emergency grid
      const result = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      // Force render
      canvas.requestRenderAll();
      
      return result;
    } catch (error) {
      console.error("Error in forceGridCreation:", error);
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef]);

  /**
   * Fix grid issues
   * @returns Array of fixed grid objects or false if canvas not available
   */
  const fixGridIssues = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      setIsWaitingForCanvas(true);
      return false;
    }
    
    setIsWaitingForCanvas(false);
    
    try {
      const health = checkGridHealth();
      if (!health) return false;
      
      // If grid is completely missing, create new one
      if (health.size === 0) {
        return forceGridCreation();
      }
      
      // If some grid objects are missing from canvas, add them back
      if (health.objectsOnCanvas < health.size) {
        const gridObjects = gridLayerRef.current;
        
        gridObjects.forEach(obj => {
          if (!canvas.contains(obj)) {
            canvas.add(obj);
          }
        });
        
        canvas.requestRenderAll();
        return gridObjects;
      }
      
      return gridLayerRef.current;
    } catch (error) {
      console.error("Error in fixGridIssues:", error);
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef, checkGridHealth, forceGridCreation]);

  return {
    debugMode,
    toggleDebugMode,
    checkGridHealth,
    forceGridCreation,
    fixGridIssues,
    isWaitingForCanvas
  };
};
