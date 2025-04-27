import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { PerformanceMetrics } from '@/types/core/DebugInfo';

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  throttleRenderTime?: number;
  minFps?: number;
  objectThreshold?: number;
}

/**
 * Hook for optimizing canvas performance with virtualization
 */
export const useVirtualizedCanvas = (
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) => {
  const {
    enabled = true,
    throttleRenderTime = 16, // 60fps target
    minFps = 30,
    objectThreshold = 100
  } = options;
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  
  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderDuration: 0,
    objectCount: 0,
    throttled: false,
    lastUpdate: Date.now()
  });
  
  // Keep track of frames
  const framesRef = useRef<{ timestamp: number; duration: number }[]>([]);
  const lastRenderTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  
  // Setup performance monitoring
  useEffect(() => {
    if (!virtualizationEnabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Track render times
    const originalRenderAll = canvas.renderAll.bind(canvas);
    
    canvas.renderAll = function() {
      const startTime = performance.now();
      const result = originalRenderAll();
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      lastRenderTimeRef.current = duration;
      
      framesRef.current.push({
        timestamp: Date.now(),
        duration
      });
      
      // Keep only last 60 frames
      if (framesRef.current.length > 60) {
        framesRef.current.shift();
      }
      
      return result;
    };
    
    // Periodic metrics update
    const updateMetrics = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Get current object count
      const objectCount = canvas.getObjects().length;
      
      // Calculate metrics
      const frames = framesRef.current.slice(-30); // last 30 frames
      const avgDuration = frames.length > 0
        ? frames.reduce((sum, frame) => sum + frame.duration, 0) / frames.length
        : 0;
      const avgFps = avgDuration > 0 ? 1000 / avgDuration : 60;
      
      // Update metrics
      setPerformanceMetrics({
        fps: Math.round(avgFps),
        renderDuration: Math.round(avgDuration),
        objectCount,
        throttled: avgFps < minFps,
        lastUpdate: Date.now()
      });
      
      // Apply optimizations if needed
      if (objectCount > objectThreshold && avgFps < minFps) {
        applyOptimizations(canvas);
      }
      
      rafIdRef.current = requestAnimationFrame(updateMetrics);
    };
    
    rafIdRef.current = requestAnimationFrame(updateMetrics);
    
    return () => {
      // Restore original renderAll
      if (canvas && originalRenderAll) {
        canvas.renderAll = originalRenderAll;
      }
      
      // Cancel animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [virtualizationEnabled, canvasRef, minFps, objectThreshold]);
  
  // Apply performance optimizations
  const applyOptimizations = (canvas: FabricCanvas) => {
    // Skip rendering objects that are outside the viewport
    const objects = canvas.getObjects();
    const viewportTransform = canvas.viewportTransform;
    
    if (!viewportTransform) return;
    
    const zoom = viewportTransform[0];
    const vpt = {
      tl: {
        x: -viewportTransform[4] / zoom,
        y: -viewportTransform[5] / zoom
      },
      br: {
        x: (canvas.width! - viewportTransform[4]) / zoom,
        y: (canvas.height! - viewportTransform[5]) / zoom
      }
    };
    
    objects.forEach(obj => {
      if (!obj.aCoords) return;
      
      // Check if object is in viewport
      const objBounds = {
        tl: { x: obj.aCoords.tl.x, y: obj.aCoords.tl.y },
        br: { x: obj.aCoords.br.x, y: obj.aCoords.br.y }
      };
      
      const isInViewport = 
        objBounds.br.x >= vpt.tl.x &&
        objBounds.tl.x <= vpt.br.x &&
        objBounds.br.y >= vpt.tl.y &&
        objBounds.tl.y <= vpt.br.y;
      
      // Set visibility based on viewport
      if (obj.visible !== isInViewport) {
        obj.visible = isInViewport;
      }
    });
  };
  
  // Toggle virtualization
  const toggleVirtualization = () => {
    setVirtualizationEnabled(prev => !prev);
  };
  
  // Function to refresh virtualization settings
  const refreshVirtualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get current object count
    const objectCount = canvas.getObjects().length;
    
    // Calculate new metrics
    const timestamps = framesRef.current.slice(-30); // last 30 frames
    const avgDuration = timestamps.length > 0
      ? timestamps.reduce((sum, frame) => sum + frame.duration, 0) / timestamps.length
      : 0;
    const avgFps = avgDuration > 0 ? 1000 / avgDuration : 60;
    
    // Update metrics
    setPerformanceMetrics({
      fps: Math.round(avgFps),
      renderDuration: Math.round(avgDuration),
      objectCount,
      throttled: avgFps < minFps,
      lastUpdate: Date.now()
    });
    
    // Apply optimizations if needed
    if (virtualizationEnabled && objectCount > objectThreshold && avgFps < minFps) {
      applyOptimizations(canvas);
    }
  };
  
  return {
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics
  };
};
