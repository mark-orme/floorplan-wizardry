
/**
 * Refactored hook for using the straight line drawing tool
 * This hook orchestrates all the line drawing functionality by composing smaller hooks
 * @module hooks/straightLineTool/useStraightLineToolRefactored
 */
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useLineState } from './useLineState';
import { useStraightLineEvents } from './useStraightLineEvents';
import { useLineKeyboardShortcuts } from './useLineKeyboardShortcuts';
import { useLineToolHandlers } from './useLineToolHandlers';
import { useToolCancellation } from './useToolCancellation';
import { useLineToolSetup } from './useLineToolSetup';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';

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
  const { logDrawingEvent } = useDrawingErrorReporting();
  
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
    snapLineToGrid,
    inputMethod,
    isPencilMode,
    toggleSnap
  } = useLineState({
    fabricCanvasRef,
    lineThickness,
    lineColor
  });

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
    snapLineToGrid,
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
