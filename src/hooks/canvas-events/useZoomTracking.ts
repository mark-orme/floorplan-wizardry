
/**
 * Hook for tracking zoom changes on canvas
 * @module useZoomTracking
 */
import { useEffect } from "react";
import type { Canvas as FabricCanvas, TEvent, TPointerEvent } from "fabric";
import logger from "@/utils/logger";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";
import { ZOOM_CONSTANTS } from "@/constants/zoomConstants";

/**
 * Interface for viewport transform event
 */
interface ViewportTransformEvent extends TEvent<TPointerEvent> {
  transform: number[];
}

/**
 * Props for useZoomTracking hook
 */
interface UseZoomTrackingProps extends BaseEventHandlerProps {
  /** Function to update zoom level */
  updateZoomLevel: (zoomLevel: number) => void;
}

/**
 * Type for fabric event handler
 */
type FabricEventHandler<T extends TEvent> = (e: T) => void;

/**
 * Hook to track zoom changes on canvas
 * @param {UseZoomTrackingProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const useZoomTracking = ({
  fabricCanvasRef,
  updateZoomLevel
}: UseZoomTrackingProps): EventHandlerResult => {
  // Monitor zoom changes on the canvas
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    /**
     * Handle zoom change events
     * Updates zoom level state when canvas zoom changes
     * @param {ViewportTransformEvent} e - Event object with transform data
     */
    const handleZoomChange = (e: ViewportTransformEvent): void => {
      try {
        if (!e || !e.transform) return;
        
        // The zoom level is stored in transform[0] (scaleX) and transform[3] (scaleY)
        // They should be the same for uniform scaling
        const zoomLevel = Math.round(e.transform[0] * 100) / 100;
        
        // Update zoom level state through the provided callback
        updateZoomLevel(zoomLevel);
        
        logger.debug("Zoom changed:", zoomLevel);
      } catch (err) {
        logger.error("Error handling zoom change:", err);
      }
    };
    
    // Register event handlers
    fabricCanvas.on('canvas:zoomed', handleZoomChange as FabricEventHandler<ViewportTransformEvent>);
    fabricCanvas.on('viewport:translate', handleZoomChange as FabricEventHandler<ViewportTransformEvent>);
    
    // Cleanup: Remove event handlers
    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('canvas:zoomed', handleZoomChange as FabricEventHandler<ViewportTransformEvent>);
        fabricCanvas.off('viewport:translate', handleZoomChange as FabricEventHandler<ViewportTransformEvent>);
      }
    };
  }, [fabricCanvasRef, updateZoomLevel]);
  
  return {
    cleanup: () => {
      logger.debug("Zoom tracking cleanup");
    }
  };
};
