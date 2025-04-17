
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Safely get clientX from a pointer event
 * @param evt Mouse or Touch event
 * @returns clientX coordinate
 */
const getClientX = (evt: MouseEvent | TouchEvent): number => {
  if ('clientX' in evt) {
    return evt.clientX;
  } else if (evt.touches && evt.touches.length > 0) {
    return evt.touches[0].clientX;
  }
  return 0;
};

/**
 * Safely get clientY from a pointer event
 * @param evt Mouse or Touch event
 * @returns clientY coordinate
 */
const getClientY = (evt: MouseEvent | TouchEvent): number => {
  if ('clientY' in evt) {
    return evt.clientY;
  } else if (evt.touches && evt.touches.length > 0) {
    return evt.touches[0].clientY;
  }
  return 0;
};

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

  // Set stateful properties for better garbage collection
  canvas.selection = false; // We'll handle selection manually for better control
  
  // Set better defaults for interactive objects
  const defaultObjectProps = {
    transparentCorners: true,
    cornerColor: 'rgba(0,0,255,0.5)',
    cornerSize: 8,
    cornerStyle: 'circle',
    borderColor: '#2C8CF4',
    padding: 5
  };
  
  canvas.getObjects().forEach(obj => {
    if (obj.selectable) {
      obj.set(defaultObjectProps);
    }
  });

  // Set up event delegation for better performance
  setupEventDelegation(canvas);
};

/**
 * Set up event delegation to reduce the number of individual event handlers
 */
const setupEventDelegation = (canvas: FabricCanvas): void => {
  // Use event delegation instead of individual object handlers
  canvas.on('mouse:down', function(opt) {
    const evt = opt.e;
    if (evt.altKey === true) {
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = getClientX(evt);
      this.lastPosY = getClientY(evt);
    }
  });
  
  canvas.on('mouse:move', function(opt) {
    if (this.isDragging) {
      const e = opt.e;
      const vpt = this.viewportTransform;
      if (!vpt) return;
      
      vpt[4] += getClientX(e) - this.lastPosX;
      vpt[5] += getClientY(e) - this.lastPosY;
      
      this.requestRenderAll();
      this.lastPosX = getClientX(e);
      this.lastPosY = getClientY(e);
    }
  });
  
  canvas.on('mouse:up', function() {
    this.isDragging = false;
    this.selection = true;
  });
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

/**
 * Batch multiple canvas operations for better performance
 * @param canvas Fabric canvas instance
 * @param operations Functions to execute in batch
 */
export const batchCanvasOperations = (
  canvas: FabricCanvas,
  operations: Array<(canvas: FabricCanvas) => void>
): void => {
  // Temporarily disable rendering
  const originalRenderOnAddRemove = canvas.renderOnAddRemove;
  canvas.renderOnAddRemove = false;
  
  try {
    // Execute all operations
    operations.forEach(operation => operation(canvas));
    
    // Request a single render
    requestOptimizedRender(canvas, 'batch-operations');
  } finally {
    // Restore original setting
    canvas.renderOnAddRemove = originalRenderOnAddRemove;
  }
};

/**
 * Debounce a function to limit execution frequency
 * @param fn Function to debounce
 * @param wait Wait time in milliseconds
 * @param immediate Whether to execute immediately
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 100,
  immediate: boolean = false
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) fn.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(later, wait);
    
    if (callNow) {
      fn.apply(context, args);
    }
  };
};
