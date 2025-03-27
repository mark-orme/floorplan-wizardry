
/**
 * Custom hook for processing paths drawn on the canvas
 * Handles the transformation of raw paths into proper shapes and objects
 * @module usePathProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Path as FabricPath, Object as FabricObject } from "fabric";
import { usePointProcessing, UsePointProcessingProps } from "./usePointProcessing";
import { usePolylineCreation } from "./usePolylineCreation";
import { DrawingTool } from "./useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";
import logger from "@/utils/logger";

/**
 * Default line style values when not specified
 * @constant {Object}
 */
const DEFAULT_LINE_STYLE = {
  /**
   * Default line thickness in pixels
   * @constant {number}
   */
  THICKNESS: 2,
  
  /**
   * Default line color in hex format
   * @constant {string}
   */
  COLOR: "#000000"
};

/**
 * Interface for usePathProcessing props
 * @interface UsePathProcessingProps
 */
interface UsePathProcessingProps {
  /** Reference to the Fabric.js canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current floor number */
  currentFloor: number;
  /** Function to update floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to update GIA value */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Line thickness to use (default: 2) */
  lineThickness?: number;
  /** Line color to use (default: "#000000") */
  lineColor?: string;
  /** Function to recalculate GIA after path changes */
  recalculateGIA?: () => void;
}

/**
 * Hook that handles processing paths on the canvas
 * Transforms raw paths into appropriate shapes based on the active tool
 * 
 * @param {UsePathProcessingProps} props - Hook properties
 * @returns {{processCreatedPath: (path: FabricPath) => void}} Processing functions
 */
export const usePathProcessing = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  currentFloor,
  setFloorPlans,
  setGia,
  lineThickness = DEFAULT_LINE_STYLE.THICKNESS,
  lineColor = DEFAULT_LINE_STYLE.COLOR,
  recalculateGIA
}: UsePathProcessingProps) => {
  // Initialize point processing hook with the proper props
  const pointProcessingProps: UsePointProcessingProps = {
    fabricCanvasRef,
    tool,
    gridLayerRef
  };
  
  const { processPathPoints } = usePointProcessing(pointProcessingProps);
  
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
   * Different tools result in different representations of the same path
   * 
   * @param {FabricPath} path - The Fabric.js path object
   * @returns {void}
   */
  const processCreatedPath = useCallback((path: FabricPath): void => {
    if (!fabricCanvasRef.current || !processPathPoints) return;
    
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
      
      case "draw": {
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
