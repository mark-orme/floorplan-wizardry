
import { useCallback, useState } from 'react';
import { GRID_CONSTANTS } from '@/types/fabric-unified';
import { Point } from '@/types/core/Point';

interface UseEnhancedGridSnappingProps {
  initialSnapEnabled?: boolean;
  gridSize?: number;
  snapThreshold?: number;
}

/**
 * Enhanced grid snapping hook with improved performance
 */
export const useEnhancedGridSnapping = ({
  initialSnapEnabled = true,
  gridSize = 10,
  snapThreshold = 5
}: UseEnhancedGridSnappingProps = {}) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [currentGridSize, setGridSize] = useState(gridSize);
  const [currentSnapThreshold, setSnapThreshold] = useState(snapThreshold);
  
  // Use a numerical value for gridSize, not the object
  const defaultGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
  
  /**
   * Toggle grid snapping on/off
   */
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the nearest grid intersection
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const snapSize = currentGridSize || defaultGridSize;
    
    return {
      x: Math.round(point.x / snapSize) * snapSize,
      y: Math.round(point.y / snapSize) * snapSize
    };
  }, [snapEnabled, currentGridSize, defaultGridSize]);
  
  /**
   * Snap a line to the grid (both endpoints)
   */
  const snapLineToGrid = useCallback((start: Point, end: Point): { start: Point; end: Point } => {
    if (!snapEnabled) return { start, end };
    
    return {
      start: snapPointToGrid(start),
      end: snapPointToGrid(end)
    };
  }, [snapEnabled, snapPointToGrid]);
  
  return {
    snapEnabled,
    setSnapEnabled,
    gridSize: currentGridSize,
    setGridSize,
    snapThreshold: currentSnapThreshold,
    setSnapThreshold,
    toggleSnap: toggleGridSnapping,
    snapPointToGrid,
    snapLineToGrid
  };
};
