/**
 * Performance monitoring utilities
 * For tracking and optimizing rendering performance
 */

export interface PerformanceEntry {
  timestamp: number;
  duration: number;
  operation: string;
  details?: any;
}

/**
 * Performance monitor for tracking rendering performance
 */
export class PerformanceMonitor {
  private static readonly MAX_ENTRIES = 100;
  private static instance: PerformanceMonitor;
  
  private entries: PerformanceEntry[] = [];
  private enabled: boolean = process.env.NODE_ENV === 'development';
  private perfCallback: ((entries: PerformanceEntry[]) => void) | null = null;
  private frameStartTime: number = 0;
  private frameCount: number = 0;
  private fpsUpdateInterval: number = 1000; // ms
  private lastFpsUpdate: number = 0;
  private currentFps: number = 0;
  
  /**
   * Get singleton instance
   */
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * Private constructor (use getInstance)
   */
  private constructor() {
    // Start FPS tracking
    this.lastFpsUpdate = performance.now();
  }
  
  /**
   * Enable or disable performance monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    
    if (!enabled) {
      this.entries = [];
    }
  }
  
  /**
   * Start timing an operation
   * @returns Timing ID for use with endTiming
   */
  public startTiming(operation: string): number {
    if (!this.enabled) return -1;
    
    return performance.now();
  }
  
  /**
   * End timing an operation
   * @param id Timing ID from startTiming
   * @param operation Operation name
   * @param details Optional details about the operation
   */
  public endTiming(id: number, operation: string, details?: any): void {
    if (!this.enabled || id === -1) return;
    
    const now = performance.now();
    const duration = now - id;
    
    this.addEntry({
      timestamp: now,
      duration,
      operation,
      details
    });
    
    // Log warning if operation takes too long
    if (duration > 16) { // 16ms = ~60fps
      console.warn(`Slow operation "${operation}": ${duration.toFixed(2)}ms`);
    }
  }
  
  /**
   * Measure a function execution time
   * @param operation Operation name
   * @param fn Function to measure
   * @param details Optional details about the operation
   * @returns Function result
   */
  public measure<T>(operation: string, fn: () => T, details?: any): T {
    if (!this.enabled) return fn();
    
    const start = this.startTiming(operation);
    try {
      return fn();
    } finally {
      this.endTiming(start, operation, details);
    }
  }
  
  /**
   * Add performance entry
   */
  private addEntry(entry: PerformanceEntry): void {
    this.entries.push(entry);
    
    // Keep only the most recent entries
    if (this.entries.length > PerformanceMonitor.MAX_ENTRIES) {
      this.entries.shift();
    }
    
    // Notify callback if registered
    if (this.perfCallback) {
      this.perfCallback(this.entries);
    }
  }
  
  /**
   * Register callback for performance updates
   */
  public onPerformanceUpdate(callback: (entries: PerformanceEntry[]) => void): void {
    this.perfCallback = callback;
  }
  
  /**
   * Mark the start of a new frame
   */
  public beginFrame(): void {
    if (!this.enabled) return;
    
    this.frameStartTime = performance.now();
    this.frameCount++;
    
    // Update FPS calculation
    const now = this.frameStartTime;
    const elapsed = now - this.lastFpsUpdate;
    
    if (elapsed >= this.fpsUpdateInterval) {
      this.currentFps = (this.frameCount * 1000) / elapsed;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
      
      // Log current FPS
      console.log(`Current FPS: ${this.currentFps.toFixed(1)}`);
    }
  }
  
  /**
   * Mark the end of a frame
   */
  public endFrame(): void {
    if (!this.enabled) return;
    
    const frameDuration = performance.now() - this.frameStartTime;
    
    this.addEntry({
      timestamp: performance.now(),
      duration: frameDuration,
      operation: 'frame'
    });
    
    // Log warning if frame takes too long
    if (frameDuration > 16) { // 16ms = ~60fps
      console.warn(`Slow frame: ${frameDuration.toFixed(2)}ms (target: 16.67ms)`);
    }
  }
  
  /**
   * Get current FPS
   */
  public getFps(): number {
    return this.currentFps;
  }
  
  /**
   * Get frame time statistics
   */
  public getFrameTimeStats(): { avg: number; min: number; max: number; } {
    const frameEntries = this.entries.filter(entry => entry.operation === 'frame');
    
    if (frameEntries.length === 0) {
      return { avg: 0, min: 0, max: 0 };
    }
    
    const durations = frameEntries.map(entry => entry.duration);
    const avg = durations.reduce((sum, val) => sum + val, 0) / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    
    return { avg, min, max };
  }
  
  /**
   * Get performance entries
   */
  public getEntries(): PerformanceEntry[] {
    return [...this.entries];
  }
  
  /**
   * Clear all performance entries
   */
  public clearEntries(): void {
    this.entries = [];
  }
}

/**
 * Create a performance measurement decorator
 * @param operation Operation name
 */
export function measure(operation: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const monitor = PerformanceMonitor.getInstance();
      
      return monitor.measure(
        operation,
        () => originalMethod.apply(this, args),
        { args }
      );
    };
    
    return descriptor;
  };
}

/**
 * Create a performance measurement hook for React components
 * @param componentName Component name for tracking
 */
export function usePerformanceTracking(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    /**
     * Track a render operation
     * @param details Optional details about the render
     */
    trackRender: (details?: any) => {
      const id = monitor.startTiming(`${componentName}.render`);
      
      return () => {
        monitor.endTiming(id, `${componentName}.render`, details);
      };
    },
    
    /**
     * Track a callback operation
     * @param name Callback name
     * @param fn Function to track
     * @returns Tracked function
     */
    trackCallback: <T extends (...args: any[]) => any>(
      name: string,
      fn: T
    ): T => {
      return ((...args: any[]) => {
        return monitor.measure(
          `${componentName}.${name}`,
          () => fn(...args),
          { args }
        );
      }) as T;
    }
  };
}
