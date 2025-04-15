
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
import { useToolInitialization } from './useToolInitialization';
import { Point } from '@/types/core/Point';

/**
 * Props for the useStraightLineToolRefactored hook
 * @interface UseStraightLineToolProps
 * @property {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to the fabric canvas
 * @property {DrawingMode} tool - Current drawing tool mode
 * @property {string} [lineColor] - Color of the line being drawn
 * @property {number} [lineThickness] - Thickness of the line in pixels
 * @property {boolean} [snapToAngle] - Whether to snap the line to standard angles
 * @property {number} [snapAngleDeg] - Angle in degrees to snap to
 * @property {function} [saveCurrentState] - Function to save the current canvas state for undo/redo
 * @property {function} [onChange] - Callback triggered when the canvas changes
 */
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
 * This refactored version coordinates smaller, specialized hooks for better maintainability
 * 
 * @param {UseStraightLineToolProps} props - Configuration props for the hook
 * @returns {Object} An object containing the hook state and methods
 * @property {boolean} isActive - Whether the straight line tool is currently active
 * @property {boolean} isDrawing - Whether a line is currently being drawn
 * @property {boolean} isToolInitialized - Whether the tool has been properly initialized
 * @property {boolean} snapEnabled - Whether grid snapping is enabled
 * @property {string} inputMethod - Current input method (mouse, touch, or stylus)
 * @property {boolean} isPencilMode - Whether Apple Pencil mode is active for iPad
 * @property {function} handlePointerDown - Handler for starting a line
 * @property {function} handlePointerMove - Handler for updating a line during drawing
 * @property {function} handlePointerUp - Handler for completing a line
 * @property {function} cancelDrawing - Function to cancel the current line drawing
 * @property {function} toggleGridSnapping - Function to toggle grid snapping on/off
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
  
  // Use the shared line state
  const {
    isDrawing,
    setIsDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
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

  /**
   * Custom function to adapt the snapLineToGrid function for different signatures
   * @param {Point} start - Starting point of the line
   * @param {Point} end - Ending point of the line
   * @returns {Object} Object containing snapped start and end points
   */
  const adaptedSnapLineToGrid = (start: Point, end: Point) => {
    if (snapEnabled) {
      return {
        start: snapPointToGrid(start),
        end: snapPointToGrid(end)
      };
    }
    return { start, end };
  };

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
    logDrawingEvent: () => {} // This will be filled in by the implementation
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
    initializeTool: () => true,
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

  // Use the tool initialization hook
  const { isToolInitialized } = useToolInitialization({
    fabricCanvasRef,
    tool,
    isActive,
    snapEnabled,
    onChange
  });

  // Return the hook API
  return {
    // State
    isActive,
    isDrawing,
    isToolInitialized: isToolInitializedResult || isToolInitialized,
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
