
/**
 * Hook for tracking zoom level in canvas
 * @module canvas-events/useZoomTracking
 */
import { useState, useCallback, useEffect } from 'react';
import { UseZoomTrackingProps, UseZoomTrackingResult, ZOOM_LEVEL_CONSTANTS } from './types';

/**
 * Hook for tracking zoom level in canvas
 * @param {UseZoomTrackingProps} props - Hook properties
 * @returns {UseZoomTrackingResult} - Zoom tracking functions and state
 */
export const useZoomTracking = ({
  fabricCanvasRef,
  initialZoom = ZOOM_LEVEL_CONSTANTS.DEFAULT,
  minZoom = ZOOM_LEVEL_CONSTANTS.MIN,
  maxZoom = ZOOM_LEVEL_CONSTANTS.MAX,
  updateZoomLevel
}: UseZoomTrackingProps): UseZoomTrackingResult => {
  const [zoom, setZoomState] = useState<number>(initialZoom);
  
  // Update zoom level in canvas
  const setZoom = useCallback((newZoom: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Clamp zoom level
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // Apply zoom to canvas
    canvas.setZoom(clampedZoom);
    setZoomState(clampedZoom);
    
    // Notify parent about zoom change
    if (updateZoomLevel) {
      updateZoomLevel();
    }
    
    // Return canvas for method chaining
    return canvas;
  }, [fabricCanvasRef, minZoom, maxZoom, updateZoomLevel]);
  
  // Zoom in by factor
  const zoomIn = useCallback((factor = ZOOM_LEVEL_CONSTANTS.STEP) => {
    setZoom(zoom + factor);
  }, [zoom, setZoom]);
  
  // Zoom out by factor
  const zoomOut = useCallback((factor = ZOOM_LEVEL_CONSTANTS.STEP) => {
    setZoom(zoom - factor);
  }, [zoom, setZoom]);
  
  // Reset zoom to initial level
  const resetZoom = useCallback(() => {
    setZoom(initialZoom);
  }, [initialZoom, setZoom]);
  
  // Initialize zoom level
  useEffect(() => {
    setZoom(initialZoom);
  }, [initialZoom, setZoom]);
  
  return {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    currentZoom: zoom
  };
};
