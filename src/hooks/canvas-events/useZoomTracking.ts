
/**
 * Hook for tracking zoom changes in canvas
 * @module useZoomTracking
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps } from "./types";

/**
 * Props type for useZoomTracking
 */
type UseZoomTrackingProps = Pick<BaseEventHandlerProps, 'fabricCanvasRef'>;

/**
 * Result interface for useZoomTracking
 */
interface UseZoomTrackingResult {
  /** Register zoom change tracking */
  registerZoomTracking: () => (() => void) | undefined;
}

/**
 * Hook to handle zoom tracking
 * @param {UseZoomTrackingProps} props - Hook properties
 * @returns {UseZoomTrackingResult} Zoom tracking functions
 */
export const useZoomTracking = ({
  fabricCanvasRef
}: UseZoomTrackingProps): UseZoomTrackingResult => {
  /**
   * Register zoom change tracking
   * Sets up event listeners for zoom changes
   * @returns {Function} Cleanup function
   */
  const registerZoomTracking = useCallback((): (() => void) | undefined => {
    const updateZoomLevel = (): void => {
      if (fabricCanvasRef.current) {
        const zoom = fabricCanvasRef.current.getZoom();
        // Type cast to access custom event type
        const canvas = fabricCanvasRef.current as FabricCanvas & {
          fire: (eventName: string, data: unknown) => void;
        };
        canvas.fire('custom:zoom-changed', { zoom });
      }
    };
    
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      // Cast to appropriate type for Fabric.js
      const zoomChangedHandler = updateZoomLevel as (e: unknown) => void;
      fabricCanvas.on('zoom:changed', zoomChangedHandler);
      
      return () => {
        fabricCanvas.off('zoom:changed', zoomChangedHandler);
      };
    }
    
    return undefined;
  }, [fabricCanvasRef]);

  return { registerZoomTracking };
};
