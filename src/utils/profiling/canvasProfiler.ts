
/**
 * Canvas Profiler Module
 * Utilities for performance profiling and monitoring canvas operations
 * @module utils/profiling/canvasProfiler
 */

interface CanvasOperationTiming {
  /** Operation name */
  operation: string;
  /** Start time of the operation */
  startTime: number;
  /** End time of the operation */
  endTime?: number;
  /** Duration of the operation in milliseconds */
  duration?: number;
  /** Additional metadata about the operation */
  metadata?: Record<string, any>;
}

interface CanvasProfilerOptions {
  /** Whether to enable detailed logging */
  enableLogging?: boolean;
  /** Performance threshold in ms to highlight slow operations */
  performanceThreshold?: number;
  /** Whether to report measurements to console */
  reportToConsole?: boolean;
}

/**
 * Canvas Profiler
 * Tracks performance metrics for canvas operations
 */
class CanvasProfiler {
  private operations: CanvasOperationTiming[] = [];
  private activeOperations: Map<string, CanvasOperationTiming> = new Map();
  private options: CanvasProfilerOptions = {
    enableLogging: false,
    performanceThreshold: 16, // ~60fps threshold
    reportToConsole: false
  };
  private enabled: boolean = false;

  /**
   * Initialize the canvas profiler
   * @param {CanvasProfilerOptions} options - Configuration options
   */
  initialize(options: CanvasProfilerOptions = {}): void {
    this.options = { ...this.options, ...options };
    this.enabled = true;
    
    if (this.options.reportToConsole) {
      console.info('Canvas Profiler initialized with options:', this.options);
    }
  }

  /**
   * Start timing an operation
   * @param {string} operationName - Name of the operation to time
   * @param {Record<string, any>} metadata - Additional context data
   * @returns {string} Unique operation ID
   */
  startOperation(operationName: string, metadata?: Record<string, any>): string {
    if (!this.enabled) return operationName;
    
    const operationId = `${operationName}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const timing: CanvasOperationTiming = {
      operation: operationName,
      startTime: performance.now(),
      metadata
    };
    
    this.activeOperations.set(operationId, timing);
    
    if (this.options.enableLogging) {
      console.debug(`[CanvasProfiler] Started: ${operationName}`, metadata);
    }
    
    return operationId;
  }

  /**
   * End timing for an operation
   * @param {string} operationId - ID of the operation to end
   */
  endOperation(operationId: string): void {
    if (!this.enabled) return;
    
    const timing = this.activeOperations.get(operationId);
    if (!timing) {
      console.warn(`[CanvasProfiler] No active operation found with ID: ${operationId}`);
      return;
    }
    
    timing.endTime = performance.now();
    timing.duration = timing.endTime - timing.startTime;
    
    this.operations.push(timing);
    this.activeOperations.delete(operationId);
    
    // Report slow operations
    if (timing.duration > (this.options.performanceThreshold || 16)) {
      console.warn(
        `[CanvasProfiler] Slow operation detected: ${timing.operation} took ${timing.duration.toFixed(2)}ms`,
        timing.metadata
      );
    } else if (this.options.enableLogging) {
      console.debug(
        `[CanvasProfiler] Completed: ${timing.operation} in ${timing.duration.toFixed(2)}ms`,
        timing.metadata
      );
    }
  }

  /**
   * Wrap a function with profiling
   * @param {string} operationName - Name of the operation
   * @param {Function} fn - Function to wrap
   * @param {Record<string, any>} metadata - Additional context data
   * @returns {Function} Wrapped function with profiling
   */
  profileFunction<T extends (...args: any[]) => any>(
    operationName: string,
    fn: T,
    metadata?: Record<string, any>
  ): (...args: Parameters<T>) => ReturnType<T> {
    if (!this.enabled) return fn;
    
    return (...args: Parameters<T>): ReturnType<T> => {
      const opId = this.startOperation(operationName, {
        ...metadata,
        arguments: this.options.enableLogging ? args : undefined
      });
      
      try {
        const result = fn(...args);
        
        // Handle promises
        if (result instanceof Promise) {
          return result
            .then(value => {
              this.endOperation(opId);
              return value;
            })
            .catch(error => {
              this.endOperation(opId);
              throw error;
            }) as ReturnType<T>;
        }
        
        this.endOperation(opId);
        return result;
      } catch (error) {
        this.endOperation(opId);
        throw error;
      }
    };
  }

  /**
   * Get performance report for all operations
   * @returns {Record<string, any>} Performance statistics
   */
  getPerformanceReport(): Record<string, any> {
    if (this.operations.length === 0) {
      return { message: 'No operations recorded' };
    }
    
    const operationGroups = this.operations.reduce((groups, op) => {
      const name = op.operation;
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(op);
      return groups;
    }, {} as Record<string, CanvasOperationTiming[]>);
    
    const report = Object.entries(operationGroups).map(([name, ops]) => {
      const durations = ops.map(op => op.duration || 0);
      const total = durations.reduce((sum, d) => sum + d, 0);
      const avg = total / durations.length;
      const max = Math.max(...durations);
      const min = Math.min(...durations);
      
      return {
        operation: name,
        count: ops.length,
        totalTime: total.toFixed(2),
        avgTime: avg.toFixed(2),
        maxTime: max.toFixed(2),
        minTime: min.toFixed(2)
      };
    });
    
    return {
      summary: {
        totalOperations: this.operations.length,
        uniqueOperations: Object.keys(operationGroups).length,
        totalTime: this.operations.reduce((sum, op) => sum + (op.duration || 0), 0).toFixed(2)
      },
      operations: report
    };
  }

  /**
   * Reset all recorded metrics
   */
  reset(): void {
    this.operations = [];
    this.activeOperations.clear();
    
    if (this.options.reportToConsole) {
      console.info('[CanvasProfiler] Metrics reset');
    }
  }

  /**
   * Disable the profiler
   */
  disable(): void {
    this.enabled = false;
    this.reset();
  }
}

// Create singleton instance
export const canvasProfiler = new CanvasProfiler();

/**
 * Higher-order function to profile async canvas operations
 * @param {string} operationName - Name of the operation
 * @param {Function} fn - Async function to profile
 * @returns {Function} Profiled async function
 */
export const profileCanvasOperation = <T extends (...args: any[]) => Promise<any>>(
  operationName: string,
  fn: T
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return canvasProfiler.profileFunction(operationName, fn);
};

/**
 * Mark the start of a canvas operation
 * @param {string} operationName - Name of the operation
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {string} Operation ID to be used with endCanvasOperation
 */
export const startCanvasOperation = (
  operationName: string,
  metadata?: Record<string, any>
): string => {
  return canvasProfiler.startOperation(operationName, metadata);
};

/**
 * Mark the end of a canvas operation
 * @param {string} operationId - ID from startCanvasOperation
 */
export const endCanvasOperation = (operationId: string): void => {
  canvasProfiler.endOperation(operationId);
};

/**
 * Get a performance report for all canvas operations
 * @returns {Record<string, any>} Performance report
 */
export const getCanvasPerformanceReport = (): Record<string, any> => {
  return canvasProfiler.getPerformanceReport();
};
