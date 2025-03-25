/**
 * Custom hook for drawing tools functionality
 * Orchestrates tool behavior, history, and canvas operations
 * @module useDrawingTools
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { FloorPlan } from "@/utils/drawing";
import { useCanvasTools } from "./useCanvasTools";
import { useDrawingHistory } from "./useDrawingHistory";
import { useCanvasActions } from "./useCanvasActions";
import { DrawingTool } from "./useCanvasState";

interface UseDrawingToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: DrawingTool;
  zoomLevel: number;
  lineThickness: number;
  lineColor: string;
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  floorPlans: FloorPlan[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => any[];
  recalculateGIA: () => void;
}

/**
 * Main hook that orchestrates all drawing tool functionality
 * Composes smaller, focused hooks to provide a complete drawing toolkit
 * @param {UseDrawingToolsProps} props - Hook properties
 * @returns {Object} Drawing tool operations
 */
export const useDrawingTools = (props: UseDrawingToolsProps) => {
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
  
  // History management (undo/redo)
  const {
    handleUndo,
    handleRedo
  } = useDrawingHistory({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    clearDrawings,
    recalculateGIA
  });
  
  // Canvas actions (clear, save)
  const {
    clearCanvas,
    saveCanvas
  } = useCanvasActions({
    fabricCanvasRef,
    historyRef,
    clearDrawings,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia
  });
  
  /**
   * Handle undo operation
   */
  const handleUndo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Access the undo function from the canvas object
    // The function is attached in useCanvasDrawing
    if ((fabricCanvasRef.current as any).handleUndo) {
      (fabricCanvasRef.current as any).handleUndo();
    }
  }, [fabricCanvasRef]);
  
  /**
   * Handle redo operation
   */
  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Access the redo function from the canvas object
    // The function is attached in useCanvasDrawing
    if ((fabricCanvasRef.current as any).handleRedo) {
      (fabricCanvasRef.current as any).handleRedo();
    }
  }, [fabricCanvasRef]);
  
  return {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas
  };
};
