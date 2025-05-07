
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineAngleSnapProps {
  enabled?: boolean;
  angles?: number[];
  threshold?: number;
}

export const useLineAngleSnap = ({ 
  enabled = false, 
  angles = [0, 45, 90, 135, 180, 225, 270, 315], 
  threshold = 10 
}: UseLineAngleSnapProps) => {
  const [anglesEnabled, setAnglesEnabled] = useState(enabled);
  
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  const snapToAngle = useCallback((startPoint: Point, currentPoint: Point): Point => {
    if (!anglesEnabled) return currentPoint;
    
    // Calculate current angle
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Find closest predefined angle
    let closestAngle = angles[0] || 0;
    let minDiff = 360;
    
    for (const snapAngle of angles) {
      if (snapAngle !== undefined) {
        const diff = Math.abs((angle + 360) % 360 - snapAngle);
        if (diff < minDiff && diff < threshold) {
          minDiff = diff;
          closestAngle = snapAngle;
        }
      }
    }
    
    // If angle is within threshold, snap to it
    if (minDiff < threshold) {
      const snapAngle = closestAngle * Math.PI / 180;
      return {
        x: startPoint.x + Math.cos(snapAngle) * distance,
        y: startPoint.y + Math.sin(snapAngle) * distance
      };
    }
    
    return currentPoint;
  }, [anglesEnabled, angles, threshold]);
  
  return {
    anglesEnabled,
    setAnglesEnabled,
    snapToAngle,
    toggleAngles
  };
};
