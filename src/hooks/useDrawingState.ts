
/**
 * Custom hook for tracking drawing state and measurements
 * @module useDrawingState
 */
import { useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { PIXELS_PER_METER, type Point } from "@/utils/drawing";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Hook for managing the state of drawing operations
 * @param {UseDrawingStateProps} props - Hook properties
 * @returns {Object} Drawing state and update handlers
 */
export const useDrawingState = ({
  fabricCanvasRef
}: UseDrawingStateProps) => {
  // Drawing state
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    startPoint: null as Point | null,
    currentPoint: null as Point | null,
    cursorPosition: { x: 0, y: 0 }
  });
  
  // Throttling for performance
  const throttleRef = useRef<{
    lastCallTime: number;
    timeout: number | null;
  }>({
    lastCallTime: 0,
    timeout: null
  });

  /**
   * Handle mouse down events to capture start point
   */
  const handleMouseDown = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !fabricCanvasRef.current.isDrawingMode) return;
    
    const pointer = fabricCanvasRef.current.getPointer(e.e);
    const point = {
      x: pointer.x / PIXELS_PER_METER,
      y: pointer.y / PIXELS_PER_METER
    };
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: point,
      currentPoint: point,
      cursorPosition: { x: e.e.clientX, y: e.e.clientY }
    }));
  }, [fabricCanvasRef]);
  
  /**
   * Update drawing state with current pointer position
   */
  const updateDrawingState = useCallback((e: any) => {
    if (!fabricCanvasRef.current) return;
    
    const pointer = fabricCanvasRef.current.getPointer(e.e);
    const point = {
      x: pointer.x / PIXELS_PER_METER,
      y: pointer.y / PIXELS_PER_METER
    };
    
    setDrawingState(prev => ({
      ...prev,
      currentPoint: point,
      cursorPosition: { x: e.e.clientX, y: e.e.clientY }
    }));
  }, [fabricCanvasRef]);
  
  /**
   * Handle mouse move with throttling for better performance
   */
  const handleMouseMove = useCallback((e: any) => {
    if (!drawingState.isDrawing) return;
    
    // Throttle updates for better performance (update max 30fps)
    const now = Date.now();
    if (now - throttleRef.current.lastCallTime < 33) { // ~30fps
      if (throttleRef.current.timeout === null) {
        throttleRef.current.timeout = window.setTimeout(() => {
          updateDrawingState(e);
          throttleRef.current.timeout = null;
          throttleRef.current.lastCallTime = Date.now();
        }, 33);
      }
      return;
    }
    
    updateDrawingState(e);
    throttleRef.current.lastCallTime = now;
  }, [drawingState.isDrawing, updateDrawingState]);
  
  /**
   * Handle mouse up events to end drawing
   */
  const handleMouseUp = useCallback(() => {
    if (throttleRef.current.timeout !== null) {
      clearTimeout(throttleRef.current.timeout);
      throttleRef.current.timeout = null;
    }
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false
    }));
  }, []);
  
  /**
   * Clean up any pending timeouts
   */
  const cleanupTimeouts = useCallback(() => {
    if (throttleRef.current.timeout !== null) {
      clearTimeout(throttleRef.current.timeout);
      throttleRef.current.timeout = null;
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
