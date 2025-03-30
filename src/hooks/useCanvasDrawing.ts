
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Path as FabricPath } from "fabric";
import { usePathProcessing } from "./usePathProcessing";
import { useCanvasHistory } from "./useCanvasHistory";
import { useCanvasEventHandlers } from "./useCanvasEventHandlers";
import { type FloorPlan } from "@/types/floorPlanTypes";
import { DrawingTool } from "@/types/drawingTypes";
import { useCanvasDrawingState } from "./useCanvasDrawingState";
import { useCanvasDrawingEvents } from "./canvas/drawing/useCanvasDrawingEvents";
import { DrawingState } from "@/types/drawingTypes";

/**
 * History state reference object
 * @interface HistoryRef
 */
interface HistoryRef {
  /** Array of past states for undo operations */
  past: FabricObject[][];
  /** Array of future states for redo operations */
  future: FabricObject[][];
}

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
  historyRef: React.MutableRefObject<HistoryRef>;
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

  // Drawing state - explicitly using the DrawingState type from drawingTypes
  const { drawingState, setDrawingState } = useCanvasDrawingState();
  
  // Canvas history
  const { saveCurrentState, handleUndo, handleRedo } = useCanvasHistory({
    fabricCanvasRef,
    gridLayerRef,
    historyRef
  });
  
  // Path processing - pass all required props
  const { processCreatedPath } = usePathProcessing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    setFloorPlans,
    currentFloor,
    setGia
  });
  
  // Update zoom level function
  const updateZoomLevel = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Update zoom level in drawing state
    setDrawingState(prev => ({
      ...prev,
      zoomLevel: canvas.getZoom()
    }));
  }, [fabricCanvasRef, setDrawingState]);
  
  // Canvas drawing events
  const { 
    isDrawing, 
    currentPath, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    cleanupTimeouts 
  } = useCanvasDrawingEvents(tool, lineThickness, lineColor);
  
  // Register event handlers
  useCanvasEventHandlers({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState,
    handleUndo,
    handleRedo,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    processCreatedPath,
    cleanupTimeouts,
    deleteSelectedObjects,
    updateZoomLevel
  });
  
  return {
    drawingState
  };
};
