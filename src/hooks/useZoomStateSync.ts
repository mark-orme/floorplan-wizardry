
/**
 * Custom hook for synchronizing zoom state across components
 * @module useZoomStateSync
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";

interface UseZoomStateSyncProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  zoomLevel: number;
}

/**
 * Hook for ensuring zoom level is properly synchronized across components
 */
export const useZoomStateSync = ({
  fabricCanvasRef,
  zoomLevel
}: UseZoomStateSyncProps) => {
  
  // Ensure zoom level is properly passed to DistanceTooltip via drawingState
  useEffect(() => {
    if (fabricCanvasRef.current) {
      // Trigger custom zoom changed event when component mounts to ensure correct initial zoom
      fabricCanvasRef.current.fire('custom:zoom-changed', { zoom: zoomLevel });
    }
  }, [fabricCanvasRef, zoomLevel]);

  return {}; // No return values needed, this hook only performs side effects
};
