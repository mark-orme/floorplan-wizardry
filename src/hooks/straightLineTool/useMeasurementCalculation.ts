
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { MeasurementData } from './useStraightLineTool';

export const useMeasurementCalculation = () => {
  const calculateMeasurements = useCallback((startPoint: Point, endPoint: Point, isSnapped: boolean = false): MeasurementData => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    
    // Calculate distance using Pythagorean theorem
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate angle in degrees
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return {
      distance,
      angle,
      snapped: isSnapped,
      unit: 'px'
    };
  }, []);

  return {
    calculateMeasurements
  };
};
