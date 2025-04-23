
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
}

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  objectThreshold?: number;
  autoToggle?: boolean;
}

export const useVirtualizedCanvas = (
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) => {
  const { 
    enabled = true, 
    objectThreshold = 100, 
    autoToggle = true 
  } = options;
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  
  const fpsCounterRef = useRef({ 
    lastTime: 0, 
    frames: 0,
    fps: 0 
  });
  
  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => !prev);
  }, []);
  
  const refreshVirtualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Simple implementation - just re-render the canvas
    canvas.requestRenderAll();
    
    // Update metrics
    updatePerformanceMetrics();
  }, [canvasRef]);
  
  // Calculate and update performance metrics
  const updatePerformanceMetrics = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Count objects
    const allObjects = canvas.getObjects();
    const objectCount = allObjects.length;
    
    // Count visible objects (simple approximation)
    const visibleObjectCount = allObjects.filter(obj => 
      obj.visible !== false
    ).length;
    
    // Calculate FPS
    const now = performance.now();
    fpsCounterRef.current.frames++;
    
    if (now > fpsCounterRef.current.lastTime + 1000) {
      fpsCounterRef.current.fps = fpsCounterRef.current.frames;
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = now;
    }
    
    // Update metrics state
    setPerformanceMetrics({
      fps: fpsCounterRef.current.fps,
      objectCount,
      visibleObjectCount,
      renderTime: 0 // Placeholder for now
    });
  }, [canvasRef]);
  
  // Set up performance monitoring
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initialize FPS counter
    fpsCounterRef.current = { 
      lastTime: performance.now(), 
      frames: 0,
      fps: 0 
    };
    
    // Set up monitoring loop
    const monitoringInterval = setInterval(() => {
      updatePerformanceMetrics();
      
      // Auto-toggle virtualization based on object count
      if (autoToggle && performanceMetrics) {
        const shouldEnableVirtualization = 
          performanceMetrics.objectCount > objectThreshold;
        
        if (shouldEnableVirtualization !== virtualizationEnabled) {
          setVirtualizationEnabled(shouldEnableVirtualization);
        }
      }
    }, 2000);
    
    return () => {
      clearInterval(monitoringInterval);
    };
  }, [
    canvasRef, 
    updatePerformanceMetrics, 
    autoToggle, 
    performanceMetrics, 
    virtualizationEnabled, 
    objectThreshold
  ]);
  
  return {
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics
  };
};
