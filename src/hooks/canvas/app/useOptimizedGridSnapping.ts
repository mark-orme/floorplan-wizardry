
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { SMALL_GRID_SIZE, GridSize } from '@/constants/gridConstants';

/**
 * Hook for optimized grid snapping functionality
 * @returns Grid snapping utilities
 */
export const useOptimizedGridSnapping = () => {
  /**
   * Snap a point to the nearest grid intersection
   * @param point Point to snap
   * @param gridSize Grid size in pixels
   * @returns Snapped point
   */
  const snapPointToGrid = useCallback((point: Point, gridSize: number = GridSize.SMALL): Point => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, []);

  /**
   * Check if a point is close to a grid line
   * @param point Point to check
   * @param gridSize Grid size in pixels
   * @param threshold Distance threshold in pixels
   * @returns Whether the point is close to a grid line
   */
  const isCloseToGridLine = useCallback((
    point: Point, 
    gridSize: number = GridSize.SMALL, 
    threshold: number = 5
  ): boolean => {
    const distanceX = point.x % gridSize;
    const distanceY = point.y % gridSize;
    
    return (
      distanceX <= threshold || 
      distanceX >= gridSize - threshold || 
      distanceY <= threshold || 
      distanceY >= gridSize - threshold
    );
  }, []);

  return {
    snapPointToGrid,
    isCloseToGridLine
  };
};
