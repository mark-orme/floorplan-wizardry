
import { useCallback, useMemo } from "react";
import type { Point } from "@/types/drawingTypes";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { useSnapToGrid } from "@/hooks/useSnapToGrid";

/**
 * Hook for grid snapping functionality
 */
export const useGridSnapping = () => {
  const { snapToGrid } = useDrawingContext();
  const { 
    snapPointToGrid: baseSnapPointToGrid, 
    snapLineToGrid: baseSnapLineToGrid, 
    isSnappedToGrid 
  } = useSnapToGrid();
  
  /**
   * Snap a point to the grid
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} [gridSize] - Optional grid size (defaults to small grid size)
   * @returns {Point} Snapped point coordinates
   */
  const snapPointToGrid = useCallback((x: number, y: number, gridSize?: number): Point => {
    if (!snapToGrid) return { x, y };
    
    // Use the base implementation from useSnapToGrid
    return baseSnapPointToGrid({ x, y });
  }, [snapToGrid, baseSnapPointToGrid]);
  
  /**
   * Snap a line to the grid
   * @param {Point} start - Start point
   * @param {Point} end - End point
   * @returns {Object} Object with snapped start and end points
   */
  const snapLineToGrid = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    if (!snapToGrid) return { start, end };
    
    // Use the base implementation from useSnapToGrid
    return baseSnapLineToGrid(start, end);
  }, [snapToGrid, baseSnapLineToGrid]);
  
  /**
   * Check if a point is already on a grid point
   * @param {Point} point - Point to check
   * @returns {boolean} Whether the point is on a grid point
   */
  const isOnGridPoint = useCallback((point: Point): boolean => {
    if (!snapToGrid) return false;
    
    // Use the base implementation from useSnapToGrid
    return isSnappedToGrid(point);
  }, [snapToGrid, isSnappedToGrid]);
  
  return useMemo(() => ({
    snapPointToGrid,
    snapLineToGrid,
    isOnGridPoint,
    snapToGrid
  }), [snapPointToGrid, snapLineToGrid, isOnGridPoint, snapToGrid]);
};
