
/**
 * Canvas state management hook
 * @module hooks/useCanvasState
 */
import { useState } from "react";
import { FloorPlan } from "@/types/floorPlanTypes";
import { CanvasDimensions, DebugInfoState } from "@/types/debugTypes";
import { CANVAS_CONSTANTS } from "@/constants/canvasConstants";

/**
 * Drawing tool types for the canvas
 */
export type DrawingTool = 
  | 'select'   // Selection tool
  | 'draw'     // Freehand drawing
  | 'eraser'   // Eraser tool
  | 'wall'     // Wall drawing
  | 'room'     // Room drawing
  | 'straightLine'  // Straight line tool
  | 'text'     // Text tool
  | 'measure'; // Measurement tool

/**
 * Initial debug info state
 */
const initialDebugState: DebugInfoState = {
  showDebugInfo: false,
  canvasInitialized: false,
  dimensionsSet: false,
  gridCreated: false,
  brushInitialized: false,
  canvasReady: false,
  canvasCreated: false,
  canvasLoaded: false,
  lastInitTime: 0,
  lastGridCreationTime: 0,
  gridObjectCount: 0,
  canvasDimensions: {
    width: CANVAS_CONSTANTS.DEFAULT_WIDTH,
    height: CANVAS_CONSTANTS.DEFAULT_HEIGHT
  },
  hasError: false,
  errorMessage: '',
  performanceStats: {
    fps: 0,
    frameTime: 0,
    renderTime: 0,
    drawCalls: 0,
    objectCount: 0
  }
};

/**
 * Hook for managing canvas state
 * @returns Canvas state and setters
 */
export const useCanvasState = () => {
  // Tool and rendering state
  const [tool, setTool] = useState<DrawingTool>('select');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [gia, setGia] = useState<number>(0);
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>('#000000');
  
  // Floor plan state
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  
  // Canvas state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({
    width: CANVAS_CONSTANTS.DEFAULT_WIDTH,
    height: CANVAS_CONSTANTS.DEFAULT_HEIGHT
  });
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>(initialDebugState);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Function to reset load time tracking
  const resetLoadTimes = () => {
    setDebugInfo(prev => ({
      ...prev,
      lastInitTime: 0,
      lastGridCreationTime: 0
    }));
  };

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
    
    // Debug state
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage,
    resetLoadTimes
  };
};
