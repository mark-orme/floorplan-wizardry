
/**
 * Hook for handling canvas resize logic
 * @module canvas-resizing/useResizeLogic
 */
import { useState, useCallback } from 'react';
import { Canvas } from 'fabric';
import { ResizingState, DEFAULT_RESIZING_STATE } from './state';

/**
 * Hook for managing canvas resize logic
 * @returns {Object} Resize state and handlers
 */
export const useResizeLogic = () => {
  // Initialize resizing state
  const [resizingState, setResizingState] = useState<ResizingState>(DEFAULT_RESIZING_STATE);
  
  /**
   * Handle resize start
   */
  const handleResizeStart = useCallback(() => {
    setResizingState(current => ({
      ...current,
      isResizing: true,
      resizeInProgress: true
    }));
  }, []);
  
  /**
   * Handle resize end
   */
  const handleResizeEnd = useCallback(() => {
    setResizingState(current => ({
      ...current,
      isResizing: false,
      resizeInProgress: false,
      initialResizeComplete: true,
      lastResizeTime: Date.now()
    }));
  }, []);
  
  /**
   * Update canvas dimensions
   * @param {Canvas} canvas - Fabric canvas instance
   * @param {number} width - New width
   * @param {number} height - New height
   * @param {number} [scale] - New scale
   */
  const updateCanvasDimensions = useCallback((
    canvas: Canvas,
    width: number,
    height: number,
    scale: number = 1
  ) => {
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.setWidth(width);
    canvas.setHeight(height);
    
    // Set zoom based on scale
    canvas.setZoom(scale);
    
    // Render canvas
    canvas.requestRenderAll();
    
    // Update state
    setResizingState(current => ({
      ...current,
      width,
      height,
      scale,
      aspectRatio: width / height,
      lastResizeTime: Date.now()
    }));
  }, []);
  
  return {
    resizingState,
    setResizingState,
    handleResizeStart,
    handleResizeEnd,
    updateCanvasDimensions
  };
};
