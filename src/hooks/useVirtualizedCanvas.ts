
import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface VirtualizationOptions {
  enabled?: boolean;
  autoToggle?: boolean;
  objectThreshold?: number;
}

interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  lastRenderTime: number;
}

export function useVirtualizedCanvas(
  canvasRef: MutableRefObject<FabricCanvas | null>, 
  options: VirtualizationOptions = {}
) {
  const [virtualizationEnabled, setVirtualizationEnabled] = useState<boolean>(options.enabled ?? true);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    lastRenderTime: 0
  });
  const framesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  
  // Toggle virtualization on/off
  const toggleVirtualization = () => {
    if (!canvasRef.current) return;
    
    const newValue = !virtualizationEnabled;
    setVirtualizationEnabled(newValue);
    
    // Apply to the canvas
    canvasRef.current.skipOffscreen = newValue;
    
    // Notify user
    toast.success(`Virtualization ${newValue ? 'enabled' : 'disabled'}`, {
      id: 'virtualization-toggle',
      duration: 2000
    });
    
    // Force re-render
    canvasRef.current.requestRenderAll();
  };
  
  // Update metrics
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const updateMetrics = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Calculate FPS
      const now = performance.now();
      const elapsed = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;
      
      framesRef.current.push(1000 / elapsed);
      if (framesRef.current.length > 30) {
        framesRef.current.shift();
      }
      
      // Calculate average FPS
      const fps = framesRef.current.reduce((sum, frame) => sum + frame, 0) / 
                 Math.max(1, framesRef.current.length);
      
      // Get object counts
      const objectCount = canvas.getObjects().length;
      const visibleObjectCount = canvas._activeObjects?.length || 0;
      
      // Auto-toggle virtualization if enabled and object count exceeds threshold
      if (options.autoToggle && objectCount > (options.objectThreshold || 200)) {
        if (!virtualizationEnabled) {
          setVirtualizationEnabled(true);
          canvas.skipOffscreen = true;
        }
      }
      
      // Update metrics
      setPerformanceMetrics({
        fps: Math.round(fps * 10) / 10,
        objectCount,
        visibleObjectCount,
        lastRenderTime: now
      });
      
      // Schedule next update
      requestAnimationFrame(updateMetrics);
    };
    
    // Start metrics collection
    const animationFrameId = requestAnimationFrame(updateMetrics);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [options.autoToggle, options.objectThreshold, virtualizationEnabled]);
  
  // Apply virtualization setting when canvas changes
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.skipOffscreen = virtualizationEnabled;
    }
  }, [canvasRef.current, virtualizationEnabled]);
  
  // Manual refresh function
  const refreshVirtualization = () => {
    if (!canvasRef.current) return;
    
    // Force reapplication of virtualization
    canvasRef.current.skipOffscreen = virtualizationEnabled;
    canvasRef.current.requestRenderAll();
  };
  
  return {
    virtualizationEnabled,
    toggleVirtualization,
    performanceMetrics,
    refreshVirtualization
  };
}
