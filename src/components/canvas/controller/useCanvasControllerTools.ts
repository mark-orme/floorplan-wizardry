
/**
 * Hook for managing canvas drawing tools
 * Centralizes tool operations and state changes
 * @module useCanvasControllerTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useDrawingTools, UseDrawingToolsResult } from "@/hooks/useDrawingTools";
import { DrawingMode } from "@/constants/drawingModes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorPlanGIA } from "@/hooks/useFloorPlanGIA";
import { ZoomDirection } from "@/types/drawingTypes";

/**
 * Props for useCanvasControllerTools hook
 * @interface UseCanvasControllerToolsProps
 */
interface UseCanvasControllerToolsProps {
  /** Reference to the fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Current active drawing tool */
  tool: DrawingMode;
  /** Current zoom level */
  zoomLevel: number;
  /** Line thickness for drawing */
  lineThickness: number;
  /** Line color for drawing */
  lineColor: string;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  /** Function to set the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Index of current floor */
  currentFloor: number;
  /** Function to update floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set the GIA (Gross Internal Area) */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to create grid objects */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Return type for useCanvasControllerTools hook
 * @interface UseCanvasControllerToolsResult
 */
interface UseCanvasControllerToolsResult {
  /** Function to clear drawings from canvas */
  clearDrawings: () => void;
  /** Function to change the current tool */
  handleToolChange: (tool: DrawingMode) => void;
  /** Function to undo last action */
  handleUndo: () => void;
  /** Function to redo previously undone action */
  handleRedo: () => void;
  /** Function to zoom in or out */
  handleZoom: (direction: ZoomDirection) => void;
  /** Function to clear the entire canvas */
  clearCanvas: () => void;
  /** Function to save the canvas state */
  saveCanvas: () => boolean; 
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
  /** Function to handle floor selection */
  handleFloorSelect: (floorIndex: number) => void;
  /** Function to add a new floor */
  handleAddFloor: () => void;
  /** Function to change line thickness */
  handleLineThicknessChange: (thickness: number) => void;
  /** Function to change line color */
  handleLineColorChange: (color: string) => void;
  /** Function to open measurement guide */
  openMeasurementGuide: () => void;
}

/**
 * Hook that manages canvas drawing tools and operations
 * @param {UseCanvasControllerToolsProps} props - Hook properties
 * @returns {UseCanvasControllerToolsResult} Drawing tool functions and handlers
 */
export const useCanvasControllerTools = (
  props: UseCanvasControllerToolsProps
): UseCanvasControllerToolsResult => {
  const {
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
  } = props;

  // Initialize GIA calculation hook
  const { recalculateGIA } = useFloorPlanGIA({
    fabricCanvasRef,
    setGia
  });

  // Drawing tools with the GIA calculation function
  const toolFunctions = useDrawingTools({
    fabricCanvasRef,
    gridLayerRef,
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    lineThickness,
    lineColor,
    historyRef,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    createGrid
  });

  // Add canvas event listeners to trigger GIA calculation when objects change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Calculate GIA on object modifications, additions or removals
    const handleObjectChange = (): void => {
      recalculateGIA();
    };
    
    canvas.on('object:added', handleObjectChange);
    canvas.on('object:removed', handleObjectChange);
    canvas.on('object:modified', handleObjectChange);
    
    // Initial calculation
    recalculateGIA();
    
    return () => {
      if (canvas) {
        canvas.off('object:added', handleObjectChange);
        canvas.off('object:removed', handleObjectChange);
        canvas.off('object:modified', handleObjectChange);
      }
    };
  }, [fabricCanvasRef, recalculateGIA]);

  // Ensure saveCanvas returns a boolean
  const enhancedSaveCanvas = useCallback((): boolean => {
    try {
      toolFunctions.saveCanvas();
      return true;
    } catch (error) {
      console.error('Error saving canvas:', error);
      return false;
    }
  }, [toolFunctions]);

  // Modified handleZoom to accept string direction
  const handleZoom = useCallback((direction: ZoomDirection): void => {
    if (direction === "in") {
      toolFunctions.handleZoom(1.2);
    } else {
      toolFunctions.handleZoom(0.8);
    }
  }, [toolFunctions]);

  // Basic implementation of missing required functions
  const deleteSelectedObjects = useCallback((): void => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length > 0) {
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      console.info('Selected objects deleted');
    }
  }, [fabricCanvasRef]);

  const handleFloorSelect = useCallback((floorIndex: number): void => {
    if (floorIndex >= 0 && floorIndex < floorPlans.length) {
      console.info(`Floor selected: ${floorPlans[floorIndex].name}`);
      // Implement actual floor selection logic
    }
  }, [floorPlans]);

  const handleAddFloor = useCallback((): void => {
    console.info('Add floor functionality');
    // Implement add floor logic
  }, []);

  const handleLineThicknessChange = useCallback((thickness: number): void => {
    console.info(`Line thickness changed to ${thickness}`);
    // Implement line thickness change logic
  }, []);

  const handleLineColorChange = useCallback((color: string): void => {
    console.info(`Line color changed to ${color}`);
    // Implement line color change logic
  }, []);

  const openMeasurementGuide = useCallback((): void => {
    console.info('Measurement guide opened');
    // Implement measurement guide logic
  }, []);

  return {
    clearDrawings: toolFunctions.clearCanvas,
    handleToolChange: toolFunctions.handleToolChange,
    handleUndo: toolFunctions.undo,
    handleRedo: toolFunctions.redo,
    handleZoom,
    clearCanvas: toolFunctions.clearCanvas,
    saveCanvas: enhancedSaveCanvas,
    saveCurrentState: toolFunctions.saveCurrentState,
    deleteSelectedObjects,
    handleFloorSelect,
    handleAddFloor,
    handleLineThicknessChange,
    handleLineColorChange,
    openMeasurementGuide
  };
};
