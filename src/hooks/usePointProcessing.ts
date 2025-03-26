
/**
 * Custom hook for processing points in drawing operations
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Point } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";
import { isTouchEvent } from "@/utils/fabric";

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
interface UsePointProcessingReturn {
  /** Process canvas point for drawing */
  processPoint: (e: MouseEvent | TouchEvent) => Point | null;
  /** Process path points from a path (optional) */
  processPathPoints?: (path: any, isEnclosed?: boolean) => { finalPoints: Point[], pixelPoints: Point[] };
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

    let clientX, clientY;

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

    const pointer = fabricCanvasRef.current.getPointer({ clientX, clientY } as any);

    if (!pointer || pointer.x === undefined || pointer.y === undefined) {
      console.warn("Pointer or pointer coordinates are undefined.");
      return null;
    }

    return {
      x: pointer.x,
      y: pointer.y
    };
  }, [fabricCanvasRef, tool]);
  
  /**
   * Process path points from a fabric path
   * @param {any} path - Fabric path object
   * @param {boolean} isEnclosed - Whether the path should be enclosed
   * @returns {Object} Processed points
   */
  const processPathPoints = useCallback((path: any, isEnclosed: boolean = false) => {
    // This is a placeholder implementation
    // Actual implementation would process path points for creation of lines or shapes
    const finalPoints: Point[] = [];
    const pixelPoints: Point[] = [];
    
    // Path points processing logic would go here
    
    return { finalPoints, pixelPoints };
  }, [fabricCanvasRef]);
  
  return { 
    processPoint,
    processPathPoints 
  };
};
