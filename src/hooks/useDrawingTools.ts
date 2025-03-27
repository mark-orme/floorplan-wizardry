
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
import { DrawingTool } from "@/constants/drawingModes";
import { Point, createPoint } from "@/types/core/Point";
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
  /** GIA recalculation function */
  recalculateGIA: () => void;
}

/**
 * UseCanvasToolsProps interface
 */
interface UseCanvasToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  tool: DrawingTool;
  zoomLevel: number;
  lineThickness: number;
  lineColor: string;
}

/**
 * Hook for managing drawing tools and operations
 * @param props - Hook props
 * @returns Drawing tools functions and state
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

  /**
   * Process a point on the canvas
   * @param point - Raw point data
   * @returns Processed point
   */
  const processPoint = (point: { x: number, y: number }): Point => {
    return createPoint(point.x, point.y);
  };

  /**
   * Initialize canvas tools hook
   */
  const canvasTools = useCanvasTools({
    fabricCanvasRef,
    gridLayerRef,
    tool,
    zoomLevel,
    lineThickness,
    lineColor
  });

  /**
   * Initialize canvas actions hook
   */
  const canvasActions = useCanvasActions({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    zoomLevel,
    setZoomLevel,
    createGrid
  });

  /**
   * Update tool with proper state cleanup
   * @param newTool - New drawing tool to set
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    if (!fabricCanvasRef.current) return;

    // Capture current state
    saveCurrentState();

    // Clean up previous tool
    const canvas = fabricCanvasRef.current;
    canvas.isDrawingMode = newTool === 'draw';

    // Set new tool
    setTool(newTool);

    // Implement tool-specific setup
    if (newTool === 'draw') {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      }
    }

    // Deselect everything for drawing tools
    if (newTool !== 'select') {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }

    logger.debug(`Tool changed to ${newTool}`);
  }, [fabricCanvasRef, lineColor, lineThickness, setTool]);

  /**
   * Clear all user-created drawings from canvas
   */
  const clearDrawings = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    // Save current state
    saveCurrentState();

    const canvas = fabricCanvasRef.current;
    
    // Get objects except grid
    const objects = canvas.getObjects().filter(obj => {
      const objectType = (obj as any).objectType;
      return objectType !== 'grid' && objectType !== 'marker';
    });

    // Remove all non-grid objects
    objects.forEach(obj => {
      canvas.remove(obj);
    });

    canvas.requestRenderAll();
    
    logger.debug("All drawings cleared");

    // Recalculate GIA after clearing
    recalculateGIA();
  }, [fabricCanvasRef, saveCurrentState, recalculateGIA]);

  /**
   * Save current canvas state to history
   */
  const saveCurrentState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const currentObjects = canvas.getObjects().filter(obj => {
      // Only save non-grid objects
      return (obj as any).objectType !== 'grid';
    });

    // Clone current objects to avoid reference issues
    const clonedObjects = currentObjects.map(obj => {
      // This is a simplified version - actual cloning might be more complex
      return obj;
    });

    // Add current state to history
    historyRef.current.past.push(clonedObjects);
    
    // Clear future when new state is saved
    historyRef.current.future = [];

    logger.debug("Canvas state saved to history");
  }, [fabricCanvasRef, historyRef]);

  /**
   * Combine operations from both hooks
   */
  return {
    // Re-export necessary functions from canvasActions
    handleZoom: canvasActions.handleZoom,
    handleUndo: canvasActions.handleUndo,
    handleRedo: canvasActions.handleRedo,
    clearCanvas: canvasActions.clearCanvas,
    saveCanvas: canvasActions.saveCanvas,
    deleteSelectedObjects: canvasActions.deleteSelectedObjects,

    // Include functions from useDrawingTools
    clearDrawings,
    handleToolChange,
    saveCurrentState,
    processPoint
  };
};
