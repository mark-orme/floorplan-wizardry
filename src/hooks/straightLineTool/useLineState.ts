/**
 * Hook for managing straight line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useCallback, useRef, useState } from "react";
import { Object as FabricObject, Line, Text } from "fabric";
import { Point } from "@/types/core/Geometry";
import { calculateDistance } from "@/utils/geometry/lineOperations";
import logger from "@/utils/logger";

/**
 * Input method type for determining drawing interaction method
 */
export type InputMethod = 'mouse' | 'touch' | 'stylus' | 'pencil';

interface UseLineStateProps {
  lineColor: string;
  lineThickness: number;
}

export const useLineState = ({ lineColor, lineThickness }: UseLineStateProps) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // Refs for persistent state
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<FabricObject | null>(null);
  const distanceTooltipRef = useRef<FabricObject | null>(null);
  
  // Grid and snapping state
  const [snapEnabled, setSnapEnabled] = useState(true);
  const snapGridSizeRef = useRef(20); // Default grid size
  
  // Add input method state
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');
  
  /**
   * Set the start point for the line
   */
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
  }, []);
  
  /**
   * Set the current line object
   */
  const setCurrentLine = useCallback((line: FabricObject | null) => {
    currentLineRef.current = line;
  }, []);
  
  /**
   * Set the distance tooltip object
   */
  const setDistanceTooltip = useCallback((tooltip: FabricObject | null) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  /**
   * Create a new line object
   */
  const createLine = useCallback((x1: number, y1: number, x2: number, y2: number): Line => {
    return new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false,
      strokeLineCap: 'round',
      strokeLineJoin: 'round'
    });
  }, [lineColor, lineThickness]);
  
  /**
   * Create a distance tooltip text object
   */
  const createDistanceTooltip = useCallback((x: number, y: number, distance: number): Text => {
    return new Text(`${Math.round(distance)}px`, {
      left: x,
      top: y,
      fontSize: 12,
      fill: '#333333',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: 5,
      selectable: false,
      evented: false
    });
  }, []);
  
  /**
   * Update line and tooltip based on current points
   */
  const updateLineAndTooltip = useCallback((startPoint: Point, currentPoint: Point) => {
    if (!currentLineRef.current || !distanceTooltipRef.current) return;
    
    // Update line points
    (currentLineRef.current as Line).set({
      x2: currentPoint.x,
      y2: currentPoint.y
    });
    
    // Calculate distance for tooltip
    const distance = calculateDistance(startPoint, currentPoint);
    
    // Update tooltip position and text
    const midX = (startPoint.x + currentPoint.x) / 2;
    const midY = (startPoint.y + currentPoint.y) / 2;
    (distanceTooltipRef.current as Text).set({
      left: midX,
      top: midY - 15, // Position above the line
      text: `${Math.round(distance)}px`
    });
    
    // Update objects
    (currentLineRef.current as Line).setCoords();
    (distanceTooltipRef.current as Text).setCoords();
  }, []);
  
  /**
   * Initialize the tool state
   */
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
    logger.info("Straight line tool initialized");
  }, []);
  
  /**
   * Reset the drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
    logger.info("Straight line drawing state reset");
  }, []);
  
  /**
   * Snap a point to the grid
   */
  const snapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    const gridSize = snapGridSizeRef.current;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapEnabled]);
  
  /**
   * Snap a line to the grid
   */
  const snapLineToGrid = useCallback((startPoint: Point, endPoint: Point): { start: Point, end: Point } => {
    if (!snapEnabled) return { start: startPoint, end: endPoint };
    
    return {
      start: snapPointToGrid(startPoint),
      end: snapPointToGrid(endPoint)
    };
  }, [snapEnabled, snapPointToGrid]);
  
  /**
   * Toggle grid snapping
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  return {
    isDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setIsDrawing,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    initializeTool,
    resetDrawingState,
    snapEnabled,
    snapPointToGrid,
    snapLineToGrid,
    toggleSnap,
    inputMethod,
    setInputMethod
  };
};
