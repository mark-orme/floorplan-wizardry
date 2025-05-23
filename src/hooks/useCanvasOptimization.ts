
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

interface UseCanvasOptimizationProps {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
}

// Extended FabricObject interface to include dirty property
interface ExtendedFabricObject extends FabricObject {
  dirty?: boolean;
  objectCaching?: boolean;
  visible?: boolean;
}

export const useCanvasOptimization = ({ 
  canvasRef, 
  enabled = true 
}: UseCanvasOptimizationProps) => {
  const renderLoopActive = useRef(false);
  const lastRenderTime = useRef(0);
  const requestAnimationFrameId = useRef<number | null>(null);

  // Optimize off-screen objects
  const optimizeOffscreenObjects = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const vpt = canvas.viewportTransform;
    const zoom = canvas.getZoom();

    if (!vpt) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();

    // Add padding to ensure objects near edges are not optimized out
    const padding = 100;

    objects.forEach((obj: ExtendedFabricObject) => {
      if (!obj || !obj.getBoundingRect) return;

      const bounds = obj.getBoundingRect();
      if (!bounds) return;

      const isVisible = 
        bounds.left * zoom + (vpt[4] || 0) < (width || 0) + padding &&
        bounds.top * zoom + (vpt[5] || 0) < (height || 0) + padding &&
        bounds.left * zoom + bounds.width * zoom + (vpt[4] || 0) > -padding &&
        bounds.top * zoom + bounds.height * zoom + (vpt[5] || 0) > -padding;

      // Skip optimization for small objects
      const isSmall = bounds.width * zoom < 10 || bounds.height * zoom < 10;

      // Only set objectCaching for objects that need it
      if (obj.objectCaching !== !isSmall && obj.type !== 'group') {
        obj.objectCaching = !isSmall;
        if (obj.dirty !== undefined) {
          obj.dirty = true;
        }
      }

      // Skip rendering for off-screen objects
      if (obj.visible !== isVisible) {
        obj.visible = isVisible;
        if (obj.dirty !== undefined) {
          obj.dirty = true;
        }
      }
    });
  }, [canvasRef]);

  // Implement a better optimization for layers
  const optimizeLayers = useCallback((layerRef: React.MutableRefObject<any>) => {
    const layer = layerRef.current;
    if (!layer) return; // Add null check
    
    // Now these lines won't throw errors
    layer.objectCaching = false;
    layer.selectable = false;
    layer.evented = false;
    layer.hoverCursor = 'default';
  }, []);

  // Batch rendering
  const startRenderLoop = useCallback(() => {
    if (renderLoopActive.current) return;

    renderLoopActive.current = true;
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        renderLoopActive.current = false;
        return;
      }

      // Only render if canvas is not being rendered elsewhere
      if (canvas.renderOnAddRemove) {
        canvas.renderAll?.();
      }

      // Measure render time for performance monitoring
      const now = performance.now();
      lastRenderTime.current = now - (lastRenderTime.current || now);

      requestAnimationFrameId.current = requestAnimationFrame(render);
    };

    requestAnimationFrameId.current = requestAnimationFrame(render);
  }, [canvasRef]);

  const stopRenderLoop = useCallback(() => {
    if (requestAnimationFrameId.current !== null) {
      cancelAnimationFrame(requestAnimationFrameId.current);
      requestAnimationFrameId.current = null;
    }
    renderLoopActive.current = false;
  }, []);

  // Apply optimizations when component mounts
  useEffect(() => {
    if (!enabled) return;

    // Initial optimization setup
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set up canvas optimization properties
    canvas.renderOnAddRemove = false;
    canvas.skipTargetFind = false;
    if ('skipOffscreen' in canvas) {
      (canvas as any).skipOffscreen = true;
    }

    optimizeOffscreenObjects();
    startRenderLoop();

    // Clean up
    return () => {
      stopRenderLoop();
      if (canvas) {
        canvas.renderOnAddRemove = true;
        if ('skipOffscreen' in canvas) {
          (canvas as any).skipOffscreen = false;
        }
      }
    };
  }, [canvasRef, enabled, optimizeOffscreenObjects, startRenderLoop, stopRenderLoop]);

  return {
    optimizeOffscreenObjects,
    optimizeLayers,
    startRenderLoop,
    stopRenderLoop,
    lastRenderTime: lastRenderTime.current
  };
};

export default useCanvasOptimization;
