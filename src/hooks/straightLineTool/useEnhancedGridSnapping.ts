
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';

interface UseEnhancedGridSnappingProps {
  initialSnapEnabled?: boolean;
  gridSize?: number;
  snapThreshold?: number;
}

export const useEnhancedGridSnapping = ({
  initialSnapEnabled = true,
  gridSize = 20,
  snapThreshold = 5
}: UseEnhancedGridSnappingProps = {}) => {
  // State for grid snapping
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  /**
   * Toggle grid snapping
   */
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the grid
   * @param point - Point to snap
   * @returns Snapped point
   */
  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const snappedX = Math.round(point.x / gridSize) * gridSize;
    const snappedY = Math.round(point.y / gridSize) * gridSize;
    
    return { x: snappedX, y: snappedY };
  }, [snapEnabled, gridSize]);
  
  /**
   * Check if a point is near a grid line
   * @param point - Point to check
   * @returns True if the point is near a grid line
   */
  const isNearGridLine = useCallback((point: Point): boolean => {
    if (!snapEnabled) return false;
    
    const distToVertical = Math.min(
      Math.abs(point.x % gridSize),
      Math.abs(gridSize - (point.x % gridSize))
    );
    
    const distToHorizontal = Math.min(
      Math.abs(point.y % gridSize),
      Math.abs(gridSize - (point.y % gridSize))
    );
    
    return distToVertical <= snapThreshold || distToHorizontal <= snapThreshold;
  }, [snapEnabled, gridSize, snapThreshold]);
  
  /**
   * Get the closest grid point to a point
   * @param point - Point to check
   * @returns Closest grid point
   */
  const getClosestGridPoint = useCallback((point: Point): Point => {
    const gridX = Math.round(point.x / gridSize) * gridSize;
    const gridY = Math.round(point.y / gridSize) * gridSize;
    
    return { x: gridX, y: gridY };
  }, [gridSize]);
  
  return {
    snapEnabled,
    toggleGridSnapping,
    // Add toggleSnap as an alias for backward compatibility
    toggleSnap: toggleGridSnapping,
    snapToGrid,
    isNearGridLine,
    getClosestGridPoint
  };
};
