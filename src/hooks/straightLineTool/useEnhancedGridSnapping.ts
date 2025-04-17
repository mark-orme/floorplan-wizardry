
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { snapPointToGrid } from '@/utils/grid/snapping';
import { lineToolLogger } from '@/utils/logger';

interface UseEnhancedGridSnappingOptions {
  initialSnapEnabled?: boolean;
  gridSize?: number;
}

/**
 * Enhanced grid snapping hook with better performance
 */
export const useEnhancedGridSnapping = ({
  initialSnapEnabled = true,
  gridSize = 20
}: UseEnhancedGridSnappingOptions = {}) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  /**
   * Snap a point to the grid
   */
  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    return snapPointToGrid(point, gridSize);
  }, [snapEnabled, gridSize]);
  
  /**
   * Toggle grid snapping
   */
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => {
      const newValue = !prev;
      lineToolLogger.debug(`Grid snapping ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []);
  
  return {
    snapEnabled,
    snapToGrid,
    toggleGridSnapping
  };
};
