
/**
 * Grid zoom hook
 * Handles grid recreation on zoom level changes
 * @module hooks/grid/useGridZoom
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Props for the useGridZoom hook
 */
interface UseGridZoomProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Flag to track if grid is initialized */
  gridInitializedRef: React.MutableRefObject<boolean>;
  /** Current zoom level */
  zoomLevel: number;
  /** Function to create the grid */
  createCanvasGrid: () => void;
}

/**
 * Hook for managing grid recreation on zoom level changes
 * 
 * @param {UseGridZoomProps} props - Hook properties
 */
export const useGridZoom = ({
  fabricCanvasRef,
  gridInitializedRef,
  zoomLevel,
  createCanvasGrid
}: UseGridZoomProps) => {
  
  // Force grid recreation when zoom changes significantly
  useEffect(() => {
    if (gridInitializedRef.current && fabricCanvasRef.current) {
      // Only recreate grid on significant zoom changes
      if (zoomLevel <= 0.5 || zoomLevel >= 2) {
        createCanvasGrid();
      }
    }
  }, [zoomLevel, createCanvasGrid, fabricCanvasRef, gridInitializedRef]);
};
