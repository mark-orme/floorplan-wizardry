
/**
 * Hook for handling mouse events during drawing
 * Abstracts common mouse event handling logic
 * @module hooks/drawing/useMouseEvents
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/types/core/DrawingTool";
import { DrawingMode } from "@/constants/drawingModes";
import { Point } from "@/types/core/Geometry";
import logger from "@/utils/logger";

/**
 * Props for useMouseEvents hook
 */
export interface UseMouseEventsProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Function to start drawing at a point */
  startDrawing: (point: Point) => void;
  /** Function to continue drawing to a point */
  continueDrawing: (point: Point) => void;
  /** Function to end drawing at a point */
  endDrawing: (point: Point) => void;
  /** Whether drawing is currently in progress */
  isDrawing: boolean;
  /** Line thickness for drawing */
  lineThickness?: number;
  /** Line color for drawing */
  lineColor?: string;
}

/**
 * Return type for useMouseEvents hook
 */
export interface UseMouseEventsResult {
  /** Handle mouse down event */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse move event */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse up event */
  handleMouseUp: (e: MouseEvent | TouchEvent) => void;
  /** Clean up event listeners */
  cleanup: () => void;
}

/**
 * Hook that abstracts mouse event handling during drawing
 * 
 * @param {UseMouseEventsProps} props - Hook properties
 * @returns {UseMouseEventsResult} Mouse event handlers
 */
export const useMouseEvents = (
  props: UseMouseEventsProps
): UseMouseEventsResult => {
  const {
    fabricCanvasRef,
    tool,
    startDrawing,
    continueDrawing,
    endDrawing,
    isDrawing
  } = props;

  // Reference to store active timeouts for cleanup
  const timeoutRef = useRef<number[]>([]);
  
  // Track bound document event listeners
  const mouseMoveListenerRef = useRef<((e: MouseEvent | TouchEvent) => void) | null>(null);
  const mouseUpListenerRef = useRef<((e: MouseEvent | TouchEvent) => void) | null>(null);
  
  /**
   * Clean up event listeners and timeouts
   */
  const cleanup = useCallback(() => {
    // Clean up timeouts
    timeoutRef.current.forEach(id => window.clearTimeout(id));
    timeoutRef.current = [];
    
    // Remove document event listeners
    if (mouseMoveListenerRef.current) {
      document.removeEventListener('mousemove', mouseMoveListenerRef.current);
      document.removeEventListener('touchmove', mouseMoveListenerRef.current);
      mouseMoveListenerRef.current = null;
    }
    
    if (mouseUpListenerRef.current) {
      document.removeEventListener('mouseup', mouseUpListenerRef.current);
      document.removeEventListener('touchend', mouseUpListenerRef.current);
      mouseUpListenerRef.current = null;
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  /**
   * Convert event coordinates to canvas point
   */
  const getCanvasPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Get pointer from canvas (handles zoom and pan)
    return canvas.getPointer(e);
  }, [fabricCanvasRef]);

  /**
   * Handle mouse down event
   */
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Return early if tool is not a drawing tool
    if (tool === DrawingMode.SELECT || tool === DrawingMode.HAND) {
      return;
    }
    
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    logger.info("Mouse down", { tool, point, isDrawingTool: tool !== DrawingMode.SELECT });
    
    // Start drawing at the point
    startDrawing(point);
    
    // Bind move and up handlers to document
    const handleDocumentMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      handleMouseMove(moveEvent);
    };
    
    const handleDocumentMouseUp = (upEvent: MouseEvent | TouchEvent) => {
      handleMouseUp(upEvent);
      
      // Clean up after mouse up
      cleanup();
    };
    
    // Store references to listeners for cleanup
    mouseMoveListenerRef.current = handleDocumentMouseMove;
    mouseUpListenerRef.current = handleDocumentMouseUp;
    
    // Add document-level event listeners
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('touchmove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);
    document.addEventListener('touchend', handleDocumentMouseUp);
    
    // Prevent default to avoid text selection during drawing
    e.preventDefault();
  }, [fabricCanvasRef, tool, getCanvasPoint, startDrawing, handleMouseMove, handleMouseUp, cleanup]);

  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent): void => {
    if (!isDrawing) return;
    
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    // Continue drawing to the point
    continueDrawing(point);
    
    // Prevent default to avoid text selection during drawing
    e.preventDefault();
  }, [isDrawing, getCanvasPoint, continueDrawing]);

  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((e: MouseEvent | TouchEvent): void => {
    if (!isDrawing) return;
    
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    // End drawing at the point
    endDrawing(point);
    
    // Prevent default
    e.preventDefault();
  }, [isDrawing, getCanvasPoint, endDrawing]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanup
  };
};
