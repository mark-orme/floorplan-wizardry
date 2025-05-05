
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseEnhancedGridSnappingProps {
  initialSnapEnabled?: boolean;
  gridSize?: number;
  snapThreshold?: number;
}

export const useEnhancedGridSnapping = ({
  initialSnapEnabled = true,
  gridSize = 20,
  snapThreshold = 10
}: UseEnhancedGridSnappingProps = {}) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [gridSizeState, setGridSize] = useState(gridSize);
  const [snapThresholdState, setSnapThreshold] = useState(snapThreshold);

  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    return {
      x: Math.round(point.x / gridSizeState) * gridSizeState,
      y: Math.round(point.y / gridSizeState) * gridSizeState
    };
  }, [snapEnabled, gridSizeState]);

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
    gridSize: gridSizeState,
    setGridSize,
    snapThreshold: snapThresholdState,
    setSnapThreshold,
    toggleGridSnapping,
    snapPointToGrid,
    snapLineToGrid
  };
};

export default useEnhancedGridSnapping;
