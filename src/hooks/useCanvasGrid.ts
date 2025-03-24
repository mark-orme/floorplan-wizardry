
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
  const lastDimensionsRef = useRef({ width: 0, height: 0 });
  const initialGridCreatedRef = useRef(false);
  
  // Create grid callback for other hooks with throttling
  const createGridCallback = useCallback((canvas: FabricCanvas) => {
    // If grid is already created and dimensions haven't changed significantly, return existing grid
    if (initialGridCreatedRef.current && gridLayerRef.current.length > 0) {
      // Only recreate if there are major dimension changes (>30% difference)
      const widthRatio = Math.abs(canvasDimensions.width - lastDimensionsRef.current.width) / lastDimensionsRef.current.width;
      const heightRatio = Math.abs(canvasDimensions.height - lastDimensionsRef.current.height) / lastDimensionsRef.current.height;
      
      if (widthRatio < 0.3 && heightRatio < 0.3) {
        // Silently return existing grid
        return gridLayerRef.current;
      }
    }
    
    // Prevent grid creation if one is already in progress
    if (gridCreationInProgressRef.current) {
      return gridLayerRef.current;
    }
    
    const now = Date.now();
    
    // Strict minimum interval between grid creations (15 seconds)
    if (now - lastGridCreationTimeRef.current < 15000 && gridLayerRef.current.length > 0) {
      return gridLayerRef.current;
    }
    
    // Set flag to indicate a grid creation is in progress
    gridCreationInProgressRef.current = true;
    
    try {
      // Update the last creation time reference
      lastGridCreationTimeRef.current = now;
      // Store current dimensions
      lastDimensionsRef.current = { ...canvasDimensions };
      
      // Create the grid
      const grid = createGrid(
        canvas, 
        gridLayerRef, 
        canvasDimensions, 
        setDebugInfo, 
        setHasError, 
        setErrorMessage
      );
      
      // Mark initial grid as created
      initialGridCreatedRef.current = true;
      
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
