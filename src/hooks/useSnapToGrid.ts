
/**
 * Hook for grid snapping functionality
 * @module hooks/useSnapToGrid
 */
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Geometry';
import { calculateAngle } from '@/utils/geometryUtils';

interface SnapOptions {
  gridSize: number;
  snapToAngle: boolean;
  angleThreshold: number;
}

/**
 * Hook for snapping points and lines to grid
 * @param fabricCanvasRef Reference to the canvas
 * @returns Grid snapping functions
 */
export const useSnapToGrid = (
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>
) => {
  // Default grid size
  const defaultGridSize = 20;
  
  // State to track if snapping is enabled
  const [snapEnabled, setSnapEnabled] = useState(true);
  
  // State to track if we auto-straightened the last line
  const [isAutoStraightened, setIsAutoStraightened] = useState(false);
  
  // Toggle snap functionality
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the nearest grid intersection
   * @param point Point to snap
   * @param gridSize Grid size in pixels
   * @returns Snapped point
   */
  const snapPointToGrid = useCallback((point: Point, gridSize: number = defaultGridSize): Point => {
    // If snapping is disabled, return the original point
    if (!snapEnabled) {
      return { ...point };
    }
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled]);
  
  /**
   * Snap a line to grid and straighten if close to horizontal, vertical, or 45°
   * @param start Start point of the line
   * @param end End point of the line
   * @param options Snapping options
   * @returns Snapped start and end points
   */
  const snapLineToGrid = useCallback((
    start: Point, 
    end: Point, 
    options: Partial<SnapOptions> = {}
  ): { start: Point, end: Point } => {
    // Default options
    const {
      gridSize = defaultGridSize,
      snapToAngle = true,
      angleThreshold = 10
    } = options;
    
    // If snapping is disabled, return the original points
    if (!snapEnabled) {
      return { 
        start: { ...start }, 
        end: { ...end } 
      };
    }
    
    // Snap endpoints to grid
    const snappedStart = snapPointToGrid(start, gridSize);
    const snappedEnd = snapPointToGrid(end, gridSize);
    
    // If angle snapping is disabled, return grid-snapped points
    if (!snapToAngle) {
      setIsAutoStraightened(false);
      return { start: snappedStart, end: snappedEnd };
    }
    
    // Calculate angle of line
    const angle = calculateAngle(snappedStart, snappedEnd);
    
    // Check if close to horizontal, vertical, or 45° angles
    const isNearHorizontal = Math.abs(angle) < angleThreshold || 
                             Math.abs(angle - 180) < angleThreshold || 
                             Math.abs(angle + 180) < angleThreshold;
                             
    const isNearVertical = Math.abs(angle - 90) < angleThreshold || 
                           Math.abs(angle + 90) < angleThreshold;
                           
    const isNear45 = Math.abs(angle - 45) < angleThreshold || 
                     Math.abs(angle + 45) < angleThreshold || 
                     Math.abs(angle - 135) < angleThreshold || 
                     Math.abs(angle + 135) < angleThreshold;
    
    let straightenedEnd = { ...snappedEnd };
    let didStraighten = false;
    
    // Straighten line if close to cardinal or 45° angles
    if (isNearHorizontal) {
      straightenedEnd.y = snappedStart.y; // Keep y the same as start point
      didStraighten = true;
    } else if (isNearVertical) {
      straightenedEnd.x = snappedStart.x; // Keep x the same as start point
      didStraighten = true;
    } else if (isNear45) {
      // Make it exactly 45°
      const dx = snappedEnd.x - snappedStart.x;
      const dy = snappedEnd.y - snappedStart.y;
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      const signX = dx > 0 ? 1 : -1;
      const signY = dy > 0 ? 1 : -1;
      
      straightenedEnd = {
        x: snappedStart.x + distance * signX,
        y: snappedStart.y + distance * signY
      };
      
      // Snap the end point back to grid after straightening
      straightenedEnd = snapPointToGrid(straightenedEnd, gridSize);
      didStraighten = true;
    }
    
    setIsAutoStraightened(didStraighten);
    
    return {
      start: snappedStart,
      end: straightenedEnd
    };
  }, [snapEnabled, snapPointToGrid]);
  
  /**
   * Check if a point is snapped to the grid
   * @param point Point to check
   * @param threshold Maximum distance to be considered snapped
   * @returns True if the point is snapped to grid
   */
  const isSnappedToGrid = useCallback((point: Point, threshold: number = 0.5): boolean => {
    if (!snapEnabled) return false;
    
    const snappedPoint = snapPointToGrid(point);
    const dx = Math.abs(point.x - snappedPoint.x);
    const dy = Math.abs(point.y - snappedPoint.y);
    
    return dx <= threshold && dy <= threshold;
  }, [snapEnabled, snapPointToGrid]);
  
  return {
    snapEnabled,
    isAutoStraightened,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid
  };
};
