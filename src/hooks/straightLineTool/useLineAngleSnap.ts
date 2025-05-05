
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineAngleSnapOptions {
  enabled?: boolean;
  angles?: number[];
}

/**
 * Hook for angle snapping functionality
 */
export const useLineAngleSnap = ({
  enabled = false,
  angles = [0, 45, 90, 135, 180, 225, 270, 315]
}: UseLineAngleSnapOptions = {}) => {
  const [anglesEnabled, setAnglesEnabled] = useState(enabled);
  
  // Toggle angle snapping
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  // Snap angle to predefined angles
  const snapToAngle = useCallback((startPoint: Point, endPoint: Point): Point => {
    if (!anglesEnabled) return endPoint;
    
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    
    // Calculate distance and angle
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Find closest snap angle
    const snapAngle = angles.reduce((prev, curr) => {
      return Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev;
    }, angles[0]);
    
    // Convert back to radians
    const snapRadians = snapAngle * (Math.PI / 180);
    
    // Calculate new end point
    return {
      x: startPoint.x + Math.cos(snapRadians) * distance,
      y: startPoint.y + Math.sin(snapRadians) * distance
    };
  }, [anglesEnabled, angles]);
  
  return {
    anglesEnabled,
    setAnglesEnabled,
    toggleAngles,
    snapToAngle
  };
};

export default useLineAngleSnap;
