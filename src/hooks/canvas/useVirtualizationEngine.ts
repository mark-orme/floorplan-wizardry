
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

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
  const [needsVirtualization, setNeedsVirtualization] = useState(false);
  const [visibleObjectCount, setVisibleObjectCount] = useState(0);
  
  const visibleAreaRef = useRef({
    left: 0,
    top: 0,
    right: viewportWidth,
    bottom: viewportHeight
  });

  const updateVirtualization = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !needsVirtualization) return;

    const vpt = canvas.viewportTransform;
    if (!vpt) return;

    const zoom = canvas.getZoom?.() || 1;
    const width = canvas.width ?? viewportWidth;
    const height = canvas.height ?? viewportHeight;
    
    const visibleArea = {
      left: (-vpt[4] / zoom) - paddingPx,
      top: (-vpt[5] / zoom) - paddingPx,
      right: ((-vpt[4] + width) / zoom) + paddingPx,
      bottom: ((-vpt[5] + height) / zoom) + paddingPx
    };
    
    visibleAreaRef.current = visibleArea;
    let visibleCount = 0;

    requestAnimationFrame(() => {
      // Make sure forEachObject exists before calling it
      if (typeof canvas.forEachObject !== 'function') return;
      
      canvas.forEachObject((obj) => {
        if (!obj) return;
        
        // Safe property access with null checks
        const isGrid = (obj as any)?.isGrid;
        if (isGrid) return;
        
        // Only call getBoundingRect if object exists and method is available
        let bounds;
        try {
          if (obj && typeof obj.getBoundingRect === 'function') {
            bounds = obj.getBoundingRect();
          } else {
            // Fallback if getBoundingRect is unavailable
            bounds = { 
              left: obj.left || 0, 
              top: obj.top || 0, 
              width: obj.width || 0, 
              height: obj.height || 0 
            };
          }
        } catch (e) {
          // In case getBoundingRect throws an error
          bounds = { left: 0, top: 0, width: 0, height: 0 };
          console.warn("Error getting object bounds:", e);
        }
        
        const isVisible = !(
          bounds.left > visibleArea.right ||
          bounds.top > visibleArea.bottom ||
          bounds.left + bounds.width < visibleArea.left ||
          bounds.top + bounds.height < visibleArea.top
        );

        // Only set visible property if it exists on the object
        if (obj && isVisible !== obj.visible) {
          obj.visible = isVisible;
          if (typeof obj.setCoords === 'function') {
            obj.setCoords();
          }
        }

        if (isVisible) visibleCount++;
      });

      setVisibleObjectCount(visibleCount);
      canvas.requestRenderAll();
    });
  }, [fabricCanvasRef, needsVirtualization, paddingPx, viewportWidth, viewportHeight]);

  return {
    needsVirtualization,
    visibleArea: visibleAreaRef.current,
    visibleObjectCount,
    updateVirtualization,
    setVirtualization: setNeedsVirtualization
  };
};
