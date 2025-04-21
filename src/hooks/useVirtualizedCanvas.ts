/**
 * Hook for canvas virtualization
 * Tracks and optimizes the rendering of canvas objects
 */
import { useCallback, useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { throttle } from 'lodash-es';
import logger from '@/utils/logger';

export interface VirtualizationPerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  culledObjectCount: number;
  lastUpdateTime: number;
}

export interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  paddingPx?: number;
  autoToggle?: boolean;
  autoToggleThreshold?: number;
  refreshInterval?: number;
}

/**
 * Hook for optimizing canvas rendering by virtualizing off-screen objects
 * @param canvasRef Reference to the Fabric canvas
 * @param options Virtualization options
 * @returns Virtualization controls and performance metrics
 */
export function useVirtualizedCanvas(
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) {
  const {
    enabled = true,
    paddingPx = 200,
    autoToggle = true,
    autoToggleThreshold = 500,
    refreshInterval = 100
  } = options;
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  const [performanceMetrics, setPerformanceMetrics] = useState<VirtualizationPerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    culledObjectCount: 0,
    lastUpdateTime: 0
  });
  
  // Track frame rate
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const visibleAreaRef = useRef({ left: 0, top: 0, right: 0, bottom: 0 });
  
  /**
   * Calculate visible area based on current viewport
   */
  const calculateVisibleArea = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const vpt = canvas.viewportTransform;
    if (!vpt) return null;
    
    const zoom = canvas.getZoom() || 1;
    const width = canvas.width || 0;
    const height = canvas.height || 0;
    
    return {
      left: -vpt[4] / zoom - paddingPx,
      top: -vpt[5] / zoom - paddingPx,
      right: (-vpt[4] + width) / zoom + paddingPx,
      bottom: (-vpt[5] + height) / zoom + paddingPx
    };
  }, [canvasRef, paddingPx]);
  
  /**
   * Update object visibility based on visible area
   */
  const updateObjectVisibility = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !virtualizationEnabled) return;
    
    const visibleArea = calculateVisibleArea();
    if (!visibleArea) return;
    
    visibleAreaRef.current = visibleArea;
    
    let visibleCount = 0;
    let totalCount = 0;
    
    // Update object visibility
    canvas.forEachObject(obj => {
      totalCount++;
      
      // Always keep grid objects visible
      if ((obj as any).isGrid) {
        obj.visible = true;
        visibleCount++;
        return;
      }
      
      // Check if object is in visible area
      const bounds = obj.getBoundingRect();
      const isVisible = !(
        bounds.left > visibleArea.right ||
        bounds.top > visibleArea.bottom ||
        bounds.left + bounds.width < visibleArea.left ||
        bounds.top + bounds.height < visibleArea.top
      );
      
      // Only update visibility if it changed
      if (obj.visible !== isVisible) {
        obj.visible = isVisible;
        obj.setCoords();
      }
      
      if (isVisible) {
        visibleCount++;
      }
    });
    
    // Update frame count
    frameCountRef.current++;
    
    // Update metrics
    const now = performance.now();
    const elapsed = now - lastFrameTimeRef.current;
    
    // Update FPS every second
    if (elapsed >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / elapsed);
      
      setPerformanceMetrics({
        fps,
        objectCount: totalCount,
        visibleObjectCount: visibleCount,
        culledObjectCount: totalCount - visibleCount,
        lastUpdateTime: now
      });
      
      // Reset counters
      frameCountRef.current = 0;
      lastFrameTimeRef.current = now;
    }
    
    // Request render only if visibility changed
    requestAnimationFrame(() => {
      canvas.requestRenderAll();
    });
  }, [canvasRef, virtualizationEnabled, calculateVisibleArea]);
  
  // Throttle updates for better performance
  const throttledUpdate = useCallback(
    throttle(updateObjectVisibility, refreshInterval),
    [updateObjectVisibility, refreshInterval]
  );
  
  /**
   * Toggle virtualization on/off
   */
  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => {
      // If turning off virtualization, make all objects visible
      if (prev) {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.forEachObject(obj => {
            obj.visible = true;
          });
          canvas.requestRenderAll();
        }
      }
      return !prev;
    });
  }, [canvasRef]);
  
  /**
   * Force refresh of virtualization
   */
  const refreshVirtualization = useCallback(() => {
    if (virtualizationEnabled) {
      updateObjectVisibility();
    }
  }, [virtualizationEnabled, updateObjectVisibility]);
  
  /**
   * Check if virtualization should be enabled based on object count
   */
  const checkAutoToggle = useCallback(() => {
    if (!autoToggle) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const objectCount = canvas.getObjects().length;
    
    // Enable virtualization if object count exceeds threshold
    if (objectCount > autoToggleThreshold && !virtualizationEnabled) {
      setVirtualizationEnabled(true);
      logger.info(`Auto-enabling virtualization (${objectCount} objects)`);
    }
    // Disable virtualization if object count is below threshold
    else if (objectCount <= autoToggleThreshold && virtualizationEnabled) {
      setVirtualizationEnabled(false);
      logger.info(`Auto-disabling virtualization (${objectCount} objects)`);
    }
  }, [autoToggle, autoToggleThreshold, canvasRef, virtualizationEnabled]);
  
  // Setup event listeners for virtualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Attach events for virtualization updates
    const handleObjectAdded = () => {
      checkAutoToggle();
      throttledUpdate();
    };
    
    const handleObjectRemoved = () => {
      checkAutoToggle();
      throttledUpdate();
    };
    
    const handleViewportChange = () => {
      throttledUpdate();
    };
    
    // Add event listeners
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('mouse:wheel', handleViewportChange);
    canvas.on('mouse:down', handleViewportChange);
    canvas.on('mouse:up', handleViewportChange);
    
    // Check initial state
    checkAutoToggle();
    updateObjectVisibility();
    
    // Set initial frame time
    lastFrameTimeRef.current = performance.now();
    
    // Setup periodic refresh
    const intervalId = setInterval(throttledUpdate, refreshInterval * 10);
    
    // Clean up
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('mouse:wheel', handleViewportChange);
      canvas.off('mouse:down', handleViewportChange);
      canvas.off('mouse:up', handleViewportChange);
      
      clearInterval(intervalId);
    };
  }, [
    canvasRef,
    throttledUpdate,
    checkAutoToggle,
    refreshInterval,
    updateObjectVisibility
  ]);
  
  return {
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics,
    visibleArea: visibleAreaRef.current
  };
}
