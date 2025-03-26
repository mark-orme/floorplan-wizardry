
/**
 * Canvas Profiler Hook
 * React hook for profiling Canvas component performance
 * @module hooks/useCanvasProfiler
 */
import { useCallback, useState, useRef, useEffect } from 'react';
import { 
  canvasProfiler, 
  startCanvasOperation, 
  endCanvasOperation, 
  getCanvasPerformanceReport
} from '@/utils/profiling/canvasProfiler';

interface UseCanvasProfilerOptions {
  /** Whether to enable profiling */
  enabled?: boolean;
  /** Whether to enable detailed logging */
  enableLogging?: boolean;
  /** Performance threshold in ms to highlight slow operations */
  performanceThreshold?: number;
  /** Whether to report measurements to console */
  reportToConsole?: boolean;
}

interface UseCanvasProfilerResult {
  /** Start profiling an operation */
  startOperation: (name: string, metadata?: Record<string, any>) => string;
  /** End profiling an operation */
  endOperation: (id: string) => void;
  /** Reset all profiling data */
  resetProfiling: () => void;
  /** Get performance report */
  getReport: () => Record<string, any>;
  /** Create a profile wrapper for a function */
  profileFn: <T extends Function>(name: string, fn: T) => T;
  /** Performance data for all operations */
  performanceData: Record<string, any>;
  /** Whether profiling is currently enabled */
  isEnabled: boolean;
  /** Toggle profiling on/off */
  toggleProfiling: () => void;
  /** Get operation time - for test compatibility */
  getOperationTime: (operationId: string) => number;
  /** Clear profile data - for test compatibility */
  clearProfileData: () => void;
}

/**
 * Hook for profiling Canvas component performance
 * 
 * @param {UseCanvasProfilerOptions} options - Profiler configuration options
 * @returns {UseCanvasProfilerResult} Profiling utilities and state
 */
export const useCanvasProfiler = (
  options: UseCanvasProfilerOptions = {}
): UseCanvasProfilerResult => {
  const [isEnabled, setIsEnabled] = useState(options.enabled ?? false);
  const [performanceData, setPerformanceData] = useState<Record<string, any>>({});
  const updateInterval = useRef<number | null>(null);

  // Initialize profiler
  useEffect(() => {
    if (isEnabled) {
      canvasProfiler.initialize({
        enableLogging: options.enableLogging ?? false,
        performanceThreshold: options.performanceThreshold ?? 16,
        reportToConsole: options.reportToConsole ?? false
      });
      
      // Set up interval to update performance data
      updateInterval.current = window.setInterval(() => {
        setPerformanceData(getCanvasPerformanceReport());
      }, 1000) as unknown as number;
    } else if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
    
    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
        updateInterval.current = null;
      }
    };
  }, [isEnabled, options.enableLogging, options.performanceThreshold, options.reportToConsole]);

  /**
   * Start profiling an operation
   * @param {string} name - Operation name
   * @param {Record<string, any>} metadata - Additional metadata
   * @returns {string} Operation ID
   */
  const startOperation = useCallback((name: string, metadata?: Record<string, any>): string => {
    return canvasProfiler.startOperation(name, metadata);
  }, []);

  /**
   * End profiling an operation
   * @param {string} id - Operation ID from startOperation
   */
  const endOperation = useCallback((id: string): void => {
    canvasProfiler.endOperation(id);
  }, []);

  /**
   * Reset all profiling data
   */
  const resetProfiling = useCallback((): void => {
    canvasProfiler.reset();
  }, []);

  /**
   * Get current performance report
   * @returns {Record<string, any>} Performance report
   */
  const getReport = useCallback((): Record<string, any> => {
    return canvasProfiler.getPerformanceReport();
  }, []);

  /**
   * Get operation time - for test compatibility
   * @param {string} operationId - Operation ID
   * @returns {number} Operation duration in ms
   */
  const getOperationTime = useCallback((operationId: string): number => {
    const report = canvasProfiler.getPerformanceReport();
    const operation = report.operations?.find((op: any) => op.id === operationId);
    return operation?.duration || 0;
  }, []);

  /**
   * Clear profile data - for test compatibility
   */
  const clearProfileData = useCallback((): void => {
    canvasProfiler.reset();
  }, []);

  /**
   * Create a profiled wrapper for a function
   * @param {string} name - Operation name
   * @param {Function} fn - Function to profile
   * @returns {Function} Profiled function
   */
  const profileFn = useCallback(<T extends Function>(name: string, fn: T): T => {
    const wrappedFn = ((...args: any[]) => {
      const opId = startOperation(name);
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return result.finally(() => endOperation(opId));
        }
        endOperation(opId);
        return result;
      } catch (error) {
        endOperation(opId);
        throw error;
      }
    }) as unknown as T;
    
    return wrappedFn;
  }, [startOperation, endOperation]);

  /**
   * Toggle profiling on/off
   */
  const toggleProfiling = useCallback((): void => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    startOperation,
    endOperation,
    resetProfiling,
    getReport,
    profileFn,
    performanceData,
    isEnabled,
    toggleProfiling,
    getOperationTime,
    clearProfileData
  };
};
