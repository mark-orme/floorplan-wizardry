
/**
 * Custom hook for managing drawing state on the canvas
 * @module useDrawingState
 */
import { useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { DrawingState, Point } from "@/types/drawingTypes";
import { snapToGrid } from "@/utils/grid/core";
import { GRID_SIZE, PIXELS_PER_METER } from "@/utils/drawing";
import { usePointProcessing } from "./usePointProcessing";
import { calculateMidpoint } from "@/utils/geometry";

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
  // Fix: Pass an object with the required properties instead of just the tool
  const { snapCurrentPoint } = usePointProcessing({
    fabricCanvasRef,
    gridLayerRef: { current: [] }
  });
  
  // Initialize drawing state with all required properties
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false,
    currentZoom: 1
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
    
    // Snap the initial point to grid (convert to meters)
    const snappedPoint = {
      x: Math.round(pointer.x / PIXELS_PER_METER * 10) / 10,
      y: Math.round(pointer.y / PIXELS_PER_METER * 10) / 10
    };
    
    // Start drawing, set the starting point with all required properties
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: snappedPoint,
      currentPoint: snappedPoint,
      cursorPosition: pointer,
      midPoint: snappedPoint
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
      const cursorPointInMeters = {
        x: pointer.x / PIXELS_PER_METER,
        y: pointer.y / PIXELS_PER_METER
      };
      
      // Always update cursor position for tooltips, even when not drawing
      if (drawingState.isDrawing && drawingState.startPoint) {
        // Apply point snapping to get grid aligned point in meters
        const snappedPoint = {
          x: Math.round(cursorPointInMeters.x * 10) / 10,
          y: Math.round(cursorPointInMeters.y * 10) / 10
        };
        
        // Calculate midpoint between start and current points
        const midPoint = {
          x: (drawingState.startPoint.x + snappedPoint.x) / 2,
          y: (drawingState.startPoint.y + snappedPoint.y) / 2
        };
        
        // Update the current point with all required properties
        setDrawingState(prevState => ({
          ...prevState,
          currentPoint: snappedPoint,
          cursorPosition: cursorPointInMeters,
          midPoint: midPoint
        }));
        
        // Enhanced debug log
        const dx = snappedPoint.x - drawingState.startPoint.x;
        const dy = snappedPoint.y - drawingState.startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        console.log("Drawing in progress:", {
          start: drawingState.startPoint,
          current: snappedPoint,
          mid: midPoint,
          distance: distance.toFixed(1) + "m"
        });
      } else {
        // Just update cursor position for hover tooltips
        setDrawingState(prevState => ({
          ...prevState,
          cursorPosition: cursorPointInMeters
        }));
      }
    });
  }, [fabricCanvasRef, drawingState.isDrawing, drawingState.startPoint]);
  
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
      // First update to keep points but mark drawing as complete
      setDrawingState(prevState => ({
        ...prevState,
        isDrawing: false,
        selectionActive: hasActiveSelection
      }));
      
      // After a longer delay, clear the points
      setTimeout(() => {
        // Then fully clear the points after showing measurement
        setDrawingState(prevState => ({
          ...prevState,
          startPoint: null,
          currentPoint: null,
          midPoint: null,
        }));
      }, 5000); // Extended to 5 seconds for better visibility
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
