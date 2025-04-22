
/**
 * Canvas render optimization utilities
 * Provides utilities for optimizing canvas rendering
 */
import { Canvas as FabricCanvas } from 'fabric';

// Track pending render requests by source
const pendingRenders = new Map<string, number>();

/**
 * Request an optimized render of the canvas
 * Throttles render calls to avoid too many redraws
 * @param canvas The Fabric.js canvas
 * @param source Identifier for the source of the render request
 */
export function requestOptimizedRender(canvas: FabricCanvas, source: string = 'default'): void {
  // Cancel any pending render from the same source
  if (pendingRenders.has(source)) {
    cancelAnimationFrame(pendingRenders.get(source)!);
  }
  
  // Schedule a new render
  pendingRenders.set(source, requestAnimationFrame(() => {
    canvas.requestRenderAll();
    pendingRenders.delete(source);
  }));
}

/**
 * Create an event handler that is smoothed for user interaction
 * @param handler The handler function to smooth
 * @param fps Target FPS (default: 60)
 * @returns Smoothed handler function
 */
export function createSmoothEventHandler<T extends (...args: any[]) => void>(
  handler: T,
  fpsTarget: number = 60
): T {
  const interval = 1000 / fpsTarget;
  let lastTime = 0;
  let rafId: number | null = null;
  let lastArgs: any[] | null = null;
  
  const smoothHandler = function(this: any, ...args: any[]) {
    lastArgs = args;
    
    const now = performance.now();
    const delta = now - lastTime;
    
    // If we're due for an update, run immediately
    if (delta >= interval) {
      lastTime = now;
      handler.apply(this, args);
      return;
    }
    
    // Otherwise, schedule for the next frame
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        lastTime = performance.now();
        if (lastArgs) {
          handler.apply(this, lastArgs);
          lastArgs = null;
        }
      });
    }
  };
  
  return smoothHandler as T;
}

/**
 * Batch multiple canvas operations to run in a single render cycle
 * @param canvas The Fabric.js canvas
 * @param operations Array of operations to perform
 * @param renderAfter Whether to render after all operations
 */
export function batchCanvasOperations(
  canvas: FabricCanvas,
  operations: Array<(canvas: FabricCanvas) => void>,
  renderAfter: boolean = true
): void {
  // Start rendering mode that prevents automatic render calls
  canvas.renderOnAddRemove = false;
  
  // Execute all operations
  operations.forEach(operation => {
    try {
      operation(canvas);
    } catch (error) {
      console.error('Error in batch canvas operation:', error);
    }
  });
  
  // Restore rendering mode
  canvas.renderOnAddRemove = true;
  
  // Render once after all operations if requested
  if (renderAfter) {
    requestOptimizedRender(canvas, 'batch-operations');
  }
}

/**
 * Optimize draw calls to WebGL
 * @param canvas The canvas element
 * @param context The WebGL context
 */
export function optimizeDrawCalls(
  canvas: HTMLCanvasElement,
  context: WebGLRenderingContext
): void {
  // Basic WebGL optimization flags
  (context as any).imageSmoothingEnabled = true;
  
  // Prevent context loss
  canvas.addEventListener('webglcontextlost', (e) => {
    console.warn('WebGL context lost, attempting to restore');
    e.preventDefault();
  }, { passive: false });
  
  // Restore context when available
  canvas.addEventListener('webglcontextrestored', () => {
    console.log('WebGL context restored');
  }, { passive: true });
}

/**
 * Set up OffscreenCanvas if supported
 * @param canvas The source canvas element
 * @returns Either an OffscreenCanvas or the original canvas
 */
export function createOptimizedCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement | OffscreenCanvas {
  if (typeof OffscreenCanvas !== 'undefined') {
    try {
      const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
      return offscreen;
    } catch (e) {
      console.warn('Failed to create OffscreenCanvas:', e);
    }
  }
  return canvas;
}
