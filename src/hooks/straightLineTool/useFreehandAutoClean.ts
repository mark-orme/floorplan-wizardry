import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { isStraightPath, straightenPath } from '@/utils/geometry/pathStraightening';

interface UseFreehandAutoCleanProps {
  snapToGridEnabled?: boolean;
  gridSize?: number;
  straightnessThreshold?: number;
}

export const useFreehandAutoClean = ({
  snapToGridEnabled = true,
  gridSize = 20,
  straightnessThreshold = 0.09
}: UseFreehandAutoCleanProps = {}) => {
  /**
   * Simplify a path by removing unnecessary points
   */
  const simplifyPath = useCallback((points: Point[], tolerance: number = 5): Point[] => {
    if (points.length <= 2) return [...points];
    
    // Simplified implementation of Ramer-Douglas-Peucker algorithm
    const result: Point[] = [points[0]];
    let maxDistanceIndex = 0;
    let maxDistance = 0;
    
    // Find point with maximum distance from line between first and last point
    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(
        points[i], 
        points[0], 
        points[points.length - 1]
      );
      
      if (distance > maxDistance) {
        maxDistance = distance;
        maxDistanceIndex = i;
      }
    }
    
    // If max distance is greater than tolerance, recursively simplify
    if (maxDistance > tolerance) {
      const firstPart = simplifyPath(points.slice(0, maxDistanceIndex + 1), tolerance);
      const secondPart = simplifyPath(points.slice(maxDistanceIndex), tolerance);
      
      // Combine the two parts, avoiding duplicating the split point
      return [...firstPart.slice(0, -1), ...secondPart];
    } else {
      // Just keep the endpoints
      return [points[0], points[points.length - 1]];
    }
  }, []);
  
  /**
   * Calculate perpendicular distance from a point to a line
   */
  const perpendicularDistance = useCallback((point: Point, lineStart: Point, lineEnd: Point): number => {
    // Line length
    const lineLength = Math.sqrt(
      Math.pow(lineEnd.x - lineStart.x, 2) + 
      Math.pow(lineEnd.y - lineStart.y, 2)
    );
    
    // Handle case where line start and end are the same point
    if (lineLength === 0) return Math.sqrt(
      Math.pow(point.x - lineStart.x, 2) + 
      Math.pow(point.y - lineStart.y, 2)
    );
    
    // Calculate distance from point to line
    const t = (
      (point.x - lineStart.x) * (lineEnd.x - lineStart.x) + 
      (point.y - lineStart.y) * (lineEnd.y - lineStart.y)
    ) / (lineLength * lineLength);
    
    // Clamp t to range [0,1]
    const tClamped = Math.max(0, Math.min(1, t));
    
    // Find closest point on line
    const closestX = lineStart.x + tClamped * (lineEnd.x - lineStart.x);
    const closestY = lineStart.y + tClamped * (lineEnd.y - lineStart.y);
    
    // Calculate distance to closest point
    return Math.sqrt(
      Math.pow(point.x - closestX, 2) + 
      Math.pow(point.y - closestY, 2)
    );
  }, []);
  
  /**
   * Check if a path should be converted to a straight line
   * and convert it if needed
   */
  const processPath = useCallback((points: Point[]): {
    shouldStraighten: boolean;
    processedPoints: Point[];
    line?: { start: Point; end: Point };
  } => {
    if (points.length < 3) {
      return { 
        shouldStraighten: false, 
        processedPoints: points 
      };
    }
    
    // First, simplify the path
    const simplified = simplifyPath(points);
    
    // Check if it's a nearly straight line
    if (isStraightPath(simplified, straightnessThreshold)) {
      const line = straightenPath(simplified, snapToGridEnabled, gridSize);
      return {
        shouldStraighten: true,
        processedPoints: [line.start, line.end],
        line
      };
    }
    
    return {
      shouldStraighten: false,
      processedPoints: simplified
    };
  }, [simplifyPath, snapToGridEnabled, gridSize, straightnessThreshold]);
  
  return {
    simplifyPath,
    processPath
  };
};
