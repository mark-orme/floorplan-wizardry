
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useOptimizedCanvas } from './canvas/useOptimizedCanvas';

/**
 * Hook for virtualizing canvas rendering to improve performance
 * Only renders objects that are visible in the current viewport
 */
export const useVirtualizedCanvas = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  options = { 
    enabled: true, 
    paddingPx: 200,
    objectLimit: 500
  }
) => {
  const canvasWidth = useRef(800);
  const canvasHeight = useRef(600);
  
  // Get viewport dimensions from canvas element
  const updateDimensions = useCallback(() => {
    if (fabricCanvasRef.current?.lowerCanvasEl) {
      canvasWidth.current = fabricCanvasRef.current.lowerCanvasEl.width || 800;
      canvasHeight.current = fabricCanvasRef.current.lowerCanvasEl.height || 600;
    }
  }, [fabricCanvasRef]);
  
  // Use our optimized canvas hook with virtualization support
  const { 
    performanceMetrics,
    needsVirtualization,
    updateVirtualization,
    optimizeCanvasSettings,
    attachVirtualizationEvents
  } = useOptimizedCanvas({
    fabricCanvasRef,
    viewportWidth: canvasWidth.current,
    viewportHeight: canvasHeight.current,
    objectLimit: options.objectLimit
  });
  
  // Apply canvas settings when canvas is ready or dependencies change
  useEffect(() => {
    if (!fabricCanvasRef.current || !options.enabled) return;
    
    // Update dimensions first
    updateDimensions();
    
    // Apply optimized settings
    optimizeCanvasSettings();
    
    // Set up virtualization events - this returns a cleanup function
    const cleanup = attachVirtualizationEvents();
    
    // Initial update of virtualization
    updateVirtualization();
    
    // Monitor for changes in canvas dimensions
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      updateVirtualization();
    });
    
    if (fabricCanvasRef.current.lowerCanvasEl) {
      resizeObserver.observe(fabricCanvasRef.current.lowerCanvasEl);
    }
    
    // Clean up
    return () => {
      cleanup();
      resizeObserver.disconnect();
    };
  }, [
    fabricCanvasRef, 
    options.enabled, 
    updateDimensions, 
    optimizeCanvasSettings, 
    attachVirtualizationEvents, 
    updateVirtualization
  ]);
  
  // Refresh virtualization - useful after major changes like adding/removing many objects
  const refreshVirtualization = useCallback(() => {
    if (fabricCanvasRef.current && options.enabled) {
      updateVirtualization();
    }
  }, [fabricCanvasRef, options.enabled, updateVirtualization]);
  
  return {
    performanceMetrics,
    needsVirtualization,
    refreshVirtualization
  };
};
