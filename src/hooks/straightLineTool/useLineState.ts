/**
 * Hook for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { DrawingMode } from '@/constants/drawingModes';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useApplePencilSupport } from './useApplePencilSupport';

export interface UseLineStateProps {
  fabricCanvasRef: React.MutableRefObject<any>;
  lineThickness?: number;
  lineColor?: string;
}

/**
 * Hook for managing line drawing state with enhanced touch support
 * @returns Line state and state management functions
 */
export const useLineState = ({
  fabricCanvasRef,
  lineThickness = 2,
  lineColor = '#000000'
}: UseLineStateProps = {
  fabricCanvasRef: { current: null },
  lineThickness: 2,
  lineColor: '#000000'
}) => {
  // Get the error reporting hook
  const { reportDrawingError, logDrawingEvent, trackDrawingPerformance } = useDrawingErrorReporting();
  
  // State tracking
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // References to drawing objects
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Get enhanced grid snapping
  const { 
    snapPointToGrid, 
    snapLineToGrid, 
    inputMethod, 
    snapEnabled, 
    toggleSnapToGrid 
  } = useEnhancedGridSnapping({
    fabricCanvasRef
  });
  
  // Get Apple Pencil support
  const { 
    pencilState,
    adjustedLineThickness,
    isPencilMode,
    isApplePencil
  } = useApplePencilSupport({
    fabricCanvasRef,
    lineThickness
  });
  
  // Keep track of performance metrics
  const performanceTimerRef = useRef<number | null>(null);
  
  /**
   * Initialize the line tool
   */
  const initializeTool = useCallback(() => {
    try {
      setIsToolInitialized(true);
      logDrawingEvent('Line tool initialized', 'tool-init', {
        tool: DrawingMode.LINE,
        interaction: { 
          type: inputMethod
        }
      });
      
      return true;
    } catch (error) {
      reportDrawingError(error, 'line-tool-init', {
        tool: DrawingMode.LINE
      });
      // Initialize anyway to avoid blocking the user
      setIsToolInitialized(true);
      return false;
    }
  }, [logDrawingEvent, reportDrawingError, inputMethod]);
  
  /**
   * Reset the drawing state
   */
  const resetDrawingState = useCallback(() => {
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
    setIsDrawing(false);
    
    // Clear performance timer
    if (performanceTimerRef.current !== null) {
      const duration = Date.now() - performanceTimerRef.current;
      
      // Track performance if drawing was active
      if (duration > 100) {
        trackDrawingPerformance('line-drawing-session', {
          duration,
          pointsProcessed: 2 // Start and end points
        }, {
          tool: DrawingMode.LINE,
          interaction: { 
            type: inputMethod,
            pressure: pencilState.pressure
          }
        });
      }
      
      performanceTimerRef.current = null;
    }
  }, [trackDrawingPerformance, inputMethod, pencilState.pressure]);
  
  /**
   * Set the current line with enhanced properties
   */
  const setCurrentLine = useCallback((line: Line | null) => {
    // If replacing the current line, remove the old one
    if (currentLineRef.current && fabricCanvasRef.current) {
      fabricCanvasRef.current.remove(currentLineRef.current);
    }
    
    // If line is provided, update styling based on current input method
    if (line) {
      // Adjust line thickness based on Apple Pencil pressure if applicable
      const thickness = isApplePencil ? adjustedLineThickness : lineThickness;
      
      line.set({
        strokeWidth: thickness,
        stroke: lineColor,
        strokeLineCap: 'round',
        strokeLineJoin: 'round'
      });
      
      // Add custom property to identify this as a line
      (line as any).objectType = 'straight-line';
      (line as any).inputMethod = inputMethod;
      
      // For stylus, add pressure data
      if (isApplePencil) {
        (line as any).pressure = pencilState.pressure;
      }
    }
    
    currentLineRef.current = line;
    
    // Start performance tracking if beginning a new line
    if (line && performanceTimerRef.current === null) {
      performanceTimerRef.current = Date.now();
    }
  }, [
    fabricCanvasRef, 
    lineThickness, 
    lineColor, 
    inputMethod, 
    isApplePencil, 
    adjustedLineThickness,
    pencilState.pressure
  ]);
  
  /**
   * Set the distance tooltip
   */
  const setDistanceTooltip = useCallback((tooltip: Text | null) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  /**
   * Set the start point
   */
  const setStartPoint = useCallback((point: Point | null) => {
    // If grid snapping is enabled, snap the start point
    if (point && snapEnabled) {
      startPointRef.current = snapPointToGrid(point);
    } else {
      startPointRef.current = point;
    }
  }, [snapEnabled, snapPointToGrid]);
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    toggleSnapToGrid();
    
    logDrawingEvent(`Grid snapping ${snapEnabled ? 'disabled' : 'enabled'}`, 'toggle-grid-snap', {
      tool: DrawingMode.LINE
    });
  }, [toggleSnapToGrid, snapEnabled, logDrawingEvent]);
  
  return {
    // State
    isDrawing,
    isToolInitialized,
    snapEnabled,
    inputMethod,
    isPencilMode,
    
    // Refs
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    
    // Setters
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    
    // Methods
    initializeTool,
    resetDrawingState,
    toggleSnap,
    
    // Enhanced functions
    snapPointToGrid,
    snapLineToGrid
  };
};
