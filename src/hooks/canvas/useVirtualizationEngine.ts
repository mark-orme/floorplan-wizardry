import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

interface UseVirtualizationEngineProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
  margin?: number;
}

/**
 * Hook to manage canvas virtualization for improved performance
 */
export const useVirtualizationEngine = ({ fabricCanvasRef, enabled = true, margin = 50 }: UseVirtualizationEngineProps) => {
  const [viewport, setViewport] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const isInitialized = useRef(false);
  
  /**
   * Update visible objects based on viewport
   */
  const updateVisibleObjects = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get viewport bounds with safeguards
    const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const zoom = vpt[0] || 1;
    const panX = vpt[4] || 0;
    const panY = vpt[5] || 0;
    
    const viewportWidth = canvas.getWidth() / zoom;
    const viewportHeight = canvas.getHeight() / zoom;
    
    const x1 = -panX / zoom - margin;
    const y1 = -panY / zoom - margin;
    const x2 = x1 + viewportWidth + 2 * margin;
    const y2 = y1 + viewportHeight + 2 * margin;
    
    setViewport({ x1, y1, x2, y2 });
    
    // Iterate through all objects and set visibility
    canvas.forEachObject((obj: FabricObject) => {
      const objWidth = obj.width || 0;
      const objHeight = obj.height || 0;
      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      
      const isVisible = !(
        objLeft > x2 ||
        objLeft + objWidth < x1 ||
        objTop > y2 ||
        objTop + objHeight < y1
      );
      
      obj.visible = isVisible;
    });
    
    // Add null check before invoking methods
    if (canvas && canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, options.margin, viewport]);
  
  /**
   * Toggle virtualization
   */
  const toggleVirtualization = useCallback(() => {
    if (enabled) {
      updateVisibleObjects();
    } else {
      fabricCanvasRef.current?.forEachObject((obj: FabricObject) => {
        obj.visible = true;
      });
      fabricCanvasRef.current?.requestRenderAll();
    }
  }, [enabled, fabricCanvasRef, updateVisibleObjects]);
  
  /**
   * Refresh virtualization
   */
  const refreshVirtualization = useCallback(() => {
    if (enabled) {
      updateVisibleObjects();
    }
  }, [enabled, updateVisibleObjects]);
  
  useEffect(() => {
    if (!enabled || isInitialized.current) return;
    
    // Initial virtualization
    updateVisibleObjects();
    
    // Set up event listeners for pan and zoom
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.on('object:moving', updateVisibleObjects);
      canvas.on('object:scaling', updateVisibleObjects);
      canvas.on('object:rotating', updateVisibleObjects);
      canvas.on('viewport:changed', updateVisibleObjects);
    }
    
    isInitialized.current = true;
    
    // Clean up event listeners
    return () => {
      if (canvas) {
        canvas.off('object:moving', updateVisibleObjects);
        canvas.off('object:scaling', updateVisibleObjects);
        canvas.off('object:rotating', updateVisibleObjects);
        canvas.off('viewport:changed', updateVisibleObjects);
      }
      isInitialized.current = false;
    };
  }, [enabled, fabricCanvasRef, updateVisibleObjects]);
  
  return {
    virtualizationEnabled: enabled,
    toggleVirtualization,
    refreshVirtualization
  };
};
