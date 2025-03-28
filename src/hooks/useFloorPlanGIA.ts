
/**
 * Hook for calculating Gross Internal Area (GIA) for floor plans
 * @module useFloorPlanGIA
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { separateGridAndDrawingObjects } from "@/utils/canvasLayerOrdering";
import { extractPolygonsFromObjects } from "@/utils/pathProcessingUtils";
import { calculateTotalAreaInPixels } from "@/utils/areaCalculation";
import { pixelsToSquareMeters } from "@/utils/geometry/conversion";
import { PIXELS_PER_METER } from "@/constants/numerics";

/**
 * Hook that handles GIA calculations for floor plans
 */
export const useFloorPlanGIA = ({
  fabricCanvasRef,
  setGia
}: {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
}) => {
  /**
   * Recalculate GIA based on canvas objects
   */
  const recalculateGIA = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Get only the drawing objects (exclude grid)
      const { drawingObjects } = separateGridAndDrawingObjects(canvas);
      
      // Extract polygons from the drawing objects
      const polygons = extractPolygonsFromObjects(drawingObjects);
      
      // For each polygon, extract its points
      const allPoints = polygons.map(poly => poly.points);
      
      // Calculate the area in pixels
      const areaInPixels = calculateTotalAreaInPixels(allPoints);
      
      // Convert to square meters
      const areaInSqMeters = pixelsToSquareMeters(areaInPixels, PIXELS_PER_METER);
      
      // Update the GIA
      setGia(areaInSqMeters);
      
    } catch (error) {
      console.error("Error calculating GIA:", error);
    }
  }, [fabricCanvasRef, setGia]);
  
  return {
    recalculateGIA
  };
};
