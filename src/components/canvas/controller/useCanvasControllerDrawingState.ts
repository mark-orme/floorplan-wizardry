
/**
 * Hook for managing drawing state in the canvas controller
 * @module useCanvasControllerDrawingState
 */
import { useEffect } from "react";
import { Object as FabricObject } from "fabric";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { DrawingTool } from "@/types/floorPlanTypes";
import { FloorPlan } from "@/types/floorPlanTypes";
import { DrawingState, createDefaultDrawingState } from "@/types/core/DrawingState";
import { asDrawingTool } from "@/utils/drawing/drawingToolAdapter";
import { DrawingMode } from "@/constants/drawingModes";
import { ExtendedFabricCanvas } from "@/types/canvas-types";

/**
 * Props for useCanvasControllerDrawingState hook
 * @interface UseCanvasControllerDrawingStateProps
 */
interface UseCanvasControllerDrawingStateProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<ExtendedFabricCanvas | null>;
  
  /** Current drawing tool */
  tool: DrawingMode | DrawingTool;
  
  /** Function to set the current drawing tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingMode | DrawingTool>>;
  
  /** Line color for drawing */
  lineColor: string;
  
  /** Line thickness for drawing */
  lineThickness: number;
  
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  
  /** Function to save the current state */
  saveCurrentState?: () => void;
  
  /** Function to add objects to the canvas */
  addObjectsToCanvas?: (objects: FabricObject[]) => void;
}

/**
 * Return type for useCanvasControllerDrawingState hook
 * @interface UseCanvasControllerDrawingStateReturn
 */
export interface UseCanvasControllerDrawingStateReturn {
  /** Current drawing state */
  drawingState: DrawingState;
  
  /** Function to set the drawing state */
  setDrawingState: React.Dispatch<React.SetStateAction<DrawingState>>;
  
  /** Function to handle mouse down event */
  handleMouseDown: (event: any) => void;
  
  /** Function to handle mouse move event */
  handleMouseMove: (event: any) => void;
  
  /** Function to handle mouse up event */
  handleMouseUp: (event: any) => void;
  
  /** Function to start drawing */
  startDrawing: (point: { x: number; y: number }) => void;
  
  /** Function to continue drawing */
  continueDrawing: (point: { x: number; y: number }) => void;
  
  /** Function to end drawing */
  endDrawing: () => void;
}

/**
 * Hook for managing drawing state in the canvas controller
 * @param props - Hook props
 * @returns Drawing state and methods
 */
export const useCanvasControllerDrawingState = ({
  fabricCanvasRef,
  tool,
  setTool,
  lineColor,
  lineThickness,
  floorPlans,
  setFloorPlans,
  saveCurrentState,
  addObjectsToCanvas
}: UseCanvasControllerDrawingStateProps): UseCanvasControllerDrawingStateReturn => {
  // Use canvas drawing hook for shared drawing functionality
  const {
    drawingState,
    setDrawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    startDrawing,
    continueDrawing,
    endDrawing
  } = useCanvasDrawing({
    canvas: fabricCanvasRef.current,
    tool: tool as DrawingTool,
    lineColor,
    lineThickness,
    onDrawingEnd: saveCurrentState
  });

  // Return all methods and state
  return {
    drawingState,
    setDrawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    startDrawing,
    continueDrawing,
    endDrawing
  };
};
