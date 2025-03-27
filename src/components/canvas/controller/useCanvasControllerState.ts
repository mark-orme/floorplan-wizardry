
/**
 * Hook for centralizing canvas controller state
 * @module useCanvasControllerState
 */
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasDebug } from "@/hooks/useCanvasDebug";
import { useState } from "react";
import { DrawingState } from "@/types/drawingTypes";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Hook that centralizes all state needed by the canvas controller
 * @returns All state variables and setters for the canvas controller
 */
export const useCanvasControllerState = () => {
  // Get all states from useCanvasState hook
  const canvasState = useCanvasState();
  
  // Extract all properties from canvas state
  const {
    tool, setTool,
    zoomLevel, setZoomLevel,
    gia, setGia,
    floorPlans, setFloorPlans,
    currentFloor, setCurrentFloor,
    isLoading, setIsLoading,
    canvasDimensions, setCanvasDimensions,
    lineThickness, setLineThickness,
    lineColor, setLineColor,
    snapToGrid, setSnapToGrid
  } = canvasState;
  
  // Debug and error state
  const {
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage,
    resetLoadTimes
  } = useCanvasDebug();

  // Drawing state for measurement tooltips
  const [drawingState, setDrawingState] = useState<DrawingState | null>(null);

  return {
    // Tool state
    tool, setTool,
    
    // Zoom state
    zoomLevel, setZoomLevel,
    
    // Measurement state
    gia, setGia,
    
    // Floor plans state
    floorPlans, setFloorPlans,
    currentFloor, setCurrentFloor,
    
    // Loading state
    isLoading, setIsLoading,
    
    // Canvas dimensions
    canvasDimensions, setCanvasDimensions,
    
    // Line settings
    lineThickness, setLineThickness,
    lineColor, setLineColor,
    
    // Drawing state
    drawingState, setDrawingState,
    
    // Grid settings
    snapToGrid, setSnapToGrid,
    
    // Debug state
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage,
    resetLoadTimes
  };
};
