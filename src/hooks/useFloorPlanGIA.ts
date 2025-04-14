
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { calculateGIA } from '@/utils/geometryUtils';
import { Point } from '@/types/core/Point';

interface UseFloorPlanGIAProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for calculating Gross Internal Area (GIA) of a floor plan
 */
export const useFloorPlanGIA = ({ fabricCanvasRef, setGia }: UseFloorPlanGIAProps) => {
  // Recalculate GIA based on walls on the canvas
  const recalculateGIA = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Get all wall objects
    const walls = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'wall'
    );
    
    if (walls.length === 0) {
      setGia(0);
      return;
    }
    
    // Extract points from walls to form a polygon
    // This is a simplified approach - in a real app, you'd need to
    // properly detect closed rooms from wall segments
    const points: Point[] = [];
    walls.forEach(wall => {
      if (wall.type === 'line') {
        points.push({ x: (wall as any).x1, y: (wall as any).y1 });
        points.push({ x: (wall as any).x2, y: (wall as any).y2 });
      }
    });
    
    // Calculate GIA
    const area = calculateGIA(points);
    
    // Convert to square meters (assuming 100px = 1m)
    const areaInSquareMeters = area / 10000;
    
    // Update GIA state
    setGia(areaInSquareMeters);
  }, [fabricCanvasRef, setGia]);
  
  // Listen for changes to the canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleObjectAdded = () => recalculateGIA();
    const handleObjectRemoved = () => recalculateGIA();
    const handleObjectModified = () => recalculateGIA();
    
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('object:modified', handleObjectModified);
    
    // Initial calculation
    recalculateGIA();
    
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [fabricCanvasRef, recalculateGIA]);
  
  return { recalculateGIA };
};
