
/**
 * Pointer optimization utilities
 * Provides advanced handling for stylus input
 */

/**
 * Check if an event is from a pen/stylus
 * @param event Pointer event
 * @returns Whether the event is from a pen
 */
export function isPenEvent(event: PointerEvent): boolean {
  return event.pointerType === 'pen';
}

/**
 * Get coalesced events from a pointer event
 * Modern browsers coalesce multiple events into one for performance
 * This extracts all the individual events for more precision
 * 
 * @param event Pointer event
 * @returns Array of coalesced events, or the event itself if not supported
 */
export function getCoalescedEvents(event: PointerEvent): PointerEvent[] {
  if (event.getCoalescedEvents && event.getCoalescedEvents().length > 0) {
    return event.getCoalescedEvents();
  }
  return [event];
}

/**
 * Configure palm rejection for canvas
 * @param canvas Canvas element
 * @returns Cleanup function
 */
export function configurePalmRejection(canvas: HTMLCanvasElement): () => void {
  let activePenId: number | null = null;
  
  const handlePointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      activePenId = e.pointerId;
    } else if (e.pointerType === 'touch' && activePenId !== null) {
      // If a pen is active and this is a touch event, prevent it
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  const handlePointerUp = (e: PointerEvent) => {
    if (e.pointerType === 'pen' && e.pointerId === activePenId) {
      activePenId = null;
    }
  };
  
  // Add event listeners
  canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
  canvas.addEventListener('pointerup', handlePointerUp, { passive: true });
  canvas.addEventListener('pointercancel', handlePointerUp, { passive: true });
  
  // Return cleanup function
  return () => {
    canvas.removeEventListener('pointerdown', handlePointerDown);
    canvas.removeEventListener('pointerup', handlePointerUp);
    canvas.removeEventListener('pointercancel', handlePointerUp);
  };
}

/**
 * Optimize canvas for drawing
 * @param canvas Canvas element
 */
export function optimizeCanvasForDrawing(canvas: HTMLCanvasElement): void {
  // Disable default touch behaviors
  canvas.style.touchAction = 'none';
  
  // Prevent context menu
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  
  // Set up fast event handling
  canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  
  // Force hardware acceleration
  canvas.style.transform = 'translateZ(0)';
  canvas.style.backfaceVisibility = 'hidden';
  
  // Optimize for high-DPI displays
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
}

/**
 * Performance monitoring frame timer
 */
export class FrameTimer {
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 0;
  private avgFrameTime: number = 0;
  private totalFrameTime: number = 0;
  private rafId: number | null = null;
  private callback: ((fps: number, avgTime: number) => void) | null = null;
  
  /**
   * Start monitoring
   * @param callback Callback function with FPS and average frame time
   */
  public startMonitoring(callback?: (fps: number, avgTime: number) => void): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.avgFrameTime = 0;
    this.totalFrameTime = 0;
    this.callback = callback || null;
    
    this.tick();
  }
  
  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  /**
   * Get current FPS
   * @returns Current FPS
   */
  public getFPS(): number {
    return this.fps;
  }
  
  /**
   * Get average frame time
   * @returns Average frame time in milliseconds
   */
  public getAverageFrameTime(): number {
    return this.avgFrameTime;
  }
  
  /**
   * Frame tick
   */
  private tick = (): void => {
    this.rafId = requestAnimationFrame(this.tick);
    
    const now = performance.now();
    const frameTime = now - this.lastTime;
    this.lastTime = now;
    
    this.frameCount++;
    this.totalFrameTime += frameTime;
    
    // Update stats every second
    if (this.totalFrameTime >= 1000) {
      this.fps = this.frameCount / (this.totalFrameTime / 1000);
      this.avgFrameTime = this.totalFrameTime / this.frameCount;
      
      if (this.callback) {
        this.callback(this.fps, this.avgFrameTime);
      }
      
      this.frameCount = 0;
      this.totalFrameTime = 0;
    }
  };
}

/**
 * Set up WebGL rendering
 * @param canvas Canvas element
 * @returns Cleanup function
 */
export function setupWebGLRendering(canvas: HTMLCanvasElement): () => void {
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  
  try {
    // Try to get WebGL context
    const contextOptions = {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
      premultipliedAlpha: false,
      desynchronized: true, // For lower latency
      powerPreference: 'high-performance'
    };
    
    gl = canvas.getContext('webgl2', contextOptions) as WebGL2RenderingContext || 
         canvas.getContext('webgl', contextOptions) as WebGLRenderingContext;
    
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    
    // Set up WebGL
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Set up viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    console.log('WebGL rendering initialized');
  } catch (error) {
    console.warn('Failed to initialize WebGL rendering:', error);
    return () => {}; // No cleanup needed
  }
  
  // Return cleanup function
  return () => {
    if (gl) {
      // Release WebGL context if possible
      const extension = gl.getExtension('WEBGL_lose_context');
      if (extension) extension.loseContext();
    }
  };
}
