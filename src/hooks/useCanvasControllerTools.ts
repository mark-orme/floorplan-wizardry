
/**
 * Hook for managing canvas drawing tools
 * Centralizes the control and operation of canvas tools and actions
 * @module useCanvasControllerTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useDrawingTools } from "@/hooks/useDrawingTools";
import { DrawingTool } from "@/hooks/useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorPlanGIA } from "@/hooks/useFloorPlanGIA";
import logger from "@/utils/logger";

/**
 * Props interface for useCanvasControllerTools hook
 * @interface UseCanvasControllerToolsProps
 */
interface UseCanvasControllerToolsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to the drawing history */
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  /** Current selected drawing tool */
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
  /** Function to set the gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to create grid */
  createGrid: (canvas: FabricCanvas) => any[];
}

/**
 * Hook that manages canvas drawing tools and operations
 * Provides functionality for tool changes, undo/redo, zooming and saving
 * 
 * @param {UseCanvasControllerToolsProps} props - Hook properties
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
      canvas.off('object:added', handleObjectChange);
      canvas.off('object:removed', handleObjectChange);
      canvas.off('object:modified', handleObjectChange);
    };
  }, [fabricCanvasRef, recalculateGIA]);

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
