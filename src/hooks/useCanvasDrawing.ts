
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

interface HistoryRef {
  past: FabricObject[][];
  future: FabricObject[][];
}

interface UseCanvasDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<HistoryRef>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness?: number;
  lineColor?: string;
  deleteSelectedObjects?: () => void;
  recalculateGIA?: () => void;
}

interface UseCanvasDrawingResult {
  drawingState: DrawingState;
}

/**
 * Hook for handling all drawing-related operations on the canvas
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
