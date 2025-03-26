
/**
 * Custom hook for drawing tools functionality
 * Orchestrates tool behavior, history, and canvas operations
 * @module useDrawingTools
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useCanvasTools } from "./useCanvasTools";
import { useCanvasActions } from "./useCanvasActions";
import { DrawingTool } from "./useCanvasState";
import logger from "@/utils/logger";

/**
 * Props for the useDrawingTools hook
 * @interface UseDrawingToolsProps
 */
interface UseDrawingToolsProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current zoom level */
  zoomLevel: number;
  /** Current line thickness */
  lineThickness: number;
  /** Current line color */
  lineColor: string;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  /** Function to set the zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Current floor index */
  currentFloor: number;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to create grid elements */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
  /** Function to recalculate gross internal area */
  recalculateGIA: () => void;
}

/**
 * Return type for the useDrawingTools hook
 * @interface UseDrawingToolsResult
 */
interface UseDrawingToolsResult {
  /** Clear all drawings from the canvas */
  clearDrawings: () => void;
  /** Change the current drawing tool */
  handleToolChange: (tool: DrawingTool) => void;
  /** Perform undo operation */
  handleUndo: () => void;
  /** Perform redo operation */
  handleRedo: () => void;
  /** Change zoom level */
  handleZoom: (direction: "in" | "out") => void;
  /** Clear the entire canvas */
  clearCanvas: () => void;
  /** Save the canvas as an image */
  saveCanvas: () => boolean;
  /** Save current state before making changes */
  saveCurrentState: () => void;
}

/**
 * Main hook that orchestrates all drawing tool functionality
 * Composes smaller, focused hooks to provide a complete drawing toolkit
 * 
 * @param {UseDrawingToolsProps} props - Hook properties
 * @returns {UseDrawingToolsResult} Drawing tool operations
 */
export const useDrawingTools = (props: UseDrawingToolsProps): UseDrawingToolsResult => {
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
    createGrid,
    recalculateGIA
  } = props;
  
  // Canvas tools (drawing, tool selection, zoom)
  const {
    clearDrawings,
    handleToolChange,
    handleZoom
  } = useCanvasTools({
    fabricCanvasRef,
    gridLayerRef,
    tool,
    zoomLevel,
    lineThickness,
    lineColor,
    setTool,
    setZoomLevel,
    createGrid
  });
  
  /**
   * Handle undo operation - uses the canvas's attached undo function
   */
  const handleUndo = useCallback(() => {
    logger.info("Triggering undo from drawing tools");
    if (!fabricCanvasRef.current) return;
    
    // Access the undo function from the canvas object (attached in useCanvasEventHandlers)
    const canvas = fabricCanvasRef.current as FabricCanvas & {
      handleUndo?: () => void;
    };
    
    if (canvas.handleUndo) {
      canvas.handleUndo();
    }
  }, [fabricCanvasRef]);
  
  /**
   * Handle redo operation - uses the canvas's attached redo function
   */
  const handleRedo = useCallback(() => {
    logger.info("Triggering redo from drawing tools");
    if (!fabricCanvasRef.current) return;
    
    // Access the redo function from the canvas object (attached in useCanvasEventHandlers)
    const canvas = fabricCanvasRef.current as FabricCanvas & {
      handleRedo?: () => void;
    };
    
    if (canvas.handleRedo) {
      canvas.handleRedo();
    }
  }, [fabricCanvasRef]);
  
  /**
   * Save current state before changes
   * Captures the current canvas state for history tracking
   */
  const saveCurrentState = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Access the saveCurrentState function from the canvas object
    const canvas = fabricCanvasRef.current as FabricCanvas & {
      saveCurrentState?: () => void;
    };
    
    if (canvas.saveCurrentState) {
      canvas.saveCurrentState();
    }
  }, [fabricCanvasRef]);
  
  // Canvas actions (clear, save)
  const {
    clearCanvas,
    saveCanvas: originalSaveCanvas
  } = useCanvasActions({
    fabricCanvasRef,
    historyRef,
    clearDrawings,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    saveCurrentState
  });
  
  /**
   * Wrap saveCanvas to return a boolean value as required by the interface
   * @returns {boolean} Success indicator
   */
  const saveCanvas = useCallback(() => {
    // Call the original saveCanvas function
    originalSaveCanvas();
    // Return true to indicate success
    return true;
  }, [originalSaveCanvas]);
  
  return {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    saveCurrentState
  };
};
