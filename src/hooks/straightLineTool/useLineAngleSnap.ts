
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';

/**
 * Hook for angle snapping functionality
 */
export const useLineAngleSnap = (anglesEnabled = false) => {
  /**
   * Snap angle to nearest constraint (0, 45, 90 degrees)
   */
  const snapToAngle = useCallback((startPoint: Point, currentPoint: Point): Point => {
    if (!anglesEnabled) return currentPoint;
    
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    
    // Calculate angle in radians
    const angleRad = Math.atan2(dy, dx);
    
    // Convert to degrees and find nearest 45° increment
    let angleDeg = angleRad * (180 / Math.PI);
    const snapAngle = 45;
    const snappedAngleDeg = Math.round(angleDeg / snapAngle) * snapAngle;
    
    // Convert back to radians
    const snappedAngleRad = snappedAngleDeg * (Math.PI / 180);
    
    // Calculate distance
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Get new point at same distance but snapped angle
    return {
      x: startPoint.x + Math.cos(snappedAngleRad) * distance,
      y: startPoint.y + Math.sin(snappedAngleRad) * distance
    };
  }, [anglesEnabled]);
  
  return {
    snapToAngle
  };
};
