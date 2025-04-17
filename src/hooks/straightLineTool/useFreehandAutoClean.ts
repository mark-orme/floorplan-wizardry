
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { isStraightPath, straightenPath } from '@/utils/geometry/pathStraightening';
import { simplifyPath } from '@/utils/geometry/pathProcessing';

interface UseFreehandAutoCleanProps {
  snapToGridEnabled?: boolean;
  gridSize?: number;
  straightnessThreshold?: number;
  simplifyTolerance?: number;
}

export const useFreehandAutoClean = ({
  snapToGridEnabled = true,
  gridSize = 20,
  straightnessThreshold = 0.09,
  simplifyTolerance = 5
}: UseFreehandAutoCleanProps = {}) => {
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
    const simplified = simplifyPath(points, simplifyTolerance);
    
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
  }, [snapToGridEnabled, gridSize, straightnessThreshold, simplifyTolerance]);
  
  return {
    simplifyPath: (points: Point[]): Point[] => simplifyPath(points, simplifyTolerance),
    processPath
  };
};
