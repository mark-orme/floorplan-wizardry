/**
 * Hook for centralizing canvas controller state
 * @module useCanvasControllerState
 */
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasDebug } from "@/hooks/useCanvasDebug";
import { useState } from "react";
import { DrawingState } from "@/types/drawingTypes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { CanvasDimensions } from "@/types/core/Geometry";

/**
 * Constants for initial state values
 */
const INITIAL_STATE_CONSTANTS = {
  /** Initial GIA value */
  INITIAL_GIA: 0,
  /** Initial floor index */
  INITIAL_FLOOR_INDEX: 0,
  /** Default canvas width */
  DEFAULT_CANVAS_WIDTH: 800,
  /** Default canvas height */
  DEFAULT_CANVAS_HEIGHT: 600
};

/**
 * Hook that centralizes all state needed by the canvas controller
 * @returns All state variables and setters for the canvas controller
 */
export const useCanvasControllerState = () => {
  // Get all states from useCanvasState hook
  const canvasState = useCanvasState();
  
  // Define missing state variables
  const [gia, setGia] = useState(INITIAL_STATE_CONSTANTS.INITIAL_GIA);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(INITIAL_STATE_CONSTANTS.INITIAL_FLOOR_INDEX);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({
    width: INITIAL_STATE_CONSTANTS.DEFAULT_CANVAS_WIDTH, 
    height: INITIAL_STATE_CONSTANTS.DEFAULT_CANVAS_HEIGHT
  });
  
  // Extract all properties from canvas state
  const {
    tool, setTool,
    zoomLevel, setZoomLevel,
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
    tool: canvasState.tool, 
    setTool: canvasState.setTool,
    
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
    canvasDimensions, 
    setCanvasDimensions,
    
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
