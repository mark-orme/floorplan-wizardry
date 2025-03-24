
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

// Track grid creation globally to prevent unnecessary recreations
const globalGridCreations = {
  count: 0,
  lastDimensions: { width: 0, height: 0 },
  lastCreationTime: 0,
  inProgress: false,
  initialized: false
};

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
  const lastGridCreationTimeRef = useRef(globalGridCreations.lastCreationTime);
  const gridCreationInProgressRef = useRef(globalGridCreations.inProgress);
  const lastDimensionsRef = useRef(globalGridCreations.lastDimensions);
  const initialGridCreatedRef = useRef(globalGridCreations.initialized);
  const gridCreationsCountRef = useRef(globalGridCreations.count);
  const debounceTimerRef = useRef<number | null>(null);
  
  // Create grid callback for other hooks with enhanced throttling
  const createGridCallback = useCallback((canvas: FabricCanvas) => {
    // If grid is already created, simply return the existing grid
    if (initialGridCreatedRef.current && gridLayerRef.current.length > 0) {
      // Check if the grid objects are still on the canvas
      const gridOnCanvas = gridLayerRef.current.some(obj => canvas.contains(obj));
      
      // If grid is on canvas, just return it
      if (gridOnCanvas) {
        return gridLayerRef.current;
      }
    }
    
    // Prevent grid recreation if one is already in progress
    if (gridCreationInProgressRef.current) {
      return gridLayerRef.current;
    }
    
    // If grid is already created and dimensions haven't changed significantly, return existing grid
    if (initialGridCreatedRef.current && gridLayerRef.current.length > 0) {
      // Only recreate if there are major dimension changes (>50% difference)
      const widthRatio = Math.abs(canvasDimensions.width - lastDimensionsRef.current.width) / lastDimensionsRef.current.width;
      const heightRatio = Math.abs(canvasDimensions.height - lastDimensionsRef.current.height) / lastDimensionsRef.current.height;
      
      // More aggressive dimension change threshold
      if (widthRatio < 0.5 && heightRatio < 0.5) {
        return gridLayerRef.current;
      }
    }
    
    // Clear any pending debounced grid creation
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    const now = Date.now();
    
    // Strict minimum interval between grid creations (120 seconds)
    if (now - lastGridCreationTimeRef.current < 120000 && gridLayerRef.current.length > 0) {
      return gridLayerRef.current;
    }
    
    // Hard limit on recreations: No more than 3 in total
    if (gridCreationsCountRef.current >= 3 && gridLayerRef.current.length > 0) {
      return gridLayerRef.current;
    }
    
    // Set flag to indicate a grid creation is in progress
    gridCreationInProgressRef.current = true;
    globalGridCreations.inProgress = true;
    
    try {
      // Increment counter
      gridCreationsCountRef.current += 1;
      globalGridCreations.count += 1;
      
      // Update the last creation time reference
      lastGridCreationTimeRef.current = now;
      globalGridCreations.lastCreationTime = now;
      
      // Store current dimensions
      lastDimensionsRef.current = { ...canvasDimensions };
      globalGridCreations.lastDimensions = { ...canvasDimensions };
      
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
      globalGridCreations.initialized = true;
      
      return grid;
    } catch (err) {
      console.error("Error in createGridCallback:", err);
      return gridLayerRef.current;
    } finally {
      // Reset the flags
      gridCreationInProgressRef.current = false;
      globalGridCreations.inProgress = false;
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
