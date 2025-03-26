
/**
 * Hook for tracking zoom changes in canvas
 * @module useZoomTracking
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps } from "./types";

/**
 * Hook to handle zoom tracking
 */
export const useZoomTracking = ({
  fabricCanvasRef
}: Pick<BaseEventHandlerProps, 'fabricCanvasRef'>) => {
  /**
   * Register zoom change tracking
   * Sets up event listeners for zoom changes
   * @returns {Function} Cleanup function
   */
  const registerZoomTracking = useCallback((): (() => void) | undefined => {
    const updateZoomLevel = (): void => {
      if (fabricCanvasRef.current) {
        const zoom = fabricCanvasRef.current.getZoom();
        fabricCanvasRef.current.fire('custom:zoom-changed', { zoom });
      }
    };
    
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      fabricCanvas.on('zoom:changed' as any, updateZoomLevel);
      
      return () => {
        fabricCanvas.off('zoom:changed' as any, updateZoomLevel);
      };
    }
    
    return undefined;
  }, [fabricCanvasRef]);

  return { registerZoomTracking };
};
