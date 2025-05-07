import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseOptimizedCanvasProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
}

/**
 * Hook to apply performance optimizations to the canvas
 */
export const useOptimizedCanvas = ({ fabricCanvasRef, enabled = true }: UseOptimizedCanvasProps) => {
  const enableOptimizations = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Apply optimizations to canvas
    canvas.renderOnAddRemove = false;
    canvas.skipTargetFind = true;
    
    // Add null check before calling methods
    if (canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef]);
  
  const disableOptimizations = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Revert optimizations
    canvas.renderOnAddRemove = true;
    canvas.skipTargetFind = false;
    
    // Add null check before calling methods
    if (canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef]);

  useEffect(() => {
    if (enabled) {
      enableOptimizations();
    } else {
      disableOptimizations();
    }

    return () => {
      disableOptimizations();
    };
  }, [enabled, enableOptimizations, disableOptimizations]);

  return {
    enableOptimizations,
    disableOptimizations
  };
};
