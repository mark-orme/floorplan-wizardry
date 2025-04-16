
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineAngleSnapProps {
  enabled?: boolean;
  angleConstraints?: number[];
}

/**
 * Hook for snapping lines to specific angles
 */
export const useLineAngleSnap = ({
  enabled = true,
  angleConstraints = [0, 45, 90, 135, 180, 225, 270, 315, 360]
}: UseLineAngleSnapProps = {}) => {
  /**
   * Snap a line to the nearest angle constraint
   * @param start - Start point of the line
   * @param end - End point of the line
   * @returns The end point snapped to the nearest angle constraint
   */
  const snapToAngle = useCallback((start: Point, end: Point): Point => {
    if (!enabled) return end;
    
    // Calculate angle of the line
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Find the closest angle constraint
    let closestAngle = angleConstraints[0];
    let minDiff = Math.abs(angle - closestAngle);
    
    for (let i = 1; i < angleConstraints.length; i++) {
      const diff = Math.abs(angle - angleConstraints[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestAngle = angleConstraints[i];
      }
    }
    
    // If the angle is close enough to a constraint, snap to it
    if (minDiff <= 10) {
      // Calculate the new end point
      const distance = Math.sqrt(dx * dx + dy * dy);
      const newAngle = closestAngle * Math.PI / 180;
      
      return {
        x: start.x + Math.cos(newAngle) * distance,
        y: start.y + Math.sin(newAngle) * distance
      };
    }
    
    return end;
  }, [enabled, angleConstraints]);
  
  return {
    snapToAngle
  };
};
