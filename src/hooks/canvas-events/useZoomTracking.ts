
/**
 * Hook for tracking canvas zoom changes
 * @module canvas-events/useZoomTracking
 */
import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { UseZoomTrackingProps, UseZoomTrackingResult } from './types';

/**
 * Hook for tracking zoom changes on the canvas
 * 
 * @param {UseZoomTrackingProps} props - Properties for the hook
 * @returns {UseZoomTrackingResult} - Zoom tracking utilities
 */
export const useZoomTracking = ({
  fabricCanvasRef,
  tool,
  updateZoomLevel
}: UseZoomTrackingProps): UseZoomTrackingResult => {
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  
  /**
   * Handle zoom change event
   */
  const handleZoomChange = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const zoom = canvas.getZoom();
    setCurrentZoom(zoom);
    
    if (updateZoomLevel) {
      updateZoomLevel(zoom);
    }
  }, [fabricCanvasRef, updateZoomLevel]);
  
  /**
   * Register zoom tracking events
   */
  const register = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Listen for zoom changes
    (canvas as any).on('zoom:changed', handleZoomChange);
    
    // Initial update
    handleZoomChange();
  }, [fabricCanvasRef, handleZoomChange]);
  
  /**
   * Unregister zoom tracking events
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove zoom change listener
    (canvas as any).off('zoom:changed', handleZoomChange);
  }, [fabricCanvasRef, handleZoomChange]);
  
  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);
  
  // Register and cleanup on mount/unmount
  useEffect(() => {
    register();
    return cleanup;
  }, [register, cleanup]);
  
  // Alias for backward compatibility
  const registerZoomTracking = register;
  
  return {
    currentZoom,
    register,
    unregister,
    cleanup,
    registerZoomTracking
  };
};
