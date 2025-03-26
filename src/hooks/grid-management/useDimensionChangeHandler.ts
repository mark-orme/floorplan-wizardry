
/**
 * Dimension change handler hook
 * Manages grid recreation when canvas dimensions change
 * @module grid-management/useDimensionChangeHandler
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { resetGridProgress } from "@/utils/gridManager";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";
import { MIN_ATTEMPT_INTERVAL } from "./constants";

/**
 * Hook for handling canvas dimension changes
 * 
 * @param {Object} params - Hook parameters
 * @returns {Object} Dimension change handler
 */
export const useDimensionChangeHandler = ({
  canvasDimensions,
  fabricCanvasRef,
  gridLayerRef,
  createGrid,
  lastAttemptTime,
  updateLastAttemptTime
}: {
  canvasDimensions: { width: number, height: number } | undefined,
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<any[]>,
  createGrid: (canvas: FabricCanvas) => any[],
  lastAttemptTime: number,
  updateLastAttemptTime: (time: number) => void
}) => {
  /**
   * Handle dimension changes with rate limiting
   */
  useEffect(() => {
    // Add null/undefined check for canvasDimensions
    if (canvasDimensions && canvasDimensions.width > 0 && canvasDimensions.height > 0 && fabricCanvasRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Canvas dimensions changed, recreating grid", canvasDimensions);
      }
      
      // Check rate-limiting - don't create grid too frequently
      const now = Date.now();
      if (now - lastAttemptTime < MIN_ATTEMPT_INTERVAL) {
        console.log("Grid recreation for dimensions change attempted too soon, skipping");
        return;
      }
      
      // Update attempt time
      updateLastAttemptTime(now);
      
      // Short timeout to ensure canvas is ready
      setTimeout(() => {
        resetGridProgress();
        
        // Check if canvas still exists
        if (!fabricCanvasRef.current) {
          console.log("Canvas no longer exists when attempting to recreate grid");
          return;
        }
        
        try {
          const grid = createGrid(fabricCanvasRef.current);
          
          // If standard grid creation fails, try emergency grid
          if (!grid || grid.length === 0) {
            console.log("Standard grid recreation returned 0 objects, trying emergency grid");
            createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
          }
        } catch (error) {
          console.error("Error during grid recreation:", error);
          
          // Try emergency grid on error
          if (fabricCanvasRef.current) {
            createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
          }
        }
      }, 100);
    }
  }, [
    canvasDimensions?.width,
    canvasDimensions?.height, 
    fabricCanvasRef, 
    gridLayerRef,
    createGrid,
    lastAttemptTime,
    updateLastAttemptTime
  ]);

  return {};
};
