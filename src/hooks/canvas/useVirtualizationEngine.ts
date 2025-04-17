
/**
 * Hook for canvas virtualization
 * Provides utilities for only rendering objects in the visible viewport
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

interface UseVirtualizationEngineProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  viewportWidth: number;
  viewportHeight: number;
  paddingPx?: number;
}

export const useVirtualizationEngine = ({
  fabricCanvasRef,
  viewportWidth,
  viewportHeight,
  paddingPx = 200
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
    updateVirtualization,
    setVirtualization
  };
};
