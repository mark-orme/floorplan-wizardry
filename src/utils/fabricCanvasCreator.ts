
/**
 * Fabric Canvas Creator
 * Utilities for creating and validating Fabric.js canvases
 * @module utils/fabricCanvasCreator
 */
import { Canvas } from 'fabric';

/**
 * Create a Fabric canvas instance
 * @param canvasElement HTML canvas element
 * @param width Canvas width
 * @param height Canvas height
 * @returns Fabric canvas instance
 */
export function createFabricCanvas(
  canvasElement: HTMLCanvasElement, 
  width: number = 800, 
  height: number = 600
): Canvas {
  try {
    // Create the canvas instance
    const fabricCanvas = new window.fabric.Canvas(canvasElement, {
      width, 
      height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true
    });
    
    // Initialize properties
    fabricCanvas.freeDrawingBrush.color = '#000000';
    fabricCanvas.freeDrawingBrush.width = 2;
    
    return fabricCanvas;
  } catch (error) {
    console.error('Failed to create Fabric.js canvas:', error);
    throw new Error('Canvas creation failed: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Validate a Fabric canvas instance
 * @param canvas Fabric canvas to validate
 * @returns Whether the canvas is valid
 */
export function validateFabricCanvas(canvas: Canvas): boolean {
  if (!canvas) return false;
  
  // Check required properties and methods
  const hasRequiredProperties = 
    typeof canvas.add === 'function' &&
    typeof canvas.remove === 'function' &&
    typeof canvas.renderAll === 'function' &&
    typeof canvas.getObjects === 'function';
  
  // Check canvas dimensions
  const hasValidDimensions = 
    typeof canvas.getWidth === 'function' && 
    typeof canvas.getHeight === 'function' &&
    canvas.getWidth() > 0 && 
    canvas.getHeight() > 0;
    
  return hasRequiredProperties && hasValidDimensions;
}
