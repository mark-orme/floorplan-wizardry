
/**
 * Canvas render optimization utilities
 * Helps batch and optimize render calls for better performance
 */

import { Canvas as FabricCanvas } from 'fabric';

// Track pending render requests
let renderRequested = false;
let renderTimeout: NodeJS.Timeout | null = null;
let renderDebounceTime = 10; // ms

/**
 * Request an optimized render of the canvas
 * Debounces multiple render calls to improve performance
 * 
 * @param canvas The fabric canvas to render
 * @param source Optional source identifier for debugging
 */
export const requestOptimizedRender = (
  canvas: FabricCanvas | null, 
  source: string = 'unknown'
): void => {
  if (!canvas) return;
  
  // Clear any pending render timeout
  if (renderTimeout) {
    clearTimeout(renderTimeout);
    renderTimeout = null;
  }
  
  // Schedule a new render
  if (!renderRequested) {
    renderRequested = true;
    
    renderTimeout = setTimeout(() => {
      if (canvas) {
        // Check if requestRenderAll is available, fall back to renderAll if not
        if (typeof canvas.requestRenderAll === 'function') {
          canvas.requestRenderAll();
        } else if (typeof canvas.renderAll === 'function') {
          canvas.renderAll();
        }
      }
      renderRequested = false;
      renderTimeout = null;
    }, renderDebounceTime);
  }
};

/**
 * Set the debounce time for render optimization
 * 
 * @param time Debounce time in milliseconds
 */
export const setRenderDebounceTime = (time: number): void => {
  renderDebounceTime = time;
};
