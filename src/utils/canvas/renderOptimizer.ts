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

/**
 * Interface for stylus input data with tilt information
 */
export interface StylusInputData {
  pressure: number;
  tiltX: number;
  tiltY: number;
  altitudeAngle?: number;
  azimuthAngle?: number;
  twist?: number;
  tangentialPressure?: number;
}

/**
 * Extract complete stylus data from pointer event
 * @param event Pointer event
 * @returns Stylus input data
 */
export function extractStylusData(event: PointerEvent): StylusInputData {
  return {
    pressure: event.pressure || 0.5,
    tiltX: event.tiltX || 0,
    tiltY: event.tiltY || 0,
    // These are experimental properties, may not be available in all browsers
    altitudeAngle: (event as any).altitudeAngle,
    azimuthAngle: (event as any).azimuthAngle,
    twist: (event as any).twist,
    tangentialPressure: (event as any).tangentialPressure
  };
}

/**
 * Normalize stylus tilt data to consistent scale
 * @param data Stylus input data
 * @returns Normalized stylus data
 */
export function normalizeStylusData(data: StylusInputData): StylusInputData {
  // Tilt values are in degrees, convert to 0-1 range
  const normalizedTiltX = (data.tiltX + 90) / 180;
  const normalizedTiltY = (data.tiltY + 90) / 180;
  
  return {
    ...data,
    tiltX: normalizedTiltX,
    tiltY: normalizedTiltY
  };
}

/**
 * Frame rate controller to target specific FPS
 */
export class FrameRateController {
  private targetFPS: number;
  private frameInterval: number;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private lastFPSUpdateTime: number = 0;
  private currentFPS: number = 0;
  private callback: ((deltaTime: number) => void) | null = null;
  private rafId: number | null = null;
  private isActive: boolean = false;

  /**
   * Constructor
   * @param targetFPS Target frames per second
   */
  constructor(targetFPS: number = 60) {
    this.targetFPS = targetFPS;
    this.frameInterval = 1000 / targetFPS;
  }

  /**
   * Start the frame rate controller
   * @param callback Callback to run on each frame
   */
  public start(callback: (deltaTime: number) => void): void {
    if (this.isActive) return;
    
    this.callback = callback;
    this.isActive = true;
    this.lastFrameTime = performance.now();
    this.lastFPSUpdateTime = this.lastFrameTime;
    this.frameCount = 0;
    
    this.tick();
  }

  /**
   * Stop the frame rate controller
   */
  public stop(): void {
    this.isActive = false;
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Set target FPS
   * @param fps Target FPS
   */
  public setTargetFPS(fps: number): void {
    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;
  }

  /**
   * Get current FPS
   * @returns Current FPS
   */
  public getFPS(): number {
    return this.currentFPS;
  }

  /**
   * Frame tick
   */
  private tick = (): void => {
    if (!this.isActive) return;
    
    this.rafId = requestAnimationFrame(this.tick);
    
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    
    // Only render if enough time has passed
    if (deltaTime >= this.frameInterval) {
      // Calculate FPS
      this.frameCount++;
      
      if (now - this.lastFPSUpdateTime >= 1000) {
        this.currentFPS = this.frameCount * 1000 / (now - this.lastFPSUpdateTime);
        this.frameCount = 0;
        this.lastFPSUpdateTime = now;
      }
      
      // Update last frame time - align to frame boundary
      this.lastFrameTime = now - (deltaTime % this.frameInterval);
      
      // Run callback
      if (this.callback) {
        this.callback(deltaTime);
      }
    }
  };
}

/**
 * Advanced palm rejection with multi-pointer tracking
 */
export class PalmRejectionController {
  private element: HTMLElement;
  private activePenId: number | null = null;
  private touchEvents: Map<number, PointerEvent> = new Map();
  private isPalmRejectionActive: boolean = true;
  private callbacks: {
    onRejectedTouch?: (e: PointerEvent) => void;
    onPenStart?: (e: PointerEvent) => void;
    onPenEnd?: (e: PointerEvent) => void;
  } = {};

  /**
   * Constructor
   * @param element Element to attach palm rejection to
   * @param options Options
   */
  constructor(element: HTMLElement, options?: {
    isPalmRejectionActive?: boolean;
    onRejectedTouch?: (e: PointerEvent) => void;
    onPenStart?: (e: PointerEvent) => void;
    onPenEnd?: (e: PointerEvent) => void;
  }) {
    this.element = element;
    
    if (options) {
      this.isPalmRejectionActive = options.isPalmRejectionActive ?? true;
      this.callbacks = {
        onRejectedTouch: options.onRejectedTouch,
        onPenStart: options.onPenStart,
        onPenEnd: options.onPenEnd
      };
    }
    
    this.attachEventListeners();
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    this.element.addEventListener('pointerdown', this.handlePointerDown, { passive: false });
    this.element.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    this.element.addEventListener('pointerup', this.handlePointerUp, { passive: true });
    this.element.addEventListener('pointercancel', this.handlePointerUp, { passive: true });
  }

  /**
   * Handle pointer down
   */
  private handlePointerDown = (e: PointerEvent): void => {
    if (e.pointerType === 'pen') {
      // Pen is active, store its ID
      this.activePenId = e.pointerId;
      this.callbacks.onPenStart?.(e);
      
      // If palm rejection is active, prevent default for all touch events
      if (this.isPalmRejectionActive) {
        e.preventDefault();
      }
    } else if (e.pointerType === 'touch' && this.activePenId !== null && this.isPalmRejectionActive) {
      // If pen is active and this is a touch event, it's likely a palm
      e.preventDefault();
      e.stopPropagation();
      this.callbacks.onRejectedTouch?.(e);
    }
    
    // Store all touch events
    if (e.pointerType === 'touch') {
      this.touchEvents.set(e.pointerId, e);
    }
  };

  /**
   * Handle pointer move
   */
  private handlePointerMove = (e: PointerEvent): void => {
    if (e.pointerType === 'touch' && this.activePenId !== null && this.isPalmRejectionActive) {
      // Ignore touch events when pen is active
      this.callbacks.onRejectedTouch?.(e);
    }
    
    // Update touch event storage
    if (e.pointerType === 'touch') {
      this.touchEvents.set(e.pointerId, e);
    }
  };

  /**
   * Handle pointer up
   */
  private handlePointerUp = (e: PointerEvent): void => {
    if (e.pointerType === 'pen' && e.pointerId === this.activePenId) {
      // Pen is no longer active
      this.activePenId = null;
      this.callbacks.onPenEnd?.(e);
    }
    
    // Remove from touch event storage
    if (e.pointerType === 'touch') {
      this.touchEvents.delete(e.pointerId);
    }
  };

  /**
   * Set palm rejection active state
   * @param active Whether palm rejection is active
   */
  public setPalmRejectionActive(active: boolean): void {
    this.isPalmRejectionActive = active;
  }

  /**
   * Check if palm rejection is active
   * @returns Whether palm rejection is active
   */
  public isPalmRejectionEnabled(): boolean {
    return this.isPalmRejectionActive;
  }

  /**
   * Check if pen is active
   * @returns Whether pen is active
   */
  public isPenActive(): boolean {
    return this.activePenId !== null;
  }

  /**
   * Get active touch points count
   * @returns Number of active touch points
   */
  public getActiveTouchCount(): number {
    return this.touchEvents.size;
  }

  /**
   * Dispose palm rejection controller
   */
  public dispose(): void {
    this.element.removeEventListener('pointerdown', this.handlePointerDown);
    this.element.removeEventListener('pointermove', this.handlePointerMove);
    this.element.removeEventListener('pointerup', this.handlePointerUp);
    this.element.removeEventListener('pointercancel', this.handlePointerUp);
    
    this.touchEvents.clear();
    this.activePenId = null;
  }
}

/**
 * Ultra-low-latency drawing with prediction
 */
export class PredictiveStrokeController {
  private points: Array<{ x: number; y: number; timestamp: number }> = [];
  private predictedPoint: { x: number; y: number } | null = null;
  private predictionAmount: number = 0.05; // 50ms prediction

  /**
   * Add point to stroke history
   * @param x X coordinate
   * @param y Y coordinate
   * @returns Predicted next point
   */
  public addPoint(x: number, y: number): { x: number; y: number } | null {
    const now = performance.now();
    const point = { x, y, timestamp: now };
    
    // Add point to history
    this.points.push(point);
    
    // Keep only last few points for prediction
    if (this.points.length > 10) {
      this.points.shift();
    }
    
    // Update prediction
    this.updatePrediction();
    
    return this.predictedPoint;
  }

  /**
   * Update prediction based on point history
   */
  private updatePrediction(): void {
    if (this.points.length < 3) {
      this.predictedPoint = null;
      return;
    }
    
    const last = this.points[this.points.length - 1];
    const prev = this.points[this.points.length - 2];
    const prevPrev = this.points[this.points.length - 3];
    
    // Calculate velocities
    const timeDeltaRecent = last.timestamp - prev.timestamp;
    const timeDeltaPrev = prev.timestamp - prevPrev.timestamp;
    
    if (timeDeltaRecent === 0 || timeDeltaPrev === 0) {
      this.predictedPoint = null;
      return;
    }
    
    const velocityXRecent = (last.x - prev.x) / timeDeltaRecent;
    const velocityYRecent = (last.y - prev.y) / timeDeltaRecent;
    
    const velocityXPrev = (prev.x - prevPrev.x) / timeDeltaPrev;
    const velocityYPrev = (prev.y - prevPrev.y) / timeDeltaPrev;
    
    // Calculate acceleration
    const accelerationX = (velocityXRecent - velocityXPrev) / ((timeDeltaRecent + timeDeltaPrev) / 2);
    const accelerationY = (velocityYRecent - velocityYPrev) / ((timeDeltaRecent + timeDeltaPrev) / 2);
    
    // Predict next point including acceleration
    const predictedX = last.x + velocityXRecent * this.predictionAmount * 1000 + 
                      0.5 * accelerationX * Math.pow(this.predictionAmount * 1000, 2);
    const predictedY = last.y + velocityYRecent * this.predictionAmount * 1000 + 
                      0.5 * accelerationY * Math.pow(this.predictionAmount * 1000, 2);
    
    this.predictedPoint = { x: predictedX, y: predictedY };
  }

  /**
   * Get predicted point
   * @returns Predicted point
   */
  public getPredictedPoint(): { x: number; y: number } | null {
    return this.predictedPoint;
  }

  /**
   * Set prediction amount in seconds
   * @param amount Prediction amount in seconds
   */
  public setPredictionAmount(amount: number): void {
    this.predictionAmount = amount;
  }

  /**
   * Reset prediction
   */
  public reset(): void {
    this.points = [];
    this.predictedPoint = null;
  }
}
