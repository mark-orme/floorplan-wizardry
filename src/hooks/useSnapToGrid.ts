
/**
 * Custom hook for grid snapping functionality
 * Provides utilities for snapping points and lines to grid
 * @module useSnapToGrid
 */
import { useCallback, useState } from "react";
import { Point } from "@/types/drawingTypes";
import { snapToGrid, snapToAngle, snapLineToStandardAngles } from "@/utils/grid/snapping";
import { getNearestGridPoint } from "@/utils/gridUtils";
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
    console.log(`Grid snapping ${!snapEnabled ? 'enabled' : 'disabled'}`);
  }, [snapEnabled]);
  
  /**
   * Snap a point to the nearest grid intersection if snapping is enabled
   * 
   * @param {Point} point - Point to snap
   * @returns {Point} Snapped point or original point if snapping disabled
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled || !point) return point;
    
    // Use the utility function from gridUtils.ts
    return getNearestGridPoint(point, GRID_SPACING);
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
    if (!snapEnabled || !startPoint || !endPoint) return endPoint;
    
    // First snap the endpoint to grid
    const snappedEnd = getNearestGridPoint(endPoint, GRID_SPACING);
    
    // Calculate the angle between points
    const dx = snappedEnd.x - startPoint.x;
    const dy = snappedEnd.y - startPoint.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Quantize to nearest 45° angle
    const quantizedAngle = Math.round(angle / 45) * 45;
    
    // Convert back to radians
    const quantizedRad = quantizedAngle * (Math.PI / 180);
    
    // Calculate the distance between the points
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Return the new end point along the quantized angle
    return {
      x: startPoint.x + distance * Math.cos(quantizedRad),
      y: startPoint.y + distance * Math.sin(quantizedRad)
    };
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
    if (!snapEnabled || !snappedPoint || !originalPoint) return false;
    
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
      if (!snapEnabled || !startPoint || !straightenedEnd || !originalEnd) return false;
      
      // Check if original end point was snapped to grid first
      const snappedOriginal = getNearestGridPoint(originalEnd, GRID_SPACING);
      
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
