
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseGridSnappingProps {
  gridSize: number;
  enabled: boolean;
}

export const useGridSnapping = ({
  gridSize = 20,
  enabled = false
}: UseGridSnappingProps) => {
  // Snap a point to the grid
  const snapToGrid = useCallback((point: Point): Point => {
    if (!enabled) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [gridSize, enabled]);
  
  // Check if a point is on a grid line
  const isOnGridLine = useCallback((point: Point, tolerance = 5): boolean => {
    if (!enabled) return false;
    
    const xOffset = point.x % gridSize;
    const yOffset = point.y % gridSize;
    
    return (
      (xOffset <= tolerance || xOffset >= gridSize - tolerance) ||
      (yOffset <= tolerance || yOffset >= gridSize - tolerance)
    );
  }, [gridSize, enabled]);
  
  // Get nearest grid point
  const getNearestGridPoint = useCallback((point: Point): { x: number, y: number } => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [gridSize]);
  
  // Get distance to nearest grid line
  const getDistanceToGridLine = useCallback((point: Point): { x: number, y: number } => {
    const xOffset = point.x % gridSize;
    const yOffset = point.y % gridSize;
    
    return {
      x: Math.min(xOffset, gridSize - xOffset),
      y: Math.min(yOffset, gridSize - yOffset)
    };
  }, [gridSize]);
  
  return {
    snapToGrid,
    isOnGridLine,
    getNearestGridPoint,
    getDistanceToGridLine
  };
};

export default useGridSnapping;
