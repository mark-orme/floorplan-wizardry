/**
 * Custom hook for processing paths drawn on the canvas
 * @module usePathProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject } from "fabric";
import { usePointProcessing } from "./usePointProcessing";
import { usePolylineCreation } from "./usePolylineCreation";
import { DrawingTool } from "./useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";
import logger from "@/utils/logger";

interface UsePathProcessingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness?: number;
  lineColor?: string;
  recalculateGIA?: () => void;
}

/**
 * Hook that handles processing paths on the canvas
 * @param {UsePathProcessingProps} props - Hook properties
 * @returns Processing functions
 */
export const usePathProcessing = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  currentFloor,
  setFloorPlans,
  setGia,
  lineThickness = 2,
  lineColor = "#000000",
  recalculateGIA
}: UsePathProcessingProps) => {
  // Initialize point processing hook
  const { processPathPoints } = usePointProcessing({
    fabricCanvasRef,
    gridLayerRef
  });
  
  // Initialize polyline creation hook with GIA recalculation
  const { createPolyline } = usePolylineCreation({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    recalculateGIA
  });

  /**
   * Process a created path and convert it to appropriate shape
   * @param path - The Fabric.js path object
   */
  const processCreatedPath = useCallback((path: FabricPath) => {
    if (!fabricCanvasRef.current) return;
    
    logger.info(`Processing path for tool: ${tool}`);
    
    // Remove original path since we'll convert it
    if (path) {
      fabricCanvasRef.current.remove(path);
    }
    
    // Process the path based on current tool
    switch (tool) {
      case "wall":
      case "straightLine": {
        // Process path points and create a straight polyline
        const { finalPoints, pixelPoints } = processPathPoints(path);
        createPolyline(finalPoints, pixelPoints);
        break;
      }
      
      case "room": {
        // Process path points and create an enclosed shape
        const { finalPoints, pixelPoints } = processPathPoints(path, true);
        createPolyline(finalPoints, pixelPoints, true);
        break;
      }
      
      case "freehand": {
        // For freehand drawing, we keep the original path style
        if (path) {
          path.set({
            stroke: lineColor,
            strokeWidth: lineThickness,
            fill: 'transparent'
          });
          fabricCanvasRef.current.add(path);
        }
        break;
      }
      
      default:
        // For other tools, just keep the original path
        if (path) {
          fabricCanvasRef.current.add(path);
        }
        break;
    }
    
    // Force canvas to render
    fabricCanvasRef.current.requestRenderAll();
    
  }, [fabricCanvasRef, tool, processPathPoints, createPolyline, lineThickness, lineColor]);

  return { processCreatedPath };
};
