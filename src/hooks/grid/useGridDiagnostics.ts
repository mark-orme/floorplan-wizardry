
/**
 * Grid diagnostics hook for troubleshooting grid issues
 * @module hooks/grid/useGridDiagnostics
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import logger from "@/utils/logger";

interface UseGridDiagnosticsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  isGridInitialized: boolean;
}

/**
 * Hook for diagnosing and troubleshooting grid issues
 */
export const useGridDiagnostics = ({
  fabricCanvasRef,
  gridLayerRef,
  isGridInitialized
}: UseGridDiagnosticsProps) => {
  /**
   * Run diagnostics on grid state
   */
  const runDiagnostics = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      logger.warn("Cannot run grid diagnostics: Canvas is null");
      return {
        hasCanvas: false,
        gridExists: false,
        gridCount: 0,
        canvasReady: false
      };
    }
    
    const gridObjects = gridLayerRef.current;
    const gridCount = gridObjects.length;
    
    // Check grid objects presence
    const gridObjectsOnCanvas = gridObjects.filter(obj => 
      canvas.contains(obj)
    );
    
    const result = {
      hasCanvas: true,
      canvasReady: canvas.width > 0 && canvas.height > 0,
      canvasDimensions: { width: canvas.width, height: canvas.height },
      gridExists: gridCount > 0,
      gridInitialized: isGridInitialized,
      gridCount,
      gridObjectsOnCanvas: gridObjectsOnCanvas.length,
      gridVisibilityIssues: gridCount > 0 && gridObjectsOnCanvas.length === 0,
      missingGridObjects: gridCount - gridObjectsOnCanvas.length
    };
    
    logger.info("Grid diagnostics result:", result);
    
    // Show issues in console if they exist
    if (result.gridVisibilityIssues) {
      console.warn("Grid visibility issues detected:", result);
    }
    
    return result;
  }, [fabricCanvasRef, gridLayerRef, isGridInitialized]);

  return {
    runDiagnostics
  };
};
