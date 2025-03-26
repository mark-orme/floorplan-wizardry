/**
 * Custom hook for managing drawing state on the canvas
 * @module useDrawingState
 */
import { useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { DrawingState, Point } from "@/types/drawingTypes";
import { snapToGrid } from "@/utils/grid/core";
import { GRID_SIZE } from "@/utils/drawing";
import { usePointProcessing } from "./usePointProcessing";

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
  
  // Get point processing functions for snapping
  const { snapCurrentPoint } = usePointProcessing(tool, "#000000");
  
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
    
    // Snap the initial point to grid
    const snappedPoint = snapToGrid(pointer, GRID_SIZE);
    
    // Start drawing, set the starting point with all required properties
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: snappedPoint,
      currentPoint: snappedPoint,
      cursorPosition: pointer,
      midPoint: {
        x: snappedPoint.x,
        y: snappedPoint.y
      }
    }));
    
    console.log("Mouse down - Start drawing at:", snappedPoint);
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
      
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      const pointer = canvas.getPointer(e.e);
      
      // Always update cursor position for tooltips, even when not drawing
      if (drawingState.isDrawing && drawingState.startPoint) {
        // Apply point snapping based on the current tool
        const snappedPoint = snapCurrentPoint(drawingState.startPoint, pointer);
        
        // Calculate midpoint between start and current points
        const midPoint = {
          x: (drawingState.startPoint.x + snappedPoint.x) / 2,
          y: (drawingState.startPoint.y + snappedPoint.y) / 2
        };
        
        // Update the current point with all required properties
        setDrawingState(prevState => ({
          ...prevState,
          currentPoint: snappedPoint,
          cursorPosition: pointer,
          midPoint: midPoint
        }));
        
        // Debug log for development
        if (process.env.NODE_ENV === 'development') {
          console.log("Drawing in progress:", {
            start: drawingState.startPoint,
            current: snappedPoint,
            mid: midPoint
          });
        }
      } else {
        // Just update cursor position for hover tooltips
        setDrawingState(prevState => ({
          ...prevState,
          cursorPosition: pointer
        }));
      }
    });
  }, [fabricCanvasRef, drawingState.isDrawing, drawingState.startPoint, snapCurrentPoint]);
  
  /**
   * Handle mouse up event on the canvas
   */
  const handleMouseUp = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Update selection state based on canvas state
    const canvas = fabricCanvasRef.current;
    const hasActiveSelection = canvas.getActiveObject() !== null;
    
    console.log("Mouse up - Completing drawing. Selection active:", hasActiveSelection);
    
    // Keep the measurement tooltip visible for a moment after drawing
    timeoutRef.current = window.setTimeout(() => {
      // Keep drawing state true for a little longer to show the measurement
      setDrawingState(prevState => ({
        ...prevState,
        isDrawing: false,  // We need this to be false to stop actual drawing
        selectionActive: hasActiveSelection
      }));
      
      // Only after showing the measurement, fully clear the points
      // This has been increased to 2.5 seconds to ensure measurement visibility
      setTimeout(() => {
        setDrawingState(prevState => ({
          ...prevState,
          startPoint: null,
          currentPoint: null,
          midPoint: null,
        }));
      }, 2500); // Keep measurement visible for 2.5 seconds after finishing
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
