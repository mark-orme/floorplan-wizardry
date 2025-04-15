
/**
 * Enhanced grid snapping hook
 * @module hooks/straightLineTool/useEnhancedGridSnapping
 */
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';
import { 
  snapPointToGrid, 
  snapLineToGrid, 
  snapToAngle, 
  isPointOnGrid 
} from '@/utils/grid/snapping';
import { toast } from 'sonner';

interface UseEnhancedGridSnappingProps {
  initialSnapEnabled?: boolean;
  snapThreshold?: number;
}

/**
 * Hook that provides enhanced grid snapping functionality
 * 
 * @param initialSnapEnabled Whether grid snapping is initially enabled
 * @param snapThreshold Threshold distance for snap attraction
 * @returns Grid snapping state and functions
 */
export const useEnhancedGridSnapping = ({
  initialSnapEnabled = true,
  snapThreshold = 10
}: UseEnhancedGridSnappingProps = {}) => {
  // State for tracking if snap is enabled
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => {
      const newValue = !prev;
      toast.info(newValue ? 'Grid snapping enabled' : 'Grid snapping disabled', {
        id: 'grid-snap-toggle'
      });
      return newValue;
    });
  }, []);
  
  // Snap a point to the grid if snapping is enabled
  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return { ...point };
    return snapPointToGrid(point);
  }, [snapEnabled]);
  
  // Snap a line to the grid if snapping is enabled
  const snapLine = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start: { ...start }, end: { ...end } };
    return snapLineToGrid(start, end);
  }, [snapEnabled]);
  
  // Snap a line to standard angles if snapping is enabled
  const snapAngle = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { ...end };
    return snapToAngle(start, end);
  }, [snapEnabled]);
  
  // Check if a point is already on grid
  const checkPointOnGrid = useCallback((point: Point): boolean => {
    return isPointOnGrid(point);
  }, []);
  
  return {
    snapEnabled,
    toggleSnap,
    snapToGrid,
    snapLine,
    snapAngle,
    checkPointOnGrid
  };
};
