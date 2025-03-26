
/**
 * Hook for centralizing canvas controller state
 * @module useCanvasControllerState
 */
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasDebug } from "@/hooks/useCanvasDebug";
import { useState } from "react";
import { DrawingState } from "@/types/drawingTypes";

/**
 * Hook that centralizes all state needed by the canvas controller
 * @returns All state variables and setters for the canvas controller
 */
export const useCanvasControllerState = () => {
  // Canvas state (tools, dimensions, etc.)
  const {
    tool, setTool,
    zoomLevel, setZoomLevel,
    gia, setGia,
    floorPlans, setFloorPlans,
    currentFloor, setCurrentFloor,
    isLoading, setIsLoading,
    canvasDimensions, setCanvasDimensions,
    lineThickness, setLineThickness,
    lineColor, setLineColor
  } = useCanvasState();
  
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
    
    // Debug state
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage,
    resetLoadTimes
  };
};
