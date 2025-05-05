
import { Canvas } from 'fabric';

export interface RenderOptions {
  debounceMs?: number;
  onBeforeRender?: () => void;
  onAfterRender?: () => void;
}

// Debounce render calls
const debounceTimers: Map<string, NodeJS.Timeout> = new Map();

/**
 * Request an optimized render operation on the canvas
 * @param canvas The canvas to render
 * @param options Render options or a string key for predefined operations
 */
export function requestOptimizedRender(
  canvas: Canvas | null, 
  options: RenderOptions | string = {}
): void {
  if (!canvas) return;
  
  // Handle string options (for backward compatibility)
  let renderOptions: RenderOptions;
  if (typeof options === 'string') {
    switch (options) {
      case 'add-objects':
        renderOptions = { debounceMs: 50 };
        break;
      case 'remove-objects':
        renderOptions = { debounceMs: 50 };
        break;
      case 'update-objects':
        renderOptions = { debounceMs: 100 };
        break;
      default:
        renderOptions = {};
    }
  } else {
    renderOptions = options;
  }
  
  const { debounceMs = 0, onBeforeRender, onAfterRender } = renderOptions;
  
  // Get a unique key for the canvas for debouncing
  const canvasKey = canvas.lowerCanvasEl?.id || 'canvas';
  
  // Clear any existing timer for this canvas
  if (debounceTimers.has(canvasKey)) {
    clearTimeout(debounceTimers.get(canvasKey));
  }
  
  if (debounceMs > 0) {
    // Debounce the render
    debounceTimers.set(
      canvasKey,
      setTimeout(() => {
        performRender(canvas, onBeforeRender, onAfterRender);
        debounceTimers.delete(canvasKey);
      }, debounceMs)
    );
  } else {
    // Render immediately
    performRender(canvas, onBeforeRender, onAfterRender);
  }
}

/**
 * Perform the actual render operation
 */
function performRender(
  canvas: Canvas,
  onBeforeRender?: () => void,
  onAfterRender?: () => void
): void {
  try {
    if (onBeforeRender) onBeforeRender();
    canvas.requestRenderAll();
    if (onAfterRender) onAfterRender();
  } catch (error) {
    console.error('Error during canvas render:', error);
  }
}

/**
 * Cancel pending debounced renders
 * @param canvas The canvas to cancel renders for, or null to cancel all
 */
export function cancelOptimizedRenders(canvas: Canvas | null = null): void {
  if (canvas) {
    const canvasKey = canvas.lowerCanvasEl?.id || 'canvas';
    if (debounceTimers.has(canvasKey)) {
      clearTimeout(debounceTimers.get(canvasKey));
      debounceTimers.delete(canvasKey);
    }
  } else {
    // Cancel all pending renders
    debounceTimers.forEach(timer => clearTimeout(timer));
    debounceTimers.clear();
  }
}

// Add the createSmoothEventHandler function needed by hooks
export function createSmoothEventHandler<T extends (...args: any[]) => any>(
  handler: T,
  debounceMs: number = 16
): T {
  let lastCallTime = 0;
  
  return ((...args: any[]) => {
    const now = Date.now();
    
    if (now - lastCallTime >= debounceMs) {
      lastCallTime = now;
      return handler(...args);
    }
    
    return undefined;
  }) as T;
}

// Add the batchCanvasOperations function needed by hooks
export function batchCanvasOperations<T>(
  canvas: Canvas | null, 
  operations: () => T,
  renderAfter: boolean = true
): T {
  if (!canvas) {
    return operations();
  }
  
  try {
    // Temporarily disable rendering
    const originalRenderOnAddRemove = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;
    
    // Perform operations
    const result = operations();
    
    // Restore original setting and render if needed
    canvas.renderOnAddRemove = originalRenderOnAddRemove;
    if (renderAfter) {
      canvas.requestRenderAll();
    }
    
    return result;
  } catch (error) {
    console.error('Error during batch canvas operations:', error);
    throw error;
  }
}
