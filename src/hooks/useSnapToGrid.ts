
/**
 * Hook for managing grid snapping functionality
 * @module hooks/useSnapToGrid
 */
import { useCallback } from 'react';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { useDrawingContext } from '@/contexts/DrawingContext';
import type { Point } from '@/types/core/Point';

/**
 * Hook for grid snapping functionality
 * @returns Object with snapping functions
 */
export const useSnapToGrid = () => {
  // Get snap to grid setting from context
  const { snapToGrid } = useDrawingContext();

  /**
   * Snap a point to the nearest grid point
   * @param point - Point to snap
   * @returns Snapped point
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapToGrid) return point;

    const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    
    // Snap to nearest grid point
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapToGrid]);

  /**
   * Constrain a line to horizontal, vertical, or diagonal
   * @param start - Start point of line
   * @param end - End point of line
   * @returns Constrained start and end points
   */
  const snapLineToGrid = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    if (!snapToGrid) return { start, end };

    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    
    // Determine line angle constraint
    if (dx > dy * 2) {
      // Horizontal constraint
      return {
        start,
        end: { x: end.x, y: start.y }
      };
    } else if (dy > dx * 2) {
      // Vertical constraint
      return {
        start,
        end: { x: start.x, y: end.y }
      };
    } else {
      // Diagonal constraint (45 degrees)
      const distance = Math.min(dx, dy);
      const directionX = end.x > start.x ? 1 : -1;
      const directionY = end.y > start.y ? 1 : -1;
      
      return {
        start,
        end: {
          x: start.x + distance * directionX,
          y: start.y + distance * directionY
        }
      };
    }
  }, [snapToGrid]);

  return {
    snapEnabled: snapToGrid,
    snapPointToGrid,
    snapLineToGrid
  };
};
