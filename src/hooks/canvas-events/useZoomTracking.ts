
/**
 * Hook for tracking canvas zoom events
 * @module canvas-events/useZoomTracking
 */
import { useEffect, useCallback } from "react";
import { Canvas } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import logger from "@/utils/logger";

/**
 * Props for useZoomTracking hook
 */
export interface UseZoomTrackingProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  /** Function to update zoom level */
  updateZoomLevel: () => void;
  /** Current active tool */
  tool: DrawingTool;
}

/**
 * Result type for useZoomTracking hook
 */
export interface UseZoomTrackingResult {
  /** Function to clean up event listeners */
  cleanup: () => void;
}

/**
 * Hook for tracking zoom events and managing zoom state
 * 
 * @param {UseZoomTrackingProps} props - Props for the hook
 * @returns {UseZoomTrackingResult} Hook result
 */
export const useZoomTracking = ({
  fabricCanvasRef,
  updateZoomLevel,
  tool
}: UseZoomTrackingProps): UseZoomTrackingResult => {
  /**
   * Handle zoom events from canvas
   */
  const handleZoom = useCallback(() => {
    // Update zoom tracking state
    updateZoomLevel();
  }, [updateZoomLevel]);
  
  /**
   * Register zoom tracking event handlers
   */
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Add event listeners for zoom events
      canvas.on('zoom:updated', handleZoom);
      
      // Create our own zoom event handler for mouse wheel
      const handleMouseWheel = (e: WheelEvent) => {
        if (tool !== 'zoom') return;
        
        e.preventDefault();
        
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        
        // Determine zoom direction
        const delta = e.deltaY;
        if (delta === 0) return;
        
        // Calculate point to zoom around (pointer position)
        const pointer = {
          x: e.offsetX,
          y: e.offsetY
        };
        
        // Calculate zoom factor based on delta
        const zoomFactor = delta > 0 ? 0.95 : 1.05;
        
        // Apply zoom
        canvas.zoomToPoint(pointer, canvas.getZoom() * zoomFactor);
        
        // Trigger zoom event
        if (typeof canvas.fire === 'function') {
          canvas.fire('zoom:updated');
        }
      };
      
      // Add event listener to canvas element
      const canvasElement = canvas.getElement();
      if (canvasElement) {
        canvasElement.addEventListener('wheel', handleMouseWheel, { passive: false });
      }
      
      // Cleanup function
      return () => {
        try {
          if (canvas) {
            canvas.off('zoom:updated', handleZoom);
          }
          
          if (canvasElement) {
            canvasElement.removeEventListener('wheel', handleMouseWheel);
          }
        } catch (error) {
          logger.error('Error cleaning up zoom tracking:', error);
        }
      };
    } catch (error) {
      logger.error('Error setting up zoom tracking:', error);
      return () => {};
    }
  }, [fabricCanvasRef, handleZoom, tool]);
  
  // Return cleanup function
  return {
    cleanup: useCallback(() => {
      try {
        const canvas = fabricCanvasRef.current;
        if (canvas) {
          canvas.off('zoom:updated', handleZoom);
        }
      } catch (error) {
        logger.error('Error in zoom tracking cleanup:', error);
      }
    }, [fabricCanvasRef, handleZoom])
  };
};
