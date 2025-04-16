
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

/**
 * Hook for enhanced grid snapping functionality
 */
export const useEnhancedGridSnapping = (initialSnapEnabled = true, gridSize = 20) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the grid
   */
  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, gridSize]);
  
  return {
    snapEnabled,
    toggleSnap,
    snapToGrid
  };
};
