
import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineState } from './useLineState';
import { InputMethod } from './useLineInputMethod';
import { MeasurementData, UseStraightLineToolResult } from '../useStraightLineTool.d';
import { FabricEventNames } from '@/types/fabric-events';
import logger from '@/utils/logger';

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
  // Create a reference to hold the canvas
  const fabricCanvasRef = useRef<FabricCanvas | null>(canvas);
  
  // Update the ref when canvas changes
  useEffect(() => {
    fabricCanvasRef.current = canvas;
  }, [canvas]);
  
  // Get line state from the hook
  const lineState = useLineState({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Get input method functions from the lineState
  const inputMethod = lineState.inputMethod;
  const isPencilMode = lineState.isPencilMode;
  
  // Default measurement data
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });
  
  // Track if we're enabled
  const [isEnabled, setIsEnabled] = useState(enabled);
  
  /**
   * Handle pointer down event
   */
  const handlePointerDown = useCallback((e: any) => {
    if (!canvas || !lineState.isActive) return;
    
    // Prevent default to avoid selection
    e.e?.preventDefault();
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    
    // Start drawing
    lineState.startDrawing({ x: pointer.x, y: pointer.y });
    
    // Detect input method if available
    if (e.e && e.e.pointerType) {
      // Instead of using detectInputMethod, we set it directly for now
      lineState.setInputMethod(e.e.pointerType === 'pen' ? InputMethod.PENCIL : InputMethod.MOUSE);
    }
    
    // Log for debugging
    logger.debug('Pointer down', { pointer, isActive: lineState.isActive });
  }, [canvas, lineState]);
  
  /**
   * Handle pointer move event
   */
  const handlePointerMove = useCallback((e: any) => {
    if (!canvas || !lineState.isDrawing) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    
    // Continue drawing
    lineState.continueDrawing({ x: pointer.x, y: pointer.y });
    
    // Update measurement data
    if (lineState.startPoint && lineState.currentPoint) {
      const dx = lineState.currentPoint.x - lineState.startPoint.x;
      const dy = lineState.currentPoint.y - lineState.startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      setMeasurementData({
        distance,
        angle,
        snapped: lineState.snapEnabled,
        unit: 'px'
      });
    }
  }, [canvas, lineState]);
  
  /**
   * Handle pointer up event
   */
  const handlePointerUp = useCallback((e: any) => {
    if (!canvas || !lineState.isDrawing) return;
    
    // Get pointer coordinates
    const pointer = canvas.getPointer(e.e);
    
    // Complete drawing
    lineState.completeDrawing({ x: pointer.x, y: pointer.y });
    
    // Save current state for undo/redo
    saveCurrentState();
    
    // Reset measurement data after a delay
    setTimeout(() => {
      setMeasurementData({
        distance: null,
        angle: null,
        snapped: false,
        unit: 'px'
      });
    }, 1000);
  }, [canvas, lineState, saveCurrentState]);
  
  /**
   * Set up and clean up event handlers
   */
  useEffect(() => {
    // Update isEnabled state when enabled prop changes
    setIsEnabled(enabled);
    
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
    handlePointerUp
  };
};

// Re-export InputMethod enum
export { InputMethod } from './useLineInputMethod';
