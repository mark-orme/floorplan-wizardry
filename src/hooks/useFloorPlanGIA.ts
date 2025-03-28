
/**
 * Floor Plan GIA Calculation Hook
 * @module useFloorPlanGIA
 */

import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { extractPolygonsFromObjects } from '@/utils/pathProcessingUtils';
import { calculatePolygonArea, calculateTotalAreaInPixels, pixelsToSquareMeters } from '@/utils/areaCalculation';

/**
 * Props for useFloorPlanGIA hook
 * @interface UseFloorPlanGIAProps
 */
interface UseFloorPlanGIAProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to set GIA value */
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for calculating Gross Internal Area (GIA) of a floor plan
 * @param props Hook properties
 * @returns GIA calculation utilities
 */
export const useFloorPlanGIA = (props: UseFloorPlanGIAProps) => {
  const { fabricCanvasRef, setGia } = props;

  /**
   * Recalculate Gross Internal Area based on canvas objects
   */
  const recalculateGIA = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Get all objects except grid
    const objects = canvas.getObjects().filter((obj: any) => !obj.isGrid);
    
    // Extract polygons from objects
    const polygons = extractPolygonsFromObjects(objects);
    
    if (polygons.length === 0) {
      setGia(0);
      return;
    }
    
    // Calculate total area in pixels
    const areaInPixels = calculateTotalAreaInPixels(polygons);
    
    // Convert to square meters
    const areaInSquareMeters = pixelsToSquareMeters(areaInPixels);
    
    // Update state
    setGia(areaInSquareMeters);
  }, [fabricCanvasRef, setGia]);

  return {
    recalculateGIA
  };
};
