
/**
 * Grid management hook for canvas
 * Handles the creation and management of grid on canvas
 * @module hooks/useCanvasGrid
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useGridCreation } from "./grid/useGridCreation";
import { useGridDiagnostics } from "./grid/useGridDiagnostics";
import { useGridZoom } from "./grid/useGridZoom";
import logger from "@/utils/logger";

/**
 * Props for useCanvasGrid hook
 */
interface UseCanvasGridProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Current zoom level */
  zoomLevel?: number;
}

/**
 * Hook for managing canvas grid
 * Creates and maintains the grid lines on the canvas
 * 
 * @param {UseCanvasGridProps} props - Hook properties
 * @returns Grid management functions and references
 */
export const useCanvasGrid = ({
  fabricCanvasRef,
  canvasDimensions,
  zoomLevel = 1
}: UseCanvasGridProps) => {
  const gridLayerRef = useRef<FabricObject[]>([]);
  const gridInitializedRef = useRef(false);
  const lastGridCreationAttemptRef = useRef(0);
  
  // Use the grid creation hook
  const { createCanvasGrid } = useGridCreation({
    fabricCanvasRef,
    gridLayerRef,
    gridInitializedRef,
    lastGridCreationAttemptRef
  });
  
  // Use the grid diagnostics hook
  const { runDiagnostics } = useGridDiagnostics({
    fabricCanvasRef,
    gridLayerRef,
    isGridInitialized: gridInitializedRef.current
  });
  
  // Use the grid zoom hook
  useGridZoom({
    fabricCanvasRef,
    gridInitializedRef,
    zoomLevel,
    createCanvasGrid
  });
  
  // Create grid when canvas or dimensions change
  useEffect(() => {
    if (fabricCanvasRef.current && 
        canvasDimensions.width > 0 && 
        canvasDimensions.height > 0) {
      // Small delay to ensure canvas is fully initialized
      const timer = setTimeout(() => {
        createCanvasGrid();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [
    fabricCanvasRef,
    canvasDimensions.width,
    canvasDimensions.height,
    createCanvasGrid
  ]);
  
  return {
    gridLayerRef,
    createGrid: createCanvasGrid,
    isGridInitialized: () => gridInitializedRef.current,
    runDiagnostics
  };
};
