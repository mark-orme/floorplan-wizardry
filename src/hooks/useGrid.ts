
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createGrid } from '@/utils/grid/gridRenderers';
import { GridLine } from '@/utils/grid/gridTypes';

/**
 * Hook for working with canvas grids
 */
export const useGrid = () => {
  const createGridCallback = useCallback((canvas: FabricCanvas, gridSize: number = 50): GridLine[] => {
    return createGrid(canvas, { spacing: gridSize }) as GridLine[];
  }, []);
  
  return {
    createGrid: createGridCallback
  };
};
