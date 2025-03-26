
/**
 * Custom hook for managing drawing state
 * @module useDrawingState
 */
import { useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { usePointProcessing } from "./usePointProcessing";
import { DrawingTool } from "./useCanvasState";
import { Point, DrawingState } from "@/types/drawingTypes";

/**
 * Props for the useDrawingState hook
 */
interface UseDrawingStateProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
}

/**
 * Return type for the useDrawingState hook
 */
interface UseDrawingStateReturn {
  /** Current drawing state */
  drawingState: DrawingState;
  /** Handler for mouse down events */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Handler for mouse move events */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Handler for mouse up events */
  handleMouseUp: (e?: MouseEvent | TouchEvent) => void;
  /** Function to clean up any timeouts */
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
  }, [fabricCanvasRef, processPoint]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!fabricCanvasRef.current || !drawingState.isDrawing) return;
    
    const point = processPoint(e);
    if (!point) return;
    
    // Update drawing state with new point
    setDrawingState(prevState => {
      // Calculate midpoint between start and current point
      const midPoint: Point | null = prevState.startPoint ? {
        x: prevState.startPoint.x + (point.x - prevState.startPoint.x) / 2,
        y: prevState.startPoint.y + (point.y - prevState.startPoint.y) / 2
      } : null;
      
      return {
        ...prevState,
        currentPoint: point,
        cursorPosition: point,
        midPoint
      };
    });
  }, [fabricCanvasRef, drawingState.isDrawing, processPoint]);
  
  // Handle mouse up event - explicitly making parameter optional with ? symbol
  const handleMouseUp = useCallback((e?: MouseEvent | TouchEvent) => {
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
