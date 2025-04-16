
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';

const DEFAULT_GRID_SIZE = 20;

interface UseSnapToGridProps {
  gridSize?: number;
  enabled?: boolean;
}

export const useSnapToGrid = ({ 
  gridSize = DEFAULT_GRID_SIZE, 
  enabled = true 
}: UseSnapToGridProps = {}) => {
  /**
   * Snap a point to the nearest grid intersection
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!enabled) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [gridSize, enabled]);
  
  /**
   * Snap both ends of a line to the grid
   */
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!enabled) return { start, end };
    
    return {
      start: snapPointToGrid(start),
      end: snapPointToGrid(end)
    };
  }, [snapPointToGrid, enabled]);
  
  return {
    snapPointToGrid,
    snapLineToGrid,
    gridSize
  };
};
