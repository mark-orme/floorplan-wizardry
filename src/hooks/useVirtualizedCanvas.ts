
import { useCallback, useState, useEffect } from 'react';
import { fabric } from 'fabric';

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  objectThreshold?: number;
  autoToggle?: boolean;
}

interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
}

export const useVirtualizedCanvas = (
  canvasRef: React.MutableRefObject<fabric.Canvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) => {
  const { 
    enabled = true,
    objectThreshold = 100,
    autoToggle = false
  } = options;
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  
  // Toggle virtualization on/off
  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => !prev);
  }, []);
  
  // Refresh virtualization settings
  const refreshVirtualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Update metrics
    const objectCount = canvas.getObjects().length;
    const visibleObjectCount = canvas.getObjects().filter(obj => (obj as any).visible !== false).length;
    
    setPerformanceMetrics(prev => ({
      fps: prev?.fps || 0,
      objectCount,
      visibleObjectCount,
      renderTime: prev?.renderTime || 0
    }));
    
    // Auto-toggle based on object count
    if (autoToggle && objectCount > objectThreshold && !virtualizationEnabled) {
      setVirtualizationEnabled(true);
    }
  }, [canvasRef, virtualizationEnabled, autoToggle, objectThreshold]);
  
  // Apply virtualization when enabled status changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Apply virtualization settings
    if ('skipOffscreen' in canvas) {
      (canvas as any).skipOffscreen = virtualizationEnabled;
    }
    
    canvas.requestRenderAll();
  }, [canvasRef, virtualizationEnabled]);
  
  // Update performance metrics periodically
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let frameID: number;
    
    const updateMetrics = () => {
      const now = performance.now();
      const elapsed = now - lastTime;
      
      // Update once per second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        const objectCount = canvas.getObjects().length;
        const visibleObjectCount = canvas.getObjects().filter(obj => (obj as any).visible !== false).length;
        
        setPerformanceMetrics({
          fps,
          objectCount,
          visibleObjectCount,
          renderTime: elapsed / frameCount
        });
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameCount++;
      frameID = requestAnimationFrame(updateMetrics);
    };
    
    frameID = requestAnimationFrame(updateMetrics);
    
    return () => cancelAnimationFrame(frameID);
  }, [canvasRef]);
  
  return {
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics
  };
};
