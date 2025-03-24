
/**
 * Custom hook for tracking drawing state
 * Manages mouse events and drawing coordinate tracking
 * @module useDrawingState
 */
import { useState, useCallback, useRef, useEffect } from "react";
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
    
    console.log("Drawing started at:", startPoint, "with tool:", tool);
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
    
    console.log("Drawing moved to:", currentPoint, "with tool:", tool);
  }, [drawingState.isDrawing, fabricCanvasRef, tool]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    // Keep the drawing state active for a moment to ensure the tooltip is visible
    cleanupTimeouts();
    
    console.log("Drawing ended, keeping state active briefly");
    
    timeoutRef.current = window.setTimeout(() => {
      setDrawingState({
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        cursorPosition: null
      });
      console.log("Drawing state reset");
      timeoutRef.current = null;
    }, 500); // Longer delay to keep tooltip visible after drawing ends
  }, [cleanupTimeouts]);

  // Add handler for line scaling events
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const handleLineScaling = (e: any) => {
      if (tool === 'select') {
        // Use client coordinates from the event for positioning if available
        const cursorPosition = e.e ? { 
          x: e.e.clientX || 0, 
          y: e.e.clientY || 0 
        } : { x: 0, y: 0 };
        
        setDrawingState({
          isDrawing: true,
          startPoint: e.startPoint,
          currentPoint: e.endPoint,
          cursorPosition
        });
      }
    };

    canvas.on('line:scaling', handleLineScaling);
    
    return () => {
      canvas.off('line:scaling', handleLineScaling);
    };
  }, [fabricCanvasRef, tool]);

  // Make sure to update drawing state when tool changes
  useEffect(() => {
    if (tool !== 'straightLine' && tool !== 'room' && tool !== 'select' && drawingState.isDrawing) {
      cleanupTimeouts();
      setDrawingState({
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        cursorPosition: null
      });
    }
  }, [tool, drawingState.isDrawing, cleanupTimeouts]);

  return {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts
  };
};
