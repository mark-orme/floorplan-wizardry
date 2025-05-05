
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { MeasurementData, GRID_CONSTANTS } from '@/types/fabric-unified';

export const useMeasurementCalculation = () => {
  const calculateDistance = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const calculateAngle = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);
  
  const calculateMidPoint = useCallback((p1: Point, p2: Point): Point => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }, []);

  const createMeasurement = useCallback((startPoint: Point, endPoint: Point): MeasurementData => {
    const distance = calculateDistance(startPoint, endPoint);
    const angle = calculateAngle(startPoint, endPoint);
    const midPoint = calculateMidPoint(startPoint, endPoint);
    
    return {
      distance,
      angle,
      startPoint,
      endPoint,
      midPoint,
      snapped: false,
      unit: 'px',
      pixelsPerMeter: GRID_CONSTANTS.PIXELS_PER_METER
    };
  }, [calculateDistance, calculateAngle, calculateMidPoint]);
  
  return {
    calculateDistance,
    calculateAngle,
    calculateMidPoint,
    createMeasurement
  };
};

export default useMeasurementCalculation;
