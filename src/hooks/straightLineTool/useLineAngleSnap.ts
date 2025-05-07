
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineAngleSnapOptions {
  enabled?: boolean;
  angles?: number[];
  threshold?: number;
}

/**
 * Hook for snapping lines to specific angles
 */
export const useLineAngleSnap = ({
  enabled = true,
  angles = [0, 45, 90, 135, 180, 225, 270, 315],
  threshold = 10
}: UseLineAngleSnapOptions = {}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled);
  const [prevAngle, setPrevAngle] = useState<number | null>(null);

  // Alias property for backwards compatibility
  const anglesEnabled = isEnabled;

  const resetAngle = useCallback(() => {
    setPrevAngle(null);
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  // Alias method for backwards compatibility
  const toggleAngles = toggleEnabled;
  
  const setAnglesEnabled = useCallback((value: boolean) => {
    setIsEnabled(value);
  }, []);

  /**
   * Calculate the angle between two points
   */
  const calculateAngle = useCallback((start: Point, end: Point): number => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Normalize angle to 0-360
    if (angle < 0) {
      angle += 360;
    }
    
    return angle;
  }, []);

  /**
   * Find the closest snap angle
   */
  const findClosestSnapAngle = useCallback((angle: number): number => {
    if (angles.length === 0) return angle;
    
    let closestAngle = angles[0] || 0;
    let smallestDifference = Math.abs(angle - closestAngle);
    
    angles.forEach(snapAngle => {
      if (snapAngle === undefined) return;
      const difference = Math.abs(angle - snapAngle);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestAngle = snapAngle;
      }
    });
    
    return smallestDifference <= threshold ? closestAngle : angle;
  }, [angles, threshold]);

  /**
   * Calculate a new endpoint based on a snapped angle
   */
  const calculatePointFromAngle = useCallback((start: Point, end: Point, angle: number): Point => {
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    
    const radians = (angle * Math.PI) / 180;
    
    return {
      x: start.x + distance * Math.cos(radians),
      y: start.y + distance * Math.sin(radians)
    };
  }, []);

  /**
   * Snap a line to a specific angle
   */
  const snapAngle = useCallback((start: Point, end: Point) => {
    if (!isEnabled || !start || !end) {
      return {
        point: end,
        wasSnapped: false,
        angle: calculateAngle(start, end)
      };
    }
    
    const angle = calculateAngle(start, end);
    const snappedAngle = findClosestSnapAngle(angle);
    const wasSnapped = snappedAngle !== angle;
    
    if (wasSnapped) {
      const point = calculatePointFromAngle(start, end, snappedAngle);
      setPrevAngle(snappedAngle);
      return { point, wasSnapped, angle: snappedAngle };
    }
    
    return { point: end, wasSnapped, angle };
  }, [isEnabled, calculateAngle, findClosestSnapAngle, calculatePointFromAngle]);

  // Add alias for snapAngle for backwards compatibility
  const snapToAngle = snapAngle;

  return {
    snapAngle,
    resetAngle,
    isEnabled,
    toggleEnabled,
    setEnabled: setIsEnabled,
    // Backward compatibility
    snapToAngle,
    anglesEnabled,
    toggleAngles,
    setAnglesEnabled
  };
};
