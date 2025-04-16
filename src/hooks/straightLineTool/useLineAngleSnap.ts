
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';

interface AngleSnapResult {
  point: Point;
  angle: number;
  isSnapped: boolean;
}

// Common angles in degrees (0°, 45°, 90°, etc.)
const DEFAULT_SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export const useLineAngleSnap = (
  snapThreshold = 10, 
  snapAngles = DEFAULT_SNAP_ANGLES
) => {
  const [activeSnapAngles, setActiveSnapAngles] = useState(snapAngles);
  
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
    let closestAngle = activeSnapAngles[0];
    let minDiff = Math.abs(angle - closestAngle);
    
    for (const snapAngle of activeSnapAngles) {
      const diff = Math.abs(angle - snapAngle);
      const wrappedDiff = Math.min(diff, 360 - diff); // Handle wrapping around 360°
      if (wrappedDiff < minDiff) {
        minDiff = wrappedDiff;
        closestAngle = snapAngle;
      }
    }
    
    // Check if it's close enough to snap based on threshold
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
  }, [activeSnapAngles, snapThreshold]);
  
  // Allow changing the active snap angles
  const setSnapAngles = useCallback((angles: number[]) => {
    setActiveSnapAngles(angles);
  }, []);
  
  // Function to get the nearest snap angle without modifying the point
  const getNearestSnapAngle = useCallback((startPoint: Point, endPoint: Point): number | null => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    
    let closestAngle = activeSnapAngles[0];
    let minDiff = Math.abs(angle - closestAngle);
    
    for (const snapAngle of activeSnapAngles) {
      const diff = Math.abs(angle - snapAngle);
      const wrappedDiff = Math.min(diff, 360 - diff);
      if (wrappedDiff < minDiff) {
        minDiff = wrappedDiff;
        closestAngle = snapAngle;
      }
    }
    
    return minDiff <= snapThreshold ? closestAngle : null;
  }, [activeSnapAngles, snapThreshold]);
  
  return {
    snapToAngles,
    setSnapAngles,
    getNearestSnapAngle,
    snapAngles: activeSnapAngles
  };
};
