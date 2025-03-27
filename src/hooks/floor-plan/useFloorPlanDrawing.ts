/**
 * Custom hook for floor plan drawing functionality
 * Manages drawing operations and calculations for floor plans
 * @module floor-plan/useFloorPlanDrawing
 */
import { useCallback, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { FloorPlan, Point } from "@/types/floorPlanTypes";
import { calculateGIA } from "@/utils/geometry";
import { PIXELS_PER_METER } from "@/constants/numerics";
import logger from "@/utils/logger";

/**
 * Props for the useFloorPlanDrawing hook
 * @interface UseFloorPlanDrawingProps
 */
interface UseFloorPlanDrawingProps {
  /** Reference to the Fabric.js canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  
  /** Current floor plan */
  floorPlan: FloorPlan;
  
  /** Function to update floor plan */
  setFloorPlan: React.Dispatch<React.SetStateAction<FloorPlan>>;
  
  /** Function to update gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Result type for useFloorPlanDrawing hook
 * @interface UseFloorPlanDrawingResult
 */
interface UseFloorPlanDrawingResult {
  /** Whether drawing is currently active */
  isDrawing: boolean;
  
  /** Start drawing at a specific point */
  startDrawing: (point: Point) => void;
  
  /** Continue drawing to a specific point */
  continueDrawing: (point: Point) => void;
  
  /** End drawing at a specific point */
  endDrawing: (point: Point) => void;
  
  /** Cancel the current drawing operation */
  cancelDrawing: () => void;
  
  /** Calculate areas for the floor plan */
  calculateAreas: () => number[];
  
  /** Current drawing points */
  drawingPoints: Point[];
}

/**
 * Hook for managing floor plan drawing operations
 * Handles drawing state, point tracking, and area calculations
 * 
 * @param {UseFloorPlanDrawingProps} props - Hook properties
 * @returns {UseFloorPlanDrawingResult} Drawing state and functions
 */
export const useFloorPlanDrawing = ({
  fabricCanvasRef,
  floorPlan,
  setFloorPlan,
  setGia
}: UseFloorPlanDrawingProps): UseFloorPlanDrawingResult => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  
  /**
   * Start drawing at a specific point
   * @param {Point} point - Starting point
   */
  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setDrawingPoints([point]);
    logger.debug("Started drawing at", point);
  }, []);
  
  /**
   * Continue drawing to a specific point
   * @param {Point} point - Next point in the drawing
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing) return;
    
    setDrawingPoints(prev => [...prev, point]);
  }, [isDrawing]);
  
  /**
   * End drawing at a specific point
   * @param {Point} point - Final point in the drawing
   */
  const endDrawing = useCallback((point: Point) => {
    if (!isDrawing) return;
    
    // Add the final point if it's different from the last one
    const finalPoints = [...drawingPoints];
    const lastPoint = finalPoints[finalPoints.length - 1];
    
    if (!lastPoint || lastPoint.x !== point.x || lastPoint.y !== point.y) {
      finalPoints.push(point);
    }
    
    // Only save if we have at least 2 points
    if (finalPoints.length >= 2) {
      // Update the floor plan with the new stroke
      setFloorPlan(prev => {
        const updatedPlan = { ...prev };
        if (!updatedPlan.strokes) {
          updatedPlan.strokes = [];
        }
        updatedPlan.strokes = [...updatedPlan.strokes, finalPoints];
        return updatedPlan;
      });
      
      // Calculate area if the shape is closed (first point = last point)
      const firstPoint = finalPoints[0];
      const lastPoint = finalPoints[finalPoints.length - 1];
      
      if (firstPoint && lastPoint && 
          Math.abs(firstPoint.x - lastPoint.x) < 0.1 && 
          Math.abs(firstPoint.y - lastPoint.y) < 0.1) {
        // Calculate area for closed shape
        const area = calculateGIA([finalPoints]);
        setGia(prev => prev + area);
        toast.success(`Area: ${area.toFixed(2)} m²`);
      }
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setDrawingPoints([]);
    logger.debug("Ended drawing with", finalPoints.length, "points");
  }, [isDrawing, drawingPoints, setFloorPlan, setGia]);
  
  /**
   * Cancel the current drawing operation
   */
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setDrawingPoints([]);
    logger.debug("Drawing cancelled");
  }, []);
  
  /**
   * Calculate areas for the floor plan
   * @returns {number[]} Array of calculated areas
   */
  const calculateAreas = useCallback(() => {
    return calculateFloorPlanAreas(floorPlan);
  }, [floorPlan]);
  
  return {
    isDrawing,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    calculateAreas,
    drawingPoints
  };
};

/**
 * Calculate areas for all enclosed shapes in a floor plan
 * @param {FloorPlan} floorPlan - The floor plan to calculate areas for
 * @returns {number[]} Array of calculated areas
 */
export const calculateFloorPlanAreas = (floorPlan: FloorPlan): number[] => {
  if (!floorPlan.strokes || floorPlan.strokes.length === 0) {
    return [];
  }
  
  // We need to ensure we're working with Point[][] rather than Stroke[][]
  // Since Stroke = Point[], we can use the strokes directly
  const areas = calculateGIA(floorPlan.strokes);
  
  return [areas];
};

/**
 * Convert pixel coordinates to meter coordinates
 * @param {Point} pixelPoint - Point in pixel coordinates
 * @returns {Point} Point in meter coordinates
 */
export const pixelToMeterCoordinates = (pixelPoint: Point): Point => {
  return {
    x: pixelPoint.x / PIXELS_PER_METER,
    y: pixelPoint.y / PIXELS_PER_METER
  };
};

/**
 * Convert meter coordinates to pixel coordinates
 * @param {Point} meterPoint - Point in meter coordinates
 * @returns {Point} Point in pixel coordinates
 */
export const meterToPixelCoordinates = (meterPoint: Point): Point => {
  return {
    x: meterPoint.x * PIXELS_PER_METER,
    y: meterPoint.y * PIXELS_PER_METER
  };
};

/**
 * Check if a point is inside a polygon
 * @param {Point} point - The point to check
 * @param {Point[]} polygon - Array of points forming the polygon
 * @returns {boolean} True if the point is inside the polygon
 */
export const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  if (polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};
