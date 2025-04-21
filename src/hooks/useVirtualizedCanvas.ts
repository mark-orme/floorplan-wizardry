
/**
 * Virtualized Canvas Hook
 * 
 * Provides canvas virtualization to improve performance with large floor plans
 * Only renders objects visible in the current viewport
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasPerformanceMonitor } from './useCanvasPerformanceMonitor';
import { toast } from 'sonner';

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
  
  // Get canvas dimensions for viewport calculation
  const getCanvasDimensions = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    return {
      width: canvas?.width || window.innerWidth,
      height: canvas?.height || window.innerHeight
    };
  }, [fabricCanvasRef]);
  
  const { width, height } = getCanvasDimensions();
  
  // Initialize performance monitor with virtualization
  const {
    performanceData,
    virtualizationEnabled,
    toggleVirtualization,
    updateVirtualization,
    resetMetrics
  } = useCanvasPerformanceMonitor({
    fabricCanvasRef,
    enabled,
    viewportWidth: width,
    viewportHeight: height,
    virtualizationPadding: padding
  });
  
  // Auto-enable virtualization when object count exceeds threshold
  useEffect(() => {
    if (!autoToggle || !fabricCanvasRef.current) return;
    
    const objectCount = performanceData.objectCount;
    
    // Enable virtualization if object count exceeds threshold
    if (objectCount > threshold && !virtualizationEnabled && !isAutoEnabled) {
      toggleVirtualization();
      setIsAutoEnabled(true);
      toast.info(`Performance optimization activated (${objectCount} objects)`, {
        description: 'Large plan detected - enabling virtualization',
        duration: 5000,
        id: 'virtualization-enabled'
      });
    }
  }, [
    performanceData.objectCount, 
    threshold, 
    virtualizationEnabled, 
    autoToggle, 
    toggleVirtualization,
    fabricCanvasRef,
    isAutoEnabled
  ]);
  
  // Manual toggle with user notification
  const toggleVirtualizationWithFeedback = useCallback(() => {
    toggleVirtualization();
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
  }, [toggleVirtualization, virtualizationEnabled]);
  
  // Force a refresh of the virtualization
  const refreshVirtualization = useCallback(() => {
    if (virtualizationEnabled) {
      updateVirtualization();
    }
  }, [updateVirtualization, virtualizationEnabled]);
  
  return {
    performanceMetrics: performanceData,
    virtualizationEnabled,
    toggleVirtualization: toggleVirtualizationWithFeedback,
    refreshVirtualization,
    resetMetrics
  };
}
