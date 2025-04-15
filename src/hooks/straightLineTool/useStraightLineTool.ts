/**
 * Custom hook for straight line drawing tool with enhanced features
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { useLineState } from './useLineState';
import { useLineToolHandlers } from './useLineToolHandlers';
import { useToolCancellation } from './useToolCancellation';
import { useGridSnapping } from '../canvas/useGridSnapping';
import { toast } from 'sonner';
import * as Sentry from '@sentry/react';
import { constrainToMajorAngles } from '@/utils/grid/snapping';
import logger from '@/utils/logger';
import { GRID_SPACING } from '@/constants/numerics';

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
  onChange?: (canvas: FabricCanvas) => void;
  useShiftConstraint?: boolean;
}

/**
 * Custom hook for straight line drawing tool with enhanced features:
 * - Grid snapping
 * - Shift key constraints
 * - Proper tooltips
 * - Cancellation support
 * - Undo/redo compatibility
 * 
 * @param {UseStraightLineToolProps} props - Configuration for the straight line tool
 * @returns {Object} Tool state and handler functions
 */
export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  saveCurrentState,
  onChange,
  useShiftConstraint = false
}: UseStraightLineToolProps) => {
  // Store tool state
  const [isActive, setIsActive] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [currentLine, setCurrentLineState] = useState<Line | null>(null);
  
  // Set Sentry context for the hook
  useEffect(() => {
    Sentry.setTag("component", "useStraightLineTool");
    Sentry.setTag("straightLineTool", tool === DrawingMode.STRAIGHT_LINE ? "active" : "inactive");
    
    Sentry.setContext("straightLineState", {
      isToolInitialized,
      isActive,
      currentTool: tool,
      lineColor,
      lineThickness,
      hasCurrentLine: !!currentLine,
      shiftConstraintActive: useShiftConstraint,
      timestamp: new Date().toISOString()
    });
    
    return () => {
      Sentry.setTag("component", null);
      Sentry.setTag("straightLineTool", null);
    };
  }, [tool, isToolInitialized, isActive, lineColor, lineThickness, currentLine, useShiftConstraint]);
  
  // Initialize grid snapping
  const { 
    snapEnabled, 
    snapPointToGrid, 
    snapLineToGrid, 
    toggleSnapToGrid: toggleGridSnapping 
  } = useGridSnapping({
    initialSnapEnabled: true,
    fabricCanvasRef,
    defaultGridSize: GRID_SPACING.SMALL
  });
  
  // Initialize the line state
  const {
    isDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    resetDrawingState,
    setIsDrawing,
    inputMethod,
    isPencilMode,
    isToolInitialized: isLineStateInitialized,
    setIsToolInitialized: setLineStateToolInitialized,
    snapPointToGrid: lineStateSnapPointToGrid,
    snapLineToGrid: lineStateSnapLineToGrid
  } = useLineState({
    fabricCanvasRef,
    snapPointToGrid,
    snapLineToGrid,
    isToolActive: isActive,
    lineColor,
    lineThickness
  });
  
  // Set current line for external access
  useEffect(() => {
    if (currentLineRef.current !== currentLine) {
      setCurrentLineState(currentLineRef.current);
    }
  }, [currentLineRef.current]);
  
  // Get simplified input method for useToolCancellation which doesn't accept all types
  const simplifiedInputMethod = (): 'mouse' | 'touch' | 'pencil' | 'stylus' | 'keyboard' => {
    if (inputMethod === 'keyboard') return 'mouse'; // Map keyboard to mouse for cancel operations
    return inputMethod;
  };
  
  // Initialize tool cancellation
  const { cancelDrawing, toggleGridSnapping: toggleSnapFromCancellation } = useToolCancellation({
    fabricCanvasRef,
    isDrawing,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    resetDrawingState,
    inputMethod: simplifiedInputMethod(),
    toggleSnap: toggleGridSnapping,
    snapEnabled
  });
  
  // Extend snapLineToGrid with shift key constraints
  const enhancedSnapLineToGrid = useCallback((start: Point, end: Point) => {
    // First apply shift constraint if active
    let processedPoints = { start, end };
    if (useShiftConstraint) {
      processedPoints = constrainToMajorAngles(start, end);
    }
    
    // Then apply grid snapping if enabled
    return snapLineToGrid(processedPoints.start, processedPoints.end);
  }, [snapLineToGrid, useShiftConstraint]);
  
  // Initialize line tool handlers with shift constraint support
  const { handlePointerDown, handlePointerMove, handlePointerUp } = useLineToolHandlers({
    fabricCanvasRef,
    isActive,
    isDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    resetDrawingState,
    saveCurrentState,
    onChange,
    lineColor,
    lineThickness,
    snapToAngle: false,
    snapAngleDeg: 45,
    snapEnabled,
    snapLineToGrid: enhancedSnapLineToGrid,
    inputMethod,
    logDrawingEvent: (message, eventType, data) => {
      logger.info(message, { eventType, ...data });
      
      // Log to Sentry for important events
      if (eventType === 'line-start' || eventType === 'line-complete' || eventType === 'line-cancel') {
        Sentry.addBreadcrumb({
          category: 'drawing',
          message,
          data: data
        });
      }
    }
  });
  
  // Effect to initialize or clean up based on tool change
  useEffect(() => {
    // Determine if tool is active
    const isStraightLineTool = tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.LINE;
    setIsActive(isStraightLineTool);
    
    Sentry.setTag("straightLineTool", isStraightLineTool ? "active" : "inactive");
    
    // Initialize tool when activated
    if (isStraightLineTool && !isToolInitialized) {
      setIsToolInitialized(true);
      setLineStateToolInitialized(true);
      
      // Log tool initialization
      logger.info("Straight line tool initialized", {
        tool,
        lineColor,
        lineThickness
      });
      
      Sentry.addBreadcrumb({
        category: 'tool',
        message: 'Straight line tool initialized',
        data: { lineColor, lineThickness }
      });
    }
    
    // Clean up any active drawing when tool changes
    if (!isStraightLineTool && isDrawing) {
      cancelDrawing();
    }
  }, [tool, isToolInitialized, isDrawing, cancelDrawing, setLineStateToolInitialized]);
  
  return {
    isActive,
    isToolInitialized,
    isDrawing,
    inputMethod,
    isPencilMode,
    snapEnabled,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping,
    currentLine: currentLineRef.current
  };
};
