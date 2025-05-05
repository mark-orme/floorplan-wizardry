
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { MeasurementData, GRID_CONSTANTS } from '@/types/fabric-unified';

/**
 * Hook for calculating measurement data
 */
export const useMeasurementCalculation = () => {
  /**
   * Calculate distance between two points
   */
  const calculateDistance = useCallback((startPoint: Point, endPoint: Point): number => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  /**
   * Calculate angle between two points
   */
  const calculateAngle = useCallback((startPoint: Point, endPoint: Point): number => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);
  
  /**
   * Calculate middle point between two points
   */
  const calculateMidPoint = useCallback((startPoint: Point, endPoint: Point): Point => {
    return {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2
    };
  }, []);
  
  /**
   * Create measurement data object
   */
  const createMeasurement = useCallback((startPoint: Point, endPoint: Point, snapped: boolean = false): MeasurementData => {
    const distance = calculateDistance(startPoint, endPoint);
    const angle = calculateAngle(startPoint, endPoint);
    const midPoint = calculateMidPoint(startPoint, endPoint);
    
    return {
      startPoint,
      endPoint,
      distance,
      angle,
      midPoint,
      unit: 'px',
      snapped,
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
