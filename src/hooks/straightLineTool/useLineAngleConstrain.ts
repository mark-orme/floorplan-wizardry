
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { snapToAngle } from '@/utils/grid/snapping';
import { useKeyboardModifiers } from '@/hooks/useKeyboardModifiers';

interface UseLineAngleConstrainProps {
  angleStep?: number;
}

export const useLineAngleConstrain = ({ angleStep = 45 }: UseLineAngleConstrainProps = {}) => {
  const { shiftKey } = useKeyboardModifiers();
  
  /**
   * Constrain a line end point to standard angles when shift key is pressed
   */
  const constrainLineAngle = useCallback(
    (startPoint: Point, endPoint: Point): Point => {
      if (shiftKey) {
        // Snap to standard angles when shift is pressed
        return snapToAngle(startPoint, endPoint, angleStep);
      }
      return endPoint;
    },
    [shiftKey, angleStep]
  );
  
  /**
   * Calculate the angle between two points in degrees
   */
  const calculateAngle = useCallback((startPoint: Point, endPoint: Point): number => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Normalize to 0-360
    if (angle < 0) angle += 360;
    
    return angle;
  }, []);
  
  return {
    constrainLineAngle,
    calculateAngle,
    isConstrained: shiftKey
  };
};
