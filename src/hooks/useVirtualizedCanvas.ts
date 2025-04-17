
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useVirtualizationEngine } from './useVirtualizationEngine';
import { useCanvasMetrics } from './useCanvasMetrics';

export const useVirtualizedCanvas = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: { 
    enabled?: boolean; 
    paddingPx?: number;
    objectLimit?: number;
  } = {}
) => {
  // Apply defaults for any missing options
  const mergedOptions = {
    enabled: options.enabled ?? true,
    paddingPx: options.paddingPx ?? 200,
    objectLimit: options.objectLimit ?? 500
  };
  
  const canvasWidth = useRef(800);
  const canvasHeight = useRef(600);
  
  // Update dimensions when needed
  const updateDimensions = useCallback(() => {
    if (fabricCanvasRef.current?.lowerCanvasEl) {
      canvasWidth.current = fabricCanvasRef.current.lowerCanvasEl.width || 800;
      canvasHeight.current = fabricCanvasRef.current.lowerCanvasEl.height || 600;
    }
  }, [fabricCanvasRef]);

  const { 
    visibleArea,
    visibleObjectCount,
    needsVirtualization,
    updateVirtualization,
    setVirtualization
  } = useVirtualizationEngine({
    fabricCanvasRef,
    viewportWidth: canvasWidth.current,
    viewportHeight: canvasHeight.current,
    paddingPx: mergedOptions.paddingPx
  });

  const { metrics, updateObjectCount } = useCanvasMetrics({
    fabricCanvasRef
  });

  const performanceMetrics = {
    ...metrics,
    visibleObjectCount
  };

  // Set up canvas optimization
  useEffect(() => {
    if (!fabricCanvasRef.current || !mergedOptions.enabled) return;
    
    updateDimensions();
    
    const canvas = fabricCanvasRef.current;
    canvas.renderOnAddRemove = false;
    canvas.skipTargetFind = needsVirtualization;
    canvas.enableRetinaScaling = true;
    
    canvas.forEachObject(obj => {
      obj.objectCaching = !['path', 'group'].includes(obj.type || '');
    });
    
    const cleanup = () => {
      canvas.renderOnAddRemove = true;
      canvas.skipTargetFind = false;
    };
    
    return cleanup;
  }, [fabricCanvasRef, mergedOptions.enabled, needsVirtualization, updateDimensions]);

  const refreshVirtualization = useCallback(() => {
    if (fabricCanvasRef.current && mergedOptions.enabled) {
      updateVirtualization();
    }
  }, [fabricCanvasRef, mergedOptions.enabled, updateVirtualization]);

  return {
    performanceMetrics,
    needsVirtualization,
    visibleArea,
    refreshVirtualization
  };
};
