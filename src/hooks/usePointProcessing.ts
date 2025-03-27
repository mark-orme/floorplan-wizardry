
/**
 * Custom hook for processing points in drawing operations
 * Handles point transformation and grid snapping
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Point } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";
import { isTouchEvent, extractClientCoordinates } from "@/utils/fabric";
import { snapToGrid } from "@/utils/grid/snapping"; // Import from snapping directly
import { straightenStroke } from "@/utils/geometry/straightening";
import { handleError } from "@/utils/errorHandling";

/**
 * Point processing constants
 * Defines thresholds and settings for point manipulation
 */
const POINT_PROCESSING = {
  /**
   * Default snap threshold for general drawing in pixels
   * Higher values make it easier to snap to grid points
   * @constant {number}
   */
  DEFAULT_SNAP_THRESHOLD: 5,
  
  /**
   * Reduced snap threshold for freehand drawing in pixels
   * Smaller value preserves more natural hand movements
   * @constant {number}
   */
  FREEHAND_SNAP_THRESHOLD: 3,
  
  /**
   * Point sampling interval for path simplification
   * Used to reduce the number of points in complex paths
   * @constant {number}
   */
  SAMPLING_INTERVAL: 5
};

/**
 * Props for the usePointProcessing hook
 * @interface UsePointProcessingProps
 */
export interface UsePointProcessingProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool?: DrawingTool;
  /** Reference to grid layer objects (optional) */
  gridLayerRef?: React.MutableRefObject<FabricObject[]>;
}

/**
 * Return type for usePointProcessing hook
 * @interface UsePointProcessingReturn
 */
export interface UsePointProcessingReturn {
  /** Process canvas point for drawing */
  processPoint: (e: MouseEvent | TouchEvent) => Point | null;
  /** Process path points from a path */
  processPathPoints: (path: any, isEnclosed?: boolean) => { 
    finalPoints: Point[]; 
    pixelPoints: Point[] 
  };
  /** Apply grid snapping to a point */
  applyGridSnapping: (point: Point) => Point;
  /** Straighten a line between two points */
  applyStraightening: (startPoint: Point, currentPoint: Point) => Point;
}

/**
 * Hook for processing drawing points
 * Handles point extraction, transformation, and grid snapping
 * 
 * @param {UsePointProcessingProps} props - Hook properties
 * @returns {UsePointProcessingReturn} Point processing functions
 */
export const usePointProcessing = ({
  fabricCanvasRef,
  tool = "draw",
  gridLayerRef
}: UsePointProcessingProps): UsePointProcessingReturn => {
  /**
   * Apply grid snapping to a point
   * Ensures drawings align cleanly with the grid
   */
  const applyGridSnapping = useCallback((point: Point): Point => {
    console.log("Applying grid snapping to point:", point);
    // Use appropriate snap threshold based on drawing tool
    const snapThreshold = tool === 'draw' 
      ? POINT_PROCESSING.FREEHAND_SNAP_THRESHOLD 
      : POINT_PROCESSING.DEFAULT_SNAP_THRESHOLD;
      
    const snappedPoint = snapToGrid(point, snapThreshold);
    console.log("Snapped point result:", snappedPoint);
    return snappedPoint;
  }, [tool]);

  /**
   * Apply straightening to a line between points
   * Creates horizontal or vertical lines based on dominant direction
   */
  const applyStraightening = useCallback((startPoint: Point, currentPoint: Point): Point => {
    console.log("Straightening line between:", startPoint, currentPoint);
    
    // Calculate delta x and y to determine dominant direction
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    
    // Determine if line should be horizontal or vertical
    // If |dx| > |dy|, line is more horizontal than vertical
    const isHorizontal = Math.abs(dx) > Math.abs(dy);
    
    // Create straightened point
    const straightenedPoint: Point = {
      x: isHorizontal ? currentPoint.x : startPoint.x,
      y: isHorizontal ? startPoint.y : currentPoint.y
    };
    
    console.log("Straightened point result:", straightenedPoint);
    return straightenedPoint;
  }, []);

  /**
   * Process point from mouse or touch event
   * Extracts canvas coordinates and applies appropriate transformations
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   * @returns {Point | null} Processed point or null if not applicable
   */
  const processPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    try {
      if (!fabricCanvasRef.current) {
        console.warn("Cannot process point: canvas reference is null");
        return null;
      }

      // Use the utility function to extract coordinates safely
      const coords = extractClientCoordinates(e);
      if (!coords) {
        console.warn("Could not extract coordinates from event");
        return null;
      }

      // Create a pointer event-like object that Fabric.js can process
      const pointer = fabricCanvasRef.current.getPointer(coords as any);

      if (!pointer || pointer.x === undefined || pointer.y === undefined) {
        console.warn("Pointer or pointer coordinates are undefined.");
        return null;
      }

      // Create point from pointer coordinates
      const point = {
        x: pointer.x,
        y: pointer.y
      };
      
      console.log("Processed raw point from event:", point);
      
      // Return the raw point - snapping will be applied in the interaction handlers
      return point;
    } catch (error) {
      console.error("Error in processPoint:", error);
      handleError(error, {
        component: 'usePointProcessing',
        operation: 'process-point'
      });
      return null;
    }
  }, [fabricCanvasRef]);
  
  /**
   * Process path points from a fabric path
   * Extracts points, applies transformations, and handles path enclosure
   * 
   * @param {any} path - Fabric path object
   * @param {boolean} isEnclosed - Whether the path should be enclosed
   * @returns {Object} Processed points for final and pixel representations
   */
  const processPathPoints = useCallback((path: any, isEnclosed: boolean = false): { 
    finalPoints: Point[];
    pixelPoints: Point[];
  } => {
    try {
      console.log("Processing path points for path:", path);
      
      // Extract points from path object if it exists
      const extractedPoints: Point[] = [];
      
      if (path && path.path) {
        // Process the path data to extract points
        for (let i = 0; i < path.path.length; i++) {
          const cmd = path.path[i];
          
          // Only process line commands (L, l) and move commands (M, m)
          if (cmd[0] === 'L' || cmd[0] === 'l' || cmd[0] === 'M' || cmd[0] === 'm') {
            extractedPoints.push({ x: cmd[1], y: cmd[2] });
          }
        }
        
        // If the path should be enclosed, connect the last point to the first point
        if (isEnclosed && extractedPoints.length > 0) {
          extractedPoints.push({ ...extractedPoints[0] });
        }
      }
      
      console.log("Extracted points from path:", extractedPoints);
      
      // Apply grid snapping and straightening based on current tool
      let processedPoints = extractedPoints;
      
      if (tool === 'wall' || tool === 'room' || tool === 'straightLine') {
        // Apply straightening for these tools
        processedPoints = straightenStroke(extractedPoints);
        console.log("After straightening:", processedPoints);
        
        // Also apply snapping to each point with reduced threshold for better precision
        processedPoints = processedPoints.map(point => applyGridSnapping(point));
        console.log("After snapping (wall/straightLine):", processedPoints);
      } else if (tool === 'draw') {
        // For freehand drawing, we don't straighten but still snap to grid
        // Use a smaller snap threshold for freehand to maintain more natural drawing
        processedPoints = processedPoints.map(point => applyGridSnapping(point));
        console.log("After snapping (freehand):", processedPoints);
      }
      
      return { 
        finalPoints: processedPoints, 
        pixelPoints: processedPoints 
      };
    } catch (error) {
      console.error("Error in processPathPoints:", error);
      handleError(error, {
        component: 'usePointProcessing',
        operation: 'process-path-points'
      });
      
      // Return empty arrays on error
      return { finalPoints: [], pixelPoints: [] };
    }
  }, [tool, applyGridSnapping]);
  
  return { 
    processPoint,
    processPathPoints,
    applyGridSnapping,
    applyStraightening
  };
};

