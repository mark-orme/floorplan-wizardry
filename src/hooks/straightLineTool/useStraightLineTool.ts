import { useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from './useLineInputMethod';
import { MeasurementData, UseStraightLineToolResult } from '../useStraightLineTool.d';
import { FabricEventNames } from '@/types/fabric-events';
import { useLineToolState } from './useLineToolState';
import { useTooltipPortal } from './useTooltipPortal';
import { useLinePointerEvents } from './useLinePointerEvents';

interface UseStraightLineToolProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor?: string;
  lineThickness?: number;
  saveCurrentState?: () => void;
}

/**
 * Hook for using the straight line drawing tool
 */
export const useStraightLineTool = ({
  canvas,
  enabled,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {}
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  // Get tool state from the modular hooks
  const {
    lineState,
    measurementData,
    updateMeasurementData,
    isEnabled,
    fabricCanvasRef
  } = useLineToolState(canvas, enabled, lineColor, lineThickness, saveCurrentState);
  
  // Get input method functions from the lineState
  const inputMethod = lineState.inputMethod;
  const isPencilMode = lineState.isPencilMode;
  
  // Get tooltip functionality
  const { renderTooltip } = useTooltipPortal(
    lineState.isDrawing,
    lineState.startPoint,
    lineState.currentPoint,
    measurementData
  );
  
  // Get pointer event handlers
  const { handlePointerDown, handlePointerMove, handlePointerUp } = useLinePointerEvents(
    canvas,
    lineState.isActive,
    lineState.startDrawing,
    lineState.continueDrawing,
    lineState.completeDrawing,
    updateMeasurementData,
    lineState.startPoint,
    lineState.snapEnabled,
    lineState.anglesEnabled,
    (e) => {
      // Set input method based on pointer type
      lineState.setInputMethod(e.pointerType === 'pen' ? InputMethod.PENCIL : InputMethod.MOUSE);
    },
    saveCurrentState
  );
  
  /**
   * Set up and clean up event handlers
   */
  useEffect(() => {
    // If not enabled or no canvas, do nothing
    if (!enabled || !canvas) {
      if (lineState.isActive) {
        lineState.resetDrawingState();
      }
      return;
    }
    
    // Update canvas ref
    fabricCanvasRef.current = canvas;
    
    // Initialize tool
    lineState.initializeTool();
    
    // Disable selection and set cursor
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    
    // Set up event handlers
    canvas.on(FabricEventNames.MOUSE_DOWN, handlePointerDown);
    canvas.on(FabricEventNames.MOUSE_MOVE, handlePointerMove);
    canvas.on(FabricEventNames.MOUSE_UP, handlePointerUp);
    
    // Set up keyboard event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lineState.isDrawing) {
        lineState.cancelDrawing();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      // Reset tool state
      if (lineState.isActive) {
        lineState.resetDrawingState();
      }
      
      // Reset canvas state
      if (canvas) {
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        
        // Remove event handlers
        canvas.off(FabricEventNames.MOUSE_DOWN, handlePointerDown);
        canvas.off(FabricEventNames.MOUSE_MOVE, handlePointerMove);
        canvas.off(FabricEventNames.MOUSE_UP, handlePointerUp);
      }
      
      // Remove keyboard event handlers
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, enabled, fabricCanvasRef, handlePointerDown, handlePointerMove, handlePointerUp, lineState]);
  
  /**
   * Toggle snap to grid
   */
  const toggleGridSnapping = useCallback(() => {
    lineState.toggleSnap();
  }, [lineState]);
  
  /**
   * Toggle angle constraints
   */
  const toggleAngles = useCallback(() => {
    lineState.toggleAngles();
  }, [lineState]);
  
  /**
   * Start drawing at a point
   */
  const startDrawing = useCallback((point: Point) => {
    lineState.startDrawing(point);
  }, [lineState]);
  
  /**
   * Continue drawing to a point
   */
  const continueDrawing = useCallback((point: Point) => {
    lineState.continueDrawing(point);
  }, [lineState]);
  
  /**
   * End drawing
   */
  const endDrawing = useCallback(() => {
    if (lineState.isDrawing && lineState.currentPoint) {
      lineState.completeDrawing(lineState.currentPoint);
      saveCurrentState();
    }
  }, [lineState, saveCurrentState]);
  
  /**
   * Cancel drawing
   */
  const cancelDrawing = useCallback(() => {
    lineState.cancelDrawing();
  }, [lineState]);
  
  return {
    isActive: lineState.isActive,
    isEnabled,
    currentLine: lineState.currentLine,
    isToolInitialized: lineState.isToolInitialized,
    isDrawing: lineState.isDrawing,
    inputMethod,
    isPencilMode,
    snapEnabled: lineState.snapEnabled,
    anglesEnabled: lineState.anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    renderTooltip
  };
};

// Re-export InputMethod enum
export { InputMethod } from './useLineInputMethod';
