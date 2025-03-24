
/**
 * Custom hook for grid management
 * @module useCanvasGrid
 */
import { useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { createGrid } from "@/utils/canvasGrid";
import { gridManager } from "@/utils/gridOperations";

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
  const lastGridCreationTimeRef = useRef(gridManager.lastCreationTime);
  const gridCreationInProgressRef = useRef(gridManager.inProgress);
  const lastDimensionsRef = useRef(gridManager.lastDimensions);
  const initialGridCreatedRef = useRef(gridManager.initialized);
  const gridCreationsCountRef = useRef(gridManager.totalCreations);
  const debounceTimerRef = useRef<number | null>(null);
  
  // Debug effect to log grid state changes
  useEffect(() => {
    console.log("Grid hook state:", {
      initialized: initialGridCreatedRef.current,
      inProgress: gridCreationInProgressRef.current,
      objectsCount: gridLayerRef.current.length,
      dimensions: canvasDimensions
    });
  }, [canvasDimensions, gridLayerRef.current.length]);
  
  // Create grid callback with forced creation
  const createGridCallback = useCallback((canvas: FabricCanvas) => {
    console.log("createGridCallback invoked with FORCED CREATION", {
      canvasDimensions,
      gridExists: gridLayerRef.current.length > 0,
      initialized: initialGridCreatedRef.current
    });
    
    // Basic validation
    if (!canvas) {
      console.error("Canvas is null in createGridCallback");
      return [];
    }
    
    // Clear any pending debounced grid creation
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Set flags to indicate a grid creation is in progress
    gridCreationInProgressRef.current = true;
    gridManager.inProgress = true;
    
    console.log("Forcing grid creation with dimensions:", canvasDimensions);
    
    try {
      // Increment counter
      gridCreationsCountRef.current += 1;
      gridManager.totalCreations += 1;
      
      // Store current dimensions
      lastDimensionsRef.current = { ...canvasDimensions };
      gridManager.lastDimensions = { ...canvasDimensions };
      
      // Create the grid with direct call (no batching)
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
      gridManager.initialized = true;
      
      if (grid && grid.length > 0) {
        console.log(`Grid created successfully with ${grid.length} objects`);
        // Force a render
        canvas.requestRenderAll();
      } else {
        console.warn("Grid creation returned no objects - critical failure");
      }
      
      return grid;
    } catch (err) {
      console.error("Critical error in createGridCallback:", err);
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    } finally {
      // Reset the flags
      gridCreationInProgressRef.current = false;
      gridManager.inProgress = false;
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
