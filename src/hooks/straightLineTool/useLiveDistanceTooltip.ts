
import { useState, useEffect, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';

interface UseLiveDistanceTooltipProps {
  startPoint: Point | null;
  currentPoint: Point | null;
  isDrawing: boolean;
  isSnapped?: boolean;
  snapType?: 'grid' | 'angle' | 'both';
}

export const useLiveDistanceTooltip = ({
  startPoint,
  currentPoint,
  isDrawing,
  isSnapped = false,
  snapType
}: UseLiveDistanceTooltipProps) => {
  const [tooltipData, setTooltipData] = useState({
    distance: 0,
    angle: 0,
    isVisible: false,
    isSnapped: false,
    snapType: undefined as 'grid' | 'angle' | 'both' | undefined
  });
  
  // Update tooltip when drawing
  useEffect(() => {
    if (isDrawing && startPoint && currentPoint) {
      // Calculate distance and angle
      const distance = calculateDistance(startPoint, currentPoint);
      const angle = calculateAngle(startPoint, currentPoint);
      
      setTooltipData({
        distance,
        angle,
        isVisible: true,
        isSnapped,
        snapType
      });
    } else {
      // Hide tooltip when not drawing
      setTooltipData(prev => ({ ...prev, isVisible: false }));
    }
  }, [isDrawing, startPoint, currentPoint, isSnapped, snapType]);
  
  /**
   * Update tooltip with new measurement data
   */
  const updateTooltipData = useCallback((
    distance: number,
    angle: number,
    isSnapped: boolean = false,
    snapType?: 'grid' | 'angle' | 'both'
  ) => {
    setTooltipData({
      distance,
      angle,
      isVisible: true,
      isSnapped,
      snapType
    });
  }, []);
  
  return {
    tooltipData,
    updateTooltipData
  };
};
