
/**
 * Hook for virtualizing canvas rendering
 * Provides performance optimization for complex canvas operations
 * @module hooks/useVirtualizedCanvas
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { perfLogger } from '@/utils/logger';

interface UseVirtualizedCanvasProps {
  enabled?: boolean;
  visibleMargin?: number;
  updateInterval?: number;
}

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  objectCount: number;
  visibleObjectCount: number;
  lastUpdate: number;
}

const INITIAL_METRICS: PerformanceMetrics = {
  fps: 60,
  renderTime: 0,
  objectCount: 0,
  visibleObjectCount: 0,
  lastUpdate: 0
};

/**
 * Hook for optimizing canvas performance through virtualization
 * Only renders objects that are visible within the viewport
 */
export function useVirtualizedCanvas(
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  {
    enabled = true,
    visibleMargin = 100,
    updateInterval = 100
  }: UseVirtualizedCanvasProps = {}
) {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(INITIAL_METRICS);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const updateTimeoutRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  // Function to refresh virtualization calculations
  const refreshVirtualization = useCallback(() => {
    if (!enabled || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const viewportRect = {
      left: -visibleMargin,
      top: -visibleMargin,
      right: (canvas.width || 0) / canvas.getZoom() + visibleMargin,
      bottom: (canvas.height || 0) / canvas.getZoom() + visibleMargin
    };
    
    let visibleCount = 0;
    
    // Update object visibility based on whether they're in viewport
    objects.forEach(obj => {
      if (!obj) return;
      
      // Skip grid objects (they should always be visible)
      if (obj.data?.isGrid) return;
      
      // Get object bounds
      const objBounds = obj.getBoundingRect();
      
      // Check if object is in viewport
      const isVisible = !(
        objBounds.left > viewportRect.right ||
        objBounds.top > viewportRect.bottom ||
        objBounds.left + objBounds.width < viewportRect.left ||
        objBounds.top + objBounds.height < viewportRect.top
      );
      
      // Set object to visible or not (skipping render)
      if (isVisible) {
        if (!obj.visible) {
          obj.visible = true;
          obj.setCoords();
        }
        visibleCount++;
      } else if (obj.visible) {
        obj.visible = false;
      }
    });
    
    // Update performance metrics
    const now = performance.now();
    const elapsed = now - performanceMetrics.lastUpdate;
    
    if (elapsed > 500) {
      const fps = frameCountRef.current / (elapsed / 1000);
      
      setPerformanceMetrics({
        fps: Math.round(fps),
        renderTime: (now - lastFrameTimeRef.current) || 0,
        objectCount: objects.length,
        visibleObjectCount: visibleCount,
        lastUpdate: now
      });
      
      frameCountRef.current = 0;
      
      // Log performance if significant changes
      if (Math.abs(fps - performanceMetrics.fps) > 10 || objects.length > 100) {
        perfLogger.info('Canvas performance update', {
          fps: Math.round(fps),
          objects: objects.length,
          visible: visibleCount,
          renderTime: (now - lastFrameTimeRef.current).toFixed(2) + 'ms'
        });
      }
    }
    
    // Request canvas re-render if needed
    canvas.requestRenderAll();
    
    return {
      objectCount: objects.length,
      visibleCount
    };
  }, [enabled, fabricCanvasRef, visibleMargin, performanceMetrics.lastUpdate]);
  
  // Set up virtualization
  useEffect(() => {
    if (!enabled || !fabricCanvasRef.current || isInitializedRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Set up rendering optimization
    canvas.renderOnAddRemove = false;
    canvas.skipOffscreen = true;
    
    // Setup frame counting for FPS calculation
    const originalRenderAll = canvas.renderAll.bind(canvas);
    
    canvas.renderAll = function() {
      const startTime = performance.now();
      frameCountRef.current++;
      const result = originalRenderAll();
      lastFrameTimeRef.current = performance.now() - startTime;
      return result;
    };
    
    // Initial refresh
    refreshVirtualization();
    isInitializedRef.current = true;
    
    // Set up interval for periodic refresh
    const refreshInterval = setInterval(() => {
      refreshVirtualization();
    }, updateInterval);
    
    // Set up event listeners for canvas changes that require virtualization refresh
    const handleViewportChange = () => {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = window.setTimeout(() => {
        refreshVirtualization();
        updateTimeoutRef.current = null;
      }, 50);
    };
    
    canvas.on('zoom:changed', handleViewportChange);
    
    // Use custom event instead of 'pan:moved' which might not be in the type definitions
    canvas.on('viewport:translate', handleViewportChange);
    
    return () => {
      clearInterval(refreshInterval);
      
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }
      
      // Remove event listeners
      canvas.off('zoom:changed', handleViewportChange);
      canvas.off('viewport:translate', handleViewportChange);
      
      // Restore original renderAll
      if (canvas.renderAll !== originalRenderAll) {
        canvas.renderAll = originalRenderAll;
      }
    };
  }, [enabled, fabricCanvasRef, refreshVirtualization, updateInterval]);
  
  return {
    performanceMetrics,
    refreshVirtualization
  };
}
