
/**
 * Custom hook for grid management
 * @module useCanvasGrid
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { createGrid } from "@/utils/canvasGrid";

interface UseCanvasGridProps {
  gridLayerRef: React.MutableRefObject<any[]>;
  canvasDimensions: { width: number, height: number };
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}

/**
 * Hook for managing canvas grid creation and updates
 * @param {UseCanvasGridProps} props - Hook properties
 * @returns Memoized grid creation function
 */
export const useCanvasGrid = ({
  gridLayerRef,
  canvasDimensions,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasGridProps) => {
  // Track the last grid creation time to prevent rapid consecutive creations
  const lastGridCreationTimeRef = useRef(0);
  const gridCreationInProgressRef = useRef(false);
  
  // Create grid callback for other hooks with throttling
  const createGridCallback = useCallback((canvas: FabricCanvas) => {
    const now = Date.now();
    
    // Prevent grid creation if one is already in progress
    if (gridCreationInProgressRef.current) {
      console.log("Grid creation already in progress, skipping duplicate call");
      return gridLayerRef.current;
    }
    
    // Prevent grid creation more frequently than every 3 seconds
    if (now - lastGridCreationTimeRef.current < 3000 && gridLayerRef.current.length > 0) {
      console.log("Grid created recently, skipping recreation");
      return gridLayerRef.current;
    }
    
    // Set flag to indicate a grid creation is in progress
    gridCreationInProgressRef.current = true;
    
    try {
      // Update the last creation time reference
      lastGridCreationTimeRef.current = now;
      
      // Create the grid
      const grid = createGrid(
        canvas, 
        gridLayerRef, 
        canvasDimensions, 
        setDebugInfo, 
        setHasError, 
        setErrorMessage
      );
      
      // Reset the flag
      gridCreationInProgressRef.current = false;
      
      return grid;
    } catch (err) {
      console.error("Error in createGridCallback:", err);
      gridCreationInProgressRef.current = false;
      return gridLayerRef.current;
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
