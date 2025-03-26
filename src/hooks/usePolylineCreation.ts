
/**
 * Custom hook for creating polylines from processed points
 * @module usePolylineCreation
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Polyline as FabricPolyline, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { PIXELS_PER_METER, DEFAULT_LINE_THICKNESS } from "@/constants/numerics";
import { calculateGIA } from "@/utils/geometry";
import { DrawingTool } from "./useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";
import { Point } from "@/types/drawingTypes";
import logger from "@/utils/logger";

/**
 * Props for the usePolylineCreation hook
 * @interface UsePolylineCreationProps
 */
interface UsePolylineCreationProps {
  /** Reference to the Fabric.js canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{
    past: FabricObject[][]; 
    future: FabricObject[][]
  }>;
  
  /** Current active drawing tool */
  tool: DrawingTool;
  
  /** Current floor index */
  currentFloor: number;
  
  /** Function to update floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  
  /** Function to update gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  
  /** Line thickness in pixels */
  lineThickness?: number;
  
  /** Line color in hex format */
  lineColor?: string;
  
  /** Function to recalculate GIA */
  recalculateGIA?: () => void;
}

/**
 * Result type for usePolylineCreation hook
 * @interface UsePolylineCreationResult
 */
interface UsePolylineCreationResult {
  /** Create a polyline from points and add it to the canvas */
  createPolyline: (
    finalPoints: { x: number; y: number }[], 
    pixelPoints: { x: number; y: number }[], 
    isEnclosed?: boolean, 
    overrideColor?: string
  ) => boolean;
}

/**
 * Hook for creating polylines from processed points
 * Handles the creation and styling of polylines on the canvas
 * 
 * @param props - Hook properties
 * @returns Object with createPolyline function
 */
export const usePolylineCreation = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  currentFloor,
  setFloorPlans,
  setGia,
  lineThickness = DEFAULT_LINE_THICKNESS,
  lineColor = "#000000",
  recalculateGIA
}: UsePolylineCreationProps): UsePolylineCreationResult => {
  
  /**
   * Create a polyline from processed points and add it to canvas
   * @param finalPoints - Array of points in meter coordinates
   * @param pixelPoints - Array of points in pixel coordinates
   * @param isEnclosed - Whether the shape is enclosed (closed)
   * @param overrideColor - Optional color override
   * @returns Boolean indicating success
   */
  const createPolyline = useCallback((
    finalPoints: { x: number; y: number }[],
    pixelPoints: { x: number; y: number }[],
    isEnclosed: boolean = false,
    overrideColor?: string
  ): boolean => {
    if (!fabricCanvasRef.current) return false;
    const fabricCanvas = fabricCanvasRef.current;
    
    try {
      // Use override color if provided, otherwise use the current lineColor
      const effectiveLineColor = overrideColor || lineColor || "#000000";
      
      // Create a polyline from the processed points
      const polylineOptions = {
        stroke: effectiveLineColor,
        strokeWidth: lineThickness,
        fill: isEnclosed ? `${effectiveLineColor}20` : 'transparent', // Semi-transparent fill for enclosed shapes
        objectType: isEnclosed ? 'room' : 'line',
        objectCaching: true,
        perPixelTargetFind: false,
        selectable: false,
        hoverCursor: 'default'
      };

      // Create the polyline with pixel points
      const polyline = new FabricPolyline(pixelPoints, polylineOptions);
      
      // Add the processed polyline to canvas
      fabricCanvas.add(polyline);
      
      logger.debug("Polyline added to canvas successfully with color:", effectiveLineColor);
      
      // Ensure grid stays in the background
      gridLayerRef.current.forEach(gridObj => {
        if (fabricCanvas.contains(gridObj)) {
          fabricCanvas.sendObjectToBack(gridObj);
        }
      });
      
      // Force a render to ensure the polyline is displayed
      fabricCanvas.requestRenderAll();
      
      // Update floor plans data
      setFloorPlans(prev => {
        const newFloorPlans = [...prev];
        if (newFloorPlans[currentFloor]) {
          newFloorPlans[currentFloor] = {
            ...newFloorPlans[currentFloor],
            strokes: [...newFloorPlans[currentFloor].strokes, finalPoints]
          };
          
          // Calculate and update area for enclosed shapes
          if (isEnclosed && finalPoints.length > 2) {
            const area = calculateGIA(finalPoints);
            setGia(prev => prev + area);
            toast.success(`Room shape enclosed: ${area.toFixed(2)} m²`);
          }
        }
        return newFloorPlans;
      });
      
      // Recalculate GIA after adding the polyline
      if (recalculateGIA && typeof recalculateGIA === 'function') {
        logger.info("Triggering GIA recalculation after polyline creation");
        recalculateGIA();
      }

      return true;
    } catch (err) {
      logger.error("Error creating polyline:", err);
      toast.error("Failed to create line");
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef, tool, currentFloor, setFloorPlans, setGia, lineThickness, lineColor, recalculateGIA]);

  return { createPolyline };
};
