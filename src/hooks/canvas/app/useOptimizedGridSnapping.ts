
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { SMALL_GRID_SIZE } from '@/constants/gridConstants';

export const useOptimizedGridSnapping = (options: {
  initialEnabled?: boolean;
  gridSize?: number;
}) => {
  const [enabled, setEnabled] = useState(options.initialEnabled ?? true);
  const gridSize = options.gridSize ?? SMALL_GRID_SIZE;

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const snap = useCallback((point: Point): Point => {
    if (!enabled) return point;

    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [enabled, gridSize]);

  return {
    enabled,
    toggle,
    snap,
    gridSize
  };
};
