
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Hook for monitoring canvas performance
 */
export function usePerformanceMonitoring() {
  const [fps, setFps] = useState(0);
  const [objectCount, setObjectCount] = useState(0);
  const [visibleObjectCount, setVisibleObjectCount] = useState(0);
  const [renderTime, setRenderTime] = useState(0);
  
  const frameTimeRef = useRef<number>(0);
  const fpsCounterRef = useRef<number>(0);
  const monitoringIntervalRef = useRef<number | null>(null);
  
  // Start performance monitoring for a canvas
  const startMonitoring = useCallback((canvas: FabricCanvas | null) => {
    if (!canvas) return;
    
    // Clear any existing interval
    if (monitoringIntervalRef.current !== null) {
      clearInterval(monitoringIntervalRef.current);
    }
    
    // Track object count
    setObjectCount(canvas.getObjects().length);
    
    // Calculate visible objects (within viewport)
    const visibleObjects = canvas.getObjects().filter(obj => {
      // Simple check if object is within current viewport
      // Use type assertion since isOnScreen might not be available
      const hasIsOnScreen = (obj as any).isOnScreen;
      return hasIsOnScreen ? hasIsOnScreen() : true; // Fallback to true if method not available
    });
    setVisibleObjectCount(visibleObjects.length);
    
    // Set up FPS counter
    let lastFrameTime = performance.now();
    let frameCount = 0;
    
    // Original render method
    const originalRender = canvas.renderAll.bind(canvas);
    
    // Override render method to track performance
    canvas.renderAll = function() {
      const startTime = performance.now();
      
      // Call original render
      const result = originalRender();
      
      // Track render time
      const endTime = performance.now();
      frameTimeRef.current = endTime - startTime;
      
      // Update FPS calculation
      frameCount++;
      if (endTime - lastFrameTime >= 1000) {
        fpsCounterRef.current = frameCount;
        frameCount = 0;
        lastFrameTime = endTime;
      }
      
      return result;
    };
    
    // Update stats every second
    monitoringIntervalRef.current = window.setInterval(() => {
      setFps(fpsCounterRef.current);
      setRenderTime(frameTimeRef.current);
      setObjectCount(canvas.getObjects().length);
      
      const visibleObjects = canvas.getObjects().filter(obj => {
        const hasIsOnScreen = (obj as any).isOnScreen;
        return hasIsOnScreen ? hasIsOnScreen() : true;
      });
      setVisibleObjectCount(visibleObjects.length);
    }, 1000);
    
    return () => {
      if (monitoringIntervalRef.current !== null) {
        clearInterval(monitoringIntervalRef.current);
      }
      
      // Restore original render method if it was overridden
      if (canvas.renderAll !== originalRender) {
        canvas.renderAll = originalRender;
      }
    };
  }, []);
  
  // Stop performance monitoring
  const stopMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current !== null) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
  }, []);
  
  return {
    metrics: { fps, objectCount, visibleObjectCount, renderTime },
    startMonitoring,
    stopMonitoring
  };
}
