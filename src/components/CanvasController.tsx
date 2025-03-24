
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
import { PaperSize } from "@/utils/drawingTypes";

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
    canvasDimensions, setCanvasDimensions
  } = useCanvasState();
  
  // Debug and error state
  const {
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage,
    resetLoadTimes
  } = useCanvasDebug();

  // Initialize canvas and grid
  const { 
    canvasRef, 
    fabricCanvasRef, 
    gridLayerRef, 
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
  
  // Grid creation callback
  const createGrid = useCanvasGrid({
    gridLayerRef,
    canvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage
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
    clearDrawings,
    createGrid
  });

  // Floor selection
  const { handleFloorSelect } = useFloorSelection({
    currentFloor,
    setCurrentFloor,
    handleSelectFloor
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

  // Load floor plans data
  useEffect(() => {
    const loadFloorPlansData = async () => {
      try {
        console.log("Loading floor plans...");
        setIsLoading(true);
        const plans = await loadData();
        
        // If plans exist, load them, otherwise create a default
        if (plans && plans.length > 0) {
          setFloorPlans(plans);
          console.log("Floor plans loaded:", plans);
        } else {
          // Create a default floor plan with a properly typed paperSize
          const defaultPlan = [{
            strokes: [],
            label: "Ground Floor",
            paperSize: "infinite" as PaperSize  // Explicitly cast as PaperSize to fix the type error
          }];
          setFloorPlans(defaultPlan);
          console.log("Created default floor plan");
        }
        
        setIsLoading(false);
        setHasError(false);
      } catch (error) {
        console.error("Error loading floor plans:", error);
        setHasError(true);
        setErrorMessage("Failed to load floor plans");
        toast.error("Failed to load floor plans");
        setIsLoading(false);
      }
    };
    
    loadFloorPlansData();
  }, [loadData, setFloorPlans, setHasError, setErrorMessage, setIsLoading]);

  // Ensure the grid is created on initial load
  useEffect(() => {
    if (fabricCanvasRef.current && !debugInfo.gridCreated) {
      console.log("Creating grid during initial load");
      const grid = createGrid(fabricCanvasRef.current);
      if (grid && grid.length > 0) {
        console.log(`Grid created with ${grid.length} objects`);
      }
    }
  }, [fabricCanvasRef, debugInfo.gridCreated, createGrid]);

  // Retry handler for loading errors
  const handleRetry = useCallback(() => {
    resetLoadTimes();
    loadData();
  }, [loadData, resetLoadTimes]);

  return {
    tool,
    gia,
    floorPlans,
    currentFloor,
    isLoading,
    hasError,
    errorMessage,
    debugInfo,
    canvasRef,
    loadData,
    handleFloorSelect,
    handleAddFloor,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    drawingState,
    handleRetry
  };
};
