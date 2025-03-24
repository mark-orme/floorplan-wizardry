
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

interface UseDrawingToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: "draw" | "room" | "straightLine";
  zoomLevel: number;
  setTool: React.Dispatch<React.SetStateAction<"draw" | "room" | "straightLine">>;
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
