
/**
 * Hook for managing canvas drawing tools
 * @module useCanvasControllerTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useDrawingTools } from "@/hooks/useDrawingTools";
import { DrawingTool } from "@/hooks/useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";

interface UseCanvasControllerToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
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
}

/**
 * Hook that manages canvas drawing tools and operations
 * @returns Drawing tool functions and handlers
 */
export const useCanvasControllerTools = (props: UseCanvasControllerToolsProps) => {
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

  // Drawing tools
  const {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    saveCurrentState  // Make sure this is exposed
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
    recalculateGIA: () => {} // Will be replaced dynamically
  });

  return {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    saveCurrentState  // Make sure to return this
  };
};
