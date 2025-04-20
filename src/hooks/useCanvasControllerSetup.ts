
/**
 * Hook for canvas initialization and setup
 * @module useCanvasControllerSetup
 */
import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useGrid } from "./useGrid";
import { useCanvasInteraction } from "./useCanvasInteraction";
import { useDrawingHistory } from "./useDrawingHistory";

interface UseCanvasControllerSetupProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initialTool?: DrawingMode;
  initialLineThickness?: number;
  initialLineColor?: string;
  initialZoomLevel?: number;
  initialFloorPlans?: any[];
}

export const useCanvasControllerSetup = (props: UseCanvasControllerSetupProps) => {
  const {
    canvasRef,
    initialTool = DrawingMode.SELECT,
    initialLineThickness = 2,
    initialLineColor = "#000000",
    initialZoomLevel = 1
  } = props;
  
  // Initialize state variables
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [tool, setTool] = useState<DrawingMode>(initialTool);
  const [zoomLevel, setZoomLevel] = useState<number>(initialZoomLevel);
  const [lineThickness, setLineThickness] = useState<number>(initialLineThickness);
  const [lineColor, setLineColor] = useState<string>(initialLineColor);
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [gia, setGia] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(0);
  
  // Create references
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Initialize drawing history
  const drawingHistory = useDrawingHistory({
    fabricCanvasRef
  });
  
  // Initialize grid hook
  const {
    gridSize,
    createGrid,
    toggleGridVisibility,
    snapToGrid
  } = useGrid({ 
    fabricCanvasRef, 
    gridLayerRef,
    initialGridSize: 50,
    initialVisible: true 
  });
  
  // Initialize canvas interaction hook
  const {
    isInteracting,
    startInteraction,
    endInteraction,
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode
  } = useCanvasInteraction({
    fabricCanvasRef,
    tool,
    saveCurrentState: drawingHistory.saveState
  });
  
  /**
   * Function to handle canvas ready event
   * Initializes the Fabric canvas and sets up event listeners
   * 
   * @param {FabricCanvas} fabricCanvas - Fabric canvas instance
   */
  const handleCanvasReady = useCallback((fabricCanvas: FabricCanvas) => {
    // Set fabric canvas reference
    fabricCanvasRef.current = fabricCanvas;
    
    // Set canvas state
    setCanvas(fabricCanvas);
    
    // Set up selection mode
    setupSelectionMode();
    
    // Create initial grid
    const gridObjects = createGrid(fabricCanvas);
    gridLayerRef.current = gridObjects;
    
    // Save initial canvas state
    drawingHistory.saveState();
  }, [createGrid, drawingHistory.saveState, setupSelectionMode]);
  
  /**
   * Function to handle canvas init error
   * Logs the error message
   * 
   * @param {string} message - Error message
   */
  const handleCanvasInitError = useCallback((message: string) => {
    console.error("Canvas initialization error:", message);
  }, []);
  
  /**
   * Function to handle canvas retry
   * Logs a message indicating canvas retry
   */
  const handleCanvasRetry = useCallback(() => {
    console.log("Retrying canvas initialization...");
  }, []);
  
  // Update drawing mode when tool changes
  useEffect(() => {
    setupSelectionMode();
  }, [tool, setupSelectionMode]);
  
  // Return all the functions and references
  return {
    canvasRef,
    fabricCanvasRef: fabricCanvasRef as React.MutableRefObject<FabricCanvas>,
    fabricRef: fabricCanvasRef, // Required by CanvasReferences
    canvas,
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor,
    isGridVisible,
    setIsGridVisible,
    gridSize,
    createGrid,
    toggleGridVisibility,
    snapToGrid,
    isInteracting,
    startInteraction,
    endInteraction,
    deleteSelectedObjects,
    enablePointSelection,
    setupSelectionMode,
    handleUndo: drawingHistory.undo,
    handleRedo: drawingHistory.redo,
    canUndo: drawingHistory.canUndo,
    canRedo: drawingHistory.canRedo,
    saveCurrentState: drawingHistory.saveState,
    handleCanvasReady,
    handleCanvasInitError,
    handleCanvasRetry,
    gia,
    setGia,
    currentFloor,
    setCurrentFloor,
    gridLayerRef
  };
};
