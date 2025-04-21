/**
 * Canvas Render Optimization Utilities
 * 
 * Provides utilities for optimizing canvas rendering performance
 */

import { Canvas as FabricCanvas } from 'fabric';

// Map to track render requests
const renderRequestMap = new Map<string, number>();

/**
 * Request a render with optimization
 * Debounces render calls to avoid excessive rendering
 * 
 * @param canvas Fabric canvas instance
 * @param source Source of the render request for tracking
 * @param delay Delay in ms before rendering
 */
export function requestOptimizedRender(
  canvas: FabricCanvas, 
  source: string = 'generic', 
  delay: number = 0
): void {
  if (!canvas) return;
  
  // Cancel any pending render request for this source
  if (renderRequestMap.has(source)) {
    cancelAnimationFrame(renderRequestMap.get(source)!);
    renderRequestMap.delete(source);
  }
  
  if (delay > 0) {
    // Delayed render with setTimeout
    const timeoutId = window.setTimeout(() => {
      canvas.requestRenderAll();
      renderRequestMap.delete(source);
    }, delay);
    
    // Store timeout ID as number
    renderRequestMap.set(source, timeoutId as unknown as number);
  } else {
    // Immediate render with requestAnimationFrame
    const frameId = requestAnimationFrame(() => {
      canvas.requestRenderAll();
      renderRequestMap.delete(source);
    });
    
    renderRequestMap.set(source, frameId);
  }
}

/**
 * Batch multiple canvas operations and render only once at the end
 * 
 * @param canvas Fabric canvas instance
 * @param operations Array of operations to perform
 */
export function batchCanvasOperations(
  canvas: FabricCanvas,
  operations: Array<(canvas: FabricCanvas) => void>
): void {
  if (!canvas || operations.length === 0) return;
  
  // Temporarily disable automatic rendering
  const originalRenderOnAddRemove = canvas.renderOnAddRemove;
  canvas.renderOnAddRemove = false;
  
  try {
    // Execute all operations
    operations.forEach(operation => operation(canvas));
    
    // Render once at the end
    requestOptimizedRender(canvas, 'batch-operations');
  } finally {
    // Restore original rendering setting
    canvas.renderOnAddRemove = originalRenderOnAddRemove;
  }
}

/**
 * Create a smooth event handler that doesn't block the UI
 * 
 * @param handler Event handler function
 * @param throttleMs Throttle time in ms
 * @returns Throttled handler
 */
export function createSmoothEventHandler<T extends (...args: any[]) => void>(
  handler: T,
  throttleMs: number = 0
): T {
  let lastExecTime = 0;
  let requestId: number | null = null;
  
  return ((...args: Parameters<T>) => {
    const now = performance.now();
    
    // Clear any pending execution
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
    
    // If throttling is enabled and we're within the throttle window, schedule for later
    if (throttleMs > 0 && now - lastExecTime < throttleMs) {
      requestId = requestAnimationFrame(() => {
        handler(...args);
        lastExecTime = performance.now();
        requestId = null;
      });
      return;
    }
    
    // Otherwise execute immediately
    handler(...args);
    lastExecTime = now;
  }) as T;
}

/**
 * Create a load-balanced set of workers for heavy operations
 * 
 * @param workerScript Path to worker script
 * @param count Number of workers to create
 * @returns Array of workers
 */
export function createWorkerPool(workerScript: string, count: number = navigator.hardwareConcurrency || 4) {
  const workers: Worker[] = [];
  
  for (let i = 0; i < count; i++) {
    const worker = new Worker(workerScript);
    workers.push(worker);
  }
  
  return {
    /**
     * Execute a task on the least busy worker
     * 
     * @param task Task data to send to worker
     * @returns Promise with worker result
     */
    execute<T, R>(task: T): Promise<R> {
      return new Promise((resolve, reject) => {
        // Simple round-robin for now
        const worker = workers[Math.floor(Math.random() * workers.length)];
        
        const messageHandler = (e: MessageEvent) => {
          worker.removeEventListener('message', messageHandler);
          worker.removeEventListener('error', errorHandler);
          resolve(e.data as R);
        };
        
        const errorHandler = (e: ErrorEvent) => {
          worker.removeEventListener('message', messageHandler);
          worker.removeEventListener('error', errorHandler);
          reject(new Error(`Worker error: ${e.message}`));
        };
        
        worker.addEventListener('message', messageHandler);
        worker.addEventListener('error', errorHandler);
        worker.postMessage(task);
      });
    },
    
    /**
     * Terminate all workers in the pool
     */
    terminate() {
      workers.forEach(worker => worker.terminate());
    }
  };
}
