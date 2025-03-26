/**
 * Custom hook for processing points in drawing operations
 * @module usePointProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point } from "@/types/drawingTypes";
import { DrawingTool } from "./useCanvasState";
import { isTouchEvent, getClientX, getClientY } from "@/utils/fabric";

/**
 * Props for the usePointProcessing hook
 * @interface UsePointProcessingProps
 */
export interface UsePointProcessingProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool?: DrawingTool;
}

/**
 * Return type for usePointProcessing hook
 * @interface UsePointProcessingReturn
 */
interface UsePointProcessingReturn {
  /** Process canvas point for drawing */
  processPoint: (e: Event) => Point | null;
}

/**
 * Hook for processing drawing points
 * @param {UsePointProcessingProps} props - Hook properties
 * @returns {UsePointProcessingReturn} Point processing functions
 */
export const usePointProcessing = ({
  fabricCanvasRef,
  tool = "draw"
}: UsePointProcessingProps): UsePointProcessingReturn => {
  /**
   * Process point from mouse or touch event
   * @param {Event} e - Mouse or touch event
   * @returns {Point | null} Processed point or null if not applicable
   */
  const processPoint = useCallback((e: Event): Point | null => {
    if (!fabricCanvasRef.current) return null;

    let clientX, clientY;

    if (isTouchEvent(e)) {
      clientX = getClientX(e);
      clientY = getClientY(e);
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
  
  return { processPoint };
};
