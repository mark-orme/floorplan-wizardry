
/**
 * Hook for canvas virtualization
 * Provides utilities for only rendering objects in the visible viewport
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { debounce } from '@/utils/debounce';

export interface VirtualizationPerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
  viewportSize?: { width: number; height: number };
  tileCount?: number;
}

interface UseVirtualizationEngineProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  viewportWidth: number;
  viewportHeight: number;
  paddingPx?: number;
  debounceDelay?: number;
}

export const useVirtualizationEngine = ({
  fabricCanvasRef,
  viewportWidth,
  viewportHeight,
  paddingPx = 200,
  debounceDelay = 50
}: UseVirtualizationEngineProps) => {
  // Track whether we need virtualization
  const [needsVirtualization, setNeedsVirtualization] = useState(false);
  
  // Track visible area for virtualization
  const visibleAreaRef = useRef({
    left: 0,
    top: 0,
    right: viewportWidth,
    bottom: viewportHeight
  });
  
  // Track number of visible objects
  const [visibleObjectCount, setVisibleObjectCount] = useState(0);
  
  // Virtual canvas rendering optimization
  // Only render objects that are in or near the viewport
  const updateVirtualization = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !needsVirtualization) return;
    
    // Get current viewport transform
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    // Calculate visible area with padding
    const zoom = canvas.getZoom() || 1;
    
    const visibleArea = {
      left: -vpt[4] / zoom - paddingPx,
      top: -vpt[5] / zoom - paddingPx,
      right: (-vpt[4] + canvas.width!) / zoom + paddingPx,
      bottom: (-vpt[5] + canvas.height!) / zoom + paddingPx
    };
    
    // Update reference
    visibleAreaRef.current = visibleArea;
    
    // Only render objects in or near the visible area
    let visibleCount = 0;
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      canvas.forEachObject((obj) => {
        // Skip grid objects which should always be visible
        if ((obj as any).isGrid) return;
        
        const objBounds = obj.getBoundingRect();
        
        // Check if object is in visible area
        const isVisible = !(
          objBounds.left > visibleArea.right ||
          objBounds.top > visibleArea.bottom ||
          objBounds.left + objBounds.width < visibleArea.left ||
          objBounds.top + objBounds.height < visibleArea.top
        );
        
        // Update object visibility
        if (isVisible !== obj.visible) {
          obj.visible = isVisible;
          obj.setCoords();
        }
        
        if (isVisible) {
          visibleCount++;
        }
      });
      
      // Update visible count
      setVisibleObjectCount(visibleCount);
      
      // Log virtualization metrics
      logger.debug('Virtualization update', {
        totalObjects: canvas.getObjects().length,
        visibleObjects: visibleCount,
        zoom,
        visibleArea
      });
      
      canvas.requestRenderAll();
    });
  }, [fabricCanvasRef, needsVirtualization, paddingPx]);
  
  // Debounced virtualization update
  const debouncedUpdateVirtualization = useCallback(
    debounce(updateVirtualization, debounceDelay),
    [updateVirtualization, debounceDelay]
  );

  // Enable or disable virtualization
  const setVirtualization = useCallback((enabled: boolean) => {
    if (enabled === needsVirtualization) return;
    
    setNeedsVirtualization(enabled);
    
    // Reset all object visibility when disabling virtualization
    if (!enabled && fabricCanvasRef.current) {
      fabricCanvasRef.current.getObjects().forEach(obj => {
        if (obj.visible !== undefined) {
          obj.visible = true;
        }
      });
      fabricCanvasRef.current.requestRenderAll();
    }
    
    logger.info(`${enabled ? 'Enabling' : 'Disabling'} canvas virtualization`);
  }, [fabricCanvasRef, needsVirtualization]);
  
  return {
    needsVirtualization,
    visibleArea: visibleAreaRef.current,
    visibleObjectCount,
    updateVirtualization: debouncedUpdateVirtualization,
    setVirtualization
  };
};

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  paddingPx?: number;
  autoToggle?: boolean;
  objectThreshold?: number;
}

export const useVirtualizedCanvas = (
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) => {
  const {
    enabled = true,
    paddingPx = 200,
    autoToggle = false,
    objectThreshold = 100
  } = options;
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  const [performanceMetrics, setPerformanceMetrics] = useState<VirtualizationPerformanceMetrics>({
    fps: 60,
    objectCount: 0,
    visibleObjectCount: 0,
    renderTime: 0
  });
  
  const viewportWidth = useRef(800);
  const viewportHeight = useRef(600);
  
  // Update dimensions if canvas changes
  useEffect(() => {
    if (canvasRef.current) {
      viewportWidth.current = canvasRef.current.width || 800;
      viewportHeight.current = canvasRef.current.height || 600;
    }
  }, [canvasRef.current]);
  
  const {
    needsVirtualization,
    visibleArea,
    visibleObjectCount,
    updateVirtualization,
    setVirtualization
  } = useVirtualizationEngine({
    fabricCanvasRef: canvasRef,
    viewportWidth: viewportWidth.current,
    viewportHeight: viewportHeight.current,
    paddingPx
  });
  
  // Set up auto-toggling based on object count
  useEffect(() => {
    if (!autoToggle || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const checkObjectCount = () => {
      const count = canvas.getObjects().length;
      if (count > objectThreshold && !virtualizationEnabled) {
        setVirtualizationEnabled(true);
        setVirtualization(true);
      } else if (count <= objectThreshold && virtualizationEnabled) {
        setVirtualizationEnabled(false);
        setVirtualization(false);
      }
    };
    
    checkObjectCount();
    
    const handleObjectAdded = () => checkObjectCount();
    const handleObjectRemoved = () => checkObjectCount();
    
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [autoToggle, canvasRef, objectThreshold, virtualizationEnabled, setVirtualization]);
  
  // Update metrics periodically
  useEffect(() => {
    if (!canvasRef.current || !virtualizationEnabled) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let animFrameId: number;
    
    const updateMetrics = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        
        if (canvasRef.current) {
          setPerformanceMetrics({
            fps,
            objectCount: canvasRef.current.getObjects().length,
            visibleObjectCount,
            renderTime: elapsed / frameCount
          });
        }
        
        frameCount = 0;
        lastTime = now;
      }
      
      animFrameId = requestAnimationFrame(updateMetrics);
    };
    
    updateMetrics();
    
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [canvasRef, virtualizationEnabled, visibleObjectCount]);
  
  // Set up event listeners for virtualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !virtualizationEnabled) return;
    
    const handleViewportChange = () => {
      updateVirtualization();
    };
    
    canvas.on('mouse:wheel', handleViewportChange);
    canvas.on('mouse:down', handleViewportChange);
    canvas.on('mouse:up', handleViewportChange);
    
    return () => {
      canvas.off('mouse:wheel', handleViewportChange);
      canvas.off('mouse:down', handleViewportChange);
      canvas.off('mouse:up', handleViewportChange);
    };
  }, [canvasRef, virtualizationEnabled, updateVirtualization]);
  
  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => {
      setVirtualization(!prev);
      return !prev;
    });
  }, [setVirtualization]);
  
  const refreshVirtualization = useCallback(() => {
    if (virtualizationEnabled) {
      updateVirtualization();
    }
  }, [virtualizationEnabled, updateVirtualization]);
  
  return {
    virtualizationEnabled,
    performanceMetrics,
    toggleVirtualization,
    refreshVirtualization,
    visibleArea
  };
};
