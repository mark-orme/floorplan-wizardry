/**
 * Custom hook for tracking drawing state
 * Manages mouse events and drawing coordinate tracking
 * @module useDrawingState
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { DrawingTool } from "./useCanvasState";
import { type DrawingState } from "@/types/drawingTypes";
import { Point } from "@/utils/drawingTypes";
import { PIXELS_PER_METER } from "@/utils/drawing";
import { adjustPointForPanning } from "@/utils/geometry";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<any>;
  tool: DrawingTool;
}

/**
 * Hook for managing drawing state during user interactions
 * @param {UseDrawingStateProps} props - Hook properties
 * @returns {Object} Drawing state and handlers
 */
export const useDrawingState = ({ 
  fabricCanvasRef,
  tool 
}: UseDrawingStateProps) => {
  // Track current drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false
  });
  
  // Use ref for timeout cleanup
  const timeoutRef = useRef<number | null>(null);
  // Track animation frame for performance
  const animationFrameRef = useRef<number | null>(null);
  
  // Clear any existing timeouts and animation frames
  const cleanupTimeouts = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Calculate midpoint between two points
  const calculateMidpoint = useCallback((start: Point, end: Point) => {
    return {
      x: start.x + (end.x - start.x) / 2,
      y: start.y + (end.y - start.y) / 2
    };
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
      cursorPosition: absolutePosition,
      midPoint: absolutePosition // Initially same as cursor position
    });
    
    console.log("Drawing started at:", startPoint, "with tool:", tool);
  }, [fabricCanvasRef, tool, cleanupTimeouts]);

  // Throttled update function using requestAnimationFrame
  const updateDrawingState = useCallback((e: any) => {
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
    
    setDrawingState(prev => {
      // Only calculate midpoint if we have both start and current points
      const midPoint = prev.startPoint ? 
        calculateMidpoint(prev.startPoint, currentPoint) : null;
      
      // Convert midpoint from meter to screen coordinates
      // This is an approximation as the exact conversion depends on canvas zoom/pan
      const midPointScreen = midPoint ? {
        x: absolutePosition.x - ((prev.cursorPosition?.x || 0) - absolutePosition.x) / 2,
        y: absolutePosition.y - ((prev.cursorPosition?.y || 0) - absolutePosition.y) / 2
      } : null;
      
      return {
        ...prev,
        currentPoint,
        cursorPosition: absolutePosition,
        midPoint: midPointScreen
      };
    });
    
    animationFrameRef.current = null;
  }, [fabricCanvasRef, calculateMidpoint]);

  // Mouse move handler with throttling
  const handleMouseMove = useCallback((e: any) => {
    // Only update if drawing and using relevant tools
    if (!drawingState.isDrawing || (tool !== 'straightLine' && tool !== 'room')) return;
    
    // Throttle updates using requestAnimationFrame for better performance
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(() => updateDrawingState(e));
    }
  }, [drawingState.isDrawing, tool, updateDrawingState]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    // Keep the drawing state active for a moment to ensure the tooltip is visible
    cleanupTimeouts();
    
    console.log("Drawing ended, keeping state active briefly");
    
    // Keep tooltip visible longer (750ms instead of 500ms)
    timeoutRef.current = window.setTimeout(() => {
      setDrawingState({
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        cursorPosition: null,
        midPoint: null
      });
      console.log("Drawing state reset");
      timeoutRef.current = null;
    }, 750); // Longer delay to keep tooltip visible after drawing ends
  }, [cleanupTimeouts]);

  // Add handler for line scaling events
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const handleLineScaling = (e: any) => {
      if (tool === 'select') {
        // Extract points for calculating midpoint 
        const startPoint = e.startPoint;
        const endPoint = e.endPoint;
        
        // Calculate the midpoint in meter coordinates
        const midPointMeter = calculateMidpoint(startPoint, endPoint);
        
        // Use client coordinates from the event for positioning if available
        const cursorPosition = e.e ? { 
          x: e.e.clientX || 0, 
          y: e.e.clientY || 0 
        } : { x: 0, y: 0 };
        
        // Calculate approximate screen position for midpoint
        // This is a simple approximation - for better accuracy we would need
        // to convert from canvas coordinates to screen coordinates
        setDrawingState({
          isDrawing: true,
          startPoint: startPoint,
          currentPoint: endPoint,
          cursorPosition: cursorPosition,
          midPoint: cursorPosition // Use cursor position as fallback
        });
      }
    };

    canvas.on('line:scaling', handleLineScaling);
    
    return () => {
      canvas.off('line:scaling', handleLineScaling);
    };
  }, [fabricCanvasRef, tool, calculateMidpoint]);

  // Make sure to update drawing state when tool changes
  useEffect(() => {
    if (tool !== 'straightLine' && tool !== 'room' && tool !== 'select' && drawingState.isDrawing) {
      cleanupTimeouts();
      setDrawingState({
        isDrawing: false,
        startPoint: null,
        currentPoint: null,
        cursorPosition: null,
        midPoint: null
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
