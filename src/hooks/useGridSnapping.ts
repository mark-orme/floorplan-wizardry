
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { createPoint } from '@/utils/pointHelpers';

interface UseGridSnappingResult {
  snapEnabled: boolean;
  toggleSnap: () => void;
  snapPointToGrid: (point: Point) => Point;
  snapLineToGrid: (start: Point, end: Point) => { start: Point; end: Point };
  gridSize: number;
}

export const useGridSnapping = (initialEnabled = true, gridSize = 20): UseGridSnappingResult => {
  const [snapEnabled, setSnapEnabled] = useState(initialEnabled);

  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    const snappedX = Math.round(point.x / gridSize) * gridSize;
    const snappedY = Math.round(point.y / gridSize) * gridSize;
    return createPoint(snappedX, snappedY);
  }, [snapEnabled, gridSize]);

  const snapLineToGrid = useCallback(
    (start: Point, end: Point): { start: Point; end: Point } => {
      if (!snapEnabled) return { start, end };
      const snappedStart = snapPointToGrid(start);
      const snappedEnd = snapPointToGrid(end);
      return { start: snappedStart, end: snappedEnd };
    },
    [snapEnabled, snapPointToGrid]
  );

  return {
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid,
    gridSize
  };
};
