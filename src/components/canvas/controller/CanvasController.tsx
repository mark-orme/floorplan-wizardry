
/**
 * Canvas controller component
 * Centralizes all canvas state and operations
 * @module CanvasController
 */
import { useEffect } from "react";

// Import all the refactored hooks
import { useCanvasControllerState } from "./useCanvasControllerState";
import { useCanvasControllerSetup } from "./useCanvasControllerSetup";
import { useCanvasControllerDependencies } from "./useCanvasControllerDependencies";
import { useCanvasControllerTools } from "./useCanvasControllerTools";
import { useCanvasControllerFloorPlans } from "./useCanvasControllerFloorPlans";
import { useCanvasControllerLineSettings } from "./useCanvasControllerLineSettings";
import { useCanvasControllerErrorHandling } from "./useCanvasControllerErrorHandling";
import { useCanvasControllerDrawingState } from "./useCanvasControllerDrawingState";
import { useCanvasControllerLoader } from "./useCanvasControllerLoader";

/**
 * Controller component that manages all canvas logic and state
 * Centralizes canvas operations to improve maintainability and security
 * @returns All canvas-related state and handler functions
 */
export const CanvasController = () => {
  // 1. Initialize state
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
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage,
    resetLoadTimes
  } = useCanvasControllerState();
  
  // 2. Initialize canvas and references
  const { 
    canvasRef, 
    fabricCanvasRef, 
    historyRef 
  } = useCanvasControllerSetup({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // 3. Initialize canvas dependencies
  const { gridLayerRef, createGrid } = useCanvasControllerDependencies({
    fabricCanvasRef,
    canvasRef,
    canvasDimensions,
    debugInfo,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    zoomLevel
  });

  // 4. Initialize floor plans (without clearDrawings yet)
  // We'll pass a dummy clearDrawings function first and update it after tools are initialized
  const dummyClearDrawings = () => {};
  
  const {
    drawFloorPlan,
    recalculateGIA,
    handleAddFloor,
    handleFloorSelect,
    loadData
  } = useCanvasControllerFloorPlans({
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    currentFloor,
    isLoading,
    setGia,
    setFloorPlans,
    setCurrentFloor,
    clearDrawings: dummyClearDrawings,
    createGrid
  });

  // 5. Initialize drawing tools with recalculateGIA
  const {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas
  } = useCanvasControllerTools({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    zoomLevel,
    lineThickness,
    lineColor,
    setTool,
    setZoomLevel,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    createGrid
  });

  // 6. Update the recalculateGIA in drawing tools
  useEffect(() => {
    // This is a workaround for the circular dependency
    if (typeof recalculateGIA === 'function') {
      // Using a global object to pass the function reference
      // This avoids direct mutation of the hook
      (window as any).__canvasHelpers = {
        ...(window as any).__canvasHelpers,
        recalculateGIA
      };
    }
  }, [recalculateGIA]);

  // 7. Initialize line settings
  const { 
    handleLineThicknessChange, 
    handleLineColorChange 
  } = useCanvasControllerLineSettings({
    fabricCanvasRef,
    lineThickness,
    lineColor,
    setLineThickness,
    setLineColor,
    tool
  });
  
  // 8. Initialize error handling
  const { 
    handleRetry 
  } = useCanvasControllerErrorHandling({
    setHasError,
    setErrorMessage,
    resetLoadTimes,
    loadData
  });
  
  // 9. Initialize drawing state (for measurement tooltips)
  const { 
    drawingState 
  } = useCanvasControllerDrawingState({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor
  });
  
  // 10. Initialize floor plan loader
  useCanvasControllerLoader({
    setIsLoading,
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  });
  
  // Return everything that the Canvas component needs
  return {
    // State
    tool,
    gia,
    floorPlans,
    currentFloor,
    isLoading,
    hasError,
    errorMessage,
    debugInfo,
    canvasRef,
    lineThickness,
    lineColor,
    
    // Data loading
    loadData,
    
    // Floor plan operations
    handleFloorSelect,
    handleAddFloor,
    
    // Drawing tools
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    
    // Line settings
    handleLineThicknessChange,
    handleLineColorChange,
    
    // Drawing state (for tooltips)
    drawingState,
    
    // Error handling
    handleRetry
  };
};
