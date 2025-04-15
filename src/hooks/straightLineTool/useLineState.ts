
/**
 * Hook for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useState, useRef, useCallback } from "react";
import { Canvas, Line, Text } from "fabric";
import { Point } from "@/types/core/Geometry";
import { FabricCanvas, FabricObjectWithId } from "@/types/fabric";

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
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // References to objects
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Snapping state
  const [snapEnabled, setSnapEnabled] = useState(true);
  
  // Input method state
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  
  // Measurement data
  const [measurementData, setMeasurementData] = useState({
    distance: null,
    angle: null
  });
  
  /**
   * Create a line object
   */
  const createLine = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const line = new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true,
      strokeUniform: true,
      objectType: 'line'
    });
    
    return line;
  }, [lineColor, lineThickness]);
  
  /**
   * Create a distance tooltip
   */
  const createDistanceTooltip = useCallback((x: number, y: number, distance: number) => {
    const tooltip = new Text(`${distance.toFixed(0)}px`, {
      left: x,
      top: y - 20,
      fontSize: 12,
      fill: '#333',
      selectable: false,
      objectType: 'tooltip'
    });
    
    return tooltip;
  }, []);
  
  /**
   * Update line and tooltip
   */
  const updateLineAndTooltip = useCallback((startPoint: Point, endPoint: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !currentLineRef.current || !distanceTooltipRef.current) return;
    
    // Update line
    const line = currentLineRef.current;
    line.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    // Calculate distance
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update tooltip
    const tooltip = distanceTooltipRef.current;
    tooltip.set({
      left: startPoint.x + dx / 2,
      top: startPoint.y + dy / 2 - 20,
      text: `${distance.toFixed(0)}px`
    });
    
    // Update measurement data
    setMeasurementData(prev => ({
      ...prev,
      distance: distance
    }));
  }, [fabricCanvasRef]);
  
  /**
   * Initialize the tool
   */
  const initializeTool = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Configure canvas
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.hoverCursor = 'crosshair';
    canvas.isDrawingMode = false;
    
    // Mark as initialized
    setIsToolInitialized(true);
  }, [fabricCanvasRef]);
  
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
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Snap point to grid
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const gridSize = 20; // Grid size in pixels
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled]);
  
  /**
   * Snap line to grid
   */
  const snapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start, end };
    
    return {
      start: snapPointToGrid(start),
      end: snapPointToGrid(end)
    };
  }, [snapEnabled, snapPointToGrid]);
  
  return {
    isDrawing,
    setIsDrawing,
    isToolInitialized,
    setIsToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint: (point: Point) => { startPointRef.current = point; },
    setCurrentLine: (line: Line) => { currentLineRef.current = line; },
    setDistanceTooltip: (tooltip: Text) => { distanceTooltipRef.current = tooltip; },
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
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
