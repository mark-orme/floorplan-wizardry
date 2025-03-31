
/**
 * Grid zoom handling hook
 * @module hooks/grid/useGridZoom
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

interface UseGridZoomProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridInitializedRef: React.MutableRefObject<boolean>;
  zoomLevel: number;
  createCanvasGrid: () => void;
}

/**
 * Hook for handling grid zoom-related operations
 */
export const useGridZoom = ({
  fabricCanvasRef,
  gridInitializedRef,
  zoomLevel,
  createCanvasGrid
}: UseGridZoomProps) => {
  // Recreate grid when zoom changes significantly
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    // Handle extreme zoom levels
    if (zoomLevel > 3 || zoomLevel < 0.3) {
      logger.info("Regenerating grid for extreme zoom level:", zoomLevel);
      
      // Only recreate if grid was previously initialized
      if (gridInitializedRef.current) {
        createCanvasGrid();
      }
    }
  }, [zoomLevel, fabricCanvasRef, gridInitializedRef, createCanvasGrid]);
};
