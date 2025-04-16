
/**
 * Line state management hook
 * @module hooks/straightLineTool/useLineState
 */
import { useCallback, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { MeasurementData } from './types';
import { Point } from '@/types/core/Point';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';

/**
 * Input method enumeration
 * Defines the possible input methods for drawing tools
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch', 
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

/**
 * Props for the useLineState hook
 */
interface UseLineStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for managing line drawing state
 */
export const useLineState = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineStateProps) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    unit: 'm'
  });
  
  // Refs for tracking drawing state
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Use grid snapping
  const { snapPointToGrid } = useSnapToGrid();
  
  /**
   * Set the start point for drawing
   * @param point Start point
   */
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
  }, []);
  
  /**
   * Set the current line being drawn
   * @param line Line object
   */
  const setCurrentLine = useCallback((line: Line) => {
    currentLineRef.current = line;
  }, []);
  
  /**
   * Set the distance tooltip
   * @param tooltip Text object
   */
  const setDistanceTooltip = useCallback((tooltip: Text) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  /**
   * Initialize the drawing tool
   */
  const initializeTool = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setIsToolInitialized(true);
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    canvas.isDrawingMode = false;
  }, [fabricCanvasRef]);
  
  /**
   * Toggle grid snapping
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Toggle angle snapping
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  /**
   * Create a new line
   * @param x1 Start X
   * @param y1 Start Y
   * @param x2 End X
   * @param y2 End Y
   * @returns New line object
   */
  const createLine = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    try {
      return new Line([x1, y1, x2, y2], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        objectType: 'straight-line'
      });
    } catch (error) {
      console.error('Error creating line:', error);
      return null;
    }
  }, [lineColor, lineThickness]);
  
  /**
   * Create a distance tooltip
   * @param x X position
   * @param y Y position
   * @param distance Distance value
   * @returns New text object
   */
  const createDistanceTooltip = useCallback((x: number, y: number, distance: number) => {
    try {
      const distanceInMeters = (distance / 100).toFixed(1);
      return new Text(`${distanceInMeters}m`, {
        left: x,
        top: y - 10,
        fontSize: 12,
        fill: 'rgba(0,0,0,0.7)',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 5,
        selectable: false
      });
    } catch (error) {
      console.error('Error creating tooltip:', error);
      return null;
    }
  }, []);
  
  /**
   * Update line and tooltip positions
   * @param start Start point
   * @param end End point
   */
  const updateLineAndTooltip = useCallback((start: Point, end: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !currentLineRef.current) return;
    
    // Update line
    currentLineRef.current.set({
      x2: end.x,
      y2: end.y
    });
    
    // Calculate angle
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
    
    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + 
      Math.pow(end.y - start.y, 2)
    );
    
    // Update tooltip position
    if (distanceTooltipRef.current) {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      
      distanceTooltipRef.current.set({
        left: midX,
        top: midY - 10,
        text: `${(distance / 100).toFixed(1)}m`
      });
    }
    
    // Update measurement data
    setMeasurementData({
      distance,
      angle,
      snapped: snapEnabled,
      unit: 'm'
    });
    
    // Render
    canvas.renderAll();
  }, [fabricCanvasRef, snapEnabled]);
  
  /**
   * Reset the drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
    setMeasurementData({
      distance: null,
      angle: null,
      unit: 'm'
    });
  }, []);
  
  /**
   * Handle pointer down event
   * @param point Point where the pointer was pressed
   */
  const handlePointerDown = useCallback((point: Point) => {
    setIsDrawing(true);
    
    // Snap to grid if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    setStartPoint(snappedPoint);
    
    // Create line
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const line = createLine(
      snappedPoint.x, 
      snappedPoint.y, 
      snappedPoint.x, 
      snappedPoint.y
    );
    
    if (line) {
      canvas.add(line);
      setCurrentLine(line);
      
      // Create tooltip
      const tooltip = createDistanceTooltip(
        snappedPoint.x, 
        snappedPoint.y, 
        0
      );
      
      if (tooltip) {
        canvas.add(tooltip);
        setDistanceTooltip(tooltip);
      }
    }
  }, [fabricCanvasRef, setStartPoint, createLine, setCurrentLine, createDistanceTooltip, setDistanceTooltip, snapEnabled, snapPointToGrid]);
  
  /**
   * Handle pointer move event
   * @param point Current pointer position
   */
  const handlePointerMove = useCallback((point: Point) => {
    if (!isDrawing || !startPointRef.current) return;
    
    // Snap to grid if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Constrain to angle if enabled
    let finalPoint = snappedPoint;
    if (anglesEnabled && startPointRef.current) {
      // Constrain to 45 degree angles
      const dx = finalPoint.x - startPointRef.current.x;
      const dy = finalPoint.y - startPointRef.current.y;
      const angle = Math.atan2(dy, dx);
      const angleStep = Math.PI / 4; // 45 degrees
      const roundedAngle = Math.round(angle / angleStep) * angleStep;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      finalPoint = {
        x: startPointRef.current.x + Math.cos(roundedAngle) * distance,
        y: startPointRef.current.y + Math.sin(roundedAngle) * distance
      };
    }
    
    // Update line and tooltip
    updateLineAndTooltip(startPointRef.current, finalPoint);
  }, [isDrawing, startPointRef, updateLineAndTooltip, snapEnabled, anglesEnabled, snapPointToGrid]);
  
  /**
   * Handle pointer up event
   * @param point Point where the pointer was released
   */
  const handlePointerUp = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || !startPointRef.current) return;
    
    // Snap to grid if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update line and tooltip one last time
    handlePointerMove(snappedPoint);
    
    // Remove distance tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // If the line has no length (same start and end point), remove it
    if (
      currentLineRef.current &&
      startPointRef.current.x === snappedPoint.x &&
      startPointRef.current.y === snappedPoint.y
    ) {
      canvas.remove(currentLineRef.current);
    } else {
      // Make line selectable
      if (currentLineRef.current) {
        currentLineRef.current.set({
          selectable: true,
          evented: true
        });
        
        // Save current state for undo
        saveCurrentState();
      }
    }
    
    // Reset state
    resetDrawingState();
    
    // Render
    canvas.requestRenderAll();
  }, [fabricCanvasRef, isDrawing, startPointRef, handlePointerMove, resetDrawingState, saveCurrentState, snapEnabled, snapPointToGrid]);
  
  /**
   * Cancel current drawing
   */
  const cancelDrawing = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove the line being drawn
    if (currentLineRef.current) {
      canvas.remove(currentLineRef.current);
    }
    
    // Remove the tooltip
    if (distanceTooltipRef.current) {
      canvas.remove(distanceTooltipRef.current);
    }
    
    // Reset state
    resetDrawingState();
    
    // Render
    canvas.requestRenderAll();
  }, [fabricCanvasRef, resetDrawingState]);
  
  return {
    // State
    isDrawing,
    isActive: isToolInitialized,
    isToolInitialized,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    currentLine: currentLineRef.current,
    
    // Refs
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    
    // Setters
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setIsDrawing,
    setInputMethod,
    setIsPencilMode,
    
    // Actions
    initializeTool,
    resetDrawingState,
    toggleSnap,
    toggleAngles,
    createLine,
    createDistanceTooltip,
    updateLineAndTooltip,
    snapPointToGrid,
    
    // Event handlers
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    
    // Ensure only one toggleGridSnapping
    toggleGridSnapping: toggleSnap
  };
};
