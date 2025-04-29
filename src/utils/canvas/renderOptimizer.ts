
/**
 * Canvas rendering optimization utilities
 */

import { Canvas } from 'fabric';

let renderRequestId: number | null = null;
const pendingCanvases = new Set<Canvas>();

/**
 * Request an optimized render for a canvas
 * Batches rendering requests to avoid multiple repaints in the same frame
 * @param canvas The canvas to render
 * @param reason Optional reason for debugging
 */
export function requestOptimizedRender(canvas: Canvas, reason?: string): void {
  if (!canvas) return;
  
  // Add canvas to pending set
  pendingCanvases.add(canvas);
  
  // If we already have a request queued, don't queue another one
  if (renderRequestId !== null) return;
  
  // Schedule a render on the next animation frame
  renderRequestId = requestAnimationFrame(() => {
    // Render all pending canvases
    pendingCanvases.forEach(canvas => {
      try {
        canvas.renderAll();
      } catch (error) {
        console.error('Error rendering canvas:', error);
      }
    });
    
    // Clear the pending set and request ID
    pendingCanvases.clear();
    renderRequestId = null;
  });
}

/**
 * Creates a smooth event handler that throttles canvas rendering
 * Useful for high-frequency events like mouse movements
 */
export function createSmoothEventHandler<T extends any[]>(
  handler: (...args: T) => void,
  canvas?: Canvas | null
): (...args: T) => void {
  return (...args: T) => {
    handler(...args);
    if (canvas) {
      requestOptimizedRender(canvas);
    }
  };
}

/**
 * Cancel any pending render requests
 */
export function cancelRenderRequests(): void {
  if (renderRequestId !== null) {
    cancelAnimationFrame(renderRequestId);
    renderRequestId = null;
    pendingCanvases.clear();
  }
}
