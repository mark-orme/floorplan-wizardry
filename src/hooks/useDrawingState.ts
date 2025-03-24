import { useCallback, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point } from "@/utils/drawingTypes";
import { PIXELS_PER_METER } from "@/utils/drawing";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool?: "draw" | "room" | "straightLine"; // Add tool as an optional prop
}

interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  cursorPosition: { x: number; y: number };
}

/**
 * Hook for tracking drawing state and cursor movement on canvas
 * Provides drawing coordinates and cursor position for tooltips
 * @param {UseDrawingStateProps} props - Hook properties
 * @returns {Object} Drawing state and event handlers
 */
export const useDrawingState = ({ fabricCanvasRef, tool }: UseDrawingStateProps) => {
  // Only create and update state for tooltips when wall (straightLine) tool is selected
  const shouldShowTooltip = tool === "straightLine";
  
  // State to track drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: { x: 0, y: 0 }
  });
  
  // Use refs to prevent memory leaks and ensure access to latest values
  const startPointRef = useRef<Point | null>(null);
  const isDrawingRef = useRef(false);
  const tooltipTimeoutRef = useRef<number | null>(null);
  
  // Event handlers for mouse movement and drawing
  const handleMouseDown = useCallback((event: { e: MouseEvent, pointer: { x: number, y: number } }) => {
    if (!shouldShowTooltip) return;
    
    const { pointer } = event;
    const startPoint = { 
      x: pointer.x / PIXELS_PER_METER, 
      y: pointer.y / PIXELS_PER_METER 
    };
    
    startPointRef.current = startPoint;
    isDrawingRef.current = true;
    
    setDrawingState({
      isDrawing: true,
      startPoint,
      currentPoint: startPoint,
      cursorPosition: { x: event.e.clientX, y: event.e.clientY }
    });
  }, [shouldShowTooltip]);
  
  const handleMouseMove = useCallback((event: { e: MouseEvent, pointer: { x: number, y: number } }) => {
    if (!isDrawingRef.current || !shouldShowTooltip) return;
    
    const { pointer } = event;
    const currentPoint = { 
      x: pointer.x / PIXELS_PER_METER, 
      y: pointer.y / PIXELS_PER_METER 
    };
    
    setDrawingState(prev => ({
      ...prev,
      currentPoint,
      cursorPosition: { x: event.e.clientX, y: event.e.clientY }
    }));
  }, [shouldShowTooltip]);
  
  const handleMouseUp = useCallback(() => {
    if (!shouldShowTooltip) return;
    
    // Use timeout to keep tooltip visible briefly after releasing mouse
    if (tooltipTimeoutRef.current) {
      window.clearTimeout(tooltipTimeoutRef.current);
    }
    
    tooltipTimeoutRef.current = window.setTimeout(() => {
      isDrawingRef.current = false;
      startPointRef.current = null;
      
      setDrawingState(prev => ({
        ...prev,
        isDrawing: false,
        startPoint: null,
        currentPoint: null
      }));
      
      tooltipTimeoutRef.current = null;
    }, 500); // Keep tooltip visible for 500ms after mouse up
  }, [shouldShowTooltip]);
  
  // Cleanup function for timeouts
  const cleanupTimeouts = useCallback(() => {
    if (tooltipTimeoutRef.current) {
      window.clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
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
