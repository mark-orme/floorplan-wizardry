
/**
 * Hook for handling brush settings on canvas
 * @module canvas-events/useBrushSettings
 */
import { useCallback, useEffect } from 'react';
import fabric from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { EventHandlerResult, UseBrushSettingsProps } from './types';

/**
 * Hook for handling brush settings on canvas
 * @param {UseBrushSettingsProps} props Brush settings props
 * @returns {EventHandlerResult} Event handler result
 */
export const useBrushSettings = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness
}: UseBrushSettingsProps): EventHandlerResult => {
  /**
   * Update brush settings
   */
  const updateBrushSettings = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  /**
   * Update drawing mode based on tool
   */
  const updateDrawingMode = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Update brush settings if in drawing mode
    if (canvas.isDrawingMode) {
      updateBrushSettings();
    }
  }, [fabricCanvasRef, tool, updateBrushSettings]);
  
  /**
   * Register brush events
   */
  const register = useCallback(() => {
    updateDrawingMode();
    updateBrushSettings();
  }, [updateDrawingMode, updateBrushSettings]);
  
  /**
   * Unregister brush events
   */
  const unregister = useCallback(() => {
    // Nothing to unregister for brush settings
  }, []);
  
  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);
  
  // Update brush settings when props change
  useEffect(() => {
    updateBrushSettings();
  }, [updateBrushSettings]);
  
  // Update drawing mode when tool changes
  useEffect(() => {
    updateDrawingMode();
  }, [updateDrawingMode]);
  
  return {
    register,
    unregister,
    cleanup
  };
};
