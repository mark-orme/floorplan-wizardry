
/**
 * Hook for canvas brush settings
 * @module canvas-events/useBrushSettings
 */
import { useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { EventHandlerResult, UseBrushSettingsProps } from './types';

/**
 * Default brush width
 */
const DEFAULT_BRUSH_WIDTH = 2;

/**
 * Default brush color
 */
const DEFAULT_BRUSH_COLOR = '#000000';

/**
 * Hook for managing brush settings in the canvas
 * 
 * @param {UseBrushSettingsProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result with cleanup function
 */
export const useBrushSettings = ({ 
  fabricCanvasRef, 
  tool,
  lineColor = DEFAULT_BRUSH_COLOR,
  lineThickness = DEFAULT_BRUSH_WIDTH
}: UseBrushSettingsProps): EventHandlerResult => {
  
  /**
   * Initialize brush settings
   */
  const initializeBrush = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = lineThickness || DEFAULT_BRUSH_WIDTH;
        canvas.freeDrawingBrush.color = lineColor || DEFAULT_BRUSH_COLOR;
      }
    } catch (error) {
      console.error('Error initializing brush:', error);
    }
  }, [fabricCanvasRef, lineColor, lineThickness]);

  /**
   * Update brush settings when the tool changes
   */
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Only set drawing mode when relevant tools are selected
    canvas.isDrawingMode = tool === 'draw'; // Fixed: removed 'free' which is not in DrawingTool
    
    // Initialize brush if it exists
    if (canvas.freeDrawingBrush) {
      initializeBrush();
    }

    return () => {
      // Clean up
      if (canvas && canvas.freeDrawingBrush) {
        canvas.isDrawingMode = false;
      }
    };
  }, [fabricCanvasRef, tool, initializeBrush]);

  /**
   * Register event handlers
   */
  const register = useCallback(() => {
    initializeBrush();
  }, [initializeBrush]);

  /**
   * Unregister event handlers
   */
  const unregister = useCallback(() => {
    // Nothing to unregister for brush settings
  }, []);

  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && canvas.freeDrawingBrush) {
      canvas.isDrawingMode = false;
    }
  }, [fabricCanvasRef]);

  return {
    register,
    unregister,
    cleanup
  };
};
