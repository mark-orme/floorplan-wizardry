
/**
 * Custom hook for initializing canvas grid
 * Handles grid creation with error recovery and fallbacks
 * @module useCanvasGridInitialization
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { DebugInfoState } from "@/types/debugTypes";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";

/**
 * Props for the useCanvasGridInitialization hook
 */
interface UseCanvasGridInitializationProps {
  /** Function to set debug information */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
}

/**
 * Hook for initializing and managing canvas grid
 * @param props - Hook properties
 * @returns Object containing grid initialization functions
 */
export const useCanvasGridInitialization = ({
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasGridInitializationProps) => {
  // Grid layer reference to track grid objects
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  /**
   * Initialize grid on canvas with error handling
   * @param canvas - The fabric canvas instance
   * @param createGrid - Function to create grid objects
   * @returns Array of created grid objects
   */
  const initializeGrid = useCallback((
    canvas: FabricCanvas,
    createGrid: (canvas: FabricCanvas) => FabricObject[]
  ): FabricObject[] => {
    try {
      logger.info("Creating grid on initialized canvas");
      console.log("🔲 Creating grid on initialized canvas");
      
      // CRITICAL CHECK: First verify canvas has valid dimensions before creating grid
      if (!canvas || 
          !canvas.width || 
          !canvas.height || 
          canvas.width === 0 || 
          canvas.height === 0) {
        logger.error("⛔️ Grid creation blocked: Canvas has zero dimensions");
        console.error("⛔️ Grid creation blocked: Canvas has zero dimensions", {
          width: canvas?.width,
          height: canvas?.height
        });
        
        // Set error to trigger emergency canvas
        setHasError(true);
        setErrorMessage("Grid creation failed: Canvas has zero dimensions");
        toast.error("⚠️ Grid creation failed: Canvas has zero dimensions");
        return [];
      }
      
      // Now create the grid with verified dimensions
      canvas.renderOnAddRemove = true;
      
      // Try using the provided createGrid function
      let gridObjects: FabricObject[] = [];
      
      try {
        // Use the provided grid creation function
        const result = createGrid(canvas);
        if (Array.isArray(result) && result.length > 0) {
          gridObjects = result;
          console.log("✅ Grid created using provided createGrid function:", gridObjects.length, "objects");
        }
      } catch (createGridError) {
        console.error("Error using provided createGrid function:", createGridError);
      }
      
      // If the provided function didn't work, try emergency grid
      if (gridObjects.length === 0) {
        logger.info("⚠️ No grid objects created, trying basic emergency grid");
        console.log("⚠️ No grid objects created, trying emergency grid");
        
        toast.error("⚠️ Grid failed to render - switching to emergency mode");
        
        createBasicEmergencyGrid(canvas, gridLayerRef);
      } else {
        console.log("✅ Grid successfully created:", gridObjects.length, "objects");
        
        // Update the gridLayerRef to track all grid objects
        gridLayerRef.current = gridObjects;
        
        // Show success toast
        toast.success(`Grid created with ${gridObjects.length} objects`);
      }
      
      // Force render after grid is created
      canvas.requestRenderAll();
      console.log("🔄 Requesting canvas render");
      
      // Set debug info for grid creation
      setDebugInfo(prev => ({
        ...prev,
        gridCreated: true,
        gridObjectCount: gridLayerRef.current.length
      }));
      
      logger.info(`Grid created with ${gridLayerRef.current.length} objects`);
      return gridLayerRef.current;
    } catch (error) {
      logger.error("Error creating grid:", error);
      console.error("❌ Error creating grid:", error);
      
      // Show error toast
      toast.error("Grid creation failed with error");
      
      // Try emergency grid on error
      try {
        if (canvas) {
          console.log("🚨 Attempting emergency grid creation");
          createBasicEmergencyGrid(canvas, gridLayerRef);
          return gridLayerRef.current;
        }
      } catch (emergencyError) {
        logger.error("Emergency grid creation also failed:", emergencyError);
        console.error("❌ Emergency grid creation also failed:", emergencyError);
      }
      
      return [];
    }
  }, [setDebugInfo, setHasError, setErrorMessage]);

  return {
    gridLayerRef,
    initializeGrid
  };
};
