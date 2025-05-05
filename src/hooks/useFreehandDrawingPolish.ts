
import { useRef, useEffect } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Point, createPoint, distanceBetweenPoints } from '@/utils/geometry/Point';
import { createFabricPath, isPath, setPathData } from '@/utils/fabric/fabric-path-adapter';

interface FreehandDrawingOptions {
  strokeWidth?: number;
  strokeColor?: string;
  simplifyTolerance?: number;
  smoothingFactor?: number;
}

/**
 * Enhanced freehand drawing with path optimization
 */
export function useFreehandDrawingPolish(canvas: Canvas | null, options: FreehandDrawingOptions = {}) {
  const pathRef = useRef<any>(null);
  const pointsRef = useRef<Point[]>([]);
  
  useEffect(() => {
    if (!canvas) return;
    
    const handlePathCreated = (e: any) => {
      if (!e.path) return;
      
      try {
        // Apply path optimization
        optimizePath(e.path, {
          simplifyTolerance: options.simplifyTolerance || 2,
          smoothingFactor: options.smoothingFactor || 0.3
        });
      } catch (error) {
        console.error('Error in path optimization:', error);
      }
    };
    
    canvas.on('path:created', handlePathCreated);
    
    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, options.simplifyTolerance, options.smoothingFactor]);
  
  // Update brush settings when options change
  useEffect(() => {
    if (!canvas) return;
    
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = options.strokeWidth || 2;
      canvas.freeDrawingBrush.color = options.strokeColor || '#000000';
    }
  }, [canvas, options.strokeWidth, options.strokeColor]);
  
  /**
   * Optimizes a path by simplifying and smoothing
   */
  const optimizePath = (path: any, settings: { simplifyTolerance: number, smoothingFactor: number }) => {
    if (!isPath(path)) return;
    
    try {
      // Get path data
      const pathData = path.path;
      if (!pathData || !Array.isArray(pathData)) return;
      
      // Convert path data to points
      const points = pathDataToPoints(pathData);
      
      // Simplify path
      const simplifiedPoints = simplifyPath(points, settings.simplifyTolerance);
      
      // Smooth path
      const smoothedPoints = smoothPath(simplifiedPoints, settings.smoothingFactor);
      
      // Convert back to path data
      const newPathData = pointsToPathData(smoothedPoints);
      
      // Update path
      setPathData(path, newPathData);
    } catch (error) {
      console.error('Error optimizing path:', error);
    }
  };
  
  /**
   * Converts path data to array of points
   */
  const pathDataToPoints = (pathData: any[]): Point[] => {
    const points: Point[] = [];
    let currentX = 0;
    let currentY = 0;
    
    for (let i = 0; i < pathData.length; i++) {
      const command = pathData[i];
      
      switch (command[0]) {
        case 'M': // Move to
          currentX = command[1];
          currentY = command[2];
          points.push(createPoint(currentX, currentY));
          break;
        case 'L': // Line to
          currentX = command[1];
          currentY = command[2];
          points.push(createPoint(currentX, currentY));
          break;
        case 'Q': // Quadratic curve
          currentX = command[3];
          currentY = command[4];
          points.push(createPoint(currentX, currentY));
          break;
        case 'C': // Cubic curve
          currentX = command[5];
          currentY = command[6];
          points.push(createPoint(currentX, currentY));
          break;
      }
    }
    
    return points;
  };
  
  /**
   * Converts array of points to path data
   */
  const pointsToPathData = (points: Point[]): any[] => {
    if (points.length === 0) return [];
    
    const pathData: any[] = [];
    
    // Move to first point
    pathData.push(['M', points[0].x, points[0].y]);
    
    // Add line segments
    for (let i = 1; i < points.length; i++) {
      pathData.push(['L', points[i].x, points[i].y]);
    }
    
    return pathData;
  };
  
  /**
   * Simplifies a path by removing points that are too close
   */
  const simplifyPath = (points: Point[], tolerance: number): Point[] => {
    if (points.length <= 2) return points;
    
    const result: Point[] = [points[0]];
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = result[result.length - 1];
      const currentPoint = points[i];
      
      if (distanceBetweenPoints(prevPoint, currentPoint) >= tolerance) {
        result.push(currentPoint);
      }
    }
    
    // Always include the last point
    if (result[result.length - 1] !== points[points.length - 1]) {
      result.push(points[points.length - 1]);
    }
    
    return result;
  };
  
  /**
   * Smooths a path using Chaikin's algorithm
   */
  const smoothPath = (points: Point[], factor: number): Point[] => {
    if (points.length <= 2) return points;
    
    const result: Point[] = [];
    
    // Always include the first point
    result.push(points[0]);
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      
      // Calculate control points
      const q0x = p0.x + (p1.x - p0.x) * factor;
      const q0y = p0.y + (p1.y - p0.y) * factor;
      
      const q1x = p1.x - (p1.x - p0.x) * factor;
      const q1y = p1.y - (p1.y - p0.y) * factor;
      
      // Add control points
      result.push(createPoint(q0x, q0y));
      result.push(createPoint(q1x, q1y));
    }
    
    // Always include the last point
    result.push(points[points.length - 1]);
    
    return result;
  };
  
  return {
    optimizePath
  };
}
