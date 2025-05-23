
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

// Simple interface for geometry calculations
interface GeometryCalculationResult {
  distance: number;
  angle: number;
  isParallel: boolean;
  isPerpendicular: boolean;
}

export const useGeometryEngine = () => {
  const [isReady, setIsReady] = useState(true);
  
  // Calculate distance between two points with null safety
  const calculateDistance = useCallback((point1: Point | null, point2: Point | null): number => {
    if (!point1 || !point2) return 0;
    
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Calculate angle between two points with null safety
  const calculateAngle = useCallback((point1: Point | null, point2: Point | null): number => {
    if (!point1 || !point2) return 0;
    
    // Calculate angle in radians
    const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
    
    // Convert to degrees
    return angle * (180 / Math.PI);
  }, []);
  
  // Check if two lines are parallel with null safety
  const areParallel = useCallback((line1Start: Point | null, line1End: Point | null, line2Start: Point | null, line2End: Point | null, tolerance = 0.1): boolean => {
    if (!line1Start || !line1End || !line2Start || !line2End) return false;
    
    // Calculate angles
    const angle1 = Math.atan2(line1End.y - line1Start.y, line1End.x - line1Start.x);
    const angle2 = Math.atan2(line2End.y - line2Start.y, line2End.x - line2Start.x);
    
    // Calculate angle difference and normalize
    const angleDiff = Math.abs(angle1 - angle2) % Math.PI;
    
    // Check if angles are very close or close to PI (180 degrees)
    return angleDiff < tolerance || Math.abs(angleDiff - Math.PI) < tolerance;
  }, []);
  
  // Check if two lines are perpendicular with null safety
  const arePerpendicular = useCallback((line1Start: Point | null, line1End: Point | null, line2Start: Point | null, line2End: Point | null, tolerance = 0.1): boolean => {
    if (!line1Start || !line1End || !line2Start || !line2End) return false;
    
    // Calculate angles
    const angle1 = Math.atan2(line1End.y - line1Start.y, line1End.x - line1Start.x);
    const angle2 = Math.atan2(line2End.y - line2Start.y, line2End.x - line2Start.x);
    
    // Calculate angle difference and normalize
    const angleDiff = Math.abs(angle1 - angle2) % Math.PI;
    
    // Check if angle difference is close to PI/2 (90 degrees)
    return Math.abs(angleDiff - Math.PI / 2) < tolerance;
  }, []);
  
  // Perform complete geometry calculation
  const calculateGeometry = useCallback((point1: Point | null, point2: Point | null): GeometryCalculationResult => {
    const distance = calculateDistance(point1, point2);
    const angle = calculateAngle(point1, point2);
    
    return {
      distance,
      angle,
      isParallel: false, // These need additional line references
      isPerpendicular: false
    };
  }, [calculateDistance, calculateAngle]);
  
  return {
    isReady,
    calculateDistance,
    calculateAngle,
    areParallel,
    arePerpendicular,
    calculateGeometry
  };
};

export default useGeometryEngine;
