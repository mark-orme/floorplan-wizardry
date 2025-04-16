
import { useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { LineState, useLineState, InputMethod } from './useLineState';
import { FabricEventNames } from '@/types/fabric-events';
import { Point } from '@/types/core/Point';
import { toast } from 'sonner';
import logger from '@/utils/logger';

export { InputMethod } from './useLineState';

interface UseStraightLineToolProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

interface UseStraightLineToolResult {
  isActive: boolean;
  toggleSnapToGrid: () => void;
  toggleAngleConstraints: () => void;
  cancelDrawing: () => void;
  snapEnabled: boolean;
  anglesEnabled: boolean;
}

export const useStraightLineTool = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  // Initialize line state
  const lineState = useLineState(lineColor, lineThickness);
  
  // Destructure needed state and methods
  const {
    isDrawing,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    fabricCanvasRef,
    initializeTool,
    resetDrawingState,
    toggleSnap,
    toggleAngles,
    snapEnabled,
    anglesEnabled
  } = lineState;

  // Event handlers
  const handleMouseDown = useCallback((e: any) => {
    if (!lineState.isActive || !e.pointer) return;
    
    e.e?.preventDefault();
    
    const point: Point = { x: e.pointer.x, y: e.pointer.y };
    startDrawing(point);
    
    logger.debug('Started line drawing at point:', point);
  }, [lineState, startDrawing]);

  const handleMouseMove = useCallback((e: any) => {
    if (!lineState.isActive || !isDrawing || !e.pointer) return;
    
    const point: Point = { x: e.pointer.x, y: e.pointer.y };
    continueDrawing(point);
  }, [lineState, isDrawing, continueDrawing]);

  const handleMouseUp = useCallback((e: any) => {
    if (!lineState.isActive || !isDrawing || !e.pointer) return;
    
    const point: Point = { x: e.pointer.x, y: e.pointer.y };
    completeDrawing(point);
    
    // Save canvas state after drawing
    saveCurrentState();
    
    logger.debug('Completed line drawing at point:', point);
  }, [lineState, isDrawing, completeDrawing, saveCurrentState]);

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isDrawing) {
      cancelDrawing();
      logger.debug('Drawing cancelled with Escape key');
    }
  }, [isDrawing, cancelDrawing]);

  // Set up canvas and event listeners when tool is enabled
  useEffect(() => {
    if (!canvas || !enabled) {
      resetDrawingState();
      return;
    }
    
    // Store canvas reference
    fabricCanvasRef.current = canvas;
    
    // Initialize the tool
    initializeTool();
    
    // Configure canvas for drawing lines
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    
    // Bind event listeners
    canvas.on(FabricEventNames.MOUSE_DOWN, handleMouseDown);
    canvas.on(FabricEventNames.MOUSE_MOVE, handleMouseMove);
    canvas.on(FabricEventNames.MOUSE_UP, handleMouseUp);
    
    // Add keyboard listener for escape
    window.addEventListener('keydown', handleEscapeKey);
    
    logger.info('Straight line tool initialized');
    
    // Clean up when tool changes
    return () => {
      // Remove event listeners
      canvas.off(FabricEventNames.MOUSE_DOWN, handleMouseDown);
      canvas.off(FabricEventNames.MOUSE_MOVE, handleMouseMove);
      canvas.off(FabricEventNames.MOUSE_UP, handleMouseUp);
      
      // Remove keyboard listener
      window.removeEventListener('keydown', handleEscapeKey);
      
      // Reset state
      resetDrawingState();
      
      logger.info('Straight line tool cleanup complete');
    };
  }, [
    canvas, 
    enabled, 
    fabricCanvasRef, 
    initializeTool, 
    resetDrawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleEscapeKey
  ]);

  return {
    isActive: lineState.isActive,
    toggleSnapToGrid: toggleSnap,
    toggleAngleConstraints: toggleAngles,
    cancelDrawing,
    snapEnabled,
    anglesEnabled
  };
};
