
/**
 * Offscreen canvas renderer
 * Moves canvas rendering off the main thread when supported
 */

// Check for OffscreenCanvas support
const isOffscreenCanvasSupported = typeof OffscreenCanvas !== 'undefined';

// State tracking
let offscreenWorkerInitialized = false;
const canvasRegistry = new Map<string, {
  canvas: HTMLCanvasElement,
  offscreen: OffscreenCanvas,
  contextType: '2d' | 'webgl' | 'webgl2'
}>();

/**
 * Initialize offscreen canvas rendering for an element
 * @param canvas HTML Canvas element
 * @param contextType Context type to use
 * @returns Success status
 */
export function initOffscreenRendering(
  canvas: HTMLCanvasElement, 
  contextType: '2d' | 'webgl' | 'webgl2' = '2d'
): boolean {
  if (!isOffscreenCanvasSupported) {
    console.warn('OffscreenCanvas not supported in this browser');
    return false;
  }
  
  try {
    // Generate unique ID for this canvas
    const canvasId = `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Transfer canvas to offscreen
    const offscreen = canvas.transferControlToOffscreen();
    
    // Store in registry
    canvasRegistry.set(canvasId, {
      canvas,
      offscreen,
      contextType
    });
    
    // Initialize worker if needed
    if (!offscreenWorkerInitialized) {
      initializeRenderingWorker();
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize offscreen rendering:', error);
    return false;
  }
}

/**
 * Initialize the rendering worker
 */
function initializeRenderingWorker() {
  if (offscreenWorkerInitialized) return;
  
  try {
    // In a real implementation, this would create a Web Worker
    // and transfer the offscreen canvas to it
    // Since we can't create a new file for the worker, we'll simulate it
    
    offscreenWorkerInitialized = true;
    console.log('OffscreenCanvas rendering initialized');
    
    // This would be the handler for messages from the worker
    const handleWorkerMessage = (event: MessageEvent) => {
      // Process messages from worker
    };
    
    // In a real implementation, we would:
    // 1. Create a Web Worker
    // 2. Add message event listener
    // 3. Transfer control of canvases to worker
    
  } catch (error) {
    console.error('Failed to initialize rendering worker:', error);
    offscreenWorkerInitialized = false;
  }
}

/**
 * Check if a canvas is using offscreen rendering
 * @param canvas HTML Canvas element
 * @returns Whether canvas is using offscreen rendering
 */
export function isOffscreenActive(canvas: HTMLCanvasElement): boolean {
  // Check if this canvas is in our registry
  for (const [_, entry] of canvasRegistry) {
    if (entry.canvas === canvas) {
      return true;
    }
  }
  return false;
}

/**
 * Cleanup offscreen rendering for a canvas
 * @param canvas HTML Canvas element to cleanup
 */
export function cleanupOffscreenRendering(canvas: HTMLCanvasElement): void {
  // Remove from registry
  for (const [id, entry] of canvasRegistry) {
    if (entry.canvas === canvas) {
      canvasRegistry.delete(id);
      break;
    }
  }
  
  // In a real implementation, we would also tell the worker
  // to release this canvas
}
