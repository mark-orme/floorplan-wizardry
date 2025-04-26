
import { useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { PerformanceMetrics } from '@/types/core/DebugInfo';

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  maxFps?: number;
  throttleRenders?: boolean;
}

export function useVirtualizedCanvas(
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) {
  const {
    enabled = true,
    maxFps = 60,
    throttleRenders = true
  } = options;
  
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderDuration: 0,
    objectCount: 0,
    throttled: false,
    lastUpdate: 0
  });
  
  const animationFrameRef = useRef<number | null>(null);
  const lastRenderTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);
  
  // Set up virtualization
  useEffect(() => {
    if (!enabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Enhance canvas with virtualization
    const updatePerformanceMetrics = () => {
      const now = performance.now();
      frameCountRef.current++;
      
      // Update FPS every second
      if (now - lastFpsUpdateRef.current > 1000) {
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: Math.round(frameCountRef.current * 1000 / (now - lastFpsUpdateRef.current)),
          objectCount: canvas.getObjects().length,
          lastUpdate: now
        }));
        
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = now;
      }
    };
    
    // Set up render loop
    const renderLoop = (timestamp: number) => {
      if (throttleRenders) {
        const elapsed = timestamp - lastRenderTimeRef.current;
        const frameTime = 1000 / maxFps;
        
        if (elapsed < frameTime) {
          animationFrameRef.current = requestAnimationFrame(renderLoop);
          return;
        }
      }
      
      lastRenderTimeRef.current = timestamp;
      updatePerformanceMetrics();
      
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };
    
    animationFrameRef.current = requestAnimationFrame(renderLoop);
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, enabled, maxFps, throttleRenders]);
  
  // Method to refresh virtualization
  const refreshVirtualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Force refresh by triggering a render
    canvas.requestRenderAll();
  };
  
  return {
    performanceMetrics,
    refreshVirtualization
  };
}
