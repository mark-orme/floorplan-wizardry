
/**
 * Custom hook for synchronizing zoom state across components
 * @module useZoomStateSync
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";

/**
 * Props for the useZoomStateSync hook
 * @interface UseZoomStateSyncProps
 */
interface UseZoomStateSyncProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current zoom level to synchronize */
  zoomLevel: number;
}

/**
 * Hook for ensuring zoom level is properly synchronized across components
 * Triggers custom zoom events to keep UI components in sync with canvas zoom
 * 
 * @param {UseZoomStateSyncProps} props - Hook properties
 * @returns {Object} Empty object as this hook only performs side effects
 */
export const useZoomStateSync = ({
  fabricCanvasRef,
  zoomLevel
}: UseZoomStateSyncProps) => {
  
  // Ensure zoom level is properly passed to DistanceTooltip via drawingState
  useEffect(() => {
    if (fabricCanvasRef.current) {
      // Trigger custom zoom changed event when component mounts to ensure correct initial zoom
      // Use type casting to allow custom events
      const canvas = fabricCanvasRef.current as unknown as {
        fire(event: string, data: unknown): void;
      };
      canvas.fire('custom:zoom-changed', { zoom: zoomLevel });
    }
  }, [fabricCanvasRef, zoomLevel]);

  return {}; // No return values needed, this hook only performs side effects
};
