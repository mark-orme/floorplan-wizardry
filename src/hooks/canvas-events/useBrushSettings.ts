
/**
 * Hook for managing brush settings
 * @module canvas-events/useBrushSettings
 */
import { useCallback, useEffect } from 'react';
import { UseBrushSettingsProps, EventHandlerResult } from './types';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Hook for managing brush settings on the canvas
 * 
 * @param {UseBrushSettingsProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result
 */
export const useBrushSettings = ({
  fabricCanvasRef,
  tool,
  lineColor = '#000000',
  lineThickness = 2
}: UseBrushSettingsProps): EventHandlerResult => {
  
  /**
   * Update brush settings based on current tool and preferences
   */
  const updateBrushSettings = useCallback((): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Only update brush settings if in drawing mode
    if (tool === DrawingMode.DRAW || tool === DrawingMode.LINE) {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      }
    }
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Enable/disable selection based on tool
    if (tool === DrawingMode.SELECT) {
      canvas.selection = true;
    } else {
      canvas.selection = false;
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);
  
  /**
   * Register event handlers
   */
  const register = useCallback((): void => {
    updateBrushSettings();
  }, [updateBrushSettings]);
  
  /**
   * Unregister event handlers
   */
  const unregister = useCallback((): void => {
    // No event handlers to remove
  }, []);
  
  /**
   * Clean up resources
   */
  const cleanup = useCallback((): void => {
    unregister();
  }, [unregister]);
  
  // Update brush settings when tool or settings change
  useEffect(() => {
    updateBrushSettings();
  }, [tool, lineColor, lineThickness, updateBrushSettings]);
  
  return {
    register,
    unregister,
    cleanup
  };
};
