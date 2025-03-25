/**
 * Custom hook for managing drawing state
 * @module useDrawingState
 */
import { useCallback, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "./useCanvasState";
import { DrawingState, Point } from "@/types/drawingTypes";
import { calculateMidpoint } from "@/utils/geometry/midpointCalculation";
import { PIXELS_PER_METER } from "@/utils/drawing";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

/**
 * Hook for tracking drawing state during user interactions
 */
export const useDrawingState = ({ 
  fabricCanvasRef,
  tool 
}: UseDrawingStateProps) => {
  // Drawing state management
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null
  });
  
  // Timeout ref for cleaning up
  const mouseStateTimeoutRef = useRef<number | null>(null);
  
  // Handle mouse down event
  const handleMouseDown = useCallback((e: any) => {
    if (tool !== "straightLine" && tool !== "room") return;
    
    // Clear any existing timeout
    if (mouseStateTimeoutRef.current) {
      clearTimeout(mouseStateTimeoutRef.current);
      mouseStateTimeoutRef.current = null;
    }
    
    const point = e.absolutePointer || e.pointer;
    if (!point) return;
    
    // Convert canvas coordinates to meters
    const worldPoint = {
      x: point.x / PIXELS_PER_METER,
      y: point.y / PIXELS_PER_METER
    };
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: worldPoint,
      currentPoint: worldPoint
    }));
  }, [tool]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((e: any) => {
    const point = e.absolutePointer || e.pointer;
    if (!point) return;
    
    // Convert canvas coordinates to meters
    const worldPoint = {
      x: point.x / PIXELS_PER_METER,
      y: point.y / PIXELS_PER_METER
    };
    
    // Update cursor position for tooltips regardless of whether we're drawing
    setDrawingState(prev => {
      // Calculate midpoint if we're drawing and have a start point
      let midPoint: Point | null = null;
      if (prev.startPoint) {
        // Calculate midpoint between start and current point for tooltip positioning
        midPoint = calculateMidpoint(prev.startPoint, worldPoint);
      }
      
      return {
        ...prev,
        currentPoint: prev.isDrawing ? worldPoint : null,
        cursorPosition: worldPoint, // Always update cursor position regardless of drawing state
        midPoint: midPoint
      };
    });
  }, []);
  
  // Handle mouse up event
  const handleMouseUp = useCallback(() => {
    // Set a timeout to delay clearing the state
    // This allows any UI elements like tooltips to display for a moment
    mouseStateTimeoutRef.current = window.setTimeout(() => {
      setDrawingState(prev => ({
        ...prev,
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        midPoint: null
        // Keeping cursorPosition so we can still show hover measurements
      }));
      mouseStateTimeoutRef.current = null;
    }, 500);
  }, []);
  
  // Cleanup timeouts on unmount
  const cleanupTimeouts = useCallback(() => {
    if (mouseStateTimeoutRef.current) {
      clearTimeout(mouseStateTimeoutRef.current);
      mouseStateTimeoutRef.current = null;
    }
  }, []);
  
  return {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  };
};
