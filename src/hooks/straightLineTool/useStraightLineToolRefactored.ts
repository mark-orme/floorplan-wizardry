
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
import { toast } from 'sonner';

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
  const adaptedSnapLineToGrid = (start: Point, end: Point) => {
    try {
      if (snapEnabled) {
        return {
          start: snapPointToGrid(start),
          end: snapPointToGrid(end)
        };
      }
      return { start, end };
    } catch (error) {
      reportDrawingError(error, 'snap-line-error', {
        input: { startPoint: start, endPoint: end }
      });
      // Return original values if there's an error to prevent crashing
      return { start, end };
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

  // Use the tool cancellation hook - make sure we properly handle the return type
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

  // Provide feedback about tool initialization
  if (isActive && isToolInitializedResult && !isToolInitialized) {
    // Only show once when the tool becomes initialized
    toast.success(`Line tool ready! ${snapEnabled ? 'Grid snapping enabled.' : 'Grid snapping disabled.'}`, {
      id: 'line-tool-initialized',
      duration: 3000
    });
  }

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
