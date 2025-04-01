/**
 * Centralized drawing tool manager
 * Provides unified handling of all drawing tools
 * @module hooks/drawing/useDrawingToolManager
 */
import { useCallback, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "@/types/core/DrawingTool";
import { DrawingMode } from "@/constants/drawingModes";
import { useMouseEvents } from "./useMouseEvents";
import { Point } from "@/types/core/Geometry";
import { toast } from "sonner";
import logger from "@/utils/logger";

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  currentDrawingObject: FabricObject | null;
}

/**
 * Props for the useDrawingToolManager hook
 */
export interface UseDrawingToolManagerProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Function to save the current canvas state */
  saveCurrentState?: () => void;
  /** Line thickness for drawing */
  lineThickness?: number;
  /** Line color for drawing */
  lineColor?: string;
  /** Whether to use grid snapping */
  snapToGrid?: boolean;
  /** Function to snap a point to the grid */
  snapPointToGrid?: (point: Point) => Point;
}

/**
 * Return type for the useDrawingToolManager hook
 */
export interface UseDrawingToolManagerResult {
  /** Current drawing state */
  drawingState: DrawingState;
  /** Start drawing at a point */
  startDrawing: (point: Point) => void;
  /** Continue drawing to a point */
  continueDrawing: (point: Point) => void;
  /** End drawing at a point */
  endDrawing: (point: Point) => void;
  /** Cancel the current drawing */
  cancelDrawing: () => void;
  /** Mouse event handlers */
  mouseHandlers: {
    handleMouseDown: (e: MouseEvent | TouchEvent) => void;
    handleMouseMove: (e: MouseEvent | TouchEvent) => void;
    handleMouseUp: (e: MouseEvent | TouchEvent) => void;
  };
}

/**
 * Default drawing state
 */
const defaultDrawingState: DrawingState = {
  isDrawing: false,
  startPoint: null,
  currentPoint: null,
  points: [],
  currentDrawingObject: null
};

/**
 * Hook for centralized management of drawing tools
 * 
 * @param {UseDrawingToolManagerProps} props - Hook properties
 * @returns {UseDrawingToolManagerResult} Drawing tool state and handlers
 */
export const useDrawingToolManager = (
  props: UseDrawingToolManagerProps
): UseDrawingToolManagerResult => {
  const {
    fabricCanvasRef,
    tool,
    saveCurrentState,
    lineThickness = 2,
    lineColor = "#000000",
    snapToGrid = false,
    snapPointToGrid = (point: Point) => point
  } = props;

  // Drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>(defaultDrawingState);

  /**
   * Start drawing at a point
   */
  const startDrawing = useCallback((point: Point): void => {
    // Apply grid snapping if enabled
    const processedPoint = snapToGrid ? snapPointToGrid(point) : point;
    
    logger.info("Starting drawing", { tool, point: processedPoint });
    
    // Save current state before starting new drawing
    if (saveCurrentState) {
      saveCurrentState();
    }
    
    // Update drawing state
    setDrawingState({
      isDrawing: true,
      startPoint: processedPoint,
      currentPoint: processedPoint,
      points: [processedPoint],
      currentDrawingObject: null
    });
    
    // Tool-specific start drawing logic
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Different behavior based on tool
    switch (tool) {
      case DrawingMode.STRAIGHT_LINE:
        // Handled by useStraightLineTool
        break;
      case DrawingMode.DRAW:
        // Using canvas free drawing mode
        break;
      default:
        // Other tools
        break;
    }
  }, [fabricCanvasRef, tool, saveCurrentState, snapToGrid, snapPointToGrid]);

  /**
   * Continue drawing to a point
   */
  const continueDrawing = useCallback((point: Point): void => {
    if (!drawingState.isDrawing) return;
    
    // Apply grid snapping if enabled
    const processedPoint = snapToGrid ? snapPointToGrid(point) : point;
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      currentPoint: processedPoint,
      points: [...prev.points, processedPoint]
    }));
    
    // Tool-specific continue drawing logic
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Different behavior based on tool
    switch (tool) {
      case DrawingMode.STRAIGHT_LINE:
        // Handled by useStraightLineTool
        break;
      default:
        // Other tools
        break;
    }
  }, [fabricCanvasRef, tool, drawingState.isDrawing, snapToGrid, snapPointToGrid]);

  /**
   * End drawing at a point
   */
  const endDrawing = useCallback((point: Point): void => {
    if (!drawingState.isDrawing) return;
    
    // Apply grid snapping if enabled
    const processedPoint = snapToGrid ? snapPointToGrid(point) : point;
    
    logger.info("Ending drawing", { 
      tool, 
      startPoint: drawingState.startPoint, 
      endPoint: processedPoint,
      pointCount: drawingState.points.length + 1
    });
    
    // Update drawing state
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      currentPoint: processedPoint,
      points: [...prev.points, processedPoint]
    }));
    
    // Tool-specific end drawing logic
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Create the final object based on the tool
    switch (tool) {
      case DrawingMode.STRAIGHT_LINE:
        // Handled by useStraightLineTool
        break;
      default:
        // Notify about other tools
        toast.info(`Drawing completed with ${tool}`);
        break;
    }
    
    // Save the canvas state after drawing is complete
    if (saveCurrentState) {
      saveCurrentState();
    }
  }, [fabricCanvasRef, tool, drawingState, saveCurrentState, snapToGrid, snapPointToGrid]);

  /**
   * Cancel the current drawing
   */
  const cancelDrawing = useCallback((): void => {
    if (!drawingState.isDrawing) return;
    
    logger.info("Canceling drawing", { tool });
    
    // Remove temporary drawing object if it exists
    const canvas = fabricCanvasRef.current;
    if (canvas && drawingState.currentDrawingObject) {
      canvas.remove(drawingState.currentDrawingObject);
      canvas.requestRenderAll();
    }
    
    // Reset drawing state
    setDrawingState(defaultDrawingState);
    
    toast.info("Drawing canceled");
  }, [fabricCanvasRef, tool, drawingState]);

  // Get mouse event handlers
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useMouseEvents({
    fabricCanvasRef,
    tool,
    startDrawing,
    continueDrawing,
    endDrawing,
    isDrawing: drawingState.isDrawing,
    lineThickness,
    lineColor
  });

  return {
    drawingState,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    mouseHandlers: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp
    }
  };
};
