import { useCallback, useRef, useState, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Point } from "@/utils/drawingTypes";
import { PIXELS_PER_METER, SMALL_GRID } from "@/utils/drawing";
import { snapPointsToGrid } from "@/utils/geometry";
import { DrawingTool } from "./useCanvasState";

interface UseDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
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
  // Show tooltips for wall tool and room tool
  const shouldShowTooltip = tool === "straightLine" || tool === "room";
  
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
  
  // Reset drawing state when tool changes
  useEffect(() => {
    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      cursorPosition: { x: 0, y: 0 }
    });
    isDrawingRef.current = false;
    startPointRef.current = null;
  }, [tool]);
  
  // Event handlers for mouse movement and drawing
  const handleMouseDown = useCallback((event: { e: MouseEvent, pointer: { x: number, y: number } }) => {
    if (!shouldShowTooltip) return;
    
    const { pointer } = event;
    // Convert pixel coordinates to meter coordinates for consistent measurements
    let startPoint = { 
      x: pointer.x / PIXELS_PER_METER, 
      y: pointer.y / PIXELS_PER_METER 
    };
    
    // For wall tool, snap to exact grid positions on start
    if (tool === "straightLine") {
      const snapped = snapPointsToGrid([startPoint], true);
      startPoint = snapped[0];
    }
    
    startPointRef.current = startPoint;
    isDrawingRef.current = true;
    
    console.log("Drawing started at:", startPoint);
    
    setDrawingState({
      isDrawing: true,
      startPoint,
      currentPoint: startPoint,
      cursorPosition: { x: event.e.clientX, y: event.e.clientY }
    });
  }, [shouldShowTooltip, tool]);
  
  const handleMouseMove = useCallback((event: { e: MouseEvent, pointer: { x: number, y: number } }) => {
    if (!isDrawingRef.current || !shouldShowTooltip) return;
    
    const { pointer } = event;
    // Convert pixel coordinates to meter coordinates for consistent measurements
    let currentPoint = { 
      x: pointer.x / PIXELS_PER_METER, 
      y: pointer.y / PIXELS_PER_METER 
    };
    
    // For wall tool, snap to exact grid positions while moving
    if (tool === "straightLine") {
      const snapped = snapPointsToGrid([currentPoint], true);
      currentPoint = snapped[0];
    }
    
    console.log("Drawing in progress:", currentPoint);
    
    setDrawingState(prev => ({
      ...prev,
      currentPoint,
      cursorPosition: { x: event.e.clientX, y: event.e.clientY }
    }));
  }, [shouldShowTooltip, tool]);
  
  const handleMouseUp = useCallback(() => {
    if (!shouldShowTooltip) return;
    
    console.log("Drawing ended");
    
    // Use timeout to keep tooltip visible briefly after releasing mouse
    if (tooltipTimeoutRef.current) {
      window.clearTimeout(tooltipTimeoutRef.current);
    }
    
    // Keep the tooltip visible for a short time after mouse up for better user experience
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
    }, 1000); // Keep tooltip visible for 1 second after mouse up
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
