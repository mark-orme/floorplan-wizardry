
/**
 * Virtualized Canvas Hook
 * Provides virtualization for large canvas with many objects
 * @module hooks/useVirtualizedCanvas
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import { debounce } from '@/utils/debounce';

interface VirtualizationOptions {
  enabled?: boolean;
  autoToggle?: boolean;
  objectThreshold?: number;
  updateInterval?: number;
}

interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
  lastUpdated: number;
}

export function useVirtualizedCanvas(
  canvasRef: React.RefObject<Canvas | null>,
  options: VirtualizationOptions = {}
) {
  const {
    enabled = false,
    autoToggle = true,
    objectThreshold = 100,
    updateInterval = 1000
  } = options;
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    renderTime: 0,
    lastUpdated: Date.now()
  });
  
  const fpsCounterRef = useRef({ frames: 0, lastCheck: Date.now() });
  const metricsIntervalRef = useRef<number | null>(null);
  
  // Update FPS counter
  const updateFpsCounter = useCallback(() => {
    const now = Date.now();
    const elapsed = now - fpsCounterRef.current.lastCheck;
    
    if (elapsed >= 1000) {
      const fps = Math.round((fpsCounterRef.current.frames * 1000) / elapsed);
      fpsCounterRef.current = { frames: 0, lastCheck: now };
      
      setPerformanceMetrics(prev => ({
        ...prev,
        fps,
        lastUpdated: now
      }));
    } else {
      fpsCounterRef.current.frames++;
    }
  }, []);
  
  // Update performance metrics
  const updateMetrics = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const visibleObjects = objects.filter(obj => obj.visible !== false);
    
    setPerformanceMetrics(prev => ({
      ...prev,
      objectCount: objects.length,
      visibleObjectCount: visibleObjects.length,
      lastUpdated: Date.now()
    }));
    
    // Auto-toggle virtualization based on object count
    if (autoToggle && !virtualizationEnabled && objects.length > objectThreshold) {
      setVirtualizationEnabled(true);
    }
  }, [canvasRef, autoToggle, virtualizationEnabled, objectThreshold]);
  
  // Refresh virtualization state
  const refreshVirtualization = useCallback(debounce(() => {
    updateMetrics();
    updateFpsCounter();
  }, 100), [updateMetrics, updateFpsCounter]);
  
  // Toggle virtualization on/off
  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => !prev);
  }, []);
  
  // Set up metrics interval
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      updateMetrics();
    }, updateInterval);
    
    metricsIntervalRef.current = intervalId;
    
    return () => {
      if (metricsIntervalRef.current !== null) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [updateMetrics, updateInterval]);
  
  return {
    virtualizationEnabled,
    toggleVirtualization,
    performanceMetrics,
    refreshVirtualization
  };
}
