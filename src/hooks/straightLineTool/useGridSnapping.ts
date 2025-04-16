
/**
 * Hook for managing grid snapping functionality
 * @module hooks/straightLineTool/useGridSnapping
 */
import { useState, useCallback } from "react";
import { Point } from "@/types/core/Point";

interface UseGridSnappingProps {
  initialSnapEnabled?: boolean;
  gridSize?: number;
}

/**
 * Hook for managing grid snapping functionality
 */
export const useGridSnapping = (props: UseGridSnappingProps = {}) => {
  const { 
    initialSnapEnabled = true,
    gridSize = 20
  } = props;
  
  // Snapping state
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Snap a point to grid
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return { ...point };
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled, gridSize]);
  
  // Snap both ends of a line to grid
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start: { ...start }, end: { ...end } };
    
    return {
      start: snapPointToGrid(start),
      end: snapPointToGrid(end)
    };
  }, [snapEnabled, snapPointToGrid]);
  
  // Check if a point is on the grid (or close to it)
  const isSnappedToGrid = useCallback((point: Point, threshold = 2): boolean => {
    if (!snapEnabled) return false;
    
    const nearestGridPoint = snapPointToGrid(point);
    const dx = Math.abs(point.x - nearestGridPoint.x);
    const dy = Math.abs(point.y - nearestGridPoint.y);
    
    return dx <= threshold && dy <= threshold;
  }, [snapEnabled, snapPointToGrid]);
  
  return {
    snapEnabled,
    toggleSnapToGrid,
    snapPointToGrid,
    snapLineToGrid,
    isSnappedToGrid,
    gridSize
  };
};
