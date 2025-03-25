
/**
 * Custom hook for processing Fabric.js paths into polylines
 * @module usePathProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Path, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { MAX_OBJECTS_PER_CANVAS } from "@/utils/drawing";
import { DrawingTool } from "./useCanvasState";
import { fabricPathToPoints } from "@/utils/fabricPathUtils";
import { usePointProcessing } from "./usePointProcessing";
import { usePolylineCreation } from "./usePolylineCreation";
import { straightenStroke } from "@/utils/geometry";
import logger from "@/utils/logger";
import { FloorPlan } from "@/types/floorPlanTypes";
import { Point } from "@/types/drawingTypes";

/**
 * Props for the usePathProcessing hook
 * @interface UsePathProcessingProps
 */
interface UsePathProcessingProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current floor index */
  currentFloor: number;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Current line thickness */
  lineThickness?: number;
  /** Current line color */
  lineColor?: string;
}

/**
 * Enhanced Fabric Path with additional properties
 * @interface EnhancedPath
 * @extends Path
 */
interface EnhancedPath extends Path {
  /** Path data array */
  path?: Array<Array<number | string>>;
  /** Line color */
  stroke?: string | null;
}

/**
 * Type definition for the hook's return value
 * @interface UsePathProcessingResult
 */
interface UsePathProcessingResult {
  /** Process a newly created path and convert it to appropriate shapes */
  processCreatedPath: (path: Path) => void;
}

/**
 * Hook for handling path creation and processing
 * @param {UsePathProcessingProps} props - Hook properties
 * @returns {UsePathProcessingResult} Path creation handler
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
  lineColor = "#000000"
}: UsePathProcessingProps): UsePathProcessingResult => {
  
  // Use the point processing hook, passing the line color
  const { processPoints, convertToPixelPoints, isShapeClosed } = usePointProcessing(tool, lineColor);
  
  // Use the polyline creation hook
  const { createPolyline } = usePolylineCreation({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor
  });
  
  /**
   * Process a newly created path and convert it to appropriate shapes
   * @param {Path} path - The fabric.js path object
   */
  const processCreatedPath = useCallback((path: Path) => {
    logger.info("Path created event triggered");
    
    if (!fabricCanvasRef.current) return;
    const fabricCanvas = fabricCanvasRef.current;
    
    const enhancedPath = path as EnhancedPath;
    if (!enhancedPath.path) {
      logger.error("Invalid path object:", path);
      return;
    }
    
    try {
      // Check for too many objects on canvas (performance optimization)
      const currentObjects = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'polyline' || obj.type === 'path'
      );
      
      if (currentObjects.length > MAX_OBJECTS_PER_CANVAS) {
        toast.warning(`Maximum objects reached (${MAX_OBJECTS_PER_CANVAS}). Please save or clear some objects.`);
        fabricCanvas.remove(path);
        return;
      }
      
      // Extract points from path
      const points = fabricPathToPoints(enhancedPath.path);
      logger.info("Points extracted from path:", points.length);
      
      if (points.length < 2) {
        logger.error("Not enough points to create a path");
        fabricCanvas.remove(path);
        return;
      }
      
      // Get the path's current color before processing
      const pathColor = typeof enhancedPath.stroke === 'string' ? enhancedPath.stroke : lineColor;
      logger.info("Detected path color:", pathColor);
      
      // Process the points according to the current tool
      let finalPoints = processPoints(points);
      
      // Apply straightening for wall lines
      if (tool === "straightLine") {
        logger.info("Applying strict wall straightening");
        finalPoints = straightenStroke(finalPoints);
      }
      
      // Check if the shape is closed (first and last points are very close)
      const isEnclosed = isShapeClosed(finalPoints);
      
      // Convert meter coordinates to pixel coordinates for display
      const pixelPoints = convertToPixelPoints(finalPoints);
      
      logger.info("Creating polyline with points:", pixelPoints.length, isEnclosed ? "(enclosed shape)" : "");
      
      // Remove the temporary path before creating the polyline
      fabricCanvas.remove(path);
      
      // Create the polyline from the processed points, passing the isEnclosed flag
      // Pass the original path's color to maintain color consistency 
      const success = createPolyline(finalPoints, pixelPoints, isEnclosed, pathColor);
      
      if (success) {
        logger.info(`Line drawn and added to canvas successfully with color: ${pathColor}`);
      }
      
    } catch (error) {
      logger.error("Error processing drawing:", error);
      toast.error("Failed to process drawing");
      
      // Safety cleanup if there was an error
      if (fabricCanvasRef.current && path) {
        try {
          fabricCanvasRef.current.remove(path);
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    }
  }, [fabricCanvasRef, processPoints, convertToPixelPoints, isShapeClosed, createPolyline, lineColor, tool]);
  
  return { processCreatedPath };
};
