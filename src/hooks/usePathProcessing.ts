import { useCallback } from 'react';
import { Point } from '@/types/core/Point';

export const usePathProcessing = () => {
  
  const simplifyPath = useCallback((points: Point[], tolerance: number = 2): Point[] => {
    if (!points || points.length <= 2) return points;
    
    // Douglas-Peucker algorithm implementation
    const douglasPeucker = (points: Point[], start: number, end: number, tolerance: number): Point[] => {
      if (end - start <= 1) {
        return [points[start], points[end]];
      }
      
      let maxDistance = 0;
      let maxIndex = start;
      
      const startPoint = points[start];
      const endPoint = points[end];
      
      if (!startPoint || !endPoint) {
        return points.slice(start, end + 1);
      }
      
      for (let i = start + 1; i < end; i++) {
        const point = points[i];
        if (!point) continue;
        
        const distance = perpendicularDistance(point, startPoint, endPoint);
        if (distance > maxDistance) {
          maxDistance = distance;
          maxIndex = i;
        }
      }
      
      if (maxDistance > tolerance) {
        const leftSegment = douglasPeucker(points, start, maxIndex, tolerance);
        const rightSegment = douglasPeucker(points, maxIndex, end, tolerance);
        
        return [...leftSegment.slice(0, -1), ...rightSegment];
      } else {
        return [startPoint, endPoint];
      }
    };
    
    return douglasPeucker(points, 0, points.length - 1, tolerance);
  }, []);
  
  const smoothPath = useCallback((points: Point[], windowSize: number = 3): Point[] => {
    if (!points || points.length <= 2) return points;
    
    const smoothed: Point[] = [];
    const halfWindow = Math.floor(windowSize / 2);
    
    for (let i = 0; i < points.length; i++) {
      const currentPoint = points[i];
      if (!currentPoint) continue;
      
      if (i === 0 || i === points.length - 1) {
        // Keep first and last points unchanged
        smoothed.push(currentPoint);
      } else {
        // Calculate weighted average
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        
        for (let j = Math.max(0, i - halfWindow); j <= Math.min(points.length - 1, i + halfWindow); j++) {
          const p = points[j];
          if (p) {
            sumX += p.x;
            sumY += p.y;
            count++;
          }
        }
        
        if (count > 0) {
          smoothed.push({ x: sumX / count, y: sumY / count });
        } else {
          smoothed.push(currentPoint);
        }
      }
    }
    
    return smoothed;
  }, []);
  
  const calculatePathLength = useCallback((points: Point[]): number => {
    if (!points || points.length < 2) return 0;
    
    let totalLength = 0;
    
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      
      if (p1 && p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
      }
    }
    
    return totalLength;
  }, []);
  
  return {
    simplifyPath,
    smoothPath,
    calculatePathLength
  };
};

// Helper function to calculate perpendicular distance
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  if (dx === 0 && dy === 0) {
    // Line is a point
    const pdx = point.x - lineStart.x;
    const pdy = point.y - lineStart.y;
    return Math.sqrt(pdx * pdx + pdy * pdy);
  }
  
  const lineLengthSquared = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared));
  
  const projectedX = lineStart.x + t * dx;
  const projectedY = lineStart.y + t * dy;
  
  const pdx = point.x - projectedX;
  const pdy = point.y - projectedY;
  
  return Math.sqrt(pdx * pdx + pdy * pdy);
}
