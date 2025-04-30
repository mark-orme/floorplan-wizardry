
import { Canvas } from 'fabric';

/**
 * Request optimized canvas rendering with debounce
 * @param canvas The fabric canvas
 * @param options Options for optimization
 */
export const requestOptimizedRender = (
  canvas: Canvas | null,
  options: {
    debounceMs?: number;
    onBeforeRender?: () => void;
    onAfterRender?: () => void;
  } = {}
) => {
  if (!canvas) return;
  
  const { debounceMs = 0, onBeforeRender, onAfterRender } = options;
  
  if (debounceMs > 0) {
    if ((canvas as any)._renderDebounceId) {
      clearTimeout((canvas as any)._renderDebounceId);
    }
    
    (canvas as any)._renderDebounceId = setTimeout(() => {
      if (onBeforeRender) onBeforeRender();
      canvas.requestRenderAll();
      if (onAfterRender) onAfterRender();
      (canvas as any)._renderDebounceId = null;
    }, debounceMs);
  } else {
    if (onBeforeRender) onBeforeRender();
    canvas.requestRenderAll();
    if (onAfterRender) onAfterRender();
  }
};

/**
 * Create a smooth event handler with throttling
 * @param handler The event handler function
 * @param options Throttle options
 */
export const createSmoothEventHandler = <T extends (...args: any[]) => any>(
  handler: T,
  options: {
    throttleMs?: number;
    leading?: boolean;
    trailing?: boolean;
  } = {}
): T => {
  const { throttleMs = 16, leading = true, trailing = true } = options;
  let lastArgs: any[] | null = null;
  let lastThis: any | null = null;
  let result: ReturnType<T>;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;
  
  function invoke(time: number) {
    const args = lastArgs!;
    const thisArg = lastThis;
    
    lastArgs = lastThis = null;
    lastCallTime = time;
    result = handler.apply(thisArg, args);
    return result;
  }
  
  function throttled(this: any, ...args: any[]) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    
    lastArgs = args;
    lastThis = this;
    
    if (isInvoking) {
      if (timerId === null) {
        lastCallTime = time;
        if (leading) {
          return invoke(lastCallTime);
        }
        if (trailing) {
          timerId = setTimeout(trailingEdge, throttleMs);
        }
        return result;
      }
    }
    if (timerId === null && trailing) {
      timerId = setTimeout(trailingEdge, throttleMs);
    }
    return result;
  }
  
  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - lastCallTime;
    return (lastCallTime === 0 || timeSinceLastCall >= throttleMs);
  }
  
  function trailingEdge() {
    timerId = null;
    if (trailing && lastArgs) {
      return invoke(Date.now());
    }
    lastArgs = lastThis = null;
    return result;
  }
  
  return throttled as T;
};

/**
 * Batch operations for improved canvas performance
 * @param canvas The fabric canvas
 * @param callback Function to execute in batched mode
 */
export const batchCanvasOperations = (
  canvas: Canvas | null,
  callback: () => void
) => {
  if (!canvas) return;
  
  // Disable rendering during operations
  const originalRenderOnAddRemove = (canvas as any).renderOnAddRemove;
  if ((canvas as any).renderOnAddRemove !== undefined) {
    (canvas as any).renderOnAddRemove = false;
  }
  
  try {
    // Execute operations
    callback();
  } finally {
    // Restore original rendering setting
    if ((canvas as any).renderOnAddRemove !== undefined) {
      (canvas as any).renderOnAddRemove = originalRenderOnAddRemove;
    }
    
    // Render all changes at once
    canvas.requestRenderAll();
  }
};
