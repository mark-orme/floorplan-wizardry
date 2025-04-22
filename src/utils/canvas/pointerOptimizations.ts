
/**
 * Pointer and canvas optimizations
 * Provides utilities for enhancing canvas drawing performance
 */
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Check if event is from a pen/stylus
 * @param event The pointer event to check
 * @returns Whether the event is from a pen
 */
export const isPenEvent = (event: PointerEvent): boolean => {
  return event.pointerType === 'pen';
};

/**
 * Get coalesced events for smoother drawing
 * @param event The pointer event to get coalesced events from
 * @returns Array of coalesced events (or the original event if not supported)
 */
export const getCoalescedEvents = (event: PointerEvent): PointerEvent[] => {
  if ('getCoalescedEvents' in event) {
    const events = event.getCoalescedEvents();
    return events.length > 0 ? events : [event];
  }
  return [event];
};

/**
 * Configure palm rejection
 * Ignores touch events when a pen is active
 * @param element The canvas element
 * @returns Cleanup function
 */
export const configurePalmRejection = (element: HTMLCanvasElement): () => void => {
  let isPenDown = false;
  
  const handlePointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      isPenDown = true;
    } else if (e.pointerType === 'touch' && isPenDown) {
      // Block touch events when pen is down
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  const handlePointerUp = (e: PointerEvent) => {
    if (e.pointerType === 'pen') {
      isPenDown = false;
    }
  };
  
  // Add event listeners with capture to intercept events
  element.addEventListener('pointerdown', handlePointerDown, true);
  element.addEventListener('pointerup', handlePointerUp, true);
  element.addEventListener('pointercancel', handlePointerUp, true);
  
  // Touch events handler to block when pen is active
  const handleTouch = (e: TouchEvent) => {
    if (isPenDown) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  
  element.addEventListener('touchstart', handleTouch, { passive: false });
  element.addEventListener('touchmove', handleTouch, { passive: false });
  
  return () => {
    element.removeEventListener('pointerdown', handlePointerDown, true);
    element.removeEventListener('pointerup', handlePointerUp, true);
    element.removeEventListener('pointercancel', handlePointerUp, true);
    element.removeEventListener('touchstart', handleTouch);
    element.removeEventListener('touchmove', handleTouch);
  };
};

/**
 * Optimize canvas for drawing performance
 * @param canvas The canvas element to optimize
 */
export const optimizeCanvasForDrawing = (canvas: HTMLCanvasElement): void => {
  // Set up canvas for optimal drawing
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Fix for the TS error: check for property before setting
    if ('imageSmoothingEnabled' in ctx) {
      (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = true;
    }
    
    // Optimize canvas performance
    canvas.style.touchAction = 'none';
    canvas.style.msTouchAction = 'none';
    canvas.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
  }
};

/**
 * Set up WebGL rendering for a canvas
 * @param canvas The canvas element
 * @returns Cleanup function
 */
export const setupWebGLRendering = (canvas: HTMLCanvasElement): (() => void) => {
  // Implementation would go here
  return () => {
    // Cleanup
  };
};

/**
 * Frame timing utility for performance monitoring
 */
export class FrameTimer {
  private lastTime: number = 0;
  private frames: number = 0;
  private totalTime: number = 0;
  private rafId: number | null = null;
  private callback: ((fps: number, avgTime: number) => void) | null = null;
  
  /**
   * Start monitoring frame rate
   * @param callback Function to call with FPS updates
   */
  startMonitoring(callback: (fps: number, avgTime: number) => void): void {
    this.callback = callback;
    this.lastTime = performance.now();
    this.frames = 0;
    this.totalTime = 0;
    
    const updateFps = () => {
      const now = performance.now();
      const delta = now - this.lastTime;
      this.lastTime = now;
      
      this.frames++;
      this.totalTime += delta;
      
      if (this.totalTime >= 1000) {
        const fps = (this.frames * 1000) / this.totalTime;
        const avgTime = this.totalTime / this.frames;
        
        if (this.callback) {
          this.callback(fps, avgTime);
        }
        
        this.frames = 0;
        this.totalTime = 0;
      }
      
      this.rafId = requestAnimationFrame(updateFps);
    };
    
    this.rafId = requestAnimationFrame(updateFps);
  }
  
  /**
   * Stop monitoring frame rate
   */
  stopMonitoring(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
