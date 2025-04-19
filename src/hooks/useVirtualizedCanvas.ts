
/**
 * Hook for virtualized canvas rendering optimization
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
}

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  viewportPadding?: number;
  maxFps?: number;
}

/**
 * Hook for optimizing canvas performance through virtualization
 * Only renders objects visible in the viewport
 */
export const useVirtualizedCanvas = (
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) => {
  const {
    enabled = true,
    viewportPadding = 100,
    maxFps = 60
  } = options;
  
  // State for performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    renderTime: 0
  });
  
  // Reference for tracking virtualization state
  const virtualizationRef = useRef({
    enabled,
    lastRefreshTime: 0,
    objectCount: 0,
    visibleCount: 0,
    throttleTimeout: null as NodeJS.Timeout | null,
    needsVirtualization: false
  });
  
  // Update options when they change
  useEffect(() => {
    virtualizationRef.current.enabled = enabled;
  }, [enabled]);
  
  // Calculate which objects are in the viewport
  const refreshVirtualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !virtualizationRef.current.enabled) {
      return {
        objectCount: 0,
        visibleCount: 0
      };
    }
    
    try {
      const startTime = performance.now();
      
      // Rate limiting - don't refresh more often than maxFps
      const now = Date.now();
      const timeSinceLastRefresh = now - virtualizationRef.current.lastRefreshTime;
      const minRefreshInterval = 1000 / maxFps;
      
      if (timeSinceLastRefresh < minRefreshInterval) {
        if (virtualizationRef.current.throttleTimeout) {
          clearTimeout(virtualizationRef.current.throttleTimeout);
        }
        
        virtualizationRef.current.throttleTimeout = setTimeout(() => {
          refreshVirtualization();
        }, minRefreshInterval - timeSinceLastRefresh);
        
        return {
          objectCount: virtualizationRef.current.objectCount,
          visibleCount: virtualizationRef.current.visibleCount
        };
      }
      
      virtualizationRef.current.lastRefreshTime = now;
      
      // Get all objects and viewport boundaries
      const allObjects = canvas.getObjects();
      const vpt = canvas.viewportTransform;
      
      if (!vpt) {
        return {
          objectCount: allObjects.length,
          visibleCount: allObjects.length
        };
      }
      
      const zoom = canvas.getZoom();
      const width = canvas.width || 0;
      const height = canvas.height || 0;
      
      // Calculate viewport boundaries with padding
      const viewportBounds = {
        left: -vpt[4] / zoom - viewportPadding,
        top: -vpt[5] / zoom - viewportPadding,
        right: (-vpt[4] + width) / zoom + viewportPadding,
        bottom: (-vpt[5] + height) / zoom + viewportPadding
      };
      
      // Count visible objects and update visibility
      let visibleCount = 0;
      
      allObjects.forEach(obj => {
        if (!obj.getBoundingRect) return;
        
        const rect = obj.getBoundingRect();
        const isVisible = (
          rect.left < viewportBounds.right &&
          rect.left + rect.width > viewportBounds.left &&
          rect.top < viewportBounds.bottom &&
          rect.top + rect.height > viewportBounds.top
        );
        
        // Set object visibility based on viewport
        if (obj.visible !== isVisible) {
          obj.visible = isVisible;
          obj.setCoords();
        }
        
        if (isVisible) {
          visibleCount++;
        }
      });
      
      const renderTime = performance.now() - startTime;
      
      // Update reference values
      virtualizationRef.current.objectCount = allObjects.length;
      virtualizationRef.current.visibleCount = visibleCount;
      
      // Update performance metrics
      setPerformanceMetrics({
        fps: Math.round(1000 / Math.max(1, timeSinceLastRefresh)),
        objectCount: allObjects.length,
        visibleObjectCount: visibleCount,
        renderTime
      });
      
      return {
        objectCount: allObjects.length,
        visibleCount
      };
    } catch (error) {
      console.error('Error in virtualization:', error);
      return {
        objectCount: 0,
        visibleCount: 0
      };
    }
  }, [canvasRef, maxFps, viewportPadding]);
  
  // Set up event listeners for canvas changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !virtualizationRef.current.enabled) return;
    
    // Define event handler safely
    const handleCanvasChange = () => {
      refreshVirtualization();
    };
    
    // Add event listeners for canvas changes
    canvas.on('object:added', handleCanvasChange);
    canvas.on('object:removed', handleCanvasChange);
    canvas.on('object:modified', handleCanvasChange);
    canvas.on('zoom:changed', handleCanvasChange);
    
    // Support viewport translation - use string literal that works with fabric.js
    canvas.on('viewport:translate' as any, handleCanvasChange);
    
    // Initial refresh
    refreshVirtualization();
    
    // Clean up event listeners
    return () => {
      if (!canvas) return;
      
      canvas.off('object:added', handleCanvasChange);
      canvas.off('object:removed', handleCanvasChange);
      canvas.off('object:modified', handleCanvasChange);
      canvas.off('zoom:changed', handleCanvasChange);
      canvas.off('viewport:translate' as any, handleCanvasChange);
    };
  }, [canvasRef, refreshVirtualization]);
  
  return {
    performanceMetrics,
    refreshVirtualization,
    needsVirtualization: virtualizationRef.current.needsVirtualization
  };
};
