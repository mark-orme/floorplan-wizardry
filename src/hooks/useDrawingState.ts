
/**
 * Custom hook for tracking drawing state
 * Manages mouse events and drawing coordinate tracking
 * @module useDrawingState
 */
import { useState, useCallback, useRef } from "react";
import { DrawingTool } from "./useCanvasState";
import { Point } from "@/utils/drawingTypes";
import { PIXELS_PER_METER } from "@/utils/drawing";
import { adjustPointForPanning } from "@/utils/geometry";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<any>;
  tool: DrawingTool;
}

/**
 * Hook for tracking the current drawing state
 * @param {UseDrawingStateProps} props - Hook properties
 * @returns {Object} Drawing state and handler functions
 */
export const useDrawingState = ({ 
  fabricCanvasRef,
  tool
}: UseDrawingStateProps) => {
  // Track current drawing state
  const [drawingState, setDrawingState] = useState<{
    isDrawing: boolean;
    startPoint: Point | null;
    currentPoint: Point | null;
    cursorPosition: { x: number; y: number } | null;
  }>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null
  });
  
  // Use ref for timeout cleanup
  const timeoutRef = useRef<number | null>(null);
  
  // Clear any existing timeouts
  const cleanupTimeouts = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Mouse down handler
  const handleMouseDown = useCallback((e: any) => {
    // Only track for straightLine and room tools
    if (tool !== 'straightLine' && tool !== 'room') return;
    
    if (!fabricCanvasRef.current) return;
    
    cleanupTimeouts();
    
    // Get pointer position in canvas coordinates
    const pointer = fabricCanvasRef.current.getPointer(e.e);
    
    // Convert from pixel coordinates to meter coordinates
    const startPoint = {
      x: pointer.x / PIXELS_PER_METER,
      y: pointer.y / PIXELS_PER_METER
    };
    
    // Get cursor position in screen coordinates for tooltip positioning
    const absolutePosition = {
      x: e.e.clientX,
      y: e.e.clientY
    };
    
    setDrawingState({
      isDrawing: true,
      startPoint,
      currentPoint: startPoint, // Initialize current as same as start
      cursorPosition: absolutePosition
    });
    
    console.log("Drawing started at:", startPoint);
  }, [fabricCanvasRef, tool, cleanupTimeouts]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: any) => {
    // Only update if drawing and using relevant tools
    if (!drawingState.isDrawing || (tool !== 'straightLine' && tool !== 'room')) return;
    
    if (!fabricCanvasRef.current) return;
    
    // Get current pointer position in canvas coordinates
    const pointer = fabricCanvasRef.current.getPointer(e.e);
    
    // Convert from pixel coordinates to meter coordinates
    const currentPoint = {
      x: pointer.x / PIXELS_PER_METER,
      y: pointer.y / PIXELS_PER_METER
    };
    
    // Get cursor position in screen coordinates for tooltip positioning
    const absolutePosition = {
      x: e.e.clientX,
      y: e.e.clientY
    };
    
    setDrawingState(prev => ({
      ...prev,
      currentPoint,
      cursorPosition: absolutePosition
    }));
  }, [drawingState.isDrawing, fabricCanvasRef, tool]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    // Reset drawing state after a small delay to allow for tooltip visibility
    cleanupTimeouts();
    
    timeoutRef.current = window.setTimeout(() => {
      setDrawingState({
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        cursorPosition: null
      });
      timeoutRef.current = null;
    }, 300); // Short delay to keep tooltip visible briefly after drawing ends
  }, [cleanupTimeouts]);

  return {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  };
};
