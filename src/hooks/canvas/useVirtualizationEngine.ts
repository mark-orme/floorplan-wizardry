
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { throttle } from 'lodash';

interface UseVirtualizationEngineProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
  objectThreshold?: number;
  renderDistance?: number;
  updateInterval?: number;
}

interface PerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  culledObjectCount: number;
  lastRenderTime: number;
}

export const useVirtualizationEngine = ({
  fabricCanvasRef,
  enabled = true,
  objectThreshold = 50,
  renderDistance = 100,
  updateInterval = 300
}: UseVirtualizationEngineProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    objectCount: 0,
    visibleObjectCount: 0,
    culledObjectCount: 0,
    lastRenderTime: 0
  });
  
  const framesCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  
  // Function to update object visibility based on viewport
  const updateObjectVisibility = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    // Skip if we're below the threshold
    const objects = canvas.getObjects();
    if (objects.length < objectThreshold) {
      if (canvas.requestRenderAll) {
        canvas.requestRenderAll();
      }
      return;
    }
    
    // Get canvas dimensions and viewport transform
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    // Calculate viewport bounds with buffer
    const zoom = canvas.getZoom ? canvas.getZoom() : 1;
    const renderOptions = {
      viewportLeft: -vpt[4] / zoom - renderDistance,
      viewportTop: -vpt[5] / zoom - renderDistance,
      viewportRight: (-vpt[4] + canvas.width!) / zoom + renderDistance,
      viewportBottom: (-vpt[5] + canvas.height!) / zoom + renderDistance
    };
    
    let visibleCount = 0;
    let culledCount = 0;
    
    // Update visibility for each object
    objects.forEach(obj => {
      if (!obj) return;
      
      // Get object bounds
      const objBounds = obj.getBoundingRect ? obj.getBoundingRect() : null;
      if (!objBounds) return;
      
      // Check if object is in viewport
      const isVisible = 
        objBounds.left < renderOptions.viewportRight &&
        objBounds.left + objBounds.width > renderOptions.viewportLeft &&
        objBounds.top < renderOptions.viewportBottom &&
        objBounds.top + objBounds.height > renderOptions.viewportTop;
      
      // Update object visibility (using 'visible' property)
      if (obj.visible !== isVisible) {
        obj.visible = isVisible;
      }
      
      if (isVisible) {
        visibleCount++;
      } else {
        culledCount++;
      }
    });
    
    // Update performance metrics
    const now = performance.now();
    if (now - lastFrameTimeRef.current > 1000) {
      const fps = Math.round(framesCountRef.current * 1000 / (now - lastFrameTimeRef.current));
      setMetrics({
        fps,
        objectCount: objects.length,
        visibleObjectCount: visibleCount,
        culledObjectCount: culledCount,
        lastRenderTime: now
      });
      
      framesCountRef.current = 0;
      lastFrameTimeRef.current = now;
    } else {
      framesCountRef.current++;
    }
    
    // Request render after updating visibility
    if (canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, isEnabled, objectThreshold, renderDistance]);
  
  // Throttled update function to avoid too many calls
  const throttledUpdate = useCallback(
    throttle(updateObjectVisibility, updateInterval), 
    [updateObjectVisibility, updateInterval]
  );
  
  // Set up event listeners for canvas movements
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    const handleViewportChange = () => {
      throttledUpdate();
    };
    
    // Attach event listeners
    canvas.on('mouse:wheel', handleViewportChange);
    canvas.on('object:moving', handleViewportChange);
    canvas.on('object:scaling', handleViewportChange);
    canvas.on('mouse:down', handleViewportChange);
    canvas.on('mouse:up', handleViewportChange);
    
    // Initial update
    updateObjectVisibility();
    
    // Clean up
    return () => {
      canvas.off('mouse:wheel', handleViewportChange);
      canvas.off('object:moving', handleViewportChange);
      canvas.off('object:scaling', handleViewportChange);
      canvas.off('mouse:down', handleViewportChange);
      canvas.off('mouse:up', handleViewportChange);
      throttledUpdate.cancel();
    };
  }, [fabricCanvasRef, isEnabled, throttledUpdate, updateObjectVisibility]);
  
  // Function to toggle virtualization
  const toggleVirtualization = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);
  
  // Update all objects to be visible when disabling virtualization
  useEffect(() => {
    if (!isEnabled) {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      canvas.getObjects().forEach(obj => {
        if (obj.visible === false) {
          obj.visible = true;
        }
      });
      
      if (canvas.requestRenderAll) {
        canvas.requestRenderAll();
      }
    }
  }, [fabricCanvasRef, isEnabled]);
  
  return {
    isEnabled,
    metrics,
    toggleVirtualization,
    updateObjectVisibility
  };
};
