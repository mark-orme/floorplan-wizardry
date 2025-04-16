
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseEnhancedGridSnappingProps {
  gridSize?: number;
  snapThreshold?: number;
  initialSnapEnabled?: boolean;
}

/**
 * Enhanced hook for grid snapping with additional options
 */
export const useEnhancedGridSnapping = ({
  gridSize = 20,
  snapThreshold = 5,
  initialSnapEnabled = true
}: UseEnhancedGridSnappingProps = {}) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  /**
   * Toggle grid snapping on/off
   */
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the nearest grid intersection
   */
  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const snappedX = Math.round(point.x / gridSize) * gridSize;
    const snappedY = Math.round(point.y / gridSize) * gridSize;
    
    // Only snap if we're close enough to a grid point
    const dx = Math.abs(point.x - snappedX);
    const dy = Math.abs(point.y - snappedY);
    
    if (dx <= snapThreshold && dy <= snapThreshold) {
      return {
        x: snappedX,
        y: snappedY
      };
    }
    
    return point;
  }, [snapEnabled, gridSize, snapThreshold]);
  
  return {
    snapEnabled,
    toggleGridSnapping,
    snapToGrid,
    gridSize
  };
};
