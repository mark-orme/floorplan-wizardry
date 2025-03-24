
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
  
  // Create grid callback for other hooks with throttling
  const createGridCallback = useCallback((canvas: FabricCanvas) => {
    const now = Date.now();
    
    // Prevent grid creation more frequently than every 2 seconds
    if (now - lastGridCreationTimeRef.current < 2000 && gridLayerRef.current.length > 0) {
      return gridLayerRef.current;
    }
    
    lastGridCreationTimeRef.current = now;
    
    return createGrid(
      canvas, 
      gridLayerRef, 
      canvasDimensions, 
      setDebugInfo, 
      setHasError, 
      setErrorMessage
    );
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
