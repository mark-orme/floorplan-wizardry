
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { usePathProcessing } from "./usePathProcessing";
import { useCanvasHistory } from "./useCanvasHistory";
import { useCanvasEventHandlers } from "./useCanvasEventHandlers";
import { type FloorPlan } from "@/types/floorPlanTypes";
import { DrawingTool } from "./useCanvasState";
import { type DrawingState } from "@/types/drawingTypes";
import { useCanvasDrawingState } from "./canvas/drawing/useCanvasDrawingState";
import { useCanvasDrawingEvents } from "./canvas/drawing/useCanvasDrawingEvents";

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
    lineColor = "#000000",
    deleteSelectedObjects = () => {},
    recalculateGIA
  } = props;
  
  // Use the drawing state hook to get all state-related functions
  const {
    drawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cleanupTimeouts,
    updateZoomLevel
  } = useCanvasDrawingState({
    fabricCanvasRef,
    tool
  });
  
  // Use the improved history management hook
  const { saveCurrentState, handleUndo, handleRedo } = useCanvasHistory({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    recalculateGIA: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Recalculating GIA after history operation");
      }
      if (recalculateGIA && typeof recalculateGIA === 'function') {
        recalculateGIA();
      }
    }
  });
  
  // Use the path processing hook
  const { processCreatedPath } = usePathProcessing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    recalculateGIA
  });
  
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
    deleteSelectedObjects
  });
  
  // Register zoom and GIA event listeners
  useCanvasDrawingEvents({
    fabricCanvasRef,
    tool,
    saveCurrentState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    processCreatedPath,
    updateZoomLevel,
    recalculateGIA,
    deleteSelectedObjects
  });
  
  // Return drawing state with current zoom level
  return {
    drawingState
  };
};
