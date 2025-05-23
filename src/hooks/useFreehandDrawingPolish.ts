
import { useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Path } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseFreehandDrawingPolishProps {
  canvas: FabricCanvas | null;
  smoothing?: number;
  streamline?: number;
  precision?: number;
}

export const useFreehandDrawingPolish = ({
  canvas,
  smoothing = 0.5,
  streamline = 0.5,
  precision = 0.5
}: UseFreehandDrawingPolishProps) => {
  // Store raw and processed points
  const rawPoints = useRef<Point[]>([]);
  const smoothedPoints = useRef<Point[]>([]);
  
  // Active drawing path
  const activePath = useRef<Path | null>(null);
  
  // Helper function to create a new path
  const createPath = useCallback((color: string, thickness: number) => {
    if (!canvas) return null;
    
    // Create empty path
    const path = new Path('M 0 0', {
      stroke: color,
      strokeWidth: thickness,
      fill: 'transparent',
      strokeLineCap: 'round',
      strokeLineJoin: 'round'
    });
    
    canvas.add(path);
    return path;
  }, [canvas]);
  
  // Start drawing
  const startDrawing = useCallback((point: Point, color: string, thickness: number) => {
    if (!canvas) return;
    
    // Clear previous points
    rawPoints.current = [point];
    smoothedPoints.current = [point];
    
    // Create new path
    activePath.current = createPath(color, thickness);
  }, [canvas, createPath]);
  
  // Add point while drawing
  const addPoint = useCallback((point: Point) => {
    if (!canvas || !activePath.current) return;
    
    // Add raw point
    rawPoints.current.push(point);
    
    // Apply streamlining (lagging behind the cursor)
    let streamlinedPoint = point;
    if (streamline > 0 && rawPoints.current.length > 1) {
      const lastPoint = smoothedPoints.current[smoothedPoints.current.length - 1];
      if (lastPoint) {
        streamlinedPoint = {
          x: lastPoint.x + (point.x - lastPoint.x) * (1 - streamline),
          y: lastPoint.y + (point.y - lastPoint.y) * (1 - streamline)
        };
      }
    }
    
    // Add streamlined point
    smoothedPoints.current.push(streamlinedPoint);
    
    // Update path if we have enough points
    if (smoothedPoints.current.length >= 2) {
      updatePath();
    }
  }, [canvas, streamline]);
  
  // Update the path with current points
  const updatePath = useCallback(() => {
    if (!canvas || !activePath.current) return;
    
    const points = smoothedPoints.current;
    if (points.length < 2) return;
    
    // Build SVG path data
    let pathData = '';
    
    // Start point
    const p0 = points[0];
    if (p0) {
      pathData = `M ${p0.x} ${p0.y}`;
    }
    
    if (smoothing > 0) {
      // Smooth curve using quadratic bezier curves
      for (let i = 1; i < points.length; i++) {
        const p1 = points[i];
        const p_1 = points[i - 1];
        
        if (p_1 && p1) {
          // Calculate control point
          const cpx = (p_1.x + p1.x) / 2;
          const cpy = (p_1.y + p1.y) / 2;
          
          // Add quadratic bezier segment
          pathData += ` Q ${p_1.x} ${p_1.y}, ${cpx} ${cpy}`;
        }
      }
      
      // Add last segment
      const lastPoint = points[points.length - 1];
      if (lastPoint) {
        pathData += ` L ${lastPoint.x} ${lastPoint.y}`;
      }
    } else {
      // Simple polyline for no smoothing
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        if (p) {
          pathData += ` L ${p.x} ${p.y}`;
        }
      }
    }
    
    // Apply path data to active path
    activePath.current.set({ path: pathData });
    canvas.renderAll();
  }, [canvas, smoothing]);
  
  // Complete drawing
  const completeDrawing = useCallback(() => {
    if (!canvas || !activePath.current) return;
    
    // Final update to path
    updatePath();
    
    // Simplify path if needed based on precision
    if (precision < 1 && smoothedPoints.current.length > 10) {
      const simplified = simplifyPoints(smoothedPoints.current, precision);
      
      if (simplified.length >= 2) {
        // Build simplified path
        let pathData = `M ${simplified[0].x} ${simplified[0].y}`;
        
        for (let i = 1; i < simplified.length; i++) {
          pathData += ` L ${simplified[i].x} ${simplified[i].y}`;
        }
        
        // Update path
        activePath.current.set({ path: pathData });
      }
    }
    
    // Add path to canvas and reset
    canvas.renderAll();
    
    // Reset state
    const finishedPath = activePath.current;
    activePath.current = null;
    rawPoints.current = [];
    smoothedPoints.current = [];
    
    return finishedPath;
  }, [canvas, updatePath, precision]);
  
  // Simplify points using Ramer-Douglas-Peucker algorithm
  const simplifyPoints = useCallback((points: Point[], tolerance: number): Point[] => {
    // Base case: 2 or fewer points
    if (points.length <= 2) return points;
    
    // Convert tolerance from 0-1 range to a pixel value
    const pixelTolerance = 5 + (1 - tolerance) * 10;
    
    // Find the point with the maximum distance
    let maxDistance = 0;
    let maxIndex = 0;
    
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    
    if (!startPoint || !endPoint) return points;
    
    for (let i = 1; i < points.length - 1; i++) {
      const point = points[i];
      if (!point) continue;
      
      const distance = perpendicularDistance(point, startPoint, endPoint);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    
    // If max distance is greater than tolerance, recursively simplify
    if (maxDistance > pixelTolerance) {
      // Recursive case
      const firstHalf = simplifyPoints(points.slice(0, maxIndex + 1), tolerance);
      const secondHalf = simplifyPoints(points.slice(maxIndex), tolerance);
      
      // Concatenate the two parts (removing duplicate point)
      return [...firstHalf.slice(0, -1), ...secondHalf];
    } else {
      // Base case: All points in this segment are within tolerance
      return [startPoint, endPoint];
    }
  }, []);
  
  // Calculate perpendicular distance from point to line segment
  const perpendicularDistance = useCallback((point: Point, lineStart: Point, lineEnd: Point): number => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    
    // If the line is just a point, return the distance to that point
    const lineLengthSquared = dx * dx + dy * dy;
    if (lineLengthSquared === 0) {
      const dx2 = point.x - lineStart.x;
      const dy2 = point.y - lineStart.y;
      return Math.sqrt(dx2 * dx2 + dy2 * dy2);
    }
    
    // Calculate the projection of the point onto the line
    const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
    
    if (t < 0) {
      // Point projects outside the line segment, near lineStart
      const dx2 = point.x - lineStart.x;
      const dy2 = point.y - lineStart.y;
      return Math.sqrt(dx2 * dx2 + dy2 * dy2);
    } else if (t > 1) {
      // Point projects outside the line segment, near lineEnd
      const dx2 = point.x - lineEnd.x;
      const dy2 = point.y - lineEnd.y;
      return Math.sqrt(dx2 * dx2 + dy2 * dy2);
    } else {
      // Point projects onto the line segment
      const projectionX = lineStart.x + t * dx;
      const projectionY = lineStart.y + t * dy;
      const dx2 = point.x - projectionX;
      const dy2 = point.y - projectionY;
      return Math.sqrt(dx2 * dx2 + dy2 * dy2);
    }
  }, []);
  
  return {
    startDrawing,
    addPoint,
    updatePath,
    completeDrawing
  };
};

export default useFreehandDrawingPolish;
