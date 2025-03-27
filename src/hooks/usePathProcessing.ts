
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
 * Path processing constants
 * Defines thresholds and timing limits for processing drawn paths
 */
const PATH_PROCESSING = {
  /**
   * Default line thickness in pixels
   * Ensures consistent line appearance across the application
   * @constant {number}
   */
  DEFAULT_THICKNESS: 2,
  
  /**
   * Default line color in hex format
   * Standard color for drawing operations
   * @constant {string}
   */
  DEFAULT_COLOR: "#000000",
  
  /**
   * Minimum path length in pixels for processing
   * Prevents processing of very short accidental paths
   * @constant {number}
   */
  MIN_PATH_LENGTH: 5,
  
  /**
   * Maximum time allowed for path processing in ms
   * Prevents long-running operations that could freeze the UI
   * @constant {number}
   */
  MAX_PROCESSING_TIME: 500,
  
  /**
   * Minimum points required for a valid path
   * Ensures sufficient data for shape creation
   * @constant {number}
   */
  MIN_POINTS_REQUIRED: 2
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
  lineThickness = PATH_PROCESSING.DEFAULT_THICKNESS,
  lineColor = PATH_PROCESSING.DEFAULT_COLOR,
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
    console.log("processCreatedPath called with path:", path);
    
    if (!fabricCanvasRef.current || !processPathPoints) {
      console.error("Cannot process path: canvas or path processor not available");
      logger.warn("Cannot process path: canvas or path processor not available");
      return;
    }
    
    logger.info(`Processing path for tool: ${tool}`);
    console.log("Processing path for tool:", tool, path);
    
    // Performance tracking for path processing
    const startTime = performance.now();
    
    try {
      // Remove original path since we'll convert it
      if (path && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(path);
      }
      
      // Process the path based on current tool
      switch (tool) {
        case "wall":
        case "straightLine": {
          // Process path points and create a straight polyline
          const { finalPoints, pixelPoints } = processPathPoints(path);
          console.log("Processed straight line points:", finalPoints, pixelPoints);
          
          if (pixelPoints.length >= PATH_PROCESSING.MIN_POINTS_REQUIRED) {
            const success = createPolyline(finalPoints, pixelPoints);
            console.log("Straight line creation success:", success);
            
            if (!success) {
              throw new Error("Failed to create polyline");
            }
          } else {
            console.warn(`Not enough points to create a polyline (minimum ${PATH_PROCESSING.MIN_POINTS_REQUIRED} required)`);
          }
          break;
        }
        
        case "room": {
          // Process path points and create an enclosed shape
          const { finalPoints, pixelPoints } = processPathPoints(path, true);
          const success = createPolyline(finalPoints, pixelPoints, true);
          console.log("Room creation success:", success);
          
          if (!success) {
            throw new Error("Failed to create room polyline");
          }
          break;
        }
        
        case "draw": {
          // For freehand drawing, we keep the original path style but apply our styling
          if (path && fabricCanvasRef.current) {
            const { finalPoints, pixelPoints } = processPathPoints(path);
            console.log("Processed freehand points:", pixelPoints.length);
            
            if (pixelPoints.length >= PATH_PROCESSING.MIN_POINTS_REQUIRED) {
              const success = createPolyline(finalPoints, pixelPoints, false, lineColor);
              console.log("Freehand line creation success:", success);
              
              if (!success) {
                throw new Error("Failed to create freehand polyline");
              }
            } else {
              console.warn(`Not enough points for freehand drawing (minimum ${PATH_PROCESSING.MIN_POINTS_REQUIRED} required)`);
            }
          }
          break;
        }
        
        default:
          // For other tools, just keep the original path
          if (path && fabricCanvasRef.current) {
            fabricCanvasRef.current.add(path);
          }
          break;
      }
      
      // Performance monitoring for path processing
      const processingTime = performance.now() - startTime;
      if (processingTime > PATH_PROCESSING.MAX_PROCESSING_TIME) {
        logger.warn(`Path processing took ${processingTime.toFixed(1)}ms, which exceeds the recommended limit of ${PATH_PROCESSING.MAX_PROCESSING_TIME}ms`);
      }
      
      // Force canvas to render
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.requestRenderAll();
      }
    } catch (error) {
      console.error("Error in processCreatedPath:", error);
      logger.error("Error processing created path:", error);
    }
    
  }, [fabricCanvasRef, tool, processPathPoints, createPolyline, lineThickness, lineColor]);

  return { processCreatedPath };
};

