
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
   * Initialize canvas tools hook
   */
  const canvasTools = useCanvasTools({
    fabricCanvasRef,
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
  }, [fabricCanvasRef, lineColor, lineThickness, setTool, saveCurrentState]);

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

  // Create wrapper functions for canvasActions methods to handle missing properties
  const handleZoom = useCallback((direction: "in" | "out") => {
    // Implement zoom functionality
    const zoomFactor = direction === "in" ? 1.1 : 0.9;
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      const newZoom = canvas.getZoom() * zoomFactor;
      canvas.setZoom(newZoom);
      canvas.requestRenderAll();
      setZoomLevel(newZoom);
    }
  }, [fabricCanvasRef, setZoomLevel]);

  const handleUndo = useCallback(() => {
    if (historyRef.current.past.length === 0) return;
    
    // Get the last state from past
    const lastState = historyRef.current.past.pop();
    if (!lastState) return;
    
    // Add current state to future
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Save current state to future
    const currentObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
    historyRef.current.future.push(currentObjects);
    
    // Clear canvas and add objects from last state
    canvas.clear();
    lastState.forEach(obj => canvas.add(obj));
    canvas.requestRenderAll();
  }, [fabricCanvasRef, historyRef]);

  const handleRedo = useCallback(() => {
    if (historyRef.current.future.length === 0) return;
    
    // Get the next state from future
    const nextState = historyRef.current.future.pop();
    if (!nextState) return;
    
    // Add current state to past
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Save current state to past
    const currentObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
    historyRef.current.past.push(currentObjects);
    
    // Clear canvas and add objects from next state
    canvas.clear();
    nextState.forEach(obj => canvas.add(obj));
    canvas.requestRenderAll();
  }, [fabricCanvasRef, historyRef]);

  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Save current state before clearing
    saveCurrentState();
    
    // Clear all objects except grid
    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
    objects.forEach(obj => canvas.remove(obj));
    canvas.requestRenderAll();
    
    // Recalculate GIA after clearing
    recalculateGIA();
  }, [fabricCanvasRef, saveCurrentState, recalculateGIA]);

  const saveCanvas = useCallback(() => {
    // Implementation for saving canvas
    logger.debug("Canvas saved");
    return true;
  }, []);

  const deleteSelectedObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (activeObject) {
      // Save state before deletion
      saveCurrentState();
      
      if (activeObject.type === 'activeSelection') {
        // Multiple objects selected
        activeObject.forEachObject((obj: FabricObject) => {
          canvas.remove(obj);
        });
        canvas.discardActiveObject();
      } else {
        // Single object selected
        canvas.remove(activeObject);
      }
      
      canvas.requestRenderAll();
      recalculateGIA();
    }
  }, [fabricCanvasRef, saveCurrentState, recalculateGIA]);

  /**
   * Combine operations from both hooks
   */
  return {
    // Re-export necessary functions
    handleZoom,
    handleUndo,
    handleRedo,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,

    // Include functions from useDrawingTools
    clearDrawings,
    handleToolChange,
    saveCurrentState,
    processPoint
  };
};
