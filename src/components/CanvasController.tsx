
/**
 * Canvas controller component
 * Centralizes all canvas state and operations
 * @module CanvasController
 */

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

// Custom hooks
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasDebug } from "@/hooks/useCanvasDebug";
import { useCanvasGrid } from "@/hooks/useCanvasGrid";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasResizing } from "@/hooks/useCanvasResizing";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useDrawingTools } from "@/hooks/useDrawingTools";
import { useFloorSelection } from "@/hooks/useFloorSelection";
import { useLineSettings } from "@/hooks/useLineSettings";
import { useCanvasErrorHandling } from "@/hooks/useCanvasErrorHandling";
import { useFloorPlanLoader } from "@/hooks/useFloorPlanLoader";
import { resetGridProgress } from "@/utils/gridManager";

/**
 * Controller component that manages all canvas logic and state
 * Centralizes canvas operations to improve maintainability and security
 * @returns All canvas-related state and handler functions
 */
export const CanvasController = () => {
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

  // Grid layer reference - initialize with empty array
  const gridLayerRef = useRef<any[]>([]);
  
  // Track grid creation attempts
  const gridAttemptCountRef = useRef(0);
  const maxGridAttempts = 3;
  const gridCreationSuccessfulRef = useRef(false);
  
  // Grid creation callback
  const createGrid = useCanvasGrid({
    gridLayerRef,
    canvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });

  // Initialize canvas and grid
  const { 
    canvasRef, 
    fabricCanvasRef, 
    historyRef 
  } = useCanvasInitialization({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Floor plans management
  const {
    drawFloorPlan,
    recalculateGIA,
    handleAddFloor,
    handleSelectFloor,
    loadData
  } = useFloorPlans({
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    currentFloor,
    isLoading,
    setGia,
    setFloorPlans,
    clearDrawings: () => {}, // Will be replaced after useDrawingTools is initialized
    createGrid
  });

  // Drawing tools
  const {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas
  } = useDrawingTools({
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
    createGrid,
    recalculateGIA: () => {}  // Will be replaced after useFloorPlans
  });

  // Drawing state tracking for measurement tooltip
  const { drawingState } = useCanvasDrawing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia
  });

  // Floor selection
  const { handleFloorSelect } = useFloorSelection({
    currentFloor,
    setCurrentFloor,
    handleSelectFloor
  });
  
  // Line settings management
  const { 
    handleLineThicknessChange, 
    handleLineColorChange,
    applyLineSettings
  } = useLineSettings({
    fabricCanvasRef,
    lineThickness,
    lineColor,
    setLineThickness,
    setLineColor
  });
  
  // Error handling and retries
  const { 
    handleRetry 
  } = useCanvasErrorHandling({
    setHasError,
    setErrorMessage,
    resetLoadTimes,
    loadData
  });
  
  // Floor plan data loading
  const { 
    loadFloorPlansData 
  } = useFloorPlanLoader({
    setIsLoading,
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  });
  
  // Update the recalculateGIA in drawing tools
  useEffect(() => {
    Object.assign(useDrawingTools, { recalculateGIA });
  }, [recalculateGIA]);

  // Canvas resizing
  useCanvasResizing({
    canvasRef,
    fabricCanvasRef,
    setCanvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    createGrid
  });

  // Apply line settings when tool changes
  useEffect(() => {
    applyLineSettings();
  }, [tool, applyLineSettings]);

  // Load floor plans data
  useEffect(() => {
    loadFloorPlansData();
  }, [loadFloorPlansData]);

  // IMPROVED: Staged grid creation with sequential retries and forced lock reset
  useEffect(() => {
    if (!fabricCanvasRef.current || gridCreationSuccessfulRef.current) {
      return;
    }
    
    console.log("⭐ FORCE CREATE GRID - Critical priority grid creation");
    
    // Always reset progress first to break any stuck locks
    resetGridProgress();
    
    // Function to attempt grid creation
    const attemptGridCreation = () => {
      if (!fabricCanvasRef.current) return false;
      
      gridAttemptCountRef.current++;
      console.log(`Grid creation attempt ${gridAttemptCountRef.current}/${maxGridAttempts}`);
      
      // Force unlock before creation
      resetGridProgress();
      
      // Wait a moment after reset before attempting
      setTimeout(() => {
        if (!fabricCanvasRef.current) return;
        
        try {
          const grid = createGrid(fabricCanvasRef.current);
          
          if (grid && grid.length > 0) {
            console.log(`Grid created with ${grid.length} objects`);
            fabricCanvasRef.current.requestRenderAll();
            gridCreationSuccessfulRef.current = true;
            return true;
          }
        } catch (err) {
          console.error("Error during grid creation attempt:", err);
        }
        
        // If we're here, grid creation failed
        if (gridAttemptCountRef.current < maxGridAttempts) {
          // Schedule next attempt with exponential backoff
          const delay = Math.pow(2, gridAttemptCountRef.current) * 300;
          console.log(`Scheduling next grid attempt in ${delay}ms`);
          
          setTimeout(() => {
            // Make sure to reset lock before next attempt
            resetGridProgress();
            attemptGridCreation();
          }, delay);
        }
      }, 100);
    };
    
    // Start the first attempt
    attemptGridCreation();
    
  }, [fabricCanvasRef.current, createGrid]);

  return {
    tool,
    setTool,
    zoomLevel,
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
    loadData,
    handleFloorSelect,
    handleAddFloor,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    handleLineThicknessChange,
    handleLineColorChange,
    drawingState,
    handleRetry
  };
};
