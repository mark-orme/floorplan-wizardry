
/**
 * Custom hook for integrating canvas dependency hooks
 * @module useCanvasDependencies
 */
import { useEffect } from "react";
import { useCanvasGrid } from "./useCanvasGrid";
import { useGridManagement } from "./useGridManagement";
import { useStylusDetection } from "./useStylusDetection";
import { useZoomStateSync } from "./useZoomStateSync";

interface UseCanvasDependenciesProps {
  fabricCanvasRef: React.MutableRefObject<any>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasDimensions: { width: number, height: number };
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  };
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  zoomLevel: number;
}

/**
 * Hook that integrates all canvas dependency hooks
 */
export const useCanvasDependencies = (props: UseCanvasDependenciesProps) => {
  const {
    fabricCanvasRef,
    canvasRef,
    canvasDimensions,
    debugInfo,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    zoomLevel
  } = props;
  
  // Create grid management
  const createGrid = useCanvasGrid({
    gridLayerRef: {} as React.MutableRefObject<any[]>, // This will be replaced with the actual ref
    canvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Initialize grid management
  const { gridLayerRef } = useGridManagement({
    fabricCanvasRef,
    canvasDimensions,
    debugInfo,
    createGrid
  });
  
  // Initialize stylus detection
  useStylusDetection({
    canvasRef,
    debugInfo
  });
  
  // Initialize zoom state synchronization
  useZoomStateSync({
    fabricCanvasRef,
    zoomLevel
  });
  
  // Update createGrid to use the actual gridLayerRef
  useEffect(() => {
    (createGrid as any).gridLayerRef = gridLayerRef;
  }, [createGrid, gridLayerRef]);
  
  return {
    gridLayerRef,
    createGrid
  };
};
