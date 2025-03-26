
/**
 * Canvas Controller
 * Main orchestration component for the canvas drawing system
 * Centralizes all controller logic and state
 */
import React, { createContext, useContext, useCallback, useRef, useMemo } from "react";
import { useCanvasControllerState } from "./useCanvasControllerState";
import { useCanvasControllerSetup } from "./useCanvasControllerSetup";
import { useCanvasControllerDependencies } from "./useCanvasControllerDependencies";
import { useCanvasControllerErrorHandling } from "./useCanvasControllerErrorHandling";
import { useCanvasControllerFloorPlans } from "./useCanvasControllerFloorPlans";
import { useCanvasControllerTools } from "./useCanvasControllerTools";
import { useCanvasControllerLineSettings } from "./useCanvasControllerLineSettings";
import { useCanvasControllerLoader } from "./useCanvasControllerLoader";
import { useCanvasControllerDrawingState } from "./useCanvasControllerDrawingState";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingState } from "@/types/drawingTypes";
import { useFloorPlanGIA } from "@/hooks/useFloorPlanGIA";

// Create Context for Canvas Controller
const CanvasControllerContext = createContext<ReturnType<typeof useCanvasControllerState> | null>(null);

/**
 * Provider component that wraps the application with canvas controller context
 * @param {Object} props - Component properties 
 * @returns {JSX.Element} Provider component with canvas controller context
 */
export const CanvasControllerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Initialize core canvas state
  const state = useCanvasControllerState();
  
  return (
    <CanvasControllerContext.Provider value={state}>
      {children}
    </CanvasControllerContext.Provider>
  );
};

/**
 * Custom hook to access the canvas controller from any component
 * @returns Canvas controller state and functions
 */
export const useCanvasController = () => {
  const context = useContext(CanvasControllerContext);
  
  if (!context) {
    throw new Error("useCanvasController must be used within a CanvasControllerProvider");
  }
  
  const {
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    gia,
    setGia,
    floorPlans,
    setFloorPlans,
    currentFloor,
    setCurrentFloor,
    debugInfo,
    setDebugInfo,
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    errorMessage, 
    setErrorMessage,
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor,
    drawingState,
    setDrawingState
  } = context;
  
  // Create refs for canvas and dependencies
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<any[]>([]);
  const historyRef = useRef<{past: any[][], future: any[][]}>({ past: [], future: [] });
  
  // Initialize GIA calculation
  const { recalculateGIA } = useFloorPlanGIA({
    fabricCanvasRef,
    setGia
  });
  
  // Debug info updating
  const updateDebugInfo = useCallback((info: Partial<typeof debugInfo>) => {
    setDebugInfo(prev => ({ ...prev, ...info }));
  }, [setDebugInfo]);
  
  // Initialize error handling
  const { handleError, handleRetry } = useCanvasControllerErrorHandling({
    setHasError,
    setErrorMessage,
    updateDebugInfo
  });
  
  // Initialize canvas dependencies, grid creation, etc.
  const { 
    createGrid 
  } = useCanvasControllerDependencies({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    updateDebugInfo
  });
  
  // Initialize canvas tools (tool selection, drawing, etc.)
  const {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    saveCurrentState
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
  
  // Initialize floor plan management
  const {
    drawFloorPlan,
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
    clearDrawings,
    createGrid
  });

  // Initialize line settings management
  const {
    handleLineThicknessChange,
    handleLineColorChange
  } = useCanvasControllerLineSettings({
    setLineThickness,
    setLineColor
  });
  
  // Initialize data loader
  useCanvasControllerLoader({
    setIsLoading,
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  });
  
  // Delete selected objects
  const deleteSelectedObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Get active objects or selected object
    const activeObject = fabricCanvasRef.current.getActiveObject();
    
    if (activeObject) {
      // Save state before making changes
      saveCurrentState();
      
      // Remove the object
      fabricCanvasRef.current.remove(activeObject);
      
      // Deselect and render
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.requestRenderAll();
      
      // Recalculate GIA after object deletion
      recalculateGIA();
    }
  }, [fabricCanvasRef, saveCurrentState, recalculateGIA]);
  
  // Drawing state management
  useCanvasControllerDrawingState({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    deleteSelectedObjects,
    setDrawingState,
    recalculateGIA
  });
  
  // Canvas initialization and setup
  const {
    initializeCanvas
  } = useCanvasControllerSetup({
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    isLoading,
    floorPlans,
    currentFloor,
    drawFloorPlan,
    saveCurrentState,
    createGrid,
    handleError,
    updateDebugInfo,
    setDrawingState,
    recalculateGIA
  });
  
  // Measurement guide modal
  const { openMeasurementGuide } = useMeasurementGuide();
  
  // Return comprehensive controller state and functions
  return {
    // Canvas refs
    canvasRef,
    fabricCanvasRef,
    
    // State
    tool,
    zoomLevel,
    gia,
    floorPlans,
    currentFloor,
    debugInfo,
    isLoading,
    hasError,
    errorMessage,
    lineThickness,
    lineColor,
    drawingState,
    
    // Tool handlers
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    
    // Floor plan handlers
    handleFloorSelect,
    handleAddFloor,
    
    // Line settings handlers
    handleLineThicknessChange,
    handleLineColorChange,
    
    // Error handlers
    handleRetry,
    
    // Measurement guide
    openMeasurementGuide,
    
    // Canvas initialization
    initializeCanvas
  };
};
