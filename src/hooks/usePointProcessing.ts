/**
 * Custom hook for processing points in drawing operations
 * Handles point transformation and grid snapping
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Point } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";
import { isTouchEvent, extractClientCoordinates } from "@/utils/fabric"; // Fixed import
import { snapToGrid } from "@/utils/grid/core"; // Import from core directly
import { straightenStroke } from "@/utils/geometry/straightening";
import { handleError } from "@/utils/errorHandling";

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
   * Process point from mouse or touch event
   * Extracts canvas coordinates and applies appropriate transformations
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   * @returns {Point | null} Processed point or null if not applicable
   */
  const processPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    try {
      if (!fabricCanvasRef.current) return null;

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
      
      // Apply grid snapping based on current tool
      if (tool === 'wall' || tool === 'room' || tool === 'straightLine') {
        return snapToGrid(point);
      }

      return point;
    } catch (error) {
      handleError(error, {
        component: 'usePointProcessing',
        operation: 'process-point'
      });
      return null;
    }
  }, [fabricCanvasRef, tool]);
  
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
      
      // Apply grid snapping and straightening based on current tool
      const processedPoints = 
        (tool === 'wall' || tool === 'room' || tool === 'straightLine') 
          ? straightenStroke(extractedPoints.map(pt => snapToGrid(pt)))
          : extractedPoints;
      
      return { 
        finalPoints: processedPoints, 
        pixelPoints: processedPoints 
      };
    } catch (error) {
      handleError(error, {
        component: 'usePointProcessing',
        operation: 'process-path-points'
      });
      
      // Return empty arrays on error
      return { finalPoints: [], pixelPoints: [] };
    }
  }, [tool]);
  
  return { 
    processPoint,
    processPathPoints 
  };
};
