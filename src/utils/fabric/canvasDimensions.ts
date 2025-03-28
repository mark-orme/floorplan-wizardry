
/**
 * Canvas dimension utilities
 * Functions for setting and managing canvas dimensions
 * @module utils/fabric/canvasDimensions
 */
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Set canvas dimensions
 * @param canvas Canvas to resize
 * @param width New width
 * @param height New height
 * @param resetTransform Whether to reset the transform
 * @returns True if successful
 */
export function setCanvasDimensions(
  canvas: FabricCanvas | null, 
  width: number, 
  height: number,
  resetTransform: boolean = false
): boolean {
  if (!canvas) return false;
  
  try {
    canvas.setWidth(width);
    canvas.setHeight(height);
    
    if (resetTransform) {
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    }
    
    canvas.renderAll();
    return true;
  } catch (e) {
    console.error('Error setting canvas dimensions:', e);
    return false;
  }
}

/**
 * Resize canvas to fit container
 * @param canvas Canvas to resize
 * @param container Container element
 * @returns True if successful
 */
export function resizeCanvasToContainer(
  canvas: FabricCanvas | null,
  container: HTMLElement | null
): boolean {
  if (!canvas || !container) return false;
  
  try {
    const rect = container.getBoundingClientRect();
    return setCanvasDimensions(canvas, rect.width, rect.height);
  } catch (e) {
    console.error('Error resizing canvas to container:', e);
    return false;
  }
}

/**
 * Zoom canvas to specific level
 * @param canvas Canvas to zoom
 * @param zoomLevel Zoom level factor
 * @param point Center point for zoom
 * @returns True if successful
 */
export function zoomCanvas(
  canvas: FabricCanvas | null,
  zoomLevel: number,
  point?: { x: number, y: number }
): boolean {
  if (!canvas) return false;
  
  try {
    // Get current position
    const vpTransform = canvas.viewportTransform;
    if (!vpTransform) return false;
    
    // Default to center if no point provided
    const center = point || {
      x: canvas.getWidth() / 2,
      y: canvas.getHeight() / 2
    };
    
    // Apply zoom
    canvas.setZoom(zoomLevel);
    canvas.renderAll();
    
    return true;
  } catch (e) {
    console.error('Error zooming canvas:', e);
    return false;
  }
}

/**
 * Get canvas dimensions
 * @param canvas Canvas to get dimensions from
 * @returns Dimensions object or null
 */
export function getCanvasDimensions(canvas: FabricCanvas | null): { width: number, height: number } | null {
  if (!canvas) return null;
  
  try {
    return {
      width: canvas.getWidth(),
      height: canvas.getHeight()
    };
  } catch (e) {
    console.error('Error getting canvas dimensions:', e);
    return null;
  }
}
