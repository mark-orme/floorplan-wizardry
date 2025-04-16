
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseSnapToGridProps {
  gridSize?: number;
  enabled?: boolean;
  initialSnapEnabled?: boolean;
}

export const useSnapToGrid = ({ 
  gridSize = 20, 
  enabled = true,
  initialSnapEnabled = true
}: UseSnapToGridProps = {}) => {
  // State for snap to grid functionality
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  /**
   * Toggle snap to grid on/off
   */
  const toggleSnapToGrid = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap a point to the nearest grid intersection
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled || !enabled) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [gridSize, snapEnabled, enabled]);
  
  /**
   * Snap both ends of a line to the grid
   */
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled || !enabled) return { start, end };
    
    return {
      start: snapPointToGrid(start),
      end: snapPointToGrid(end)
    };
  }, [snapPointToGrid, snapEnabled, enabled]);
  
  /**
   * Check if point is snapped to grid
   */
  const isSnappedToGrid = useCallback((point: Point, threshold = 2): boolean => {
    if (!snapEnabled) return false;
    
    const snappedPoint = snapPointToGrid(point);
    const dx = Math.abs(point.x - snappedPoint.x);
    const dy = Math.abs(point.y - snappedPoint.y);
    
    return dx <= threshold && dy <= threshold;
  }, [snapPointToGrid, snapEnabled]);
  
  return {
    snapEnabled,
    toggleSnapToGrid,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    gridSize
  };
};
