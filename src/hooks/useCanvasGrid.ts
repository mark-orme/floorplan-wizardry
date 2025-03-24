
/**
 * Custom hook for grid management
 * @module useCanvasGrid
 */
import { useCallback } from "react";
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
  // Create grid callback for other hooks
  const createGridCallback = useCallback((canvas: FabricCanvas) => {
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
