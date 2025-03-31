
/**
 * Hook for grid snapping functionality
 * @module hooks/useSnapToGrid
 */
import { useCallback } from 'react';
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
  
  /**
   * Snap a point to the nearest grid intersection
   * @param point Point to snap
   * @param gridSize Grid size in pixels
   * @returns Snapped point
   */
  const snapPointToGrid = useCallback((point: Point, gridSize: number = defaultGridSize): Point => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, []);
  
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
    
    // Snap endpoints to grid
    const snappedStart = snapPointToGrid(start, gridSize);
    const snappedEnd = snapPointToGrid(end, gridSize);
    
    // If angle snapping is disabled, return grid-snapped points
    if (!snapToAngle) {
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
    
    // Straighten line if close to cardinal or 45° angles
    if (isNearHorizontal) {
      straightenedEnd.y = snappedStart.y; // Keep y the same as start point
    } else if (isNearVertical) {
      straightenedEnd.x = snappedStart.x; // Keep x the same as start point
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
    }
    
    return {
      start: snappedStart,
      end: straightenedEnd
    };
  }, [snapPointToGrid]);
  
  return {
    snapPointToGrid,
    snapLineToGrid
  };
};
