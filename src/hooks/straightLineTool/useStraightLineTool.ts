
/**
 * Straight line drawing tool hook
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useRef } from "react";
import { Canvas } from "fabric";
import { useLineState } from "./useLineState";
import { useLineToolHandlers } from "./useLineToolHandlers";
import { useLineMouseHandlers } from "./useLineMouseHandlers";
import { useLineToolInitialization } from "./useLineToolInitialization";
import { useLineToolResult } from "./useLineToolResult";
import { Point } from "@/types/core/Geometry";

/**
 * Props for the straight line tool hook
 */
interface UseStraightLineToolProps {
  /**
   * Reference to the fabric canvas
   */
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  /**
   * Whether the tool is enabled
   */
  enabled: boolean;
  /**
   * Line color
   */
  lineColor: string;
  /**
   * Line thickness
   */
  lineThickness: number;
  /**
   * Callback for saving the current state
   */
  saveCurrentState?: () => void;
}

/**
 * Hook for drawing straight lines on canvas
 * @param props - Hook properties 
 */
export const useStraightLineTool = (props: UseStraightLineToolProps) => {
  const { 
    fabricCanvasRef, 
    enabled, 
    lineColor, 
    lineThickness, 
    saveCurrentState 
  } = props;
  
  // Use the line state hook
  const lineState = useLineState({ 
    fabricCanvasRef, 
    lineColor, 
    lineThickness 
  });
  
  // Use the line tool handlers
  useLineToolHandlers({
    fabricCanvasRef,
    enabled,
    lineState,
    saveCurrentState
  });
  
  // Use the mouse handlers
  useLineMouseHandlers({
    fabricCanvasRef,
    enabled,
    isDrawing: lineState.isDrawing,
    startPointRef: lineState.startPointRef,
    currentLineRef: lineState.currentLineRef,
    distanceTooltipRef: lineState.distanceTooltipRef,
    setIsDrawing: lineState.setIsDrawing,
    setStartPoint: lineState.setStartPoint,
    setCurrentLine: lineState.setCurrentLine,
    setDistanceTooltip: lineState.setDistanceTooltip,
    createLine: lineState.createLine,
    createDistanceTooltip: lineState.createDistanceTooltip,
    updateLineAndTooltip: lineState.updateLineAndTooltip,
    resetDrawingState: lineState.resetDrawingState,
    snapPointToGrid: lineState.snapPointToGrid,
    snapLineToGrid: lineState.snapLineToGrid,
    saveCurrentState,
    setInputMethod: lineState.setInputMethod
  });
  
  // Use the tool initialization
  useLineToolInitialization({
    fabricCanvasRef,
    enabled,
    isToolInitialized: lineState.isToolInitialized,
    initializeTool: lineState.initializeTool
  });
  
  // Create the result object
  return useLineToolResult({
    isDrawing: lineState.isDrawing,
    enabled,
    inputMethod: lineState.inputMethod,
    snapEnabled: lineState.snapEnabled,
    startPointRef: lineState.startPointRef,
    currentLineRef: lineState.currentLineRef,
    toggleSnap: lineState.toggleSnap
  });
};
