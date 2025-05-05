
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';

interface UseEnhancedGridSnappingOptions {
  initialSnapEnabled?: boolean;
  gridSize?: number;
  snapThreshold?: number; // Added this property as it's being used
}

/**
 * Hook for grid snapping functionality
 */
export const useEnhancedGridSnapping = ({
  initialSnapEnabled = false,
  gridSize = 20,
  snapThreshold = 10 // Default value added
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
  
  // Check if a point is near a grid line
  const isNearGridLine = useCallback((point: Point): boolean => {
    if (!snapEnabled) return false;
    
    const distToGridX = Math.min(point.x % gridSize, gridSize - (point.x % gridSize));
    const distToGridY = Math.min(point.y % gridSize, gridSize - (point.y % gridSize));
    
    return distToGridX < snapThreshold || distToGridY < snapThreshold;
  }, [snapEnabled, gridSize, snapThreshold]);
  
  return {
    snapEnabled,
    setSnapEnabled,
    toggleGridSnapping,
    snapToGrid,
    isNearGridLine,
    gridSize,
    snapThreshold
  };
};

export default useEnhancedGridSnapping;
