
/**
 * Custom hook for grid snapping functionality
 * Provides utilities for snapping points and lines to grid
 * @module useSnapToGrid
 */
import { useCallback, useState } from "react";
import { Point } from "@/types/drawingTypes";
import { snapToGrid, snapToAngle, snapLineToStandardAngles } from "@/utils/grid/snapping";
import { GRID_SPACING } from "@/constants/numerics";

/**
 * Hook return type for useSnapToGrid
 * @interface UseSnapToGridReturn
 */
interface UseSnapToGridReturn {
  /** Whether snapping to grid is enabled */
  snapEnabled: boolean;
  /** Toggle grid snapping on/off */
  toggleSnap: () => void;
  /** Snap a point to the nearest grid intersection */
  snapPointToGrid: (point: Point) => Point;
  /** Snap a line to standard angles */
  snapLineToGrid: (startPoint: Point, endPoint: Point) => Point;
  /** Whether the current point is snapped to grid */
  isSnappedToGrid: (point: Point, originalPoint: Point) => boolean;
  /** Whether the current line is straightened */
  isAutoStraightened: (startPoint: Point, endPoint: Point, originalEnd: Point) => boolean;
}

/**
 * Hook for managing grid snapping operations
 * Provides utilities to snap points and lines to grid and standard angles
 * 
 * @returns {UseSnapToGridReturn} Grid snapping utilities
 */
export const useSnapToGrid = (): UseSnapToGridReturn => {
  // State to track whether snapping is enabled (default: true)
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  
  /**
   * Toggle grid snapping on/off
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the nearest grid intersection if snapping is enabled
   * 
   * @param {Point} point - Point to snap
   * @returns {Point} Snapped point or original point if snapping disabled
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    return snapToGrid(point, GRID_SPACING);
  }, [snapEnabled]);
  
  /**
   * Snap a line to standard angles if snapping is enabled
   * Uses the start point as anchor and adjusts the end point
   * 
   * @param {Point} startPoint - Line start point (anchor)
   * @param {Point} endPoint - Line end point to adjust
   * @returns {Point} Snapped end point or original end point if snapping disabled
   */
  const snapLineToGrid = useCallback((startPoint: Point, endPoint: Point): Point => {
    if (!snapEnabled) return endPoint;
    
    // First snap the endpoint to grid
    const snappedEnd = snapToGrid(endPoint, GRID_SPACING);
    
    // Then apply angle snapping
    return snapLineToStandardAngles(startPoint, snappedEnd);
  }, [snapEnabled]);
  
  /**
   * Check if a point is snapped to grid
   * Compares original point to snapped point to determine if snapping occurred
   * 
   * @param {Point} snappedPoint - Point after snapping
   * @param {Point} originalPoint - Original point before snapping
   * @returns {boolean} True if point was snapped (modified)
   */
  const isSnappedToGrid = useCallback((snappedPoint: Point, originalPoint: Point): boolean => {
    if (!snapEnabled) return false;
    
    const threshold = 1.5; // Small threshold to account for rounding errors
    
    return (
      Math.abs(snappedPoint.x - originalPoint.x) > threshold ||
      Math.abs(snappedPoint.y - originalPoint.y) > threshold
    );
  }, [snapEnabled]);
  
  /**
   * Check if a line was automatically straightened
   * Compares the straightened endpoint to the original endpoint
   * 
   * @param {Point} startPoint - Line start point
   * @param {Point} straightenedEnd - End point after straightening
   * @param {Point} originalEnd - Original end point before straightening
   * @returns {boolean} True if line was straightened
   */
  const isAutoStraightened = useCallback(
    (startPoint: Point, straightenedEnd: Point, originalEnd: Point): boolean => {
      if (!snapEnabled) return false;
      
      // Check if original end point was snapped to grid first
      const snappedOriginal = snapToGrid(originalEnd, GRID_SPACING);
      
      // Calculate angles from start to both endpoints
      const originalAngle = Math.atan2(
        snappedOriginal.y - startPoint.y,
        snappedOriginal.x - startPoint.x
      ) * (180 / Math.PI);
      
      const straightenedAngle = Math.atan2(
        straightenedEnd.y - startPoint.y,
        straightenedEnd.x - startPoint.x
      ) * (180 / Math.PI);
      
      // Check if angles are different (line was straightened)
      return Math.abs(originalAngle - straightenedAngle) > 1;
    },
    [snapEnabled]
  );
  
  return {
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    isAutoStraightened
  };
};
