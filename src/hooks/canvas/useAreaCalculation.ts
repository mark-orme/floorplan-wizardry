
/**
 * Hook for calculating area of shapes on canvas
 * Provides utilities for calculating areas of polygons, rooms, and floor plans
 */
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Point } from '@/types/core/Geometry';
import { useGeometryEngine } from './useGeometryEngine';
import logger from '@/utils/logger';

interface UseAreaCalculationProps {
  fabricCanvas: FabricCanvas | null;
}

interface AreaResult {
  areaM2: number;
  rooms?: Array<{
    id: string;
    label?: string;
    areaM2: number;
  }>;
}

export const useAreaCalculation = (fabricCanvas: FabricCanvas | null) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastCalculatedArea, setLastCalculatedArea] = useState<AreaResult>({ areaM2: 0 });
  
  const { 
    calculatePolygonArea,
    isPolygonClockwise
  } = useGeometryEngine();
  
  /**
   * Extract points from a fabric object
   */
  const getObjectPoints = useCallback((obj: FabricObject): Point[] => {
    if (!obj) return [];
    
    // Handle different object types
    if (obj.type === 'polygon' && 'points' in obj) {
      // Polygon objects
      const points = (obj as any).points as { x: number, y: number }[];
      return points.map(p => ({ x: p.x, y: p.y }));
    } else if (obj.type === 'polyline' && 'points' in obj) {
      // Polyline objects
      const points = (obj as any).points as { x: number, y: number }[];
      return points.map(p => ({ x: p.x, y: p.y }));
    } else if (obj.type === 'path' && 'path' in obj) {
      // Path objects - more complex
      try {
        // Convert SVG path to points
        const path = (obj as any).path;
        if (!Array.isArray(path)) return [];
        
        const points: Point[] = [];
        
        // Extract points from path commands
        path.forEach(cmd => {
          if (Array.isArray(cmd) && cmd.length >= 3) {
            if (cmd[0] === 'L' || cmd[0] === 'M') {
              points.push({ x: cmd[1], y: cmd[2] });
            } else if (cmd[0] === 'Q' && cmd.length >= 5) {
              // For quadratic curves, add both control point and end point
              points.push({ x: cmd[3], y: cmd[4] });
            } else if (cmd[0] === 'C' && cmd.length >= 7) {
              // For cubic curves, add end point
              points.push({ x: cmd[5], y: cmd[6] });
            }
          }
        });
        
        return points;
      } catch (error) {
        logger.error('Error extracting points from path', { error });
        return [];
      }
    } else if ('left' in obj && 'top' in obj && 'width' in obj && 'height' in obj) {
      // Rectangle objects
      const left = obj.left || 0;
      const top = obj.top || 0;
      const width = (obj as any).width || 0;
      const height = (obj as any).height || 0;
      
      return [
        { x: left, y: top },
        { x: left + width, y: top },
        { x: left + width, y: top + height },
        { x: left, y: top + height }
      ];
    }
    
    return [];
  }, []);
  
  /**
   * Calculate area for a single object
   */
  const calculateObjectArea = useCallback((obj: FabricObject): number => {
    try {
      const points = getObjectPoints(obj);
      if (points.length < 3) return 0;
      
      // Make sure points are in the right order (clockwise)
      const clockwise = isPolygonClockwise(points);
      const orderedPoints = clockwise ? points : [...points].reverse();
      
      // Calculate area
      return calculatePolygonArea(orderedPoints);
    } catch (error) {
      logger.error('Error calculating object area', { error });
      return 0;
    }
  }, [getObjectPoints, isPolygonClockwise, calculatePolygonArea]);
  
  /**
   * Calculate area for all qualifying objects on canvas
   */
  const calculateArea = useCallback(async (): Promise<AreaResult> => {
    if (!fabricCanvas) {
      return { areaM2: 0 };
    }
    
    setIsCalculating(true);
    
    try {
      // Get all objects that could represent rooms
      const objects = fabricCanvas.getObjects().filter(obj => {
        // Identify closed shapes that could represent rooms
        return (
          obj.type === 'polygon' || 
          obj.type === 'path' || 
          obj.type === 'rect' ||
          (obj as any).isRoom === true
        );
      });
      
      let totalArea = 0;
      const rooms: AreaResult['rooms'] = [];
      
      // Calculate area for each object
      for (const obj of objects) {
        const area = calculateObjectArea(obj);
        
        if (area > 0) {
          // Convert to square meters (canvas units are assumed to be in cm)
          const areaM2 = area / 10000; // cm² to m²
          
          totalArea += areaM2;
          
          // Try to get a label for the room
          const objLabel = (obj as any).type === 'room' ? 
                          (obj as any).label || 'Room' : 
                          (obj as any).id ? `Shape ${(obj as any).id}` : 'Shape';
          
          rooms.push({
            id: (obj as any).id || `obj_${obj.type}_${Math.random().toString(36).substr(2, 9)}`,
            label: objLabel,
            areaM2
          });
        }
      }
      
      const result = { areaM2: totalArea, rooms };
      setLastCalculatedArea(result);
      
      return result;
    } catch (error) {
      logger.error('Error calculating area', { error });
      return { areaM2: 0 };
    } finally {
      setIsCalculating(false);
    }
  }, [fabricCanvas, calculateObjectArea]);
  
  return {
    calculateArea,
    isCalculating,
    lastCalculatedArea
  };
};
