
import { useCallback } from 'react';
import { Point } from '@/types/geometryTypes';

interface UsePathProcessingProps {
  tolerance?: number;
}

export const usePathProcessing = ({ tolerance = 5 }: UsePathProcessingProps = {}) => {
  
  const simplifyPath = useCallback((points: Point[]): Point[] => {
    if (!points || points.length < 3) return points || [];
    
    const simplified: Point[] = [points[0]];
    
    for (let i = 1; i < points.length - 1; i++) {
      const prev = simplified[simplified.length - 1];
      const current = points[i];
      const next = points[i + 1];
      
      if (!prev || !current || !next) continue;
      
      const distance = Math.sqrt(
        Math.pow(current.x - prev.x, 2) + Math.pow(current.y - prev.y, 2)
      );
      
      if (distance > tolerance) {
        simplified.push(current);
      }
    }
    
    const lastPoint = points[points.length - 1];
    if (lastPoint) {
      simplified.push(lastPoint);
    }
    
    return simplified;
  }, [tolerance]);
  
  const smoothPath = useCallback((points: Point[]): Point[] => {
    if (!points || points.length < 3) return points || [];
    
    const smoothed: Point[] = [];
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      if (!current) continue;
      
      if (i === 0 || i === points.length - 1) {
        smoothed.push(current);
      } else {
        const prev = points[i - 1];
        const next = points[i + 1];
        
        if (prev && next) {
          smoothed.push({
            x: (prev.x + current.x + next.x) / 3,
            y: (prev.y + current.y + next.y) / 3
          });
        } else {
          smoothed.push(current);
        }
      }
    }
    
    return smoothed;
  }, []);
  
  return {
    simplifyPath,
    smoothPath
  };
};
