
/**
 * Custom hook for processing points in drawing operations
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Point } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";
import { isTouchEvent } from "@/utils/fabric";
import { snapToGrid } from "@/utils/grid/snapping";
import { straightenStroke } from "@/utils/geometry/straightening";

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
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   * @returns {Point | null} Processed point or null if not applicable
   */
  const processPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    if (!fabricCanvasRef.current) return null;

    let clientX: number;
    let clientY: number;

    if (isTouchEvent(e)) {
      clientX = e.touches[0]?.clientX || 0;
      clientY = e.touches[0]?.clientY || 0;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    if (clientX === undefined || clientY === undefined) {
      console.warn("ClientX or ClientY is undefined. Touch event might be incomplete.");
      return null;
    }

    // Create a pointer event-like object that Fabric.js can process
    const pointer = fabricCanvasRef.current.getPointer({ clientX, clientY } as any);

    if (!pointer || pointer.x === undefined || pointer.y === undefined) {
      console.warn("Pointer or pointer coordinates are undefined.");
      return null;
    }

    // Apply grid snapping based on current tool
    const point = {
      x: pointer.x,
      y: pointer.y
    };
    
    if (tool === 'wall' || tool === 'room' || tool === 'straightLine') {
      return snapToGrid(point);
    }

    return point;
  }, [fabricCanvasRef, tool]);
  
  /**
   * Process path points from a fabric path
   * @param {any} path - Fabric path object
   * @param {boolean} isEnclosed - Whether the path should be enclosed
   * @returns {Object} Processed points
   */
  const processPathPoints = useCallback((path: any, isEnclosed: boolean = false): { 
    finalPoints: Point[];
    pixelPoints: Point[];
  } => {
    // Extract points from path object if it exists
    const extractedPoints: Point[] = [];
    
    if (path && path.path) {
      try {
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
      } catch (error) {
        console.error("Error processing path points:", error);
      }
    }
    
    // Apply grid snapping and straightening
    const processedPoints = 
      (tool === 'wall' || tool === 'room' || tool === 'straightLine') 
        ? straightenStroke(extractedPoints.map(pt => snapToGrid(pt)))
        : extractedPoints;
    
    return { 
      finalPoints: processedPoints, 
      pixelPoints: processedPoints 
    };
  }, [tool]);
  
  return { 
    processPoint,
    processPathPoints 
  };
};
