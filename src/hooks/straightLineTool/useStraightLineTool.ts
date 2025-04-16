
import { useEffect, useCallback, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineState } from './useLineState';
import { useLineToolHandlers } from './useLineToolHandlers';
import { captureError } from '@/utils/sentryUtils';
import { toast } from 'sonner';

// Make sure we export InputMethod so other modules can use it
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

interface UseStraightLineToolProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useStraightLineTool = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps) => {
  const fabricCanvasRef = { current: canvas };
  const [isActive, setIsActive] = useState(false);
  const [measurementData, setMeasurementData] = useState<{
    distance: number;
    angle: number;
    snapped: boolean;
    unit: string;
  }>({
    distance: 0,
    angle: 0,
    snapped: false,
    unit: 'px'
  });

  // Initialize the main line state
  const lineState = useLineState({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });

  // Get the event handlers for the line tool
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown
  } = useLineToolHandlers({
    lineState,
    updateMeasurementData: (data) => setMeasurementData(data)
  });

  // Function to activate the line tool
  const activateTool = useCallback(() => {
    if (!canvas) return;

    console.log('Activating straight line tool');
    
    try {
      // Initialize the tool
      lineState.initializeTool();
      
      // Mark as active
      setIsActive(true);
      
      // Set canvas cursor
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      
      // Disable selection
      canvas.selection = false;
      
      // Add event listeners
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      
      // Add keyboard event listener for Escape key
      document.addEventListener('keydown', handleKeyDown);
      
      toast.success('Straight line tool activated');
    } catch (error) {
      console.error('Error activating straight line tool:', error);
      captureError(error as Error);
      toast.error('Failed to activate straight line tool');
    }
  }, [canvas, lineState, handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown]);

  // Function to deactivate the line tool
  const deactivateTool = useCallback(() => {
    if (!canvas) return;
    
    console.log('Deactivating straight line tool');
    
    try {
      // Reset drawing state
      lineState.resetDrawingState();
      
      // Mark as inactive
      setIsActive(false);
      
      // Reset canvas cursor
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'default';
      
      // Remove event listeners
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      
      // Remove keyboard event listener
      document.removeEventListener('keydown', handleKeyDown);
    } catch (error) {
      console.error('Error deactivating straight line tool:', error);
      captureError(error as Error);
    }
  }, [canvas, lineState, handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown]);

  // Activate/deactivate tool when enabled changes
  useEffect(() => {
    if (enabled) {
      activateTool();
    } else {
      deactivateTool();
    }
    
    return () => {
      // Cleanup when component unmounts
      deactivateTool();
    };
  }, [enabled, activateTool, deactivateTool]);

  // Create handler functions for the StraightLineToolDemo component
  const handlePointerDown = useCallback((e: any) => {
    handleMouseDown(e);
  }, [handleMouseDown]);

  const handlePointerMove = useCallback((e: any) => {
    handleMouseMove(e);
  }, [handleMouseMove]);

  const handlePointerUp = useCallback((e: any) => {
    handleMouseUp(e);
  }, [handleMouseUp]);

  const toggleGridSnapping = useCallback(() => {
    if (lineState.toggleSnap) {
      lineState.toggleSnap();
    }
  }, [lineState]);

  const toggleAngles = useCallback(() => {
    if (lineState.toggleAngles) {
      lineState.toggleAngles();
    }
  }, [lineState]);

  return {
    isActive,
    isEnabled: enabled,
    isDrawing: lineState.isDrawing,
    inputMethod: lineState.inputMethod,
    isPencilMode: lineState.isPencilMode,
    snapEnabled: lineState.snapEnabled,
    anglesEnabled: lineState.anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing: lineState.cancelDrawing,
    ...lineState
  };
};
