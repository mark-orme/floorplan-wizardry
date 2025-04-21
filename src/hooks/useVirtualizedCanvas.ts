
/**
 * Virtualized Canvas Hook
 * 
 * Provides canvas virtualization to improve performance with large floor plans
 * Only renders objects visible in the current viewport
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useGridPerformanceMonitor } from './useCanvasPerformanceMonitor';
import { toast } from 'sonner';

// Define the performance metrics interface
export interface VirtualizationPerformanceMetrics {
  fps: number;
  frameTime?: number;
  objectCount: number;
  visibleObjectCount: number;
  maxFrameTime?: number;
  longFrames?: number;
  [key: string]: number | undefined;
}

interface UseVirtualizedCanvasProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  options?: {
    enabled?: boolean;
    threshold?: number; // Number of objects before virtualization is auto-enabled
    padding?: number; // Padding area around visible viewport
    autoToggle?: boolean; // Auto-enable virtualization when object count exceeds threshold
  };
}

export function useVirtualizedCanvas(
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  {
    enabled = false,
    threshold = 100,
    padding = 200,
    autoToggle = true
  }: UseVirtualizedCanvasProps['options'] = {}
) {
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [performanceData, setPerformanceData] = useState<VirtualizationPerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0
  });
  
  // Get canvas dimensions for viewport calculation
  const getCanvasDimensions = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    return {
      width: canvas?.width || window.innerWidth,
      height: canvas?.height || window.innerHeight
    };
  }, [fabricCanvasRef]);
  
  const { width, height } = getCanvasDimensions();
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  
  // Handle performance monitoring
  const updatePerformanceMetrics = useCallback((stats: any) => {
    setPerformanceData({
      fps: stats.fps || 0,
      objectCount: stats.objectCount || 0,
      visibleObjectCount: stats.visibleObjectCount || 0,
      frameTime: stats.frameTime,
      maxFrameTime: stats.maxFrameTime,
      longFrames: stats.longFrames
    });
  }, []);
  
  // Use the grid performance monitor
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    // Track performance
    const stats = useGridPerformanceMonitor({
      canvas: fabricCanvasRef.current,
      enabled: true,
      onPerformanceUpdate: updatePerformanceMetrics
    });
    
    return () => {
      // Cleanup if needed
    };
  }, [fabricCanvasRef, updatePerformanceMetrics]);
  
  // Function to update virtualization
  const updateVirtualization = useCallback(() => {
    if (!fabricCanvasRef.current || !virtualizationEnabled) return;
    
    // Implementation for virtualization update logic
    const canvas = fabricCanvasRef.current;
    const zoom = canvas.getZoom() || 1;
    const vpt = canvas.viewportTransform;
    
    if (!vpt) return;
    
    // Calculate visible area with padding
    const visibleArea = {
      left: -vpt[4] / zoom - padding,
      top: -vpt[5] / zoom - padding,
      right: (-vpt[4] + canvas.width!) / zoom + padding,
      bottom: (-vpt[5] + canvas.height!) / zoom + padding
    };
    
    let visibleCount = 0;
    
    // Update object visibility based on viewport
    canvas.forEachObject(obj => {
      if (!obj) return;
      
      const bounds = obj.getBoundingRect();
      const isVisible = !(
        bounds.left > visibleArea.right ||
        bounds.top > visibleArea.bottom ||
        bounds.left + bounds.width < visibleArea.left ||
        bounds.top + bounds.height < visibleArea.top
      );
      
      if (obj.visible !== isVisible) {
        obj.visible = isVisible;
        obj.setCoords();
      }
      
      if (isVisible) visibleCount++;
    });
    
    // Update performance data with visible count
    setPerformanceData(prev => ({
      ...prev,
      visibleObjectCount: visibleCount
    }));
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef, virtualizationEnabled, padding]);
  
  // Auto-enable virtualization when object count exceeds threshold
  useEffect(() => {
    if (!autoToggle || !fabricCanvasRef.current) return;
    
    const objectCount = fabricCanvasRef.current.getObjects().length;
  
    // Enable virtualization if object count exceeds threshold
    if (objectCount > threshold && !virtualizationEnabled && !isAutoEnabled) {
      setVirtualizationEnabled(true);
      setIsAutoEnabled(true);
      toast.info(`Performance optimization activated (${objectCount} objects)`, {
        description: 'Large plan detected - enabling virtualization',
        duration: 5000,
        id: 'virtualization-enabled'
      });
    }
  }, [
    threshold, 
    virtualizationEnabled, 
    autoToggle,
    fabricCanvasRef,
    isAutoEnabled
  ]);
  
  // Manual toggle with user notification
  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => !prev);
    toast.info(
      virtualizationEnabled 
        ? 'Virtualization disabled' 
        : 'Virtualization enabled',
      {
        description: virtualizationEnabled 
          ? 'All objects will be rendered' 
          : 'Only objects in viewport will be rendered',
        duration: 3000
      }
    );
  }, [virtualizationEnabled]);
  
  // Force a refresh of the virtualization
  const refreshVirtualization = useCallback(() => {
    if (virtualizationEnabled) {
      updateVirtualization();
    }
  }, [updateVirtualization, virtualizationEnabled]);
  
  // Reset metrics function
  const resetMetrics = useCallback(() => {
    setPerformanceData({
      fps: 0,
      objectCount: 0,
      visibleObjectCount: 0
    });
  }, []);
  
  return {
    performanceMetrics: performanceData,
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    resetMetrics
  };
}
