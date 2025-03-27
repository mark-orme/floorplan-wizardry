
/**
 * Hook for managing canvas drawing tools
 * Centralizes tool operations and state changes
 * @module useCanvasControllerTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useDrawingTools } from "@/hooks/useDrawingTools";
import { DrawingTool } from "@/constants/drawingModes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorPlanGIA } from "@/hooks/useFloorPlanGIA";

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
  tool: DrawingTool;
  /** Current zoom level */
  zoomLevel: number;
  /** Line thickness for drawing */
  lineThickness: number;
  /** Line color for drawing */
  lineColor: string;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
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
  handleToolChange: (tool: DrawingTool) => void;
  /** Function to undo last action */
  handleUndo: () => void;
  /** Function to redo previously undone action */
  handleRedo: () => void;
  /** Function to zoom in or out */
  handleZoom: (direction: "in" | "out") => void;
  /** Function to clear the entire canvas */
  clearCanvas: () => void;
  /** Function to save the canvas state */
  saveCanvas: () => boolean; 
  /** Function to save current state before making changes */
  saveCurrentState: () => void;
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
  const {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    saveCurrentState
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
    recalculateGIA
  });

  // Add canvas event listeners to trigger GIA calculation when objects change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Calculate GIA on object modifications, additions or removals
    const handleObjectChange = () => {
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
      saveCanvas();
      return true;
    } catch (error) {
      console.error('Error saving canvas:', error);
      return false;
    }
  }, [saveCanvas]);

  return {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas: enhancedSaveCanvas,
    saveCurrentState
  };
};
