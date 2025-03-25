
/**
 * Hook for tracking the canvas drawing state
 * @module useCanvasControllerDrawingState
 */
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useMemo } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";

interface UseCanvasControllerDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness: number;
  lineColor: string;
}

/**
 * Hook that tracks the drawing state for measurements and tooltips
 * @returns Current drawing state for the canvas
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
    lineColor
  } = props;

  // Use memoized props to prevent re-renders
  const memoizedProps = useMemo(() => ({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor
  }), [
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor
  ]);

  // Drawing state tracking for measurement tooltip
  const { drawingState } = useCanvasDrawing(memoizedProps);

  return {
    drawingState
  };
};
