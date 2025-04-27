
import { useEffect, useState } from 'react';
import { fabric } from 'fabric';

export interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
  lastUpdateTime: number;
}

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  autoToggle?: boolean;
  visibilityThreshold?: number;
  refreshInterval?: number;
}

export const useVirtualizedCanvas = (
  canvasRef: React.MutableRefObject<fabric.Canvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) => {
  const {
    enabled = true,
    autoToggle = true,
    visibilityThreshold = 100,
    refreshInterval = 1000
  } = options;
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    renderTime: 0,
    lastUpdateTime: Date.now()
  });
  
  useEffect(() => {
    if (!canvasRef.current || !enabled) return;
    
    const canvas = canvasRef.current;
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateMetrics = () => {
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= refreshInterval) {
        const objects = canvas.getObjects();
        const objectCount = objects.length;
        const visibleObjectCount = objects.filter(obj => (obj as any).visible !== false).length;
        const fps = Math.round((frameCount * 1000) / elapsed);
        
        setPerformanceMetrics({
          fps,
          objectCount,
          visibleObjectCount,
          renderTime: elapsed / frameCount,
          lastUpdateTime: Date.now()
        });
        
        // Auto toggle virtualization based on object count
        if (autoToggle) {
          setVirtualizationEnabled(objectCount > visibilityThreshold);
        }
        
        // Reset counters
        frameCount = 0;
        lastTime = now;
      }
    };
    
    const handleRender = () => {
      frameCount++;
      updateMetrics();
    };
    
    canvas.on('after:render', handleRender);
    
    return () => {
      canvas.off('after:render', handleRender);
    };
  }, [canvasRef, enabled, autoToggle, visibilityThreshold, refreshInterval]);
  
  const toggleVirtualization = () => {
    setVirtualizationEnabled(prev => !prev);
  };
  
  const refreshVirtualization = () => {
    if (!canvasRef.current) return;
    canvasRef.current.requestRenderAll();
  };
  
  return {
    performanceMetrics,
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization
  };
};
