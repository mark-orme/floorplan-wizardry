
/**
 * Hook for managing drawing state in the canvas controller
 * @module useCanvasControllerDrawingState
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { DrawingTool } from "@/types/canvasStateTypes";
import { FloorPlan } from "@/types/FloorPlan";
import { DrawingState, createDefaultDrawingState } from "@/types/core/DrawingState";
import { asDrawingTool } from "@/utils/drawing/drawingToolAdapter";
import { DrawingMode } from "@/constants/drawingModes";

/**
 * Props for useCanvasControllerDrawingState hook
 * @interface UseCanvasControllerDrawingStateProps
 */
interface UseCanvasControllerDrawingStateProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Current active drawing tool */
  tool: DrawingMode;
  /** Current floor index */
  currentFloor: number;
  /** Function to update floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to update GIA */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Current line thickness */
  lineThickness: number;
  /** Current line color */
  lineColor: string;
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
  /** Function to update drawing state */
  setDrawingState: React.Dispatch<React.SetStateAction<DrawingState | null>>;
  /** Function to recalculate GIA */
  recalculateGIA?: () => void;
}

/**
 * Return type for the hook
 */
interface UseCanvasControllerDrawingStateResult {
  /** Current drawing state */
  drawingState: DrawingState | null;
}

/**
 * Hook that handles drawing state in the canvas controller
 * @param {UseCanvasControllerDrawingStateProps} props - Hook properties
 * @returns {UseCanvasControllerDrawingStateResult} Drawing state
 */
export const useCanvasControllerDrawingState = (
  props: UseCanvasControllerDrawingStateProps
): UseCanvasControllerDrawingStateResult => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    deleteSelectedObjects,
    setDrawingState,
    recalculateGIA
  } = props;
  
  // Use the canvas drawing hook - convert DrawingMode to DrawingTool with the adapter
  const toolAsDrawingTool = asDrawingTool(tool);
  
  // Use a type assertion since we know the types are compatible
  const { drawingState } = useCanvasDrawing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool: toolAsDrawingTool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    deleteSelectedObjects,
    recalculateGIA
  });
  
  // Update the controller drawing state whenever it changes
  useEffect(() => {
    if (drawingState) {
      setDrawingState(drawingState as unknown as DrawingState);
    } else {
      // Create a properly populated default state
      const defaultState = createDefaultDrawingState();
      setDrawingState(defaultState);
    }
  }, [drawingState, setDrawingState]);
  
  return { drawingState: drawingState as unknown as DrawingState };
};
