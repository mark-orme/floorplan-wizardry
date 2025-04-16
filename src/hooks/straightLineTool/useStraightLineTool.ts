
/**
 * Hook for straight line drawing tool
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useLineState, InputMethod } from './useLineState';
import { useLineEvents } from './useLineEvents';

/**
 * Props for useStraightLineTool
 */
export interface UseStraightLineToolProps {
  canvas?: FabricCanvas | null;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
  snapToGrid?: boolean;
  angleConstraint?: boolean;
}

/**
 * Hook for straight line drawing tool
 * @param props Hook properties
 * @returns Straight line tool state and functions
 */
export const useStraightLineTool = ({
  canvas,
  fabricCanvasRef,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState,
  snapToGrid = false,
  angleConstraint = false
}: UseStraightLineToolProps) => {
  // Use the canvas from props or ref
  const actualCanvas = canvas || (fabricCanvasRef?.current || null);
  const actualCanvasRef = useRef<FabricCanvas | null>(actualCanvas);
  
  // Set up line state
  const lineState = useLineState({
    lineColor,
    lineThickness,
    fabricCanvasRef: actualCanvasRef,
    snapToGrid,
    angleConstraint
  });
  
  // Set up line events
  const lineEvents = useLineEvents({
    fabricCanvasRef: { current: actualCanvasRef.current },
    lineState,
    onComplete: saveCurrentState,
    enabled
  });
  
  // Update canvas ref when it changes
  useEffect(() => {
    if (canvas || fabricCanvasRef?.current) {
      actualCanvasRef.current = canvas || fabricCanvasRef?.current;
    }
  }, [canvas, fabricCanvasRef]);
  
  // Set up active state
  const isActive = enabled && !!actualCanvasRef.current;
  
  // Handle pointer events manually
  const handlePointerDown = (point: { x: number; y: number }) => {
    if (!isActive) return;
    
    const { startPointRef, setIsDrawing, setStartPoint, createLine, createDistanceTooltip } = lineState;
    const canvas = actualCanvasRef.current;
    if (!canvas) return;
    
    // Start drawing
    setIsDrawing(true);
    const snappedPoint = lineState.snapPointToGrid(point);
    setStartPoint(snappedPoint);
    startPointRef.current = snappedPoint;
    
    // Create line
    const line = createLine(snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y);
    canvas.add(line);
    lineState.setCurrentLine(line);
    
    // Create tooltip
    const tooltip = createDistanceTooltip(snappedPoint.x, snappedPoint.y, 0);
    canvas.add(tooltip);
    lineState.setDistanceTooltip(tooltip);
    
    // Render
    canvas.requestRenderAll();
  };
  
  const handlePointerMove = (point: { x: number; y: number }) => {
    if (!isActive || !lineState.isDrawing || !lineState.startPointRef.current) return;
    
    const canvas = actualCanvasRef.current;
    if (!canvas) return;
    
    // Get snapped point
    const snappedPoint = lineState.snapPointToGrid(point);
    
    // Update line and tooltip
    lineState.updateLineAndTooltip(lineState.startPointRef.current, snappedPoint);
    
    // Render
    canvas.requestRenderAll();
  };
  
  const handlePointerUp = (point: { x: number; y: number }) => {
    if (!isActive || !lineState.isDrawing || !lineState.startPointRef.current) return;
    
    const canvas = actualCanvasRef.current;
    if (!canvas) return;
    
    // Get snapped point
    const snappedPoint = lineState.snapPointToGrid(point);
    
    // Update line and tooltip one last time
    lineState.updateLineAndTooltip(lineState.startPointRef.current, snappedPoint);
    
    // Remove distance tooltip
    if (lineState.distanceTooltipRef.current) {
      canvas.remove(lineState.distanceTooltipRef.current);
    }
    
    // If the line has no length, remove it
    if (
      lineState.startPointRef.current.x === snappedPoint.x &&
      lineState.startPointRef.current.y === snappedPoint.y &&
      lineState.currentLineRef.current
    ) {
      canvas.remove(lineState.currentLineRef.current);
    } else if (saveCurrentState) {
      // Call completion callback
      saveCurrentState();
    }
    
    // Reset drawing state
    lineState.resetDrawingState();
    
    // Render
    canvas.requestRenderAll();
  };
  
  const cancelDrawing = () => {
    if (!lineState.isDrawing) return;
    
    const canvas = actualCanvasRef.current;
    if (!canvas) return;
    
    // Remove line
    if (lineState.currentLineRef.current) {
      canvas.remove(lineState.currentLineRef.current);
    }
    
    // Remove tooltip
    if (lineState.distanceTooltipRef.current) {
      canvas.remove(lineState.distanceTooltipRef.current);
    }
    
    // Reset drawing state
    lineState.resetDrawingState();
    
    // Render
    canvas.requestRenderAll();
  };
  
  return {
    ...lineState,
    isActive,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping: lineState.toggleSnap,
    toggleAngles: lineState.toggleAngles,
    startPointRef: lineState.startPointRef,
    currentLineRef: lineState.currentLineRef,
    lineEvents
  };
};

export type UseStraightLineToolResult = ReturnType<typeof useStraightLineTool>;
