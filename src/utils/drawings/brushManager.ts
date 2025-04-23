
/**
 * Utility to configure and manage drawing brushes
 */
import { Canvas as FabricCanvas } from 'fabric';
import { isPressureSupported } from '../canvas/pointerEvents';

/**
 * Initialize brush with proper settings
 * @param canvas - Fabric canvas instance
 * @param color - Brush color
 * @param width - Brush width
 */
export const initializeBrush = (
  canvas: FabricCanvas,
  color: string = '#000000',
  width: number = 2
): void => {
  if (!canvas) return;
  
  // Set basic brush properties
  canvas.freeDrawingBrush.color = color;
  canvas.freeDrawingBrush.width = width;
  
  // Configure pressure sensitivity if available
  const hasPressure = isPressureSupported();
  if (hasPressure && canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.limitWidthTo = width * 3;
    canvas.freeDrawingBrush.minWidth = width * 0.5;
  }
};

/**
 * Update brush properties
 * @param canvas - Fabric canvas instance
 * @param color - New brush color
 * @param width - New brush width
 */
export const updateBrushSettings = (
  canvas: FabricCanvas,
  color?: string,
  width?: number
): void => {
  if (!canvas || !canvas.freeDrawingBrush) return;
  
  if (color) {
    canvas.freeDrawingBrush.color = color;
  }
  
  if (width) {
    canvas.freeDrawingBrush.width = width;
    
    // Update pressure settings
    if (isPressureSupported()) {
      canvas.freeDrawingBrush.limitWidthTo = width * 3;
      canvas.freeDrawingBrush.minWidth = width * 0.5;
    }
  }
};

