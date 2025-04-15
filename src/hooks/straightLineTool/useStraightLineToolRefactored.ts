
/**
 * Refactored hook for using the straight line drawing tool
 * This hook orchestrates all the line drawing functionality by composing smaller hooks
 * @module hooks/straightLineTool/useStraightLineToolRefactored
 */
import { Canvas as FabricCanvas, Line } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineState } from './useLineState';
import { useStraightLineEvents } from './useStraightLineEvents';
import { useLineKeyboardShortcuts } from './useLineKeyboardShortcuts';
import { useLineToolHandlers } from './useLineToolHandlers';
import { useToolCancellation } from './useToolCancellation';
import { useLineToolSetup } from './useLineToolSetup';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { Point } from '@/types/core/Point';

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  snapToAngle?: boolean;
  snapAngleDeg?: number;
  saveCurrentState?: () => void;
  onChange?: (canvas: FabricCanvas) => void;
}

/**
 * Hook for using the straight line drawing tool
 * This refactored version coordinates smaller, specialized hooks
 */
export const useStraightLineToolRefactored = ({
  fabricCanvasRef,
  tool,
  lineColor = '#000000',
  lineThickness = 2,
  snapToAngle = false,
  snapAngleDeg = 45,
  saveCurrentState = () => {},
  onChange
}: UseStraightLineToolProps) => {
  // Track if the tool is active
  const isActive = tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.LINE;
  
  // Get the error reporting hook for logging events
  const { logDrawingEvent, reportDrawingError } = useDrawingErrorReporting();
  
  // Use the shared line state
  const {
    isDrawing,
    isToolInitialized,
    setIsDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    initializeTool,
    resetDrawingState,
    snapEnabled,
    snapPointToGrid,
    inputMethod,
    isPencilMode,
    toggleSnap
  } = useLineState({
    fabricCanvasRef,
    lineThickness,
    lineColor
  });

  // Custom function to adapt the snapLineToGrid function for different signatures
  const adaptedSnapLineToGrid = (lineOrStart: Line | Point, end?: Point) => {
    if (end) {
      // Called with two points
      return {
        start: snapPointToGrid(lineOrStart as Point),
        end: snapPointToGrid(end)
      };
    } else if (lineOrStart instanceof Line) {
      // Called with a Line object
      const line = lineOrStart;
      const x1 = line.x1 || 0;
      const y1 = line.y1 || 0;
      const x2 = line.x2 || 0;
      const y2 = line.y2 || 0;
      
      // Snap both endpoints
      const snappedStart = snapPointToGrid({ x: x1, y: y1 });
      const snappedEnd = snapPointToGrid({ x: x2, y: y2 });
      
      // Update line with snapped points
      line.set({
        x1: snappedStart.x,
        y1: snappedStart.y,
        x2: snappedEnd.x,
        y2: snappedEnd.y
      });
    }
  };

  // Use the line tool handlers
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useLineToolHandlers({
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
    snapToAngle,
    snapAngleDeg,
    snapEnabled,
    snapLineToGrid: adaptedSnapLineToGrid,
    inputMethod,
    logDrawingEvent
  });

  // Use the event handlers hook
  const {
    handleFabricMouseDown,
    handleFabricMouseMove,
    handleFabricMouseUp
  } = useStraightLineEvents({
    fabricCanvasRef,
    isActive,
    isDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    inputMethod
  });

  // Use the tool cancellation hook
  const {
    cancelDrawing,
    toggleGridSnapping
  } = useToolCancellation({
    fabricCanvasRef,
    isDrawing,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    resetDrawingState,
    inputMethod,
    toggleSnap,
    snapEnabled
  });

  // Use the keyboard shortcuts hook
  const { handleKeyDown } = useLineKeyboardShortcuts({
    isActive,
    isDrawing,
    cancelDrawing,
    toggleGridSnapping,
    tool
  });

  // Use the tool setup hook
  const { isToolInitialized: isToolInitializedResult } = useLineToolSetup({
    fabricCanvasRef,
    isActive,
    isDrawing,
    tool,
    initializeTool,
    handleFabricMouseDown,
    handleFabricMouseMove,
    handleFabricMouseUp,
    handleKeyDown,
    lineColor,
    lineThickness,
    snapToAngle,
    snapAngleDeg,
    inputMethod
  });

  // Return the hook API
  return {
    // State
    isActive,
    isDrawing,
    isToolInitialized: isToolInitializedResult,
    snapEnabled,
    inputMethod,
    isPencilMode,
    
    // Methods for direct manipulation
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping
  };
};
