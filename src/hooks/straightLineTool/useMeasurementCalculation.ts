
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';

/**
 * Hook for calculating measurements for lines
 */
export const useMeasurementCalculation = () => {
  /**
   * Calculate measurement data for a line
   * @param start - Start point
   * @param end - End point
   * @param isSnapped - Whether the points are snapped
   * @param snapType - Type of snapping applied
   * @returns Measurement data
   */
  const calculateMeasurement = useCallback((
    start: Point,
    end: Point,
    isSnapped: boolean = false,
    snapType?: 'grid' | 'angle' | 'both'
  ) => {
    const distance = calculateDistance(start, end);
    const angle = calculateAngle(start, end);
    
    return {
      distance,
      angle,
      isSnapped,
      snapType
    };
  }, []);
  
  return {
    calculateMeasurement
  };
};
