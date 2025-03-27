
/**
 * Hook for tracking zoom changes on canvas
 * @module useZoomTracking
 */
import { useCallback, useEffect } from "react";
import type { Canvas as FabricCanvas, TEvent } from "fabric";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";
import { ZOOM_CONSTANTS } from "@/constants/zoomConstants";
import logger from "@/utils/logger";

/**
 * Interface for zoom change event
 */
interface ZoomChangeEvent extends TEvent {
  zoom?: number;
  e?: MouseEvent | WheelEvent | TouchEvent;
}

/**
 * Interface for viewport transform event
 */
interface ViewportTransformEvent extends TEvent {
  transform?: number[];
}

/**
 * Props for the useZoomTracking hook
 */
interface UseZoomTrackingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  onZoomChange?: (zoom: number) => void;
}

/**
 * Result of the useZoomTracking hook
 */
interface UseZoomTrackingResult extends EventHandlerResult {
  registerZoomTracking: () => (() => void) | undefined;
}

/**
 * Type for the Fabric event handler to satisfy Fabric.js API
 */
type FabricEventHandler<T extends TEvent> = (e: T) => void;

/**
 * Hook to track zoom changes on canvas
 * @param {UseZoomTrackingProps} props - Hook properties
 * @returns {UseZoomTrackingResult} Zoom tracking functions and cleanup
 */
export const useZoomTracking = ({
  fabricCanvasRef,
  onZoomChange
}: UseZoomTrackingProps): UseZoomTrackingResult => {
  /**
   * Calculate current zoom from canvas viewportTransform
   */
  const getCurrentZoom = useCallback((): number => {
    if (!fabricCanvasRef.current) return ZOOM_CONSTANTS.DEFAULT_ZOOM;
    
    const canvas = fabricCanvasRef.current;
    
    // Extract zoom from viewportTransform
    const transform = canvas.viewportTransform;
    if (!transform) return ZOOM_CONSTANTS.DEFAULT_ZOOM;
    
    // The zoom is in the first position of the transform matrix
    return transform[0];
  }, [fabricCanvasRef]);
  
  /**
   * Register event listeners for zoom changes
   */
  const registerZoomTracking = useCallback((): (() => void) | undefined => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    /**
     * Handle zoom changed event
     */
    const handleZoomChange = (e: ZoomChangeEvent): void => {
      const zoomLevel = e.zoom || getCurrentZoom();
      logger.debug(`Zoom changed to: ${zoomLevel}`);
      
      if (onZoomChange) {
        onZoomChange(zoomLevel);
      }
    };
    
    /**
     * Handle viewport transform event
     */
    const handleViewportTransform = (e: ViewportTransformEvent): void => {
      const zoomLevel = getCurrentZoom();
      logger.debug(`Viewport transform changed, zoom: ${zoomLevel}`);
      
      if (onZoomChange) {
        onZoomChange(zoomLevel);
      }
    };
    
    // Register event handlers
    canvas.on('zoom:changed', handleZoomChange as FabricEventHandler<ZoomChangeEvent>);
    canvas.on('viewport:transform', handleViewportTransform as FabricEventHandler<ViewportTransformEvent>);
    
    // Initial zoom check
    const initialZoom = getCurrentZoom();
    if (onZoomChange) {
      onZoomChange(initialZoom);
    }
    
    // Return cleanup function
    return () => {
      if (canvas) {
        canvas.off('zoom:changed', handleZoomChange as FabricEventHandler<ZoomChangeEvent>);
        canvas.off('viewport:transform', handleViewportTransform as FabricEventHandler<ViewportTransformEvent>);
      }
    };
  }, [fabricCanvasRef, getCurrentZoom, onZoomChange]);
  
  // Register zoom tracking on mount
  useEffect(() => {
    const cleanupFn = registerZoomTracking();
    return () => {
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [registerZoomTracking]);
  
  return {
    registerZoomTracking,
    cleanup: () => {
      logger.debug("Zoom tracking cleanup");
    }
  };
};
