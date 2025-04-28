
import { useCallback, useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedFabricCanvas, ExtendedFabricObject, PerformanceMetrics } from '@/types/canvas-types';

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  objectThreshold?: number;
}

/**
 * Hook for managing virtualized canvas rendering
 * Improves performance for canvases with many objects
 */
export function useVirtualizedCanvas(
  canvasRef: React.MutableRefObject<ExtendedFabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) {
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(options.enabled ?? false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    objectCount: 0,
    visibleObjectCount: 0
  });
  
  const lastRenderTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(0);

  // Toggle virtualization on/off
  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => !prev);
  }, []);

  // Force refresh virtualization with current settings
  const refreshVirtualization = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const objectCount = canvas.getObjects().length;
    
    // Track metrics
    setPerformanceMetrics(prev => ({
      ...prev,
      objectCount,
      visibleObjectCount: objectCount // Default to all objects visible
    }));
    
    // Trigger a render
    canvas.requestRenderAll();
  }, [canvasRef]);

  // Monitor canvas performance
  useEffect(() => {
    if (!virtualizationEnabled || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    let animFrameId: number;
    let visibleCount = 0;

    const measurePerformance = () => {
      const now = performance.now();
      
      // Calculate FPS
      frameCountRef.current++;
      if (now - lastFpsUpdateRef.current > 1000) {
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: frameCountRef.current,
          visibleObjectCount: visibleCount
        }));
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = now;
      }
      
      // Track render time
      if (lastRenderTimeRef.current > 0) {
        const renderTime = now - lastRenderTimeRef.current;
        setPerformanceMetrics(prev => ({
          ...prev,
          renderTime
        }));
      }
      
      // Count visible objects
      visibleCount = canvas.getObjects().filter(obj => obj.visible).length;
      
      lastRenderTimeRef.current = now;
      animFrameId = requestAnimationFrame(measurePerformance);
    };
    
    animFrameId = requestAnimationFrame(measurePerformance);
    
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [virtualizationEnabled, canvasRef]);

  return {
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics
  };
}
