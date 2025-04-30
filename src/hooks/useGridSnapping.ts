
import { useCallback, useState } from 'react';
import { Point, GRID_CONSTANTS } from '@/types/fabric-unified';

interface UseGridSnappingProps {
  initialSnapEnabled?: boolean;
  gridSize?: number;
  snapThreshold?: number;
}

export const useGridSnapping = ({
  initialSnapEnabled = true,
  gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE,
  snapThreshold = 5
}: UseGridSnappingProps = {}) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [gridSizeState, setGridSize] = useState(gridSize);
  const [snapThresholdState, setSnapThreshold] = useState(snapThreshold);
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  // Snap point to grid
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const newX = Math.round(point.x / gridSizeState) * gridSizeState;
    const newY = Math.round(point.y / gridSizeState) * gridSizeState;
    
    return { x: newX, y: newY };
  }, [snapEnabled, gridSizeState]);
  
  // Snap line to grid
  const snapLineToGrid = useCallback((startPoint: Point, endPoint: Point): { start: Point, end: Point } => {
    if (!snapEnabled) return { start: startPoint, end: endPoint };
    
    const snappedStart = snapPointToGrid(startPoint);
    const snappedEnd = snapPointToGrid(endPoint);
    
    return { start: snappedStart, end: snappedEnd };
  }, [snapEnabled, snapPointToGrid]);

  return {
    snapEnabled,
    setSnapEnabled,
    gridSize: gridSizeState,
    setGridSize,
    snapThreshold: snapThresholdState,
    setSnapThreshold,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid
  };
};
