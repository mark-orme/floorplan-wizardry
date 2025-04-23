
import { useCallback } from 'react';
import type { MeasurementData } from './useStraightLineTool';
import { Point } from '@/types/core/Point';

/**
 * Hook for calculating measurements between two points
 */
export const useMeasurementCalculation = () => {
  /**
   * Calculate distance between two points
   */
  const calculateDistance = useCallback((point1: Point, point2: Point): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  /**
   * Calculate angle between two points in degrees
   */
  const calculateAngle = useCallback((point1: Point, point2: Point): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    // Calculate angle in radians and convert to degrees
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Normalize to 0-360 range
    return angle < 0 ? angle + 360 : angle;
  }, []);
  
  /**
   * Get measurement data between two points
   */
  const getMeasurements = useCallback((point1: Point, point2: Point): MeasurementData => {
    return {
      distance: calculateDistance(point1, point2),
      angle: calculateAngle(point1, point2),
      startPoint: point1,
      endPoint: point2,
      snapped: false,
      unit: 'px'
    };
  }, [calculateDistance, calculateAngle]);
  
  return {
    calculateDistance,
    calculateAngle,
    getMeasurements
  };
};
