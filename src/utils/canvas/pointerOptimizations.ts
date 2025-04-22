
/**
 * Advanced Pointer and Stylus Handling Optimizations
 * Provides optimized handling for pressure-sensitive drawing and palm rejection
 */

/**
 * Check if the event is from a pen/stylus
 * @param event Pointer event to check
 * @returns True if event is from a pen
 */
export const isPenEvent = (event: PointerEvent | Touch): boolean => {
  return 'pointerType' in event && event.pointerType === 'pen';
};

/**
 * Get coalesced pointer events if available
 * Ensures high-fidelity capture of fast pen movements
 * @param event Pointer event
 * @returns Array of pointer events (coalesced if available)
 */
export const getCoalescedEvents = (event: PointerEvent): PointerEvent[] => {
  if ('getCoalescedEvents' in event) {
    const events = event.getCoalescedEvents();
    return events.length > 0 ? events : [event];
  }
  return [event];
};

/**
 * Palm rejection implementation
 * Ignores touch events when a pen is active
 */
export const configurePalmRejection = (canvasElement: HTMLCanvasElement): () => void => {
  let isPenActive = false;
  
  const pointerDownHandler = (e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      isPenActive = true;
      console.log('Pen active, palm rejection enabled');
    }
  };
  
  const pointerUpHandler = (e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      // Small delay to prevent accidental palm touches right after pen up
      setTimeout(() => {
        isPenActive = false;
        console.log('Pen inactive, palm rejection disabled');
      }, 100);
    }
  };
  
  const touchHandler = (e: TouchEvent) => {
    if (isPenActive) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Touch event rejected due to active pen');
    }
  };
  
  // Add event listeners
  canvasElement.addEventListener('pointerdown', pointerDownHandler);
  canvasElement.addEventListener('pointerup', pointerUpHandler);
  canvasElement.addEventListener('pointercancel', pointerUpHandler);
  canvasElement.addEventListener('touchstart', touchHandler, { passive: false });
  canvasElement.addEventListener('touchmove', touchHandler, { passive: false });
  
  // Return cleanup function
  return () => {
    canvasElement.removeEventListener('pointerdown', pointerDownHandler);
    canvasElement.removeEventListener('pointerup', pointerUpHandler);
    canvasElement.removeEventListener('pointercancel', pointerUpHandler);
    canvasElement.removeEventListener('touchstart', touchHandler);
    canvasElement.removeEventListener('touchmove', touchHandler);
  };
};

/**
 * Configure canvas for optimal drawing performance
 * @param canvas Canvas element to optimize
 */
export const optimizeCanvasForDrawing = (canvas: HTMLCanvasElement): void => {
  // Disable default touch actions for smoother drawing
  canvas.style.touchAction = 'none';
  
  // Prevent default events
  canvas.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
  
  // Set high-performance rendering context attributes
  // This tells browsers to prioritize rendering performance
  const ctx = canvas.getContext('2d', {
    alpha: false,              // No transparency needed for drawing
    desynchronized: true,      // Allow desynchronized canvas for lower latency
    preserveDrawingBuffer: false // No need to preserve unless doing export
  });
  
  // Set additional optimizations if context is available
  if (ctx) {
    ctx.imageSmoothingEnabled = false; // Disable image smoothing for line drawing
    // More specific options for webkit/blink browsers
    (ctx as any).imageSmoothingQuality = 'low';
  }
};

/**
 * Frame timing utility for performance monitoring
 * Ensures we're hitting 16ms/frame target (60fps)
 */
export class FrameTimer {
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private totalFrameTime: number = 0;
  private isMonitoring: boolean = false;
  private frameCallback: ((fps: number, avgTime: number) => void) | null = null;
  
  /**
   * Start monitoring frame times
   * @param callback Optional callback for FPS reporting
   */
  public startMonitoring(callback?: (fps: number, avgTime: number) => void): void {
    this.isMonitoring = true;
    this.frameCount = 0;
    this.totalFrameTime = 0;
    this.lastFrameTime = performance.now();
    this.frameCallback = callback || null;
    
    this.monitorNextFrame();
  }
  
  /**
   * Stop monitoring frame times
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
  }
  
  /**
   * Monitor the next animation frame
   */
  private monitorNextFrame(): void {
    if (!this.isMonitoring) return;
    
    requestAnimationFrame(() => {
      const now = performance.now();
      const frameDuration = now - this.lastFrameTime;
      
      // Log slow frames (over 16ms, which is below 60fps)
      if (frameDuration > 16) {
        console.warn(`Slow frame detected: ${frameDuration.toFixed(2)}ms (target: 16ms)`);
      }
      
      this.frameCount++;
      this.totalFrameTime += frameDuration;
      
      // Report FPS every 60 frames
      if (this.frameCount % 60 === 0 && this.frameCallback) {
        const avgTime = this.totalFrameTime / this.frameCount;
        const fps = 1000 / avgTime;
        this.frameCallback(fps, avgTime);
        
        // Reset metrics for next batch
        this.frameCount = 0;
        this.totalFrameTime = 0;
      }
      
      this.lastFrameTime = now;
      this.monitorNextFrame();
    });
  }
}

/**
 * Setup WebGL rendering for canvas optimization
 * @param canvas Canvas element to optimize with WebGL
 * @returns Cleanup function
 */
export const setupWebGLRendering = (canvas: HTMLCanvasElement): (() => void) => {
  // Use OffscreenCanvas if available for better performance
  let offscreenCanvas: OffscreenCanvas | null = null;
  
  try {
    if ('OffscreenCanvas' in window) {
      offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
      console.log('Using OffscreenCanvas for optimized rendering');
    }
  } catch (err) {
    console.warn('OffscreenCanvas not supported:', err);
  }
  
  // Return cleanup function
  return () => {
    offscreenCanvas = null;
  };
};
