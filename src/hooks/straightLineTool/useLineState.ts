
/**
 * Hook for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useState, useRef, useCallback } from "react";
import { Canvas } from "fabric";
import { Point } from "@/types/core/Geometry";
import { useGridSnapping } from "./useGridSnapping";
import { useLineCreation } from "./useLineCreation";
import { useToolInitialization } from "./useToolInitialization";

/**
 * Input method enum for drawing
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

/**
 * Props for useLineState hook
 */
export interface UseLineStateProps {
  /**
   * Reference to the fabric canvas
   */
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  /**
   * Line color
   */
  lineColor: string;
  /**
   * Line thickness
   */
  lineThickness: number;
}

/**
 * Hook for managing the state of the line drawing tool
 */
export const useLineState = (props: UseLineStateProps) => {
  const { fabricCanvasRef, lineColor, lineThickness } = props;
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  
  // References to objects
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<any | null>(null);
  const distanceTooltipRef = useRef<any | null>(null);
  
  // Input method state
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  
  // Measurement data
  const [measurementData, setMeasurementData] = useState({
    distance: null,
    angle: null
  });
  
  // Use grid snapping hook
  const { snapEnabled, toggleSnap, snapPointToGrid, snapLineToGrid } = useGridSnapping();
  
  // Use line creation hook
  const { createLine, createDistanceTooltip, updateLineAndTooltip } = useLineCreation({
    lineColor,
    lineThickness
  });
  
  // Use tool initialization hook
  const { isToolInitialized, initializeTool } = useToolInitialization({ fabricCanvasRef });
  
  /**
   * Reset drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
  }, []);
  
  /**
   * Update line and tooltip wrapper
   */
  const updateLineAndTooltipWrapper = useCallback((startPoint: Point, endPoint: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !currentLineRef.current || !distanceTooltipRef.current) return;
    
    updateLineAndTooltip(
      currentLineRef.current, 
      distanceTooltipRef.current, 
      startPoint, 
      endPoint, 
      setMeasurementData
    );
  }, [fabricCanvasRef, updateLineAndTooltip]);
  
  return {
    isDrawing,
    setIsDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint: (point: Point) => { startPointRef.current = point; },
    setCurrentLine: (line: any) => { currentLineRef.current = line; },
    setDistanceTooltip: (tooltip: any) => { distanceTooltipRef.current = tooltip; },
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip: updateLineAndTooltipWrapper,
    initializeTool,
    resetDrawingState,
    snapEnabled,
    toggleSnap,
    snapPointToGrid,
    snapLineToGrid,
    inputMethod,
    setInputMethod,
    measurementData,
    setMeasurementData
  };
};
