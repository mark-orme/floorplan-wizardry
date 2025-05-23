
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { throttle, debounce } from 'lodash';

interface UseVirtualizationEngineProps {
  canvas: FabricCanvas | null;
  threshold?: number;
  checkIntervalMs?: number;
}

interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  now?: number;
}

export const useVirtualizationEngine = ({
  canvas,
  threshold = 100,
  checkIntervalMs = 1000
}: UseVirtualizationEngineProps) => {
  // State handled with React.useState in the original implementation
  // We'll use local variables for this simplified version
  const metrics = {
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    now: Date.now()
  };
  
  // Virtualize objects that are outside the viewport
  const virtualizeObjects = useCallback(() => {
    if (!canvas) return;
    
    // Get canvas viewport bounds - add null checks
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    const zoom = canvas.getZoom() || 1;
    const width = canvas.width || 0;
    const height = canvas.height || 0;
    
    // Calculate viewport bounds with null safety
    const viewportLeft = -vpt[4] / zoom;
    const viewportTop = -vpt[5] / zoom;
    const viewportRight = viewportLeft + (width / zoom);
    const viewportBottom = viewportTop + (height / zoom);
    
    // Expanded bounds with threshold
    const expandedLeft = viewportLeft - threshold;
    const expandedTop = viewportTop - threshold;
    const expandedRight = viewportRight + threshold;
    const expandedBottom = viewportBottom + threshold;
    
    // Loop through objects and check visibility
    const objects = canvas.getObjects() || [];
    let visibleCount = 0;
    
    objects.forEach(obj => {
      if (!obj) return;
      
      // Skip grid lines
      if ((obj as any).objectType === 'grid') return;
      
      // Get object bounds
      const objBounds = obj.getBoundingRect();
      if (!objBounds) return;
      
      // Check if object is in expanded viewport
      const isVisible = (
        objBounds.left <= expandedRight &&
        objBounds.left + objBounds.width >= expandedLeft &&
        objBounds.top <= expandedBottom &&
        objBounds.top + objBounds.height >= expandedTop
      );
      
      // Set visibility
      obj.visible = isVisible;
      if (isVisible) visibleCount++;
    });
    
    // Update metrics
    metrics.objectCount = objects.length;
    metrics.visibleObjectCount = visibleCount;
    metrics.now = Date.now();
    
    // Render if visibility changed
    canvas.requestRenderAll();
    
    return { objectCount: objects.length, visibleCount };
  }, [canvas, threshold]);
  
  // Optimize canvas operations
  const optimizeCanvas = useCallback(() => {
    if (!canvas) return;
    
    // Skip rendering for objects outside viewport
    canvas.skipTargetFind = false;
    canvas.selection = true;
    
    // Virtualize objects
    virtualizeObjects();
  }, [canvas, virtualizeObjects]);
  
  // Debounced and throttled versions for performance
  const debouncedOptimize = debounce(optimizeCanvas, 300);
  const throttledOptimize = throttle(optimizeCanvas, 150);
  
  // Set up event listeners
  useEffect(() => {
    if (!canvas) return;
    
    const handleZoom = () => {
      throttledOptimize();
    };
    
    const handlePan = () => {
      throttledOptimize();
    };
    
    const handleResize = () => {
      debouncedOptimize();
    };
    
    // Attach event listeners
    canvas.on('mouse:wheel', handleZoom);
    canvas.on('object:moving', handlePan);
    window.addEventListener('resize', handleResize);
    
    // Run initial optimization
    optimizeCanvas();
    
    // Set up interval for regular check
    const interval = setInterval(optimizeCanvas, checkIntervalMs);
    
    // Clean up
    return () => {
      clearInterval(interval);
      canvas.off('mouse:wheel', handleZoom);
      canvas.off('object:moving', handlePan);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas, optimizeCanvas, throttledOptimize, debouncedOptimize, checkIntervalMs]);
  
  return {
    virtualizeObjects,
    optimizeCanvas
  };
};
