
import { useEffect, useState, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
}

interface VirtualizedCanvasOptions {
  enabled?: boolean;
  objectThreshold?: number;
  autoToggle?: boolean;
}

export const useVirtualizedCanvas = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: VirtualizedCanvasOptions = {}
) => {
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(options.enabled ?? true);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    renderTime: 0
  });

  const framesRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());
  const fpsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const objectThreshold = options.objectThreshold ?? 100;

  // Update FPS counter
  useEffect(() => {
    const updateFps = () => {
      const now = Date.now();
      const elapsed = now - lastFrameTimeRef.current;
      if (elapsed >= 1000) {
        const currentFps = Math.round((framesRef.current * 1000) / elapsed);
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: currentFps
        }));
        framesRef.current = 0;
        lastFrameTimeRef.current = now;
      }
    };

    fpsTimerRef.current = setInterval(updateFps, 500);
    return () => {
      if (fpsTimerRef.current) {
        clearInterval(fpsTimerRef.current);
      }
    };
  }, []);

  // Apply virtualization when object count exceeds threshold
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const countObjects = () => {
      const objects = canvas.getObjects();
      const count = objects.length;
      
      // Auto-toggle virtualization if enabled and object count exceeds threshold
      if (options.autoToggle && count > objectThreshold && !virtualizationEnabled) {
        setVirtualizationEnabled(true);
      }
      
      setPerformanceMetrics(prev => ({
        ...prev,
        objectCount: count
      }));
    };
    
    // Count initial objects
    countObjects();
    
    // Listen for object changes
    canvas.on('object:added object:removed', countObjects);
    
    return () => {
      canvas.off('object:added object:removed', countObjects);
    };
  }, [fabricCanvasRef, objectThreshold, options.autoToggle, virtualizationEnabled]);

  // Set up virtualization
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.skipOffscreen = virtualizationEnabled;
    
    // Record frame rendered
    const recordFrame = () => {
      framesRef.current += 1;
      
      // Count visible objects if virtualization is enabled
      if (virtualizationEnabled) {
        const allObjects = canvas.getObjects();
        let visibleCount = 0;
        
        for (const obj of allObjects) {
          if (obj.visible && !obj.isOffscreen) {
            visibleCount++;
          }
        }
        
        setPerformanceMetrics(prev => ({
          ...prev,
          visibleObjectCount: visibleCount
        }));
      }
    };

    canvas.on('after:render', recordFrame);
    
    return () => {
      canvas.skipOffscreen = false;
      canvas.off('after:render', recordFrame);
    };
  }, [fabricCanvasRef, virtualizationEnabled]);

  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => !prev);
  }, []);

  const refreshVirtualization = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Force recalculation of offscreen status
    canvas.calcViewportBoundaries();
    canvas.requestRenderAll();
  }, [fabricCanvasRef]);

  return {
    performanceMetrics,
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization
  };
};
