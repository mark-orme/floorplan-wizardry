
/**
 * Hook for handling mouse events during drawing
 * Abstracts common mouse event handling logic for various drawing tools
 * @module hooks/drawing/useMouseEvents
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/types/core/DrawingTool";
import { DrawingMode } from "@/constants/drawingModes";
import { Point } from "@/types/core/Geometry";
import logger from "@/utils/logger";
import * as Sentry from '@sentry/react';

/**
 * Props for useMouseEvents hook
 * @interface UseMouseEventsProps
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
 * @interface UseMouseEventsResult
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
 * Provides standardized event handlers for mouse/touch interactions
 * Manages document-level event listeners and cleanup
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
    isDrawing,
    lineThickness,
    lineColor
  } = props;

  // Set Sentry context for the component
  useEffect(() => {
    Sentry.setTag("component", "useMouseEvents");
    Sentry.setTag("currentTool", tool);
    
    Sentry.setContext("drawingState", {
      tool,
      isDrawing,
      lineThickness,
      lineColor
    });
    
    return () => {
      // Clear component-specific tags when unmounting
      Sentry.setTag("component", null);
    };
  }, [tool, isDrawing, lineThickness, lineColor]);

  // Reference to store active timeouts for cleanup
  const timeoutRef = useRef<number[]>([]);
  
  // Track bound document event listeners
  const mouseMoveListenerRef = useRef<((e: MouseEvent | TouchEvent) => void) | null>(null);
  const mouseUpListenerRef = useRef<((e: MouseEvent | TouchEvent) => void) | null>(null);
  
  /**
   * Convert event coordinates to canvas point
   * Handles coordinate conversion considering zoom and pan
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   * @returns {Point | null} Canvas point or null if canvas is not available
   */
  const getCanvasPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Get pointer from canvas (handles zoom and pan)
    return canvas.getPointer(e);
  }, [fabricCanvasRef]);

  /**
   * Handle mouse down event
   * Initiates drawing operation and sets up document-level event listeners
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   */
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Return early if tool is not a drawing tool
    const isSelectOrHand = tool === DrawingMode.SELECT || tool === DrawingMode.HAND;
    if (isSelectOrHand) {
      return;
    }
    
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    // Set Sentry context for mouse down
    Sentry.setTag("action", "mouseDown");
    Sentry.setContext("mouseEvent", {
      type: "mouseDown",
      tool,
      point,
      timestamp: new Date().toISOString()
    });
    
    logger.info("Mouse down", { tool, point, isDrawingTool: !isSelectOrHand });
    
    // Start drawing at the point
    startDrawing(point);
    
    // Define handlers here to avoid reference errors
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
  }, [fabricCanvasRef, tool, getCanvasPoint, startDrawing]);

  /**
   * Handle mouse move event
   * Updates drawing operation as mouse/touch moves
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   */
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent): void => {
    if (!isDrawing) return;
    
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    // Set Sentry context for mouse move (throttled to avoid excessive logging)
    if (Math.random() < 0.05) { // Only log ~5% of moves to avoid spamming Sentry
      Sentry.setContext("mouseEvent", {
        type: "mouseMove",
        tool,
        point,
        isDrawing,
        timestamp: new Date().toISOString()
      });
    }
    
    // Continue drawing to the point
    continueDrawing(point);
    
    // Prevent default to avoid text selection during drawing
    e.preventDefault();
  }, [isDrawing, getCanvasPoint, continueDrawing, tool]);

  /**
   * Handle mouse up event
   * Completes drawing operation
   * 
   * @param {MouseEvent | TouchEvent} e - Mouse or touch event
   */
  const handleMouseUp = useCallback((e: MouseEvent | TouchEvent): void => {
    if (!isDrawing) return;
    
    // Get point from event
    const point = getCanvasPoint(e);
    if (!point) return;
    
    // Set Sentry context for mouse up
    Sentry.setTag("action", "mouseUp");
    Sentry.setContext("mouseEvent", {
      type: "mouseUp",
      tool,
      point,
      timestamp: new Date().toISOString()
    });
    
    // End drawing at the point
    endDrawing(point);
    
    // Prevent default
    e.preventDefault();
  }, [isDrawing, getCanvasPoint, endDrawing, tool]);

  /**
   * Clean up event listeners and timeouts
   * Ensures proper cleanup to prevent memory leaks
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

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanup
  };
};
