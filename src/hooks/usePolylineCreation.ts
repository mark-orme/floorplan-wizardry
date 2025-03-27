
/**
 * Custom hook for creating polylines from processed points
 * Manages the creation of line segments and shapes on the canvas
 * @module usePolylineCreation
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Polyline as FabricPolyline, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { PIXELS_PER_METER, DEFAULT_LINE_THICKNESS } from "@/constants/numerics";
import { calculateGIA } from "@/utils/geometry";
import { DrawingTool } from "./useCanvasState";
import { FloorPlan, Point, Stroke } from "@/types/floorPlanTypes";
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
    finalPoints: Point[], 
    pixelPoints: Point[], 
    isEnclosed?: boolean, 
    overrideColor?: string
  ) => boolean;
}

/**
 * Hook for creating polylines from processed points
 * Handles the creation and styling of polylines on the canvas
 * 
 * @param {UsePolylineCreationProps} props - Hook properties
 * @returns {UsePolylineCreationResult} Object with createPolyline function
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
   * @param {Point[]} finalPoints - Array of points in meter coordinates
   * @param {Point[]} pixelPoints - Array of points in pixel coordinates
   * @param {boolean} isEnclosed - Whether the shape is enclosed (closed)
   * @param {string} overrideColor - Optional color override
   * @returns {boolean} Boolean indicating success
   */
  const createPolyline = useCallback((
    finalPoints: Point[],
    pixelPoints: Point[],
    isEnclosed: boolean = false,
    overrideColor?: string
  ): boolean => {
    try {
      console.log("CreatePolyline called with", {
        pointCount: pixelPoints?.length,
        isEnclosed,
        tool
      });
      
      if (!fabricCanvasRef.current) {
        console.error("Cannot create polyline: canvas is not available");
        logger.error("Cannot create polyline: canvas is not available");
        return false;
      }
      
      if (!pixelPoints || pixelPoints.length < 2) {
        console.warn("Cannot create polyline: not enough points", { pointCount: pixelPoints?.length });
        logger.warn("Cannot create polyline: not enough points", { pointCount: pixelPoints?.length });
        return false;
      }
      
      const canvas = fabricCanvasRef.current;
      
      // Log points for debugging
      console.log("Creating polyline with points:", pixelPoints);
      
      // Prepare points for Fabric.js Polyline
      // Fabric.js needs points in the format {x: number, y: number}
      const formattedPoints = pixelPoints.map(point => ({ x: point.x, y: point.y }));
      
      // Create the polyline object with improved visibility
      const polyline = new FabricPolyline(formattedPoints, {
        stroke: overrideColor || lineColor,
        strokeWidth: lineThickness,
        fill: isEnclosed ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        objectType: isEnclosed ? 'room' : (tool === 'wall' ? 'wall' : 'line'),
        selectable: true, // Allow selection for editing
        strokeUniform: true, // Maintain stroke width during scaling
        evented: true, // Ensure object receives events
        perPixelTargetFind: false, // Improves performance and makes lines easier to select
      });
      
      // Add the polyline to the canvas
      canvas.add(polyline);
      console.log(`Added polyline to canvas: ${polyline.objectType}`);
      
      // Ensure grid stays in the background
      if (gridLayerRef.current && gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(gridObj => {
          if (canvas.contains(gridObj)) {
            // Fix: Use canvas.sendObjectToBack instead of sendToBack
            canvas.sendObjectToBack(gridObj);
          }
        });
      }
      
      // Calculate GIA if it's a room
      if (isEnclosed && polyline.objectType === 'room') {
        // This is now properly typed with objectType
        if (recalculateGIA && typeof recalculateGIA === 'function') {
          recalculateGIA();
        }
      }
      
      // Add to floor plan model for persistence
      setFloorPlans(prevFloorPlans => {
        const updatedFloorPlans = [...prevFloorPlans];
        const currentFloorPlan = updatedFloorPlans[currentFloor];
        
        if (!currentFloorPlan) return prevFloorPlans;
        
        // Create a new stroke object
        const newStroke: Stroke = {
          id: `stroke-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          points: finalPoints,
          type: isEnclosed ? 'room' : (tool === 'wall' ? 'wall' : 'line'),
          color: overrideColor || lineColor,
          thickness: lineThickness
        };
        
        // Add the stroke to the current floor plan
        if (!currentFloorPlan.strokes) {
          currentFloorPlan.strokes = [];
        }
        
        currentFloorPlan.strokes.push(newStroke);
        
        return updatedFloorPlans;
      });
      
      // Force the canvas to render
      canvas.requestRenderAll();
      
      console.log(`${isEnclosed ? 'Room' : 'Line'} created successfully: ${polyline.objectType}`);
      
      return true;
    } catch (error) {
      logger.error("Error creating polyline:", error);
      console.error("Failed to create polyline:", error);
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef, tool, lineColor, lineThickness, recalculateGIA, currentFloor, setFloorPlans]);
  
  return { createPolyline };
};
