import { useCallback, useState, useRef } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineAngleSnapOptions {
  angleIncrement?: number;
  snapThreshold?: number;
  enabled?: boolean;
}

export const useLineAngleSnap = ({
  angleIncrement = 15, // Snap to multiples of this angle
  snapThreshold = 5,  // Degrees of threshold for snapping
  enabled = false
}: UseLineAngleSnapOptions = {}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const previousAngleRef = useRef<number | null>(null);
  
  const snapAngle = useCallback((start: Point, end: Point): { point: Point, wasSnapped: boolean, angle: number } => {
    if (!isEnabled) {
      return { point: end, wasSnapped: false, angle: calculateAngle(start, end) };
    }
    
    // Calculate the angle and distance
    const angle = calculateAngle(start, end);
    const distance = calculateDistance(start, end);
    
    // Round to nearest increment
    const prev = previousAngleRef.current;
    const snappedAngle = Math.round(angle / angleIncrement) * angleIncrement;
    
    // Check if we're close enough to snap
    const isCloseEnoughToSnap = Math.abs(angle - snappedAngle) < snapThreshold;
    
    // Store the snapped angle for next time if we snapped
    if (isCloseEnoughToSnap) {
      previousAngleRef.current = snappedAngle;
    } else if (prev !== null) {
      // Use previous snap angle if we're still close to it
      const isCloseToLastSnap = Math.abs(angle - prev) < snapThreshold * 2;
      if (isCloseToLastSnap) {
        return { 
          point: calculateEndPoint(start, distance, prev),
          wasSnapped: true,
          angle: prev
        };
      }
      previousAngleRef.current = null;
    }
    
    // Return the snapped point if snapping occurred
    if (isCloseEnoughToSnap) {
      return { 
        point: calculateEndPoint(start, distance, snappedAngle),
        wasSnapped: true,
        angle: snappedAngle
      };
    }
    
    // Otherwise return the original point
    return { point: end, wasSnapped: false, angle };
  }, [isEnabled, angleIncrement, snapThreshold]);
  
  const resetAngle = useCallback(() => {
    previousAngleRef.current = null;
  }, []);
  
  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    snapAngle,
    resetAngle,
    isEnabled,
    toggleEnabled,
    setEnabled: setIsEnabled
  };
};

// Helper function to calculate angle between two points in degrees
function calculateAngle(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}

// Helper function to calculate distance between two points
function calculateDistance(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Helper function to calculate end point based on start, distance, and angle
function calculateEndPoint(start: Point, distance: number, angle: number): Point {
  const angleRadians = angle * (Math.PI / 180);
  return {
    x: start.x + distance * Math.cos(angleRadians),
    y: start.y + distance * Math.sin(angleRadians)
  };
}

export default useLineAngleSnap;
