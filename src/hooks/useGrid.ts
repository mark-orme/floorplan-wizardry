
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

export const useGrid = (gridSize = GRID_CONSTANTS.DEFAULT_GRID_SIZE) => {
  const snapToGrid = useCallback((point: Point): Point => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [gridSize]);

  const calculateGridDimensions = useCallback((width: number, height: number) => {
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);
    
    return {
      cols,
      rows,
      totalLines: cols + rows,
      width,
      height
    };
  }, [gridSize]);

  return {
    snapToGrid,
    calculateGridDimensions,
    gridSize
  };
};
