
/**
 * Hook for calculating area of shapes on the canvas
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { useGeometryEngine } from './useGeometryEngine';
import logger from '@/utils/logger';

interface UseAreaCalculationOptions {
  includeInvisible?: boolean;
}

export const useAreaCalculation = (
  canvas: FabricCanvas | null,
  options: UseAreaCalculationOptions = {}
) => {
  const { includeInvisible = false } = options;
  const { calculateArea } = useGeometryEngine();
  
  /**
   * Extract points from a fabric object
   */
  const getPointsFromObject = useCallback((obj: any): Point[] => {
    // Handle different object types
    if (obj.type === 'polygon' && obj.points) {
      return obj.points.map((p: any) => ({
        x: p.x + obj.left,
        y: p.y + obj.top
      }));
    } else if (obj.type === 'rect') {
      const { left, top, width, height } = obj;
      return [
        { x: left, y: top },
        { x: left + width, y: top },
        { x: left + width, y: top + height },
        { x: left, y: top + height },
      ];
    } else if (obj.type === 'path' && obj.path) {
      // Complex case, would need to implement path parsing
      logger.warn('Path area calculation not fully implemented');
      return [];
    }
    
    // Default case
    return [];
  }, []);
  
  /**
   * Calculate area of a specific object
   */
  const calculateObjectArea = useCallback(async (obj: any): Promise<number> => {
    try {
      const points = getPointsFromObject(obj);
      if (points.length < 3) {
        return 0;
      }
      
      return await calculateArea(points);
    } catch (error) {
      logger.error('Error calculating object area', { error });
      return 0;
    }
  }, [getPointsFromObject, calculateArea]);
  
  /**
   * Calculate area of all objects or selected objects
   */
  const calculateCanvasArea = useCallback(async (selectedOnly = false): Promise<{ areaM2: number }> => {
    if (!canvas) {
      return { areaM2: 0 };
    }
    
    try {
      let objects;
      if (selectedOnly) {
        objects = canvas.getActiveObjects();
      } else {
        objects = canvas.getObjects().filter(obj => {
          return includeInvisible || obj.visible !== false;
        });
      }
      
      let totalArea = 0;
      for (const obj of objects) {
        if ((obj as any).isGrid) continue; // Skip grid objects
        
        const area = await calculateObjectArea(obj);
        totalArea += area;
      }
      
      // Convert to square meters (assuming canvas units are in cm)
      const areaM2 = totalArea / 10000;
      
      return { areaM2 };
    } catch (error) {
      logger.error('Error calculating canvas area', { error });
      return { areaM2: 0 };
    }
  }, [canvas, includeInvisible, calculateObjectArea]);
  
  return {
    calculateArea: calculateCanvasArea,
    calculateObjectArea
  };
};
