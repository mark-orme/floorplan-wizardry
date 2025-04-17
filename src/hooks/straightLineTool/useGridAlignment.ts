
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { snapPointToGrid, constrainToMajorAngles } from '@/utils/grid/snapping';

export interface GridSnappingSettings {
  gridSize?: number;
  threshold?: number;
}

interface UseGridAlignmentProps {
  enabled: boolean;
  gridSize?: number;
  threshold?: number;
}

/**
 * Hook for grid and angle alignment
 */
export const useGridAlignment = ({
  enabled = true,
  gridSize = 20,
  threshold = 10
}: UseGridAlignmentProps) => {
  /**
   * Snap a point to the grid
   */
  const snapToGrid = useCallback((point: Point): Point => {
    if (!enabled) return { ...point };
    return snapPointToGrid(point, gridSize);
  }, [enabled, gridSize]);
  
  /**
   * Auto-straighten a line based on angle
   */
  const autoStraighten = useCallback((startPoint: Point, endPoint: Point): Point => {
    if (!enabled) return { ...endPoint };
    
    const { end } = constrainToMajorAngles(startPoint, endPoint);
    return end;
  }, [enabled]);
  
  return {
    snapToGrid,
    autoStraighten,
    enabled,
    threshold
  };
};
