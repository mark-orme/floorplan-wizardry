
/**
 * Grid creation hook
 * Handles the creation of grid on canvas
 * @module hooks/grid/useGridCreation
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createCompleteGrid, createBasicEmergencyGrid } from "@/utils/grid/gridCreationUtils";
import { arrangeGridElementsWithRetry } from "@/utils/useCanvasLayerOrdering";
import logger from "@/utils/logger";
import { toast } from "sonner";

/**
 * Props for the useGridCreation hook
 */
interface UseGridCreationProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to store grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Flag to track if grid is initialized */
  gridInitializedRef: React.MutableRefObject<boolean>;
  /** Reference to last grid creation attempt time */
  lastGridCreationAttemptRef: React.MutableRefObject<number>;
}

/**
 * Hook for handling grid creation on canvas
 * 
 * @param {UseGridCreationProps} props - Hook properties
 * @returns Grid creation functions
 */
export const useGridCreation = ({
  fabricCanvasRef,
  gridLayerRef,
  gridInitializedRef,
  lastGridCreationAttemptRef
}: UseGridCreationProps) => {
  
  /**
   * Create grid on the canvas with error handling
   */
  const createCanvasGrid = useCallback(() => {
    if (!fabricCanvasRef.current) {
      logger.warn("Cannot create grid: Canvas reference is null");
      console.warn("Cannot create grid: Canvas reference is null");
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    // Throttle grid creation attempts
    const now = Date.now();
    if (now - lastGridCreationAttemptRef.current < 1000) {
      logger.debug("Grid creation throttled");
      return;
    }
    lastGridCreationAttemptRef.current = now;
    
    try {
      logger.info("Creating grid on canvas");
      console.log("Creating grid on canvas", {
        width: canvas.width,
        height: canvas.height
      });
      
      // Check if canvas has valid dimensions
      if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
        logger.error("Grid creation failed: Canvas has zero dimensions");
        console.error("Grid creation failed: Canvas has zero dimensions", {
          width: canvas.width,
          height: canvas.height
        });
        return;
      }
      
      // Clear existing grid objects
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      }
      
      // Create complete grid
      const gridObjects = createCompleteGrid(canvas);
      
      // If grid creation failed, try emergency grid
      if (!gridObjects || gridObjects.length === 0) {
        logger.warn("Complete grid creation failed, trying emergency grid");
        console.warn("Complete grid creation failed, trying emergency grid");
        
        const emergencyGrid = createBasicEmergencyGrid(canvas);
        if (emergencyGrid.length > 0) {
          gridInitializedRef.current = true;
          logger.info(`Created emergency grid with ${emergencyGrid.length} objects`);
          console.log(`Created emergency grid with ${emergencyGrid.length} objects`);
        } else {
          logger.error("Both regular and emergency grid creation failed");
          console.error("Both regular and emergency grid creation failed");
          toast.error("Failed to create grid. Please try refreshing the application.");
        }
      } else {
        // Grid created successfully
        gridInitializedRef.current = true;
        
        // Log success
        logger.info(`Grid created with ${gridObjects.length} objects`);
        console.log(`Grid created with ${gridObjects.length} objects`);
        
        // Ensure proper ordering
        arrangeGridElementsWithRetry(canvas, gridLayerRef);
      }
      
      // Force render to ensure grid is visible
      canvas.requestRenderAll();
      
      // Run diagnostics after a short delay to verify grid is properly displayed
      setTimeout(() => {
        if (fabricCanvasRef.current) {
          const diagnostics = runGridDiagnostics(canvas, gridLayerRef.current, true);
          
          // If issues found, try to fix them
          if (diagnostics.status !== 'ok') {
            applyGridFixes(canvas, gridLayerRef.current);
          }
        }
      }, 500);
      
    } catch (error) {
      logger.error("Error creating grid:", error);
      console.error("Error creating grid:", error);
      
      // Try emergency grid on error
      try {
        if (fabricCanvasRef.current) {
          const emergencyGrid = createBasicEmergencyGrid(fabricCanvasRef.current);
          if (emergencyGrid.length > 0) {
            gridInitializedRef.current = true;
          }
        }
      } catch (emergencyError) {
        logger.error("Emergency grid creation also failed:", emergencyError);
        console.error("Emergency grid creation also failed:", emergencyError);
      }
    }
  }, [fabricCanvasRef, gridLayerRef, gridInitializedRef, lastGridCreationAttemptRef]);
  
  return {
    createCanvasGrid
  };
};

// Import dependent functions that are used in this hook
import { runGridDiagnostics, applyGridFixes } from "@/utils/grid/gridDiagnostics";
