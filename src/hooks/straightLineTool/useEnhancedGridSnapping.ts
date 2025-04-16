
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';

interface UseEnhancedGridSnappingProps {
  initialSnapEnabled?: boolean;
  gridSize?: number;
  snapThreshold?: number;
}

export const useEnhancedGridSnapping = (
  initialSnapEnabled: boolean = true,
  gridSize: number = 20,
  snapThreshold: number = 10
) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);

  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  // Add an alias for backward compatibility
  const toggleSnap = toggleGridSnapping;

  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) {
      return point;
    }

    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, gridSize]);

  const isNearGridLine = useCallback((point: Point): boolean => {
    if (!snapEnabled) return false;

    const distanceToGridX = Math.abs(point.x - Math.round(point.x / gridSize) * gridSize);
    const distanceToGridY = Math.abs(point.y - Math.round(point.y / gridSize) * gridSize);

    return distanceToGridX <= snapThreshold || distanceToGridY <= snapThreshold;
  }, [snapEnabled, gridSize, snapThreshold]);

  const getClosestGridPoint = useCallback((point: Point): Point => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [gridSize]);

  return {
    snapEnabled,
    toggleGridSnapping,
    toggleSnap, // Include the alias in the returned object
    snapToGrid,
    isNearGridLine,
    getClosestGridPoint
  };
};
