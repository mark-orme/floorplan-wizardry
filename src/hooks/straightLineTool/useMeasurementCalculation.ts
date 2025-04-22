
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';

export const useMeasurementCalculation = () => {
  const calculateMeasurements = useCallback((startPoint: Point, endPoint: Point) => {
    const distance = calculateDistance(startPoint, endPoint);
    const angle = calculateAngle(startPoint, endPoint);
    
    return {
      distance,
      angle
    };
  }, []);
  
  return {
    calculateMeasurements
  };
};
