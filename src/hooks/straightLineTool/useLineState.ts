
/**
 * Hook for line drawing state management
 * @module hooks/straightLineTool/useLineState
 */
import { useState, useRef } from 'react';
import { Canvas, Line } from 'fabric';
import { Point } from '@/types/core/Geometry';

/**
 * Input method for drawing
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  STYLUS = 'stylus',
  PENCIL = 'pencil'
}

/**
 * Line state hook props
 */
export interface UseLineStateProps {
  lineColor: string;
  lineThickness: number;
  fabricCanvasRef?: React.MutableRefObject<Canvas | null>;
  snapToGrid?: boolean;
  angleConstraint?: boolean;
}

/**
 * Hook for managing line drawing state
 * @param props Hook properties
 * @returns Line state and functions
 */
export const useLineState = ({
  lineColor,
  lineThickness,
  fabricCanvasRef,
  snapToGrid = false,
  angleConstraint = false
}: UseLineStateProps) => {
  // State for line drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [distanceTooltip, setDistanceTooltip] = useState<any | null>(null);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(snapToGrid);
  const [anglesEnabled, setAnglesEnabled] = useState(angleConstraint);
  const [measurementData, setMeasurementData] = useState<{
    distance: number;
    angle: number;
  }>({ distance: 0, angle: 0 });
  
  // Refs for accessing state in event handlers
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<any | null>(null);
  
  /**
   * Create a line
   * @param x1 Start point X
   * @param y1 Start point Y
   * @param x2 End point X
   * @param y2 End point Y
   * @returns Created line
   */
  const createLine = (x1: number, y1: number, x2: number, y2: number): Line => {
    const line = new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true,
      evented: true,
      objectType: 'line',
      data: {
        type: 'measurement-line',
        inputMethod: inputMethod
      }
    });
    
    currentLineRef.current = line;
    return line;
  };
  
  /**
   * Create a distance tooltip
   * @param x X position
   * @param y Y position
   * @param distance Distance value
   * @returns Created tooltip
   */
  const createDistanceTooltip = (x: number, y: number, distance: number): any => {
    // For now, using a placeholder object
    // In a real app, this would create a proper text or group object
    const tooltip = {
      type: 'tooltip',
      objectType: 'tooltip',
      position: { x, y },
      distance
    };
    
    distanceTooltipRef.current = tooltip;
    return tooltip;
  };
  
  /**
   * Reset drawing state
   */
  const resetDrawingState = () => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
  };
  
  /**
   * Update line and tooltip
   * @param start Start point
   * @param end End point
   */
  const updateLineAndTooltip = (start: Point, end: Point) => {
    // Calculate distance and angle
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Update measurement data
    setMeasurementData({
      distance,
      angle
    });
    
    // Update the line if it exists
    if (currentLineRef.current) {
      currentLineRef.current.set({
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y
      });
    }
    
    // Update the tooltip if it exists
    if (distanceTooltipRef.current) {
      distanceTooltipRef.current.position = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      };
      distanceTooltipRef.current.distance = distance;
    }
  };
  
  /**
   * Snap point to grid
   * @param point Point to snap
   * @returns Snapped point
   */
  const snapPointToGrid = (point: Point): Point => {
    if (!snapEnabled) return point;
    
    // Snap to 10px grid
    const gridSize = 10;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  };
  
  /**
   * Initialize the tool
   */
  const initializeTool = () => {
    const canvas = fabricCanvasRef?.current;
    if (canvas) {
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.isDrawingMode = false;
    }
    setIsToolInitialized(true);
  };
  
  /**
   * Toggle grid snapping
   */
  const toggleSnap = () => {
    setSnapEnabled(prev => !prev);
  };
  
  /**
   * Toggle angle constraint
   */
  const toggleAngles = () => {
    setAnglesEnabled(prev => !prev);
  };
  
  return {
    isDrawing,
    isToolInitialized,
    startPoint,
    currentLine,
    distanceTooltip,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setInputMethod,
    setIsPencilMode,
    createLine,
    createDistanceTooltip,
    resetDrawingState,
    updateLineAndTooltip,
    snapPointToGrid,
    initializeTool,
    toggleSnap,
    toggleAngles
  };
};
