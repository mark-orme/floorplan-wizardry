
/**
 * Straight line tool hook
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';
import { applyLineStyles, LineStyleOptions } from './lineStyles';
import { hasValidCoordinates, isLineTooShort } from './lineDiagnostics';
import { registerLineCreation } from './lineEvents';
import { useGridAlignment } from './useGridAlignment';

export interface UseStraightLineToolProps {
  /** Current drawing mode */
  drawingMode: DrawingMode;
  /** Line style options */
  styleOptions: LineStyleOptions;
  /** Enable grid snapping */
  snapToGrid?: boolean;
  /** Grid size */
  gridSize?: number;
}

export interface UseStraightLineToolResult {
  /** Whether the tool is active */
  isActive: boolean;
  /** Whether drawing is in progress */
  isDrawing: boolean;
  /** Current line object */
  currentLine: Line | null;
  /** Start drawing */
  startDrawing: (canvas: FabricCanvas, point: Point) => void;
  /** Continue drawing */
  continueDrawing: (canvas: FabricCanvas, point: Point) => void;
  /** End drawing */
  endDrawing: (canvas: FabricCanvas) => void;
  /** Cancel drawing */
  cancelDrawing: (canvas: FabricCanvas) => void;
}

/**
 * Hook for straight line drawing tool
 * @param props Hook props
 * @returns Line tool functions and state
 */
export const useStraightLineTool = ({
  drawingMode,
  styleOptions,
  snapToGrid = true,
  gridSize = 20
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  // Internal state
  const [isDrawing, setIsDrawing] = useState(false);
  const lineRef = useRef<Line | null>(null);
  const startPointRef = useRef<Point | null>(null);
  
  // Check if the tool is active
  const isActive = drawingMode === DrawingMode.STRAIGHT_LINE;
  
  // Get grid alignment functions
  const { snapToGrid: snapToGridFn, autoStraighten } = useGridAlignment({
    enabled: snapToGrid,
    gridSize,
    threshold: 10
  });
  
  /**
   * Create a new line
   * @param canvas Fabric canvas
   * @param start Start point
   * @param end End point
   * @returns Line object
   */
  const createLine = useCallback((
    canvas: FabricCanvas,
    start: Point,
    end: Point
  ): Line => {
    const line = new Line([start.x, start.y, end.x, end.y], {
      stroke: styleOptions.color,
      strokeWidth: styleOptions.thickness,
      strokeDashArray: styleOptions.dashed ? [5, 5] : undefined,
      selectable: false,
      evented: false
    });
    
    canvas.add(line);
    return line;
  }, [styleOptions]);
  
  /**
   * Start drawing a line
   * @param canvas Fabric canvas
   * @param point Starting point
   */
  const startDrawing = useCallback((
    canvas: FabricCanvas,
    point: Point
  ): void => {
    if (!isActive) return;
    
    // Apply grid snapping if enabled
    const snappedPoint = snapToGrid ? snapToGridFn(point) : point;
    
    // Store start point
    startPointRef.current = snappedPoint;
    
    // Create the initial line (start and end points are the same)
    const line = createLine(canvas, snappedPoint, snappedPoint);
    lineRef.current = line;
    
    // Update state
    setIsDrawing(true);
  }, [isActive, snapToGrid, snapToGridFn, createLine]);
  
  /**
   * Continue drawing a line
   * @param canvas Fabric canvas
   * @param point Current point
   */
  const continueDrawing = useCallback((
    canvas: FabricCanvas,
    point: Point
  ): void => {
    if (!isDrawing || !lineRef.current || !startPointRef.current) return;
    
    // Apply grid snapping if enabled
    const snappedPoint = snapToGrid ? snapToGridFn(point) : point;
    
    // Auto-straighten the line if needed
    const correctedPoint = autoStraighten(startPointRef.current, snappedPoint);
    
    // Update line coordinates
    lineRef.current.set({
      x2: correctedPoint.x,
      y2: correctedPoint.y
    });
    
    canvas.renderAll();
  }, [isDrawing, snapToGrid, snapToGridFn, autoStraighten]);
  
  /**
   * End drawing a line
   * @param canvas Fabric canvas
   */
  const endDrawing = useCallback((
    canvas: FabricCanvas
  ): void => {
    if (!isDrawing || !lineRef.current || !startPointRef.current) return;
    
    // Get end point from current line
    const endPoint: Point = {
      x: lineRef.current.x2 ?? startPointRef.current.x,
      y: lineRef.current.y2 ?? startPointRef.current.y
    };
    
    // Check if the line is too short
    if (isLineTooShort(startPointRef.current, endPoint)) {
      // Remove the line if it's too short
      canvas.remove(lineRef.current);
    } else {
      // Make the line selectable and register the creation
      lineRef.current.set({
        selectable: true,
        evented: true
      });
      
      registerLineCreation(
        canvas,
        lineRef.current,
        startPointRef.current,
        endPoint
      );
    }
    
    canvas.renderAll();
    
    // Reset state
    setIsDrawing(false);
    lineRef.current = null;
    startPointRef.current = null;
  }, [isDrawing]);
  
  /**
   * Cancel drawing a line
   * @param canvas Fabric canvas
   */
  const cancelDrawing = useCallback((
    canvas: FabricCanvas
  ): void => {
    if (!lineRef.current) return;
    
    // Remove the line from canvas
    canvas.remove(lineRef.current);
    canvas.renderAll();
    
    // Reset state
    setIsDrawing(false);
    lineRef.current = null;
    startPointRef.current = null;
  }, []);
  
  // Cleanup on unmount or when mode changes
  useEffect(() => {
    return () => {
      setIsDrawing(false);
      lineRef.current = null;
      startPointRef.current = null;
    };
  }, [isActive]);
  
  return {
    isActive,
    isDrawing,
    currentLine: lineRef.current,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing
  };
};
