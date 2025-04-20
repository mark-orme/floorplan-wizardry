
/**
 * Hook for canvas initialization and setup
 * @module useCanvasControllerSetup
 */
import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useGrid } from "./useGrid";
import { useCanvasInteraction } from "./useCanvasInteraction";

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
  const historyRef = useRef<{ past: any[][], future: any[][] }>({ past: [], future: [] });
  
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
    saveCurrentState: () => {
      // Save current state to history
      console.log('Saving current canvas state');
    }
  });
  
  // Handle drawing history
  const saveCurrentState = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    historyRef.current.past.push([...objects]);
    historyRef.current.future = [];
    
    // Limit history size
    if (historyRef.current.past.length > 50) {
      historyRef.current.past.shift();
    }
  }, [fabricCanvasRef]);
  
  const handleUndo = useCallback(() => {
    if (!fabricCanvasRef.current || historyRef.current.past.length === 0) return;
    
    const current = fabricCanvasRef.current.getObjects();
    historyRef.current.future.push([...current]);
    
    // Remove all current objects
    fabricCanvasRef.current.clear();
    
    // Restore last state
    const lastState = historyRef.current.past.pop() || [];
    lastState.forEach(obj => {
      fabricCanvasRef.current?.add(obj);
    });
    
    fabricCanvasRef.current.requestRenderAll();
  }, [fabricCanvasRef]);
  
  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current || historyRef.current.future.length === 0) return;
    
    const current = fabricCanvasRef.current.getObjects();
    historyRef.current.past.push([...current]);
    
    // Remove all current objects
    fabricCanvasRef.current.clear();
    
    // Restore next state
    const nextState = historyRef.current.future.pop() || [];
    nextState.forEach(obj => {
      fabricCanvasRef.current?.add(obj);
    });
    
    fabricCanvasRef.current.requestRenderAll();
  }, [fabricCanvasRef]);
  
  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;
  
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
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    saveCurrentState,
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
