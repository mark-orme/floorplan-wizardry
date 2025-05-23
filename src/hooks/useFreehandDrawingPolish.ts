import { useCallback, useRef } from 'react';
import { Point } from '@/types/core/Point';

// Helper function to create a default Point
const createDefaultPoint = (): Point => ({ x: 0, y: 0 });

// Helper function to safely access point data
const safePoint = (point: Point | undefined): Point => {
  return point || createDefaultPoint();
};

interface UseFreehandDrawingPolishOptions {
  smoothingFactor?: number;
  velocityThreshold?: number;
  pressureEnabled?: boolean;
}

export const useFreehandDrawingPolish = ({
  smoothingFactor = 0.3,
  velocityThreshold = 3,
  pressureEnabled = true
}: UseFreehandDrawingPolishOptions = {}) => {
  // Points for path smoothing
  const pointsRef = useRef<(Point | undefined)[]>([]);
  const lastTimeRef = useRef(0);
  const lastVelocityRef = useRef(0);
  
  // Reset the stored points
  const resetPoints = useCallback(() => {
    pointsRef.current = [];
    lastTimeRef.current = 0;
    lastVelocityRef.current = 0;
  }, []);
  
  // Add a point to the smoothing buffer
  const addPoint = useCallback((point: Point, pressure?: number) => {
    // Add the point to our buffer
    pointsRef.current.push(point);
    
    // Keep a limited number of points
    if (pointsRef.current.length > 10) {
      pointsRef.current.shift();
    }
    
    // Calculate velocity if we have previous points
    if (pointsRef.current.length >= 2) {
      const now = Date.now();
      const prevPoint = pointsRef.current[pointsRef.current.length - 2];
      
      if (prevPoint && lastTimeRef.current > 0) {
        const dt = now - lastTimeRef.current;
        if (dt > 0) {
          // Calculate distance between points
          const dx = point.x - prevPoint.x;
          const dy = point.y - prevPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Velocity in pixels per millisecond
          const velocity = distance / dt;
          
          // Update last velocity with some smoothing
          lastVelocityRef.current = 0.7 * lastVelocityRef.current + 0.3 * velocity;
        }
      }
      
      lastTimeRef.current = now;
    }
  }, []);
  
  // Get the smoothed control point based on the last few points
  const getSmoothedControlPoint = useCallback((index: number): Point => {
    const len = pointsRef.current.length;
    
    // We need at least 3 points for proper smoothing
    if (len < 3) {
      return safePoint(pointsRef.current[len - 1]);
    }
    
    // Get points for calculation
    const p0 = safePoint(pointsRef.current[len - 3]);
    const p1 = safePoint(pointsRef.current[len - 2]);
    const p2 = safePoint(pointsRef.current[len - 1]);
    
    // Adjust control point based on index (for before or after main point)
    let cp;
    if (index === 0) {
      // Control point before
      cp = {
        x: p1.x + (p0.x - p2.x) * smoothingFactor,
        y: p1.y + (p0.y - p2.y) * smoothingFactor
      };
    } else {
      // Control point after
      cp = {
        x: p1.x + (p2.x - p0.x) * smoothingFactor,
        y: p1.y + (p2.y - p0.y) * smoothingFactor
      };
    }
    
    return cp;
  }, [smoothingFactor]);
  
  // Get the current drawing velocity (used for pressure simulation)
  const getVelocity = useCallback(() => {
    return Math.min(1.0, lastVelocityRef.current / velocityThreshold);
  }, [velocityThreshold]);
  
  // Calculate point thickness based on velocity or pressure
  const getPointThickness = useCallback((baseSizing: number, pressure?: number): number => {
    if (!pressureEnabled) return baseSizing;
    
    if (pressure !== undefined && pressure > 0) {
      // Use actual pressure data if available
      return baseSizing * (0.5 + pressure * 0.5);
    } else {
      // Otherwise simulate based on velocity
      const velocity = getVelocity();
      // Inverse relationship - faster drawing = thinner line
      return baseSizing * (1.0 - velocity * 0.7);
    }
  }, [pressureEnabled, getVelocity]);
  
  // Get bezier curve path from the current points
  const getBezierPath = useCallback(() => {
    const len = pointsRef.current.length;
    
    if (len < 2) return '';
    
    // Start with the first point
    let path = `M ${safePoint(pointsRef.current[0]).x} ${safePoint(pointsRef.current[0]).y}`;
    
    // For two points, just draw a line
    if (len === 2) {
      path += ` L ${safePoint(pointsRef.current[1]).x} ${safePoint(pointsRef.current[1]).y}`;
      return path;
    }
    
    // For more points, use quadratic bezier curves
    for (let i = 1; i < len - 1; i++) {
      const p0 = safePoint(pointsRef.current[i - 1]);
      const p1 = safePoint(pointsRef.current[i]);
      const p2 = safePoint(pointsRef.current[i + 1]);
      
      // Use control points to create smoother curves
      const cp1x = p1.x + (p0.x - p2.x) * smoothingFactor;
      const cp1y = p1.y + (p0.y - p2.y) * smoothingFactor;
      const cp2x = p1.x + (p2.x - p0.x) * smoothingFactor;
      const cp2y = p1.y + (p2.y - p0.y) * smoothingFactor;
      
      // Add cubic bezier curve
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
    }
    
    // Add final point
    const lastPoint = safePoint(pointsRef.current[len - 1]);
    path += ` L ${lastPoint.x},${lastPoint.y}`;
    
    return path;
  }, [smoothingFactor]);
  
  return {
    addPoint,
    resetPoints,
    getSmoothedControlPoint,
    getVelocity,
    getPointThickness,
    getBezierPath,
    pointCount: () => pointsRef.current.length
  };
};

export default useFreehandDrawingPolish;
