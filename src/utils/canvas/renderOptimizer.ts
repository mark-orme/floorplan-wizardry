
/**
 * Canvas rendering optimization utilities
 * Provides RAF-based rendering and debounced events for smoother canvas operations
 */
import { Canvas as FabricCanvas } from 'fabric';
import { debounce, throttle } from '@/utils/canvas/rateLimit';

// Track ongoing animation frames
const animationFrames = new Map<string, number>();

/**
 * Request a render on the next animation frame
 * Cancels any pending render request for the same ID
 * 
 * @param canvas - The fabric canvas to render
 * @param id - Unique identifier for this render request
 * @returns The request ID for cancellation
 */
export const requestOptimizedRender = (
  canvas: FabricCanvas,
  id: string = 'default'
): void => {
  // Cancel any existing frame with the same ID
  if (animationFrames.has(id)) {
    cancelAnimationFrame(animationFrames.get(id)!);
  }
  
  // Schedule new render
  const frameId = requestAnimationFrame(() => {
    canvas.requestRenderAll();
    animationFrames.delete(id);
  });
  
  // Store frame ID for potential cancellation
  animationFrames.set(id, frameId);
};

/**
 * Cancel a pending optimized render
 * 
 * @param id - The render request ID to cancel
 */
export const cancelOptimizedRender = (id: string = 'default'): void => {
  if (animationFrames.has(id)) {
    cancelAnimationFrame(animationFrames.get(id)!);
    animationFrames.delete(id);
  }
};

/**
 * Create a smoother canvas event handler with both throttling and RAF
 * 
 * @param callback - The function to call with the event
 * @param throttleTime - How frequently to allow updates during rapid events
 * @returns Optimized event handler function
 */
export const createSmoothEventHandler = <T extends (...args: any[]) => void>(
  callback: T,
  throttleTime: number = 16 // ~60fps
): T => {
  // Create throttled version that uses requestAnimationFrame
  const throttled = throttle((...args: Parameters<T>) => {
    const result = callback(...args);
    return result;
  }, throttleTime);
  
  return throttled as T;
};

/**
 * Create a debounced finish handler for completing actions
 * 
 * @param callback - The function to call when activity finishes
 * @param debounceTime - How long to wait after last activity
 * @returns Debounced completion handler
 */
export const createCompletionHandler = <T extends (...args: any[]) => void>(
  callback: T,
  debounceTime: number = 250
): T => {
  return debounce(callback, debounceTime) as T;
};

/**
 * Apply performance optimizations to a canvas
 * 
 * @param canvas - The fabric canvas to optimize
 */
export const optimizeCanvasPerformance = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Performance configuration
  canvas.enableRetinaScaling = true;
  canvas.antialiase = true;
  canvas.skipOffscreen = true;
  
  // Use optimized render on specific events
  const optimizedRender = () => requestOptimizedRender(canvas);
  
  // Enhanced mouse move handler
  const originalMouseMove = canvas.__onMouseMove;
  canvas.__onMouseMove = function(e: MouseEvent) {
    // Call original with throttling
    createSmoothEventHandler((event: MouseEvent) => {
      originalMouseMove.call(this, event);
    }, 8)(e);
  };
  
  // Optimize rendering during active operations
  const optimizeMovingEvent = (eventName: string) => {
    const originalHandler = canvas['_' + eventName];
    if (originalHandler) {
      canvas['_' + eventName] = function(e: any) {
        requestOptimizedRender(canvas, eventName);
        return originalHandler.call(this, e);
      };
    }
  };
  
  // Apply to various movement events
  optimizeMovingEvent('onObjectScaling');
  optimizeMovingEvent('onObjectRotating');
  optimizeMovingEvent('onObjectMoving');
  
  // Log optimization applied
  console.log('Canvas performance optimization applied');
};
