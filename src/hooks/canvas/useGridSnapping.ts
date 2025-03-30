
import { useCallback, useMemo } from "react";
import { Point } from "@/types/drawingTypes";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { useDrawingContext } from "@/contexts/DrawingContext";

/**
 * Hook for grid snapping functionality
 */
export const useGridSnapping = () => {
  const { snapToGrid } = useDrawingContext();
  
  /**
   * Snap a point to the grid
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} [gridSize] - Optional grid size (defaults to small grid size)
   * @returns {Point} Snapped point coordinates
   */
  const snapPointToGrid = useCallback((x: number, y: number, gridSize?: number): Point => {
    if (!snapToGrid) return { x, y };
    
    const snapSize = gridSize || GRID_CONSTANTS.SMALL_GRID_SIZE;
    
    return {
      x: Math.round(x / snapSize) * snapSize,
      y: Math.round(y / snapSize) * snapSize
    };
  }, [snapToGrid]);
  
  /**
   * Snap a line to the grid
   * @param {Point} start - Start point
   * @param {Point} end - End point
   * @returns {Object} Object with snapped start and end points
   */
  const snapLineToGrid = useCallback((start: Point, end: Point): { start: Point, end: Point } => {
    if (!snapToGrid) return { start, end };
    
    return {
      start: snapPointToGrid(start.x, start.y),
      end: snapPointToGrid(end.x, end.y)
    };
  }, [snapToGrid, snapPointToGrid]);
  
  /**
   * Check if a point is already on a grid point
   * @param {Point} point - Point to check
   * @returns {boolean} Whether the point is on a grid point
   */
  const isOnGridPoint = useCallback((point: Point): boolean => {
    if (!snapToGrid) return false;
    
    const snapSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
    const snappedPoint = snapPointToGrid(point.x, point.y, snapSize);
    
    return point.x === snappedPoint.x && point.y === snappedPoint.y;
  }, [snapToGrid, snapPointToGrid]);
  
  return useMemo(() => ({
    snapPointToGrid,
    snapLineToGrid,
    isOnGridPoint,
    snapToGrid
  }), [snapPointToGrid, snapLineToGrid, isOnGridPoint, snapToGrid]);
};
