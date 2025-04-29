
/**
 * Canvas rendering optimization utilities
 */

import { Canvas } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

/**
 * Request an optimized render of the canvas
 * Uses requestAnimationFrame to batch render operations
 */
export function requestOptimizedRender(
  canvas: Canvas | ExtendedFabricCanvas | null, 
  options: { immediate?: boolean } = {}
): void {
  if (!canvas) return;
  
  if (options.immediate) {
    canvas.renderAll();
    return;
  }

  // Use requestAnimationFrame to optimize rendering
  if (!('_renderPending' in canvas)) {
    (canvas as any)._renderPending = false;
  }

  if (!(canvas as any)._renderPending) {
    (canvas as any)._renderPending = true;
    
    requestAnimationFrame(() => {
      if (!canvas) return;
      canvas.renderAll();
      (canvas as any)._renderPending = false;
    });
  }
}

/**
 * Batch multiple canvas operations and render once at the end
 */
export async function batchCanvasOperations<T>(
  canvas: Canvas | ExtendedFabricCanvas | null,
  operations: () => Promise<T> | T
): Promise<T> {
  if (!canvas) throw new Error('Canvas is null');
  
  // Temporarily disable rendering
  const originalRenderOnAddRemove = canvas.renderOnAddRemove;
  canvas.renderOnAddRemove = false;
  
  try {
    // Run operations
    const result = await operations();
    
    // Render once at the end
    canvas.renderAll();
    
    return result;
  } finally {
    // Restore original setting
    canvas.renderOnAddRemove = originalRenderOnAddRemove;
  }
}
