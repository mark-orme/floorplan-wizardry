
/**
 * Hook for centralizing canvas controller state
 * Provides a unified interface for all canvas state management
 * @module components/canvas/controller/useCanvasControllerState
 */
import { useCanvasState } from "@/hooks/useCanvasState";
import { UseCanvasStateResult } from "@/types/canvasStateTypes";
import { useCanvasDebug } from "@/hooks/useCanvasDebug";
import { useState } from "react";
import { DrawingState } from "@/types/core/DrawingState";
import { FloorPlan } from "@/types/floorPlan";
import { CanvasDimensions } from "@/types/core/Geometry";
import { DebugInfoState } from "@/types/core/DebugInfo";

/**
 * Constants for initial state values
 * @const {Object} INITIAL_STATE_CONSTANTS
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
 * Return type for useCanvasControllerState hook
 * @interface UseCanvasControllerStateResult
 */
export interface UseCanvasControllerStateResult extends UseCanvasStateResult {
  /** Gross internal area value */
  gia: number;
  /** Set gross internal area value */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Current floor index */
  currentFloor: number;
  /** Set current floor index */
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  /** Loading state */
  isLoading: boolean;
  /** Set loading state */
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  /** Canvas dimensions */
  canvasDimensions: CanvasDimensions;
  /** Set canvas dimensions */
  setCanvasDimensions: React.Dispatch<React.SetStateAction<CanvasDimensions>>;
  /** Drawing state */
  drawingState: DrawingState | null;
  /** Set drawing state */
  setDrawingState: React.Dispatch<React.SetStateAction<DrawingState | null>>;
  /** Debug info */
  debugInfo: DebugInfoState;
  /** Set debug info */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  /** Error state */
  hasError: boolean;
  /** Set error state */
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  /** Error message */
  errorMessage: string;
  /** Set error message */
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  /** Reset load times */
  resetLoadTimes: () => void;
}

/**
 * Hook that centralizes all state needed by the canvas controller
 * @returns All state variables and setters for the canvas controller
 */
export function useCanvasControllerState(): UseCanvasControllerStateResult {
  // Get all states from useCanvasState hook
  const canvasState = useCanvasState();
  
  // Define missing state variables
  const [gia, setGia] = useState<number>(INITIAL_STATE_CONSTANTS.INITIAL_GIA);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState<number>(INITIAL_STATE_CONSTANTS.INITIAL_FLOOR_INDEX);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({
    width: INITIAL_STATE_CONSTANTS.DEFAULT_CANVAS_WIDTH, 
    height: INITIAL_STATE_CONSTANTS.DEFAULT_CANVAS_HEIGHT
  });
  
  // Drawing state for measurement tooltips
  const [drawingState, setDrawingState] = useState<DrawingState | null>(null);
  
  // Debug and error state
  const {
    debugInfo,
    setDebugInfo,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    resetLoadTimes
  } = useCanvasDebug();

  return {
    // Include all properties from canvasState
    ...canvasState,
    
    // GIA state
    gia,
    setGia,
    
    // Floor plans state
    floorPlans,
    setFloorPlans,
    currentFloor,
    setCurrentFloor,
    
    // Loading state
    isLoading,
    setIsLoading,
    
    // Canvas dimensions
    canvasDimensions, 
    setCanvasDimensions,
    
    // Drawing state
    drawingState,
    setDrawingState,
    
    // Debug state
    debugInfo,
    setDebugInfo,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    resetLoadTimes
  };
}
