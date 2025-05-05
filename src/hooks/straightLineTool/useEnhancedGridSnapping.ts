
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseEnhancedGridSnappingOptions {
  initialSnapEnabled?: boolean;
  gridSize?: number;
  snapThreshold?: number;
}

/**
 * Enhanced grid snapping hook with additional functionality
 */
export const useEnhancedGridSnapping = ({
  initialSnapEnabled = true,
  gridSize = 20,
  snapThreshold = 10
}: UseEnhancedGridSnappingOptions = {}) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [gridSizeState] = useState(gridSize);
  const [snapThresholdState] = useState(snapThreshold);

  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;

    // Calculate nearest grid points
    const nearestX = Math.round(point.x / gridSizeState) * gridSizeState;
    const nearestY = Math.round(point.y / gridSizeState) * gridSizeState;
    
    // Calculate distances to nearest grid points
    const distX = Math.abs(point.x - nearestX);
    const distY = Math.abs(point.y - nearestY);
    
    // Only snap if within threshold
    return {
      x: distX <= snapThresholdState ? nearestX : point.x,
      y: distY <= snapThresholdState ? nearestY : point.y
    };
  }, [snapEnabled, gridSizeState, snapThresholdState]);

  const isSnappedToGrid = useCallback((point: Point, snappedPoint: Point): boolean => {
    return point.x !== snappedPoint.x || point.y !== snappedPoint.y;
  }, []);

  return {
    snapEnabled,
    setSnapEnabled,
    snapToGrid,
    toggleGridSnapping,
    isSnappedToGrid
  };
};

export default useEnhancedGridSnapping;
