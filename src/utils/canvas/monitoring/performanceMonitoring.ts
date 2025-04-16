
/**
 * Canvas performance monitoring utilities
 * @module utils/canvas/monitoring/performanceMonitoring
 */
import { Canvas as FabricCanvas } from 'fabric';
import { ErrorCategory, ErrorSeverity } from './errorTypes';
import { reportCanvasError } from './errorReporting';

/**
 * Canvas performance metrics
 */
export interface CanvasPerformanceMetrics {
  objectCount: number;
  renderTime: number;
  fps: number;
  memoryUsage?: number;
  timestamp: number;
}

let lastRenderTime = 0;
let frameCount = 0;
let lastFpsUpdate = 0;
let currentFps = 0;

/**
 * Track canvas render performance
 * @param canvas Fabric canvas instance
 * @returns Performance metrics
 */
export function trackRenderPerformance(canvas: FabricCanvas | null): CanvasPerformanceMetrics | null {
  if (!canvas) return null;
  
  const startTime = performance.now();
  const objectCount = canvas.getObjects().length;
  
  // Update FPS calculation
  const now = Date.now();
  frameCount++;
  
  if (now - lastFpsUpdate >= 1000) {
    currentFps = frameCount;
    frameCount = 0;
    lastFpsUpdate = now;
  }
  
  // Get memory usage if available
  let memoryUsage: number | undefined;
  if (performance && (performance as any).memory) {
    memoryUsage = (performance as any).memory.usedJSHeapSize;
  }
  
  // Track render time
  canvas.once('after:render', () => {
    lastRenderTime = performance.now() - startTime;
    
    // Report if render time is excessive
    if (lastRenderTime > 100) {
      reportCanvasError(
        `Slow canvas rendering detected: ${lastRenderTime.toFixed(2)}ms`,
        ErrorCategory.PERFORMANCE,
        ErrorSeverity.MEDIUM,
        { objectCount, fps: currentFps }
      );
    }
  });
  
  return {
    objectCount,
    renderTime: lastRenderTime,
    fps: currentFps,
    memoryUsage,
    timestamp: now
  };
}

/**
 * Start monitoring canvas performance
 * @param canvas Fabric canvas instance
 * @param interval Monitoring interval in milliseconds
 * @param callback Optional callback for metrics
 * @returns Cleanup function
 */
export function monitorCanvasPerformance(
  canvas: FabricCanvas | null,
  interval: number = 5000,
  callback?: (metrics: CanvasPerformanceMetrics) => void
): () => void {
  if (!canvas) return () => {};
  
  const intervalId = setInterval(() => {
    const metrics = trackRenderPerformance(canvas);
    if (metrics && callback) {
      callback(metrics);
    }
  }, interval);
  
  return () => clearInterval(intervalId);
}
