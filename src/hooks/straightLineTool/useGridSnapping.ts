
/**
 * Hook for managing grid snapping functionality
 * @module hooks/straightLineTool/useGridSnapping
 */
import { useState, useCallback } from "react";
import { Point } from "@/types/core/Geometry";

interface UseGridSnappingProps {
  initialSnapEnabled?: boolean;
}

/**
 * Hook for managing grid snapping functionality
 */
export const useGridSnapping = (props: UseGridSnappingProps = {}) => {
  const { initialSnapEnabled = true } = props;
  
  // Snapping state
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap point to grid
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const gridSize = 20; // Grid size in pixels
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled]);
  
  /**
   * Snap line to grid
   */
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start, end };
    
    return {
      start: snapPointToGrid(start),
      end: snapPointToGrid(end)
    };
  }, [snapEnabled, snapPointToGrid]);
  
  return {
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid
  };
};
