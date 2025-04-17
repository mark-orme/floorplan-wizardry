
/**
 * Hook for tracking canvas performance metrics
 */
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseCanvasMetricsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

export interface CanvasPerformanceMetrics {
  fps: number;
  renderTime: number;
  objectCount: number;
  visibleObjectCount: number;
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  } | null;
}

export const useCanvasMetrics = ({
  fabricCanvasRef
}: UseCanvasMetricsProps) => {
  // Performance metrics state
  const [metrics, setMetrics] = useState<CanvasPerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    memory: null
  });
  
  // Start performance monitoring
  const startMonitoring = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return () => {};
    
    let frameCount = 0;
    let lastFpsUpdateTime = performance.now();
    let lastRenderTime = 0;
    
    // After render event handler
    const handleAfterRender = () => {
      frameCount++;
      
      const now = performance.now();
      const elapsed = now - lastRenderTime;
      lastRenderTime = now;
      
      // Update FPS every second
      if (now - lastFpsUpdateTime > 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastFpsUpdateTime));
        
        // Get memory info if available
        let memory = null;
        if (performance && (performance as any).memory) {
          memory = {
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize
          };
        }
        
        setMetrics(prev => ({
          ...prev,
          fps,
          renderTime: elapsed,
          objectCount: canvas.getObjects().length,
          memory
        }));
        
        frameCount = 0;
        lastFpsUpdateTime = now;
      }
    };
    
    // Register event handler
    canvas.on('after:render', handleAfterRender);
    
    // Clean up
    return () => {
      if (canvas) {
        canvas.off('after:render', handleAfterRender);
      }
    };
  }, [fabricCanvasRef]);
  
  // Start monitoring on mount
  useEffect(() => {
    const stopMonitoring = startMonitoring();
    return stopMonitoring;
  }, [startMonitoring]);
  
  // Update object count
  const updateObjectCount = useCallback((visibleCount?: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setMetrics(prev => ({
      ...prev,
      objectCount: canvas.getObjects().length,
      visibleObjectCount: visibleCount !== undefined ? 
        visibleCount : prev.visibleObjectCount
    }));
  }, [fabricCanvasRef]);
  
  return {
    metrics,
    updateObjectCount
  };
};
