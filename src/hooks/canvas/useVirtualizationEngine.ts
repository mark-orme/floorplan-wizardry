
import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { debounce, throttle } from 'lodash'; // Importing lodash functions

interface UseVirtualizationEngineProps {
  canvas: FabricCanvas | null;
  enabled?: boolean;
  viewportPadding?: number;
  updateInterval?: number;
}

export const useVirtualizationEngine = ({
  canvas,
  enabled = true,
  viewportPadding = 100,
  updateInterval = 100
}: UseVirtualizationEngineProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [performance, setPerformance] = useState<{
    fps: number;
    objectCount: number;
    visibleObjectCount: number;
  }>({ fps: 0, objectCount: 0, visibleObjectCount: 0 });
  
  const lastFrameTime = useRef(0);
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(0);
  
  // Get viewport bounds accounting for zoom and pan
  const getViewportBounds = useCallback(() => {
    if (!canvas || !canvas.viewportTransform) return { left: 0, top: 0, right: 0, bottom: 0 };
    
    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    const width = canvas.getWidth() || 0;
    const height = canvas.getHeight() || 0;
    
    return {
      left: -vpt[4] / zoom - viewportPadding,
      top: -vpt[5] / zoom - viewportPadding,
      right: (-vpt[4] + width) / zoom + viewportPadding,
      bottom: (-vpt[5] + height) / zoom + viewportPadding
    };
  }, [canvas, viewportPadding]);
  
  // Update the object visibility based on viewport
  const updateObjectVisibility = useCallback(() => {
    if (!canvas || !isEnabled) return;
    
    const bounds = getViewportBounds();
    const objects = canvas.getObjects();
    let visibleCount = 0;
    
    objects.forEach(obj => {
      if (!obj.getBoundingRect) return;
      
      const objBounds = obj.getBoundingRect();
      const isVisible = 
        objBounds.left < bounds.right &&
        objBounds.top < bounds.bottom &&
        objBounds.left + objBounds.width > bounds.left &&
        objBounds.top + objBounds.height > bounds.top;
      
      // Only update visibility if it changed
      if (obj.visible !== isVisible) {
        obj.visible = isVisible;
        
        // Set the dirty flag if available
        if ('dirty' in obj) {
          (obj as any).dirty = true;
        }
      }
      
      if (isVisible) visibleCount++;
    });
    
    // Update performance metrics
    frameCount.current++;
    const now = performance.now();
    
    if (now - lastFpsUpdate.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastFpsUpdate.current));
      
      setPerformance({
        fps,
        objectCount: objects.length,
        visibleObjectCount: visibleCount
      });
      
      frameCount.current = 0;
      lastFpsUpdate.current = now;
    }
  }, [canvas, getViewportBounds, isEnabled]);
  
  // Create debounced and throttled versions of the update function
  const debouncedUpdate = useCallback(
    debounce(updateObjectVisibility, 100),
    [updateObjectVisibility]
  );
  
  const throttledUpdate = useCallback(
    throttle(updateObjectVisibility, updateInterval),
    [updateObjectVisibility, updateInterval]
  );
  
  // Set up event listeners for canvas events
  useEffect(() => {
    if (!canvas || !isEnabled) return;
    
    const handleViewportChange = () => {
      throttledUpdate();
    };
    
    const handleObjectModification = () => {
      debouncedUpdate();
    };
    
    canvas.on('object:modified', handleObjectModification);
    canvas.on('object:added', handleObjectModification);
    canvas.on('object:removed', handleObjectModification);
    canvas.on('zoom:changed', handleViewportChange);
    canvas.on('viewportTransform:changed', handleViewportChange);
    canvas.on('mouse:wheel', handleViewportChange);
    
    // Initial update
    updateObjectVisibility();
    
    return () => {
      canvas.off('object:modified', handleObjectModification);
      canvas.off('object:added', handleObjectModification);
      canvas.off('object:removed', handleObjectModification);
      canvas.off('zoom:changed', handleViewportChange);
      canvas.off('viewportTransform:changed', handleViewportChange);
      canvas.off('mouse:wheel', handleViewportChange);
      
      debouncedUpdate.cancel();
      throttledUpdate.cancel();
    };
  }, [canvas, isEnabled, debouncedUpdate, throttledUpdate, updateObjectVisibility]);
  
  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);
  
  return {
    isEnabled,
    toggleEnabled,
    updateVisibility: updateObjectVisibility,
    performance
  };
};

export default useVirtualizationEngine;
