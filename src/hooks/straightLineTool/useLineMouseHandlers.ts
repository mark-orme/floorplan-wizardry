
/**
 * Hook for managing mouse handlers for the straight line tool
 * @module hooks/straightLineTool/useLineMouseHandlers
 */
import { useCallback, useEffect } from "react";
import { Canvas } from "fabric";
import { Point } from "@/types/core/Geometry";
import { InputMethod } from "./useLineState";

interface UseLineMouseHandlersProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  enabled: boolean;
  isDrawing: boolean;
  startPointRef: React.MutableRefObject<Point | null>;
  currentLineRef: React.MutableRefObject<any | null>;
  distanceTooltipRef: React.MutableRefObject<any | null>;
  setIsDrawing: (isDrawing: boolean) => void;
  setStartPoint: (point: Point) => void;
  setCurrentLine: (line: any) => void;
  setDistanceTooltip: (tooltip: any) => void;
  createLine: (x1: number, y1: number, x2: number, y2: number) => any;
  createDistanceTooltip: (x: number, y: number, distance: number) => any;
  updateLineAndTooltip: (startPoint: Point, endPoint: Point) => void;
  resetDrawingState: () => void;
  snapPointToGrid: (point: Point) => Point;
  snapLineToGrid: (start: Point, end: Point) => { start: Point; end: Point };
  saveCurrentState?: () => void;
  setInputMethod: (method: InputMethod) => void;
}

/**
 * Hook for handling line tool mouse events
 */
export const useLineMouseHandlers = (props: UseLineMouseHandlersProps) => {
  const {
    fabricCanvasRef,
    enabled,
    isDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    resetDrawingState,
    snapPointToGrid,
    snapLineToGrid,
    saveCurrentState,
    setInputMethod
  } = props;

  // Set up event handlers for canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !enabled) return;
    
    // Set cursor style
    canvas.defaultCursor = 'crosshair';
    
    // Function to handle pointer down event
    const handlePointerDown = (event: any) => {
      if (!enabled) return;
      
      // Get input method
      const isTouch = event.e && event.e.type.includes('touch');
      const isStylus = event.e && event.e.pointerType === 'pen';
      setInputMethod(isStylus ? InputMethod.PENCIL : isTouch ? InputMethod.TOUCH : InputMethod.MOUSE);
      
      // Get pointer coordinates
      const pointerObj = canvas.getPointer(event.e);
      
      // Create a simple Point object compatible with our Point type
      const pointer: Point = {
        x: pointerObj.x,
        y: pointerObj.y
      };
      
      // Snap to grid if enabled
      const snappedPointer = snapPointToGrid(pointer);
      
      // Set start point and create line
      setIsDrawing(true);
      setStartPoint(snappedPointer);
      
      const line = createLine(snappedPointer.x, snappedPointer.y, snappedPointer.x, snappedPointer.y);
      setCurrentLine(line);
      
      // Create distance tooltip
      const tooltip = createDistanceTooltip(snappedPointer.x, snappedPointer.y, 0);
      setDistanceTooltip(tooltip);
      
      // Add objects to canvas
      canvas.add(line, tooltip);
    };
    
    // Function to handle pointer move event
    const handlePointerMove = (event: any) => {
      if (!enabled || !isDrawing || !startPointRef.current) return;
      
      // Get pointer coordinates
      const pointerObj = canvas.getPointer(event.e);
      
      // Create a simple Point object compatible with our Point type
      const pointer: Point = {
        x: pointerObj.x,
        y: pointerObj.y
      };
      
      // Snap to grid if enabled
      const snappedPointer = snapPointToGrid(pointer);
      
      // Update line and tooltip
      updateLineAndTooltip(startPointRef.current, snappedPointer);
      
      // Request render
      canvas.requestRenderAll();
    };
    
    // Function to handle pointer up event
    const handlePointerUp = () => {
      if (!enabled || !isDrawing || !startPointRef.current || !currentLineRef.current || !distanceTooltipRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Snap line to grid
      const currentLine = currentLineRef.current;
      const { start, end } = snapLineToGrid(startPointRef.current, {
        x: currentLine.x2 || 0,
        y: currentLine.y2 || 0
      });
      
      // Update line and tooltip
      updateLineAndTooltip(start, end);
      
      // Remove tooltip
      canvas.remove(distanceTooltipRef.current);
      
      // Reset drawing state
      setIsDrawing(false);
      resetDrawingState();
      
      // Save state
      if (saveCurrentState) {
        saveCurrentState();
      }
    };
    
    // Add event listeners
    canvas.on('mouse:down', handlePointerDown);
    canvas.on('mouse:move', handlePointerMove);
    canvas.on('mouse:up', handlePointerUp);
    
    // Clean up event listeners
    return () => {
      canvas.off('mouse:down', handlePointerDown);
      canvas.off('mouse:move', handlePointerMove);
      canvas.off('mouse:up', handlePointerUp);
    };
  }, [
    fabricCanvasRef,
    enabled,
    isDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    snapPointToGrid,
    snapLineToGrid,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    resetDrawingState,
    saveCurrentState,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setInputMethod
  ]);

  return {
    // Return handlers for use in parent component if needed
  };
};
