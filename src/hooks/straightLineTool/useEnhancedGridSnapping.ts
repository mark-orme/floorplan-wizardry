
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';

interface UseEnhancedGridSnappingOptions {
  initialSnapEnabled?: boolean;
  gridSize?: number;
}

/**
 * Hook for grid snapping functionality
 */
export const useEnhancedGridSnapping = ({
  initialSnapEnabled = false,
  gridSize = 20
}: UseEnhancedGridSnappingOptions = {}) => {
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Snap point to grid
  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, gridSize]);
  
  return {
    snapEnabled,
    setSnapEnabled,
    toggleGridSnapping,
    snapToGrid
  };
};

export default useEnhancedGridSnapping;
