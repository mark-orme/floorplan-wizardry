
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
    console.log("Grid state:", {
      initialized: initialGridCreatedRef.current,
      inProgress: gridCreationInProgressRef.current,
      objectsCount: gridLayerRef.current.length,
      dimensions: canvasDimensions
    });
  }, [canvasDimensions, gridLayerRef.current.length]);
  
  // Create grid callback for other hooks with enhanced throttling
  const createGridCallback = useCallback((canvas: FabricCanvas) => {
    console.log("createGridCallback invoked", {
      canvasDimensions,
      gridExists: gridLayerRef.current.length > 0,
      initialized: initialGridCreatedRef.current
    });
    
    // Basic validation
    if (!canvas) {
      console.error("Canvas is null in createGridCallback");
      return [];
    }
    
    // If grid is already created, simply return the existing grid
    if (initialGridCreatedRef.current && gridLayerRef.current.length > 0) {
      // Check if the grid objects are still on the canvas
      const gridOnCanvas = gridLayerRef.current.some(obj => canvas.contains(obj));
      
      // If grid is on canvas, just return it
      if (gridOnCanvas) {
        console.log("Grid already exists on canvas in callback, using existing");
        return gridLayerRef.current;
      } else {
        console.log("Grid exists in reference but not on canvas in callback, will recreate");
      }
    }
    
    // Prevent grid recreation if one is already in progress
    if (gridCreationInProgressRef.current) {
      console.log("Grid creation already in progress in callback, skipping");
      return gridLayerRef.current;
    }
    
    // Force grid creation even if dimensions haven't changed - this is a critical fix
    if (canvasDimensions.width === 0 || canvasDimensions.height === 0) {
      console.warn("Invalid dimensions in callback:", canvasDimensions);
      return gridLayerRef.current;
    }

    // Clear any pending debounced grid creation
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Set flag to indicate a grid creation is in progress
    gridCreationInProgressRef.current = true;
    gridManager.inProgress = true;
    
    console.log("Creating grid in callback with dimensions:", canvasDimensions);
    
    try {
      // Increment counter
      gridCreationsCountRef.current += 1;
      gridManager.totalCreations += 1;
      
      // Store current dimensions
      lastDimensionsRef.current = { ...canvasDimensions };
      gridManager.lastDimensions = { ...canvasDimensions };
      
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
      gridManager.initialized = true;
      
      if (grid && grid.length > 0) {
        console.log(`Grid created successfully with ${grid.length} objects`);
        canvas.requestRenderAll();
      } else {
        console.warn("Grid creation returned no objects");
      }
      
      return grid;
    } catch (err) {
      console.error("Error in createGridCallback:", err);
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${err instanceof Error ? err.message : String(err)}`);
      return gridLayerRef.current;
    } finally {
      // Reset the flags
      gridCreationInProgressRef.current = false;
      gridManager.inProgress = false;
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
