
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { useCallback, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { usePathEvents } from "./usePathEvents";
import { useCanvasHistory } from "./useCanvasHistory";
import { DrawingTool } from "@/types/core/DrawingTool";
import { DrawingMode } from "@/constants/drawingModes";
import { Point } from "@/types/core/Geometry";
import { DrawingState, createDefaultDrawingState } from "@/types/drawingTypes";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Props for the useCanvasDrawing hook
 * @interface UseCanvasDrawingProps
 */
interface UseCanvasDrawingProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Current floor index */
  currentFloor: number;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Current line thickness */
  lineThickness?: number;
  /** Current line color */
  lineColor?: string;
  /** Function to delete selected objects */
  deleteSelectedObjects?: () => void;
  /** Function to recalculate gross internal area */
  recalculateGIA?: () => void;
}

/**
 * Result type for the useCanvasDrawing hook
 * @interface UseCanvasDrawingResult
 */
interface UseCanvasDrawingResult {
  /** Current drawing state */
  drawingState: DrawingState;
  /** Clear all drawn objects */
  clearDrawings: () => void;
  /** Delete selected objects */
  deleteObjects: () => void;
  /** Handle mouse down event */
  handleMouseDown: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse move event */
  handleMouseMove: (e: MouseEvent | TouchEvent) => void;
  /** Handle mouse up event */
  handleMouseUp: (e: MouseEvent | TouchEvent) => void;
}

/**
 * Hook for handling all drawing-related operations on the canvas
 * Coordinates multiple sub-hooks for complete drawing functionality
 * 
 * @param {UseCanvasDrawingProps} props - Hook properties
 * @returns {UseCanvasDrawingResult} Drawing state and handlers
 */
export const useCanvasDrawing = (props: UseCanvasDrawingProps): UseCanvasDrawingResult => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness = 2,
    lineColor = '#000000',
    deleteSelectedObjects = () => {},
    recalculateGIA = () => {}
  } = props;

  // Drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());
  
  // Canvas history
  const { saveCurrentState, undo, redo } = useCanvasHistory({
    fabricCanvasRef,
    historyRef
  });
  
  /**
   * Start drawing at a point
   * 
   * @param {Point} point - Starting point
   */
  const startDrawing = useCallback((point: Point) => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      pathStartPoint: point,
      startPoint: point,
      currentPoint: point,
      points: [point]
    }));
    
    console.log('Started drawing with tool:', tool, 'at point:', point);
  }, [tool]);
  
  /**
   * Continue drawing to a point
   * 
   * @param {Point} point - Current point
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!drawingState.isDrawing) return;
    
    setDrawingState(prev => ({
      ...prev,
      currentPoint: point,
      points: [...prev.points, point]
    }));
  }, [drawingState.isDrawing]);
  
  /**
   * End drawing at a point
   * 
   * @param {Point} point - End point
   */
  const endDrawing = useCallback((point: Point) => {
    if (!drawingState.isDrawing) return;
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      currentPoint: point,
      points: [...prev.points, point]
    }));
    
    // Process the completed drawing
    processDrawing([...drawingState.points, point]);
    
    // Recalculate GIA if needed
    if (recalculateGIA) {
      recalculateGIA();
    }
  }, [drawingState, recalculateGIA]);
  
  /**
   * Cancel the current drawing
   */
  const cancelDrawing = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false
    }));
  }, []);
  
  /**
   * Process a completed drawing
   * 
   * @param {Point[]} points - Points in the drawing
   */
  const processDrawing = useCallback((points: Point[]) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || points.length < 2) return;
    
    // Different behavior based on tool
    switch (tool) {
      case DrawingMode.DRAW:
        // Create freeform path
        // Implementation would depend on the specific requirements
        break;
        
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.LINE:
        // Create straight line between first and last points
        // Implementation would depend on the specific requirements
        break;
        
      case DrawingMode.RECTANGLE:
        // Create rectangle from start and end points
        // Implementation would depend on the specific requirements
        break;
        
      case DrawingMode.CIRCLE:
        // Create circle from start and end points
        // Implementation would depend on the specific requirements
        break;
        
      case DrawingMode.WALL:
        // Create wall from points
        // Implementation would depend on the specific requirements
        break;
        
      default:
        // For other tools or unknown tools
        break;
    }
    
    // Render canvas
    canvas.requestRenderAll();
    
    // Save state after creating object
    saveCurrentState();
  }, [fabricCanvasRef, tool, saveCurrentState]);
  
  /**
   * Clear all drawn objects on the canvas
   */
  const clearDrawings = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Save current state before clearing
    saveCurrentState();
    
    // Get all non-grid objects
    const objects = canvas.getObjects().filter(
      obj => !gridLayerRef.current.includes(obj)
    );
    
    // Remove all non-grid objects
    canvas.remove(...objects);
    canvas.requestRenderAll();
  }, [fabricCanvasRef, gridLayerRef, saveCurrentState]);
  
  /**
   * Delete selected objects on the canvas
   */
  const deleteObjects = useCallback(() => {
    if (deleteSelectedObjects) {
      deleteSelectedObjects();
    }
  }, [deleteSelectedObjects]);
  
  // Get path event handlers
  const { 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    cleanupTimeouts 
  } = usePathEvents({
    fabricCanvasRef,
    tool,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    saveCurrentState,
    lineThickness,
    lineColor
  });
  
  return {
    drawingState,
    clearDrawings,
    deleteObjects,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
