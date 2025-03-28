
/**
 * Hook for grid snapping functionality
 * @module useSnapToGrid
 */
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { GRID_SPACING, SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Result of the useSnapToGrid hook
 */
export interface UseSnapToGridResult {
  snapPointToGrid: (point: Point, gridSize?: number) => Point;
  snapPointsToGrid: (points: Point[], gridSize?: number) => Point[];
  snapLineToGrid: (startPoint: Point, endPoint: Point) => Point;
  isSnappedToGrid: (point: Point, originalPoint: Point) => boolean;
  isAutoStraightened: (startPoint: Point, endPoint: Point, originalEndPoint: Point) => boolean;
  snapEnabled: boolean;
  toggleSnap: () => void;
}

/**
 * Hook for snapping points to grid
 * @returns Snapping utility functions
 */
export const useSnapToGrid = (): UseSnapToGridResult => {
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  
  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the nearest grid point
   * @param point - Point to snap
   * @param gridSize - Grid size (optional, defaults to small grid)
   * @returns Snapped point
   */
  const snapPointToGrid = useCallback((point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
    if (!snapEnabled) return point;
    
    // Round to nearest grid point
    const gridX = Math.round(point.x / gridSize) * gridSize;
    const gridY = Math.round(point.y / gridSize) * gridSize;
    
    return { x: gridX, y: gridY } as Point;
  }, [snapEnabled]);
  
  /**
   * Snap multiple points to grid
   * @param points - Array of points to snap
   * @param gridSize - Grid size (optional, defaults to small grid)
   * @returns Array of snapped points
   */
  const snapPointsToGrid = useCallback((points: Point[], gridSize: number = GRID_SPACING.SMALL): Point[] => {
    if (!snapEnabled) return points;
    
    return points.map(point => snapPointToGrid(point, gridSize));
  }, [snapEnabled, snapPointToGrid]);
  
  /**
   * Snap a line to standard angles (0, 45, 90 degrees)
   * @param startPoint - Line start point
   * @param endPoint - Line end point
   * @returns Adjusted end point for standard angle
   */
  const snapLineToGrid = useCallback((startPoint: Point, endPoint: Point): Point => {
    if (!snapEnabled) return endPoint;
    
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    
    // If the distance is very small, just return the original point
    if (Math.abs(dx) < SNAP_THRESHOLD && Math.abs(dy) < SNAP_THRESHOLD) {
      return endPoint;
    }
    
    // Calculate angle
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Round to nearest 45 degrees (π/4 radians)
    const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    
    // Calculate new end point based on standard angle
    const newEndX = startPoint.x + Math.cos(snapAngle) * distance;
    const newEndY = startPoint.y + Math.sin(snapAngle) * distance;
    
    // Snap this to grid as well
    return snapPointToGrid({ x: newEndX, y: newEndY } as Point);
  }, [snapEnabled, snapPointToGrid]);
  
  /**
   * Check if a point is snapped to grid
   * @param point - Point to check
   * @param originalPoint - Original unsnapped point
   * @returns Whether the point is snapped
   */
  const isSnappedToGrid = useCallback((point: Point, originalPoint: Point): boolean => {
    if (!snapEnabled) return false;
    
    const snapped = snapPointToGrid(originalPoint);
    return point.x === snapped.x && point.y === snapped.y;
  }, [snapEnabled, snapPointToGrid]);
  
  /**
   * Check if a line is automatically straightened
   * @param startPoint - Line start point
   * @param endPoint - Current end point
   * @param originalEndPoint - Original unsnapped end point
   * @returns Whether the line is auto-straightened
   */
  const isAutoStraightened = useCallback((
    startPoint: Point, 
    endPoint: Point, 
    originalEndPoint: Point
  ): boolean => {
    if (!snapEnabled) return false;
    
    const snapped = snapLineToGrid(startPoint, originalEndPoint);
    return endPoint.x === snapped.x && endPoint.y === snapped.y;
  }, [snapEnabled, snapLineToGrid]);
  
  return {
    snapPointToGrid,
    snapPointsToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    isAutoStraightened,
    snapEnabled,
    toggleSnap
  };
};
