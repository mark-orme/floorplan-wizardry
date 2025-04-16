
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface AngleSnapResult {
  point: Point;
  angle: number;
  isSnapped: boolean;
}

export const useLineAngleSnap = (snapThreshold = 10, snapAngles = [0, 45, 90, 135, 180, 225, 270, 315]) => {
  const snapToAngles = useCallback((startPoint: Point, endPoint: Point): AngleSnapResult => {
    // Calculate current angle
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If points are too close, don't snap
    if (distance < 5) {
      return { point: endPoint, angle: 0, isSnapped: false };
    }
    
    // Calculate angle in degrees (0-360)
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    
    // Find the closest snap angle
    let closestAngle = snapAngles[0];
    let minDiff = Math.abs(angle - closestAngle);
    
    snapAngles.forEach(snapAngle => {
      const diff = Math.abs(angle - snapAngle);
      if (diff < minDiff) {
        minDiff = diff;
        closestAngle = snapAngle;
      }
    });
    
    // Check if it's close enough to snap
    const isSnapped = minDiff <= snapThreshold;
    
    if (!isSnapped) {
      return { point: endPoint, angle, isSnapped: false };
    }
    
    // Calculate new point position based on snapped angle
    const radAngle = closestAngle * Math.PI / 180;
    const newX = startPoint.x + distance * Math.cos(radAngle);
    const newY = startPoint.y + distance * Math.sin(radAngle);
    
    return {
      point: { x: newX, y: newY },
      angle: closestAngle,
      isSnapped: true
    };
  }, [snapThreshold, snapAngles]);
  
  return {
    snapToAngles
  };
};
