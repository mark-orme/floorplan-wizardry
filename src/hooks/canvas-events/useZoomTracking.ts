
/**
 * Hook for tracking zoom events and operations
 * @module canvas-events/useZoomTracking
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ZOOM_LEVEL_CONSTANTS, UseZoomTrackingProps, UseZoomTrackingResult } from './types';

/**
 * Hook for tracking and managing canvas zoom operations
 * @param {UseZoomTrackingProps} props The zoom tracking props
 * @returns {UseZoomTrackingResult} Zoom tracking result with zoom operations
 */
export const useZoomTracking = ({
  fabricCanvasRef,
  tool,
  updateZoomLevel
}: UseZoomTrackingProps): UseZoomTrackingResult => {
  const [currentZoom, setCurrentZoom] = useState(ZOOM_LEVEL_CONSTANTS.DEFAULT);
  const zoomFunctionsInitialized = useRef(false);

  /**
   * Register zoom-related event handlers
   */
  const register = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Update zoom level when canvas is zoomed
    const canvas = fabricCanvasRef.current;
    
    // Add zoom change listener using a standard Fabric event
    // Create a custom event emitter for zoom changes
    canvas.on('mouse:wheel', () => {
      if (updateZoomLevel) {
        updateZoomLevel();
      }
      setCurrentZoom(canvas.getZoom());
      
      // You can emit a custom event here if needed
      if (canvas.fire) {
        canvas.fire('custom:zoom-changed', {});
      }
    });
    
    // Flag that handlers are registered
    zoomFunctionsInitialized.current = true;
  }, [fabricCanvasRef, updateZoomLevel]);
  
  /**
   * Unregister zoom-related event handlers
   */
  const unregister = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Remove zoom change listener
    const canvas = fabricCanvasRef.current;
    canvas.off('zoom:changed');
    
    // Reset flag
    zoomFunctionsInitialized.current = false;
  }, [fabricCanvasRef]);
  
  /**
   * Clean up event handlers
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);
  
  /**
   * Zoom in operation
   */
  const zoomIn = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const zoom = Math.min(
      canvas.getZoom() + ZOOM_LEVEL_CONSTANTS.STEP,
      ZOOM_LEVEL_CONSTANTS.MAX
    );
    
    canvas.setZoom(zoom);
    canvas.requestRenderAll();
    setCurrentZoom(zoom);
    
    // Trigger update zoom level callback
    if (updateZoomLevel) {
      updateZoomLevel();
    }
  }, [fabricCanvasRef, updateZoomLevel]);
  
  /**
   * Zoom out operation
   */
  const zoomOut = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const zoom = Math.max(
      canvas.getZoom() - ZOOM_LEVEL_CONSTANTS.STEP,
      ZOOM_LEVEL_CONSTANTS.MIN
    );
    
    canvas.setZoom(zoom);
    canvas.requestRenderAll();
    setCurrentZoom(zoom);
    
    // Trigger update zoom level callback
    if (updateZoomLevel) {
      updateZoomLevel();
    }
  }, [fabricCanvasRef, updateZoomLevel]);
  
  /**
   * Reset zoom to default level
   */
  const resetZoom = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.setZoom(ZOOM_LEVEL_CONSTANTS.DEFAULT);
    canvas.requestRenderAll();
    setCurrentZoom(ZOOM_LEVEL_CONSTANTS.DEFAULT);
    
    // Trigger update zoom level callback
    if (updateZoomLevel) {
      updateZoomLevel();
    }
  }, [fabricCanvasRef, updateZoomLevel]);
  
  /**
   * Set zoom to specific level
   * @param {number} level Zoom level to set
   */
  const setZoom = useCallback((level: number) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const zoom = Math.max(
      Math.min(level, ZOOM_LEVEL_CONSTANTS.MAX),
      ZOOM_LEVEL_CONSTANTS.MIN
    );
    
    canvas.setZoom(zoom);
    canvas.requestRenderAll();
    setCurrentZoom(zoom);
    
    // Trigger update zoom level callback
    if (updateZoomLevel) {
      updateZoomLevel();
    }
  }, [fabricCanvasRef, updateZoomLevel]);
  
  // Register zoom handlers when component mounts
  useEffect(() => {
    register();
    return cleanup;
  }, [register, cleanup]);
  
  return {
    zoom: currentZoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    currentZoom,
    register,
    unregister,
    cleanup
  };
};
