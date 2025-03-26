
/**
 * Hook for managing drawing state in the canvas controller
 * @module useCanvasControllerDrawingState
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { DrawingTool } from "@/hooks/useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";
import { DrawingState } from "@/types/drawingTypes";

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
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  /** Current active drawing tool */
  tool: DrawingTool;
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
 * Hook that handles drawing state in the canvas controller
 * @param {UseCanvasControllerDrawingStateProps} props - Hook properties
 */
export const useCanvasControllerDrawingState = (props: UseCanvasControllerDrawingStateProps) => {
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
  
  // Use the canvas drawing hook
  const { drawingState } = useCanvasDrawing({
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
    recalculateGIA
  });
  
  // Update the controller drawing state whenever it changes
  useEffect(() => {
    setDrawingState(drawingState);
  }, [drawingState, setDrawingState]);
  
  return { drawingState };
};
