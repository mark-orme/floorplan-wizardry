
/**
 * Hook for managing grid snapping in canvas operations
 * @module hooks/canvas/useGridSnapping
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import type { Point } from '@/types/core/Point';

/**
 * Hook for grid snapping functionality
 * @param canvasRef - Reference to the fabric canvas
 * @returns Object with snapping functions and state
 */
export const useGridSnapping = (canvasRef: React.MutableRefObject<FabricCanvas | null>) => {
  const { snapEnabled, snapPointToGrid, snapLineToGrid, isSnappedToGrid } = useSnapToGrid();

  /**
   * Snap an object to the grid
   * @param object - Fabric object to snap
   */
  const snapObjectToGrid = useCallback((object: any) => {
    if (!snapEnabled || !object) return;

    const left = Math.round(object.left / 20) * 20;
    const top = Math.round(object.top / 20) * 20;

    object.set({
      left,
      top
    });

    if (canvasRef.current) {
      canvasRef.current.requestRenderAll();
    }
  }, [snapEnabled, canvasRef]);

  /**
   * Enable grid snapping
   */
  const enableGridSnapping = useCallback(() => {
    if (!canvasRef.current) return;

    canvasRef.current.on('object:moving', (e) => {
      if (snapEnabled && e.target) {
        snapObjectToGrid(e.target);
      }
    });

    canvasRef.current.on('object:scaling', (e) => {
      if (snapEnabled && e.target) {
        // Apply snapping for scaling operations
        // Implementation depends on specific requirements
      }
    });
  }, [canvasRef, snapEnabled, snapObjectToGrid]);

  /**
   * Disable grid snapping
   */
  const disableGridSnapping = useCallback(() => {
    if (!canvasRef.current) return;

    canvasRef.current.off('object:moving');
    canvasRef.current.off('object:scaling');
  }, [canvasRef]);

  return {
    snapEnabled,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    snapObjectToGrid,
    enableGridSnapping,
    disableGridSnapping
  };
};
