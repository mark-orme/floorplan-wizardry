/**
 * Hook for setting up the canvas controller
 * Initializes canvas, grid, and history
 * @module useCanvasControllerSetup
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { useDrawingHistory } from "@/hooks/useDrawingHistory";
import { useGrid } from "@/hooks/useGrid";
import { DrawingMode } from "@/constants/drawingModes";
import { useFloorPlanState } from "@/hooks/useFloorPlanState";
import { useSyncedFloorPlans } from "@/hooks/useSyncedFloorPlans";
import { FloorPlan } from "@/types/floorPlanTypes";

interface CanvasReferences {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas>;
  canvas: FabricCanvas;
  fabricRef?: any; // Add missing fabricRef property
}

/**
 * Props for the useCanvasControllerSetup hook
 * @interface UseCanvasControllerSetupProps
 */
interface UseCanvasControllerSetupProps {
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Initial drawing tool */
  initialTool?: DrawingMode;
  /** Initial line thickness */
  initialLineThickness?: number;
  /** Initial line color */
  initialLineColor?: string;
  /** Initial zoom level */
  initialZoomLevel?: number;
  /** Initial floor plans */
  initialFloorPlans?: FloorPlan[];
}

/**
 * Hook that sets up the canvas controller
 * Initializes canvas, grid, drawing history, and floor plan state
 * 
 * @param {UseCanvasControllerSetupProps} props - Hook properties
 * @returns {Object} Canvas setup functions and references
 */
export const useCanvasControllerSetup = (props: UseCanvasControllerSetupProps) => {
  const {
    canvasRef,
    initialTool = DrawingMode.SELECT,
    initialLineThickness = 2,
    initialLineColor = "#000000",
    initialZoomLevel = 1,
    initialFloorPlans = []
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
  const fabricCanvasRef = useRef<FabricCanvas>(null as any);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<{ past: any[][], future: any[][] }>({ past: [], future: [] });
  
  // Initialize drawing history hook
  const {
    history,
    saveCurrentState,
    undo,
    redo
  } = useDrawingHistory({ fabricCanvasRef, historyRef });
  
  // Initialize floor plan state hook
  const {
    floorPlans,
    setFloorPlans
  } = useSyncedFloorPlans({
    initialFloorPlans: initialFloorPlans,
    fabricCanvasRef: fabricCanvasRef
  });
  
  // Initialize grid hook
  const {
    gridSize,
    createGrid,
    toggleGridVisibility,
    snapToGrid
  } = useGrid({ fabricCanvasRef, gridLayerRef });
  
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
    saveCurrentState
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
    saveCurrentState();
  }, [createGrid, saveCurrentState, setupSelectionMode]);
  
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
    fabricCanvasRef,
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
    history,
    saveCurrentState,
    undo,
    redo,
    handleCanvasReady,
    handleCanvasInitError,
    handleCanvasRetry,
    floorPlans,
    setFloorPlans,
    gia,
    setGia,
    currentFloor,
    setCurrentFloor
  };
};
