
/**
 * Canvas controller component
 * Centralizes all canvas state and operations
 * @module CanvasController
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createGrid } from "@/utils/canvasGrid";
import { FloorPlan } from "@/utils/drawing";

// Custom hooks
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasResizing } from "@/hooks/useCanvasResizing";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useDrawingTools } from "@/hooks/useDrawingTools";

/**
 * Controller component that manages all canvas logic and state
 * Centralizes canvas operations to improve maintainability and security
 * @returns All canvas-related state and handler functions
 */
export const CanvasController = () => {
  // State for drawing tools and display
  // Default to straightLine (wall) tool as requested
  const [tool, setTool] = useState<"draw" | "room" | "straightLine">("straightLine");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gia, setGia] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Canvas sizing and initialization tracking
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
  
  /**
   * Debug info for troubleshooting canvas issues
   */
  const [debugInfo, setDebugInfo] = useState({
    canvasInitialized: false,
    gridCreated: false,
    dimensionsSet: false,
    brushInitialized: false
  });

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
  
  // Create grid callback for other hooks
  const gridRef = useCallback((canvas: any) => {
    return createGrid(
      canvas, 
      gridLayerRef, 
      canvasDimensions, 
      setDebugInfo, 
      setHasError, 
      setErrorMessage
    );
  }, [canvasDimensions, gridLayerRef]);

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
    createGrid: gridRef,
    recalculateGIA: () => {}  // Will be replaced after useFloorPlans
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
    createGrid: gridRef
  });

  // Update the recalculateGIA in drawing tools
  useEffect(() => {
    Object.assign(useDrawingTools, { recalculateGIA });
  }, [recalculateGIA]);

  // Canvas drawing
  useCanvasDrawing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia
  });

  // Canvas resizing
  useCanvasResizing({
    canvasRef,
    fabricCanvasRef,
    setCanvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    createGrid: gridRef
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
          // Create a default floor plan
          const defaultPlan = [{
            strokes: [],
            label: "Ground Floor",
            paperSize: "infinite"
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
  }, [loadData]);

  // Handle selecting a different floor
  const handleFloorSelect = useCallback((index: number) => {
    if (index !== currentFloor) {
      setCurrentFloor(index);
      handleSelectFloor(index);
    }
  }, [currentFloor, handleSelectFloor]);

  // Ensure the grid is created on initial load
  useEffect(() => {
    if (fabricCanvasRef.current && !debugInfo.gridCreated) {
      console.log("Creating grid during initial load");
      const grid = gridRef(fabricCanvasRef.current);
      if (grid && grid.length > 0) {
        console.log(`Grid created with ${grid.length} objects`);
      }
    }
  }, [fabricCanvasRef, debugInfo.gridCreated, gridRef]);

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
    saveCanvas
  };
};
