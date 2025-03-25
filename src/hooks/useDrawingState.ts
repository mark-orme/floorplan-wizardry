
/**
 * Custom hook for managing drawing state on the canvas
 * @module useDrawingState
 */
import { useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { DrawingState, Point } from "@/types/drawingTypes";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

/**
 * Manages the drawing state of the canvas, including drawing status,
 * start and current points, and handling mouse events.
 * @param {UseDrawingStateProps} props - Hook properties
 * @returns {Object} Drawing state and event handlers
 */
export const useDrawingState = (props: UseDrawingStateProps) => {
  const { fabricCanvasRef, tool } = props;
  
  // Timeout references for debouncing mouse events
  const timeoutRef = useRef<number | null>(null);
  const throttleRef = useRef<number | null>(null);
  
  // Initialize drawing state with all required properties
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false
  });
  
  /**
   * Clear any pending timeouts to prevent unexpected behavior
   */
  const cleanupTimeouts = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (throttleRef.current !== null) {
      window.cancelAnimationFrame(throttleRef.current);
      throttleRef.current = null;
    }
  }, []);
  
  /**
   * Handle mouse down event on the canvas
   * @param {Event} e - Mouse event
   */
  const handleMouseDown = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);
    
    // Start drawing, set the starting point with all required properties
    setDrawingState({
      isDrawing: true,
      startPoint: pointer,
      currentPoint: pointer,
      cursorPosition: pointer,
      midPoint: null,
      selectionActive: false
    });
  }, [fabricCanvasRef]);
  
  /**
   * Handle mouse move event on the canvas
   * @param {Event} e - Mouse event
   */
  const handleMouseMove = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    
    // Throttle the drawing to improve performance
    if (throttleRef.current) {
      return;
    }
    
    throttleRef.current = window.requestAnimationFrame(() => {
      throttleRef.current = null;
      
      if (drawingState.isDrawing) {
        const canvas = fabricCanvasRef.current;
        const pointer = canvas.getPointer(e.e);
        
        // Calculate midpoint between start and current points
        const midPoint = drawingState.startPoint ? {
          x: (drawingState.startPoint.x + pointer.x) / 2,
          y: (drawingState.startPoint.y + pointer.y) / 2
        } : null;
        
        // Update the current point with all required properties
        setDrawingState(prevState => ({
          ...prevState,
          currentPoint: pointer,
          cursorPosition: pointer,
          midPoint: midPoint,
          selectionActive: false
        }));
      }
    });
  }, [fabricCanvasRef, drawingState.isDrawing, drawingState.startPoint]);
  
  /**
   * Handle mouse up event on the canvas
   */
  const handleMouseUp = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Clear drawing state after a short delay
    timeoutRef.current = window.setTimeout(() => {
      setDrawingState(prevState => ({
        ...prevState,
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        cursorPosition: null,
        midPoint: null,
        selectionActive: false
      }));
    }, 50);
  }, [fabricCanvasRef]);
  
  return {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  };
};
