
/**
 * Hook for managing brush settings in drawing mode
 * @module canvas-events/useBrushSettings
 */
import { useEffect } from 'react';
import { UseBrushSettingsProps } from './types';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Hook for managing brush settings in drawing mode
 * @param {UseBrushSettingsProps} props Brush settings props
 * @returns {void} No return value
 */
export const useBrushSettings = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness,
  usePressure = false
}: UseBrushSettingsProps): void => {
  // Update brush settings when tool, line color, or line thickness change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Set drawing mode
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Configure brush
    if (canvas.freeDrawingBrush) {
      // Set brush color
      canvas.freeDrawingBrush.color = lineColor || '#000000';
      
      // Set brush width
      canvas.freeDrawingBrush.width = lineThickness || 1;
      
      // Apply pressure sensitivity if available
      if (usePressure && 'setPressure' in canvas.freeDrawingBrush) {
        (canvas.freeDrawingBrush as any).setPressure(true);
      }
    }
    
    // Set cursor style
    if (tool === DrawingMode.DRAW) {
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    } else {
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness, usePressure]);
};
