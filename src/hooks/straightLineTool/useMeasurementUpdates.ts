
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '../useStraightLineTool.d';

/**
 * Hook for updating measurement data
 */
export const useMeasurementUpdates = () => {
  /**
   * Update measurement data based on current drawing
   */
  const updateMeasurementData = useCallback(
    (
      startPoint: Point,
      currentPoint: Point,
      snapEnabled: boolean,
      anglesEnabled: boolean
    ): MeasurementData => {
      // Calculate distance
      const dx = currentPoint.x - startPoint.x;
      const dy = currentPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate angle
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Create measurement data
      return {
        distance,
        angle,
        snapped: snapEnabled,
        unit: 'px',
        snapType: anglesEnabled ? 'angle' : (snapEnabled ? 'grid' : undefined)
      };
    },
    []
  );
  
  return {
    updateMeasurementData
  };
};
