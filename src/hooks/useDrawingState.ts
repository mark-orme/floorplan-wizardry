
/**
 * Custom hook for managing drawing state
 * @module useDrawingState
 */
import { useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { usePointProcessing } from "./usePointProcessing";
import { DrawingTool } from "./useCanvasState";
import { Point, DrawingState } from "@/types/drawingTypes";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
}

interface UseDrawingStateReturn {
  drawingState: DrawingState;
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  handleMouseUp: (e: MouseEvent | TouchEvent) => void;
  cleanupTimeouts: () => void;
}

/**
 * Hook for managing the drawing state
 * @param {UseDrawingStateProps} props - Drawing state props
 * @returns {UseDrawingStateReturn} Drawing state and handlers
 */
export const useDrawingState = ({ 
  fabricCanvasRef, 
  tool 
}: UseDrawingStateProps): UseDrawingStateReturn => {
  // State for tracking drawing process
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false
  });
  
  // Timeout refs for cleaning up event handlers
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the point processing hook for handling point calculations
  const { processPoint } = usePointProcessing({
    fabricCanvasRef,
    tool
  });
  
  // Handle mouse down event
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current) return;
    
    const point = processPoint(e);
    if (!point) return;
    
    setDrawingState(prevState => ({
      ...prevState,
      isDrawing: true,
      startPoint: point,
      currentPoint: point,
      cursorPosition: point,
      midPoint: point,
      selectionActive: false
    }));
    
    // Prevent selection when drawing
    fabricCanvasRef.current.selection = false;
  }, [fabricCanvasRef, tool, processPoint]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current || !drawingState.isDrawing) return;
    
    const point = processPoint(e);
    if (!point) return;
    
    // Update drawing state with new point
    setDrawingState(prevState => ({
      ...prevState,
      currentPoint: point,
      cursorPosition: point,
      midPoint: {
        x: (prevState.startPoint?.x || 0) + (point.x - (prevState.startPoint?.x || 0)) / 2,
        y: (prevState.startPoint?.y || 0) + (point.y - (prevState.startPoint?.y || 0)) / 2
      }
    }));
  }, [fabricCanvasRef, drawingState.isDrawing, processPoint]);
  
  // Handle mouse up event
  const handleMouseUp = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current || !drawingState.isDrawing) return;
    
    // Re-enable selection
    fabricCanvasRef.current.selection = true;
    
    // Clear drawing state
    setDrawingState(prevState => ({
      ...prevState,
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      cursorPosition: null,
      midPoint: null,
      selectionActive: false
    }));
  }, [fabricCanvasRef, drawingState.isDrawing]);
  
  // Cleanup any lingering timeouts
  const cleanupTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
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
