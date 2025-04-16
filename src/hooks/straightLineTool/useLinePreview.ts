
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import { useLineAngleSnap } from './useLineAngleSnap';

export interface LinePreviewResult {
  startPoint: Point;
  endPoint: Point;
  isSnapped: boolean;
}

export const useLinePreview = (gridSize = 20) => {
  const { snapPointToGrid, snapEnabled } = useSnapToGrid({ gridSize });
  const { snapToAngles } = useLineAngleSnap();
  
  const getLinePreview = useCallback((
    startPoint: Point, 
    endPoint: Point, 
    shouldSnap = true
  ): LinePreviewResult => {
    // Default return with no snapping
    if (!shouldSnap || !snapEnabled) {
      return { 
        startPoint, 
        endPoint,
        isSnapped: false 
      };
    }
    
    // First snap end point to grid
    const gridSnappedEnd = snapPointToGrid(endPoint);
    
    // Then try to snap to common angles
    const { point: angleSnappedEnd, isSnapped: isAngleSnapped } = snapToAngles(startPoint, gridSnappedEnd);
    
    return {
      startPoint,
      endPoint: angleSnappedEnd,
      isSnapped: isAngleSnapped
    };
  }, [snapPointToGrid, snapToAngles, snapEnabled]);
  
  return {
    getLinePreview
  };
};
