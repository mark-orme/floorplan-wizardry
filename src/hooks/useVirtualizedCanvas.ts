
import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { measurePerformance } from '@/utils/performance/canvasPerformance';
import { PerformanceMetrics } from '@/types/canvas';

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  measureInterval?: number;
}

export const useVirtualizedCanvas = (
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) => {
  const { 
    enabled = true,
    measureInterval = 1000 
  } = options;
  
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0
  });
  
  const performanceIntervalRef = useRef<number | null>(null);
  
  // Initialize performance monitoring
  useEffect(() => {
    if (!enabled || !canvasRef.current) return;
    
    const updatePerformanceMetrics = () => {
      if (!canvasRef.current) return;
      
      const metrics = measurePerformance(canvasRef.current);
      setPerformanceMetrics(metrics);
    };
    
    // Initial measurement
    updatePerformanceMetrics();
    
    // Set up interval
    performanceIntervalRef.current = window.setInterval(
      updatePerformanceMetrics, 
      measureInterval
    );
    
    return () => {
      if (performanceIntervalRef.current) {
        window.clearInterval(performanceIntervalRef.current);
        performanceIntervalRef.current = null;
      }
    };
  }, [canvasRef, enabled, measureInterval]);
  
  // Force refresh virtualization
  const refreshVirtualization = useCallback(() => {
    if (!canvasRef.current) return;
    
    // Update object visibility based on viewport
    const canvas = canvasRef.current;
    const objects = canvas.getObjects();
    
    // Get canvas viewport bounds
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    const vpWidth = canvas.width || 0;
    const vpHeight = canvas.height || 0;
    
    // Calculate viewport bounds
    const vpBounds = {
      left: -vpt[4] / vpt[0],
      top: -vpt[5] / vpt[3],
      right: (-vpt[4] + vpWidth) / vpt[0],
      bottom: (-vpt[5] + vpHeight) / vpt[3]
    };
    
    // Update objects based on visibility
    let visibleCount = 0;
    
    objects.forEach(obj => {
      // Skip grid objects
      if ((obj as any).isGrid) return;
      
      const bounds = obj.getBoundingRect();
      
      // Check if object is in viewport
      const isVisible = (
        bounds.left < vpBounds.right &&
        bounds.left + bounds.width > vpBounds.left &&
        bounds.top < vpBounds.bottom &&
        bounds.top + bounds.height > vpBounds.top
      );
      
      // Update visibility
      if (isVisible) {
        visibleCount++;
        if (!obj.visible) {
          obj.visible = true;
          obj.dirty = true;
        }
      } else if (obj.visible && !(obj as any).alwaysVisible) {
        obj.visible = false;
        obj.dirty = true;
      }
    });
    
    // Update performance metrics
    const metrics = measurePerformance(canvas);
    setPerformanceMetrics({
      ...metrics,
      visibleObjectCount: visibleCount
    });
    
    // Request render
    canvas.requestRenderAll();
    
    return visibleCount;
  }, [canvasRef]);
  
  return {
    performanceMetrics,
    refreshVirtualization
  };
};
