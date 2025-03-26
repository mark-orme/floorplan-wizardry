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
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: pointer,
      currentPoint: pointer,
      cursorPosition: pointer,
      midPoint: null
    }));
    
    console.log("Mouse down - Start drawing at:", pointer);
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
      if (drawingState.isDrawing) {
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
          midPoint: midPoint
        }));
        
        if (tool === "straightLine" || tool === "wall") {
          console.log("Drawing line:", { 
            start: drawingState.startPoint, 
            current: pointer, 
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
  }, [fabricCanvasRef, drawingState.isDrawing, drawingState.startPoint, tool]);
  
  /**
   * Handle mouse up event on the canvas
   */
  const handleMouseUp = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Update selection state based on canvas state
    const canvas = fabricCanvasRef.current;
    const hasActiveSelection = canvas.getActiveObject() !== null;
    
    console.log("Mouse up - End drawing, selection active:", hasActiveSelection);
    
    // Clear drawing state after a short delay
    // But preserve selection state for tooltips on selected objects
    timeoutRef.current = window.setTimeout(() => {
      // Keep drawing state true for a little longer to show the measurement
      setDrawingState(prevState => ({
        ...prevState,
        isDrawing: false,  // We need this to be false to stop actual drawing
        selectionActive: hasActiveSelection
      }));
      
      // Only after showing the measurement, fully clear the points
      // This has been increased from 1.5 to 2.5 seconds to ensure measurement visibility
      setTimeout(() => {
        console.log("Clearing drawing points after showing measurement");
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
