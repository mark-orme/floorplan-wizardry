
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useLineAngleSnap } from './useLineAngleSnap';

/**
 * Hook to manage line preview with snapping
 */
export const useLinePreview = (gridSize = 20, snapTolerance = 5) => {
  // Reuse existing hooks for grid and angle snapping
  const { snapToGrid } = useEnhancedGridSnapping(true, gridSize);
  const { snapToAngle } = useLineAngleSnap(true);
  
  /**
   * Get line preview with snapping applied based on settings
   */
  const getLinePreview = useCallback((
    startPoint: Point,
    currentPoint: Point,
    snapEnabled: boolean,
    anglesEnabled: boolean,
    shiftKeyPressed: boolean = false
  ) => {
    let endPoint = currentPoint;
    let isSnapped = false;
    let snapType: 'grid' | 'angle' | 'both' | undefined = undefined;
    
    // First try grid snapping
    if (snapEnabled) {
      const snappedPoint = snapToGrid(currentPoint);
      
      // Check if point is close enough to snap point
      const dx = Math.abs(currentPoint.x - snappedPoint.x);
      const dy = Math.abs(currentPoint.y - snappedPoint.y);
      
      if (dx <= snapTolerance && dy <= snapTolerance) {
        endPoint = snappedPoint;
        isSnapped = true;
        snapType = 'grid';
      }
    }
    
    // Then try angle snapping (or if shift is pressed)
    if ((anglesEnabled || shiftKeyPressed) && startPoint) {
      const angleLockPoint = snapToAngle(startPoint, endPoint);
      
      if (snapType === 'grid') {
        // Both grid and angle snap - try to find best compromise
        const gridAndAnglePoint = snapToGrid(angleLockPoint);
        endPoint = gridAndAnglePoint;
        snapType = 'both';
      } else {
        endPoint = angleLockPoint;
        isSnapped = true;
        snapType = 'angle';
      }
    }
    
    return {
      startPoint,
      endPoint,
      isSnapped,
      snapType
    };
  }, [snapToGrid, snapToAngle, snapTolerance]);
  
  return {
    getLinePreview
  };
};
