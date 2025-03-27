
/**
 * Hook for tracking zoom events in canvas
 * @module canvas-events/useZoomTracking
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { UseZoomTrackingProps, UseZoomTrackingResult, ZOOM_LEVEL_CONSTANTS } from './types';
import { createPoint } from '@/types/geometryTypes';

/**
 * Default initial zoom level
 */
const DEFAULT_ZOOM = ZOOM_LEVEL_CONSTANTS.DEFAULT_ZOOM;

/**
 * Hook for tracking zoom level changes in the canvas
 * 
 * @param {UseZoomTrackingProps} props - Properties for the hook
 * @returns {UseZoomTrackingResult} - Zoom tracking result with current zoom level
 */
export const useZoomTracking = ({
  fabricCanvasRef,
  updateZoomLevel,
  tool
}: UseZoomTrackingProps): UseZoomTrackingResult => {
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  
  /**
   * Update zoom level in the component state
   */
  const handleZoomChange = useCallback((zoom: number) => {
    setCurrentZoom(zoom);
    if (updateZoomLevel) {
      updateZoomLevel(zoom);
    }
  }, [updateZoomLevel]);
  
  /**
   * Handle wheel events for zooming
   */
  const handleMouseWheel = useCallback((e: WheelEvent) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Only zoom when tool is set to hand or select
    if (tool !== 'hand' && tool !== 'select') return;
    
    // Prevent default browser behavior
    e.preventDefault();
    
    try {
      // Calculate new zoom level based on wheel direction
      const delta = e.deltaY;
      const zoom = canvas.getZoom();
      const newZoom = delta > 0 ? 
        Math.max(ZOOM_LEVEL_CONSTANTS.MIN_ZOOM, zoom * 0.95) : 
        Math.min(ZOOM_LEVEL_CONSTANTS.MAX_ZOOM, zoom * 1.05);
      
      // Get point under cursor as zoom center
      const point = {
        x: e.offsetX,
        y: e.offsetY
      };
      
      // Zoom to point
      canvas.zoomToPoint(point, newZoom);
      
      // Fire custom zoom event
      canvas.fire('custom:zoom-changed', { zoom: newZoom });
      
      // Update state
      handleZoomChange(newZoom);
    } catch (error) {
      console.error('Error in wheel zoom handler:', error);
    }
  }, [fabricCanvasRef, handleZoomChange, tool]);
  
  /**
   * Register zoom tracking
   */
  const registerZoomTracking = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Set initial zoom level
    const zoom = canvas.getZoom();
    handleZoomChange(zoom);
    
    // Attach wheel event to canvas element
    const canvasElement = canvas.getElement();
    if (canvasElement) {
      canvasElement.addEventListener('wheel', handleMouseWheel);
    }
    
    // Listen for custom zoom events
    canvas.on('custom:zoom-changed', (e: any) => {
      if (e.zoom !== undefined) {
        handleZoomChange(e.zoom);
      }
    });
  }, [fabricCanvasRef, handleMouseWheel, handleZoomChange]);
  
  /**
   * Effect to register zoom tracking on mount
   */
  useEffect(() => {
    registerZoomTracking();
    
    return () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Remove wheel event from canvas element
      const canvasElement = canvas.getElement();
      if (canvasElement) {
        canvasElement.removeEventListener('wheel', handleMouseWheel);
      }
      
      // Remove custom zoom event listener
      canvas.off('custom:zoom-changed');
    };
  }, [fabricCanvasRef, registerZoomTracking, handleMouseWheel]);
  
  /**
   * Register handlers (for useEventHandlers hook)
   */
  const register = useCallback(() => {
    registerZoomTracking();
  }, [registerZoomTracking]);
  
  /**
   * Unregister handlers (for useEventHandlers hook)
   */
  const unregister = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove wheel event from canvas element
    const canvasElement = canvas.getElement();
    if (canvasElement) {
      canvasElement.removeEventListener('wheel', handleMouseWheel);
    }
    
    // Remove custom zoom event listener
    canvas.off('custom:zoom-changed');
  }, [fabricCanvasRef, handleMouseWheel]);
  
  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);
  
  return {
    currentZoom,
    register,
    unregister,
    cleanup,
    registerZoomTracking
  };
};
