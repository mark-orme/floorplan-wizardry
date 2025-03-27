
/**
 * Hook for tracking zoom level in canvas
 * @module canvas-events/useZoomTracking
 */
import { useEffect, useCallback } from "react";
import { Canvas as FabricCanvas, IEvent } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import { ZOOM_CONSTANTS } from "@/constants/zoomConstants";
import logger from "@/utils/logger";

/**
 * Props for the useZoomTracking hook
 */
export interface UseZoomTrackingProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to update zoom level state */
  updateZoomLevel: () => void;
  /** Current active tool */
  tool: DrawingTool;
}

/**
 * Hook to track and maintain zoom level
 * @param props The hook props
 * @returns Object with cleanup function
 */
export const useZoomTracking = ({ 
  fabricCanvasRef, 
  updateZoomLevel,
  tool
}: UseZoomTrackingProps) => {
  /**
   * Handle mouse wheel events for zooming
   */
  const handleMouseWheel = useCallback((opt: IEvent) => {
    // Skip if not using hand tool
    if (tool !== 'hand') return;
  
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get wheel delta
    const e = opt.e as WheelEvent;
    const delta = e.deltaY;
    
    // Calculate zoom based on wheel direction
    const zoomFactor = delta > 0 ? ZOOM_CONSTANTS.OUT : ZOOM_CONSTANTS.IN;
    
    // Get current zoom
    const zoom = canvas.getZoom();
    
    // Calculate new zoom level within constraints
    const newZoom = Math.min(
      Math.max(zoom * zoomFactor, ZOOM_CONSTANTS.MIN_ZOOM), 
      ZOOM_CONSTANTS.MAX_ZOOM
    );
    
    // Apply new zoom centered at mouse position
    canvas.zoomToPoint(
      { x: e.offsetX, y: e.offsetY },
      newZoom
    );
    
    // Prevent page scrolling
    e.preventDefault();
    e.stopPropagation();
    
    // Update zoom level in state
    if (updateZoomLevel) {
      updateZoomLevel();
    }
  }, [fabricCanvasRef, updateZoomLevel, tool]);

  /**
   * Apply transition to canvas for smooth zooming
   */
  const applyTransition = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const transitionDuration = 300; // in milliseconds
    canvas.wrapperEl.style.transition = `transform ${transitionDuration}ms ease-in-out`;
    
    // Clear transition after animation completes
    setTimeout(() => {
      if (canvas.wrapperEl) {
        canvas.wrapperEl.style.transition = '';
      }
    }, transitionDuration);
  }, [fabricCanvasRef]);

  /**
   * Set up event listeners when component mounts
   */
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Add mouse wheel event listener
    canvas.on('mouse:wheel', handleMouseWheel);
    
    // Cleanup function
    return () => {
      canvas.off('mouse:wheel', handleMouseWheel);
    };
  }, [fabricCanvasRef, handleMouseWheel]);

  return {
    cleanup: () => {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.off('mouse:wheel', handleMouseWheel);
      }
    }
  };
};
