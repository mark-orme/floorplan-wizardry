
/**
 * Hook for tracking zoom changes in canvas
 * @module useZoomTracking
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";
import logger from "@/utils/logger";

/**
 * Canvas event name constants
 * @constant {Object}
 */
const CANVAS_EVENTS = {
  /**
   * Zoom changed event name
   * @constant {string}
   */
  ZOOM_CHANGED: 'zoom:changed',
  
  /**
   * Custom zoom changed event name
   * @constant {string}
   */
  CUSTOM_ZOOM_CHANGED: 'custom:zoom-changed'
};

/**
 * Props type for useZoomTracking
 */
type UseZoomTrackingProps = Pick<BaseEventHandlerProps, 'fabricCanvasRef'>;

/**
 * Result interface for useZoomTracking
 */
interface UseZoomTrackingResult extends EventHandlerResult {
  /** Register zoom change tracking */
  registerZoomTracking: () => (() => void) | undefined;
}

/**
 * Custom event interface for zoom events
 */
interface ZoomChangedEvent {
  zoom: number;
}

/**
 * Extended Canvas type with custom events
 */
interface ExtendedFabricCanvas extends FabricCanvas {
  fire(eventName: string, data: unknown): void;
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
        const canvas = fabricCanvasRef.current as ExtendedFabricCanvas;
        canvas.fire(CANVAS_EVENTS.CUSTOM_ZOOM_CHANGED, { zoom });
      }
    };
    
    const fabricCanvas = fabricCanvasRef.current;
    if (fabricCanvas) {
      // Cast to appropriate type for Fabric.js
      const zoomChangedHandler = updateZoomLevel as (e: unknown) => void;
      fabricCanvas.on(CANVAS_EVENTS.ZOOM_CHANGED as any, zoomChangedHandler);
      
      return () => {
        fabricCanvas.off(CANVAS_EVENTS.ZOOM_CHANGED as any, zoomChangedHandler);
      };
    }
    
    return undefined;
  }, [fabricCanvasRef]);

  return { 
    registerZoomTracking,
    cleanup: () => {
      logger.debug("Zoom tracking cleanup");
    }
  };
};
