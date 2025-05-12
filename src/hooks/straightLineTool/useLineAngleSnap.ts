
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineAngleSnapOptions {
  enabled?: boolean;
  angleStep?: number;
}

export const useLineAngleSnap = ({ 
  enabled = false, 
  angleStep = 15 
}: UseLineAngleSnapOptions = {}) => {
  const [isEnabled, setEnabled] = useState<boolean>(enabled);
  const [lastAngle, setLastAngle] = useState<number | null>(null);
  
  /**
   * Reset the angle state
   */
  const resetAngle = useCallback(() => {
    setLastAngle(null);
  }, []);
  
  /**
   * Toggle angle snapping on/off
   */
  const toggleEnabled = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap the angle between two points to the nearest angleStep
   */
  const snapAngle = useCallback((start: Point, end: Point) => {
    if (!isEnabled) {
      return { point: end, wasSnapped: false, angle: 0 };
    }
    
    // Calculate angle
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate raw angle in degrees
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    // Snap to the nearest angle step
    const snappedAngle = Math.round(angle / angleStep) * angleStep;
    
    // Convert back to radians
    const radians = snappedAngle * (Math.PI / 180);
    
    // Calculate new point based on snapped angle and original distance
    const newX = start.x + Math.cos(radians) * distance;
    const newY = start.y + Math.sin(radians) * distance;
    
    setLastAngle(snappedAngle);
    
    return { 
      point: { x: newX, y: newY },
      wasSnapped: true,
      angle: snappedAngle
    };
  }, [isEnabled, angleStep]);
  
  /**
   * Snap to angle with previous angle as reference
   * This is for API compatibility with existing code
   */
  const snapToAngle = useCallback((start: Point, end: Point): Point => {
    const result = snapAngle(start, end);
    return result.point;
  }, [snapAngle]);
  
  /**
   * Toggle angle snapping
   * This is for API compatibility with existing code
   */
  const toggleAngles = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);
  
  // Return additional properties for compatibility with existing code
  return { 
    snapAngle,
    resetAngle,
    isEnabled,
    toggleEnabled,
    setEnabled,
    snapToAngle,
    toggleAngles,
    anglesEnabled: isEnabled
  };
};

export default useLineAngleSnap;

