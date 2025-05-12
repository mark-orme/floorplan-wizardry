
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

    const zoom = canvas.getZoom() || 1;
    const visibleArea = {
      left: (-vpt[4] / zoom) - paddingPx,
      top: (-vpt[5] / zoom) - paddingPx,
      right: ((-vpt[4] + (canvas.width ?? viewportWidth)) / zoom) + paddingPx,
      bottom: ((-vpt[5] + (canvas.height ?? viewportHeight)) / zoom) + paddingPx
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
        const bounds = obj && typeof obj.getBoundingRect === 'function' ? 
          obj.getBoundingRect() : 
          { left: 0, top: 0, width: 0, height: 0 };
        
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
