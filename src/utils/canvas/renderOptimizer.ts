
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Optimize canvas performance by configuring rendering and caching settings
 * @param canvas Fabric canvas instance to optimize
 */
export const optimizeCanvasPerformance = (canvas: FabricCanvas): void => {
  if (!canvas) return;

  // Disable automatic rendering for better performance control
  canvas.renderOnAddRemove = false;

  // Enable object caching for improved rendering speed
  canvas.forEachObject(obj => {
    // Disable caching for path and group objects to prevent potential rendering issues
    obj.objectCaching = !['path', 'group'].includes(obj.type || '');
  });

  // Enable retina scaling for crisp rendering on high-DPI displays
  canvas.enableRetinaScaling = true;

  // Optimize selection and interaction performance
  canvas.skipTargetFind = false;
};

/**
 * Request an optimized render using requestAnimationFrame to batch multiple render requests
 * @param canvas Fabric canvas instance
 * @param id Unique identifier for the render request
 */
const animationFrames = new Map<string, number>();

export const requestOptimizedRender = (
  canvas: FabricCanvas,
  id: string = 'default'
): void => {
  if (animationFrames.has(id)) {
    cancelAnimationFrame(animationFrames.get(id)!);
  }
  
  const frameId = requestAnimationFrame(() => {
    canvas.requestRenderAll();
    animationFrames.delete(id);
  });
  
  animationFrames.set(id, frameId);
};

/**
 * Cancel a pending optimized render request
 * @param id Unique identifier for the render request
 */
export const cancelOptimizedRender = (id: string = 'default'): void => {
  if (animationFrames.has(id)) {
    cancelAnimationFrame(animationFrames.get(id)!);
    animationFrames.delete(id);
  }
};

/**
 * Create a throttled event handler for smoother interactions
 * @param callback Function to throttle
 * @param throttleTime Minimum time between function calls in milliseconds
 * @returns Throttled function
 */
export const createSmoothEventHandler = <T extends (...args: any[]) => void>(
  callback: T,
  throttleTime: number = 16
): T => {
  let lastRun = 0;
  
  return ((...args: Parameters<T>) => {
    const now = performance.now();
    if (now - lastRun >= throttleTime) {
      lastRun = now;
      return callback(...args);
    }
  }) as T;
};
