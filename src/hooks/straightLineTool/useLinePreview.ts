
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';
import { useLineAngleSnap } from './useLineAngleSnap';

export interface LinePreviewResult {
  startPoint: Point;
  endPoint: Point;
  isSnapped: boolean;
  snapType?: 'grid' | 'angle' | 'both';
}

export const useLinePreview = (gridSize = 20, snapTolerance = 10) => {
  const { snapPointToGrid, snapEnabled } = useSnapToGrid({ gridSize });
  const { snapToAngles } = useLineAngleSnap(snapTolerance);
  
  const getLinePreview = useCallback((
    startPoint: Point, 
    endPoint: Point, 
    shouldSnap = true,
    constrainAngle = false,
    shiftKeyPressed = false
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
    
    // Check if grid snapped point is different from original
    const isGridSnapped = gridSnappedEnd.x !== endPoint.x || gridSnappedEnd.y !== endPoint.y;
    
    let finalEndPoint = gridSnappedEnd;
    let snapType: 'grid' | 'angle' | 'both' | undefined = isGridSnapped ? 'grid' : undefined;
    
    // Then try to snap to common angles if constrainAngle is true or shift key is pressed
    if (constrainAngle || shiftKeyPressed) {
      const { point: angleSnappedEnd, isSnapped: isAngleSnapped } = snapToAngles(startPoint, finalEndPoint);
      
      if (isAngleSnapped) {
        finalEndPoint = angleSnappedEnd;
        snapType = isGridSnapped ? 'both' : 'angle';
      }
    }
    
    return {
      startPoint,
      endPoint: finalEndPoint,
      isSnapped: isGridSnapped || snapType === 'angle' || snapType === 'both',
      snapType
    };
  }, [snapPointToGrid, snapToAngles, snapEnabled]);
  
  return {
    getLinePreview
  };
};
