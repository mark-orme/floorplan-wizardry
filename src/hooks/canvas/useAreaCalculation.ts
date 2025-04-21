
/**
 * Hook for calculating areas of canvas objects
 * Uses web workers for performance
 */

import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useGeometryWorker } from '@/hooks/useGeometryWorker';
import { Point } from '@/types/core/Geometry';

interface AreaCalculationOptions {
  includeRooms?: boolean;
  includeWalls?: boolean;
  unit?: 'metric' | 'imperial';
}

interface AreaCalculationResult {
  areaM2: number;
  areaSqFt?: number;
  rooms?: {
    id: string;
    name: string;
    areaM2: number;
    areaSqFt?: number;
  }[];
}

export function useAreaCalculation(canvas: FabricCanvas | null) {
  const [calculating, setCalculating] = useState(false);
  const [lastResult, setLastResult] = useState<AreaCalculationResult | null>(null);
  
  // Use the geometry worker for calculations
  const { 
    initialized: workerInitialized,
    calculateArea,
    isProcessing
  } = useGeometryWorker();
  
  /**
   * Extract points from object
   */
  const getObjectPoints = useCallback((obj: any): Point[] => {
    // For polygon/polyline objects
    if (obj.points) {
      return obj.points.map((p: any) => ({
        x: p.x + obj.left,
        y: p.y + obj.top
      }));
    }
    
    // For path objects
    if (obj.path) {
      return obj.path.map((cmd: any) => {
        if (Array.isArray(cmd)) {
          return { x: cmd[1] + obj.left, y: cmd[2] + obj.top };
        }
        return { x: cmd.x + obj.left, y: cmd.y + obj.top };
      });
    }
    
    // For rectangle objects
    if (obj.type === 'rect') {
      const width = obj.width * obj.scaleX;
      const height = obj.height * obj.scaleY;
      return [
        { x: obj.left, y: obj.top },
        { x: obj.left + width, y: obj.top },
        { x: obj.left + width, y: obj.top + height },
        { x: obj.left, y: obj.top + height }
      ];
    }
    
    // Default empty array
    return [];
  }, []);
  
  /**
   * Convert meters to square feet
   */
  const metersToSquareFeet = useCallback((meters: number) => {
    return meters * 10.7639;
  }, []);
  
  /**
   * Calculate room areas
   */
  const calculateRoomAreas = useCallback(async (options: AreaCalculationOptions = {}) => {
    if (!canvas || !workerInitialized) {
      console.warn('Canvas or worker not initialized');
      return null;
    }
    
    try {
      setCalculating(true);
      
      // Get all objects that are rooms
      const rooms = canvas.getObjects().filter(obj => 
        obj.type === 'polygon' || 
        (obj.objectType === 'room' || obj.type === 'path')
      );
      
      // Calculate individual room areas
      const roomAreas = [];
      let totalArea = 0;
      
      for (const room of rooms) {
        const points = getObjectPoints(room);
        
        if (points.length >= 3) {
          const areaM2 = await calculateArea(points);
          totalArea += areaM2;
          
          roomAreas.push({
            id: room.id || `room-${roomAreas.length}`,
            name: room.name || `Room ${roomAreas.length + 1}`,
            areaM2,
            areaSqFt: options.unit === 'imperial' ? metersToSquareFeet(areaM2) : undefined
          });
        }
      }
      
      // Create result
      const result: AreaCalculationResult = {
        areaM2: totalArea,
        areaSqFt: options.unit === 'imperial' ? metersToSquareFeet(totalArea) : undefined
      };
      
      // Add rooms if requested
      if (options.includeRooms && roomAreas.length > 0) {
        result.rooms = roomAreas;
      }
      
      setLastResult(result);
      return result;
    } catch (error) {
      console.error('Error calculating areas:', error);
      throw error;
    } finally {
      setCalculating(false);
    }
  }, [canvas, workerInitialized, getObjectPoints, calculateArea, metersToSquareFeet]);
  
  return {
    calculateArea: calculateRoomAreas,
    calculating: calculating || isProcessing,
    lastResult,
    workerReady: workerInitialized
  };
}
