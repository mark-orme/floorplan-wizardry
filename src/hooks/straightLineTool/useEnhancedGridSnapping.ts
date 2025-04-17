
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';

/**
 * Options for useEnhancedGridSnapping hook
 */
export interface UseEnhancedGridSnappingOptions {
  /**
   * Grid size in pixels
   */
  gridSize?: number;
  
  /**
   * Initial snap enabled state
   */
  initialSnapEnabled?: boolean;
  
  /**
   * Snap threshold in pixels
   */
  snapThreshold?: number;
}

/**
 * Enhanced grid snapping hook with improved reliability
 */
export const useEnhancedGridSnapping = (options: UseEnhancedGridSnappingOptions = {}) => {
  const {
    gridSize = 20,
    initialSnapEnabled = true,
    snapThreshold = 5
  } = options;
  
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  /**
   * Toggle grid snapping on/off
   */
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the nearest grid point
   */
  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) {
      return point;
    }
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, gridSize]);
  
  return {
    snapEnabled,
    toggleGridSnapping,
    snapToGrid,
    gridSize,
    snapThreshold
  };
};
