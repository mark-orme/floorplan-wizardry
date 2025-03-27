
/**
 * Grid snapping hook
 * Provides functions for snapping points to a grid
 * @module hooks/useSnapToGrid
 */
import { useCallback } from 'react';
import { Point } from '@/types/drawingTypes';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Default grid spacing
 */
const DEFAULT_GRID_SPACING = GRID_CONSTANTS.GRID_SPACING;

/**
 * Result type for the snap to grid hook
 */
interface UseSnapToGridResult {
  /** Snap a single point to the grid */
  snapPointToGrid: (point: Point, gridSize?: number) => Point;
  /** Snap multiple points to the grid */
  snapPointsToGrid: (points: Point[], gridSize?: number) => Point[];
}

/**
 * Hook for grid snapping operations
 * @returns Functions for snapping points to grid
 */
export const useSnapToGrid = (): UseSnapToGridResult => {
  /**
   * Snap a point to the nearest grid point
   * 
   * @param point - Point to snap
   * @param gridSize - Grid spacing
   * @returns Snapped point
   */
  const snapPointToGrid = useCallback((
    point: Point,
    gridSize: number = DEFAULT_GRID_SPACING
  ): Point => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, []);
  
  /**
   * Snap multiple points to the grid
   * 
   * @param points - Array of points to snap
   * @param gridSize - Grid spacing
   * @returns Array of snapped points
   */
  const snapPointsToGrid = useCallback((
    points: Point[],
    gridSize: number = DEFAULT_GRID_SPACING
  ): Point[] => {
    return points.map(point => snapPointToGrid(point, gridSize));
  }, [snapPointToGrid]);
  
  return {
    snapPointToGrid,
    snapPointsToGrid
  };
};
