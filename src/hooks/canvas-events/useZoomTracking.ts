
/**
 * Hook for tracking zoom changes on the canvas
 * @module useZoomTracking
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, TPointerEvent, TEvent } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import { EventHandlerResult } from "./types";
import { ZOOM_CONSTANTS } from "@/constants/zoomConstants";

/**
 * Props for the useZoomTracking hook
 */
interface UseZoomTrackingProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to update zoom level */
  updateZoomLevel: () => void;
  /** Current drawing tool */
  tool: DrawingTool;
}

/**
 * Event type used for zoom tracking
 */
interface ZoomEvent extends Partial<TEvent<TPointerEvent>> {
  scale?: number; 
}

/**
 * Hook to track and respond to zoom changes on the canvas
 * @param {UseZoomTrackingProps} props - Hook properties
 * @returns {Object} Methods for zoom tracking and cleanup
 */
export const useZoomTracking = ({
  fabricCanvasRef,
  updateZoomLevel,
  tool
}: UseZoomTrackingProps): EventHandlerResult & { registerZoomTracking: () => (() => void) | undefined } => {
  // Track if we're currently zooming to avoid duplicate updates
  const isZoomingRef = useRef(false);
  
  /**
   * Register zoom change tracking events
   * @returns {Function} Cleanup function
   */
  const registerZoomTracking = useCallback((): (() => void) | undefined => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    /**
     * Handle zoom events from the canvas
     * @param {ZoomEvent} e - Zoom event data 
     */
    const handleZoom = (e: ZoomEvent) => {
      if (isZoomingRef.current) return;
      
      isZoomingRef.current = true;
      updateZoomLevel();
      
      // Reset zooming flag after short delay
      setTimeout(() => {
        isZoomingRef.current = false;
      }, ZOOM_CONSTANTS.TRANSITION_DURATION);
    };
    
    // Use any type for now to avoid TS errors with custom event names
    canvas.on('canvas:zoomed' as any, handleZoom as any);
    canvas.on('viewport:translate' as any, handleZoom as any);
    
    // Initial update
    updateZoomLevel();
    
    return () => {
      canvas.off('canvas:zoomed' as any, handleZoom as any);
      canvas.off('viewport:translate' as any, handleZoom as any);
    };
  }, [fabricCanvasRef, updateZoomLevel]);
  
  useEffect(() => {
    const cleanup = registerZoomTracking();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [registerZoomTracking]);

  return {
    registerZoomTracking,
    cleanup: () => {
      // Additional cleanup if needed
    }
  };
};
