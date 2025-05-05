
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineAngleSnapOptions {
  enabled?: boolean;
  angleIncrement?: number;
}

/**
 * Hook for snapping lines to angles
 */
export const useLineAngleSnap = ({
  enabled = true,
  angleIncrement = 45
}: UseLineAngleSnapOptions = {}) => {
  const [anglesEnabled, setAnglesEnabled] = useState(enabled);
  const [increment, setIncrement] = useState(angleIncrement);
  
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  const snapToAngle = useCallback((start: Point, end: Point): Point => {
    if (!anglesEnabled) return end;
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // Calculate current angle in radians
    const currentAngle = Math.atan2(dy, dx);
    
    // Convert increment to radians
    const incrementRad = increment * (Math.PI / 180);
    
    // Snap to nearest angle
    const snappedAngle = Math.round(currentAngle / incrementRad) * incrementRad;
    
    // Calculate distance
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate new end point
    return {
      x: start.x + Math.cos(snappedAngle) * distance,
      y: start.y + Math.sin(snappedAngle) * distance
    };
  }, [anglesEnabled, increment]);
  
  return {
    anglesEnabled,
    setAnglesEnabled,
    increment,
    setIncrement,
    snapToAngle,
    toggleAngles
  };
};

export default useLineAngleSnap;
