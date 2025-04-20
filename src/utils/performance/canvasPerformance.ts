
import { Canvas as FabricCanvas } from 'fabric';
import { PerformanceMetrics } from '@/types/core/PerformanceMetrics';

/**
 * Collect performance metrics for a canvas
 * @param canvas Fabric canvas instance
 * @returns Performance metrics object
 */
export function collectCanvasPerformanceMetrics(canvas: FabricCanvas): PerformanceMetrics {
  const now = performance.now();
  let renderTime = 0;
  
  // Get render time if available
  if (canvas.__lastRenderTime) {
    renderTime = now - canvas.__lastRenderTime;
  }
  
  // Calculate frame rate (inverse of render time)
  const frameRate = renderTime > 0 ? 1000 / renderTime : 60;
  
  // Count canvas objects
  const objectCount = canvas.getObjects().length;
  
  // Get memory usage if available
  let memoryUsage: number | undefined;
  if (window.performance && 'memory' in window.performance) {
    memoryUsage = (window.performance as any).memory.usedJSHeapSize;
  }
  
  // Create metrics object
  const metrics: PerformanceMetrics = {
    frameRate,
    renderTime,
    objectCount,
    memoryUsage,
    timestamp: now
  };
  
  return metrics;
}

/**
 * Track canvas render performance
 * @param canvas Fabric canvas instance
 * @param callback Function to call with metrics after render
 * @returns Cleanup function
 */
export function trackCanvasPerformance(
  canvas: FabricCanvas,
  callback: (metrics: PerformanceMetrics) => void
): () => void {
  // Before render handler
  const handleBeforeRender = () => {
    canvas.__lastRenderTime = performance.now();
  };
  
  // After render handler
  const handleAfterRender = () => {
    const metrics = collectCanvasPerformanceMetrics(canvas);
    callback(metrics);
  };
  
  // Add event listeners
  canvas.on('before:render', handleBeforeRender);
  canvas.on('after:render', handleAfterRender);
  
  // Return cleanup function
  return () => {
    canvas.off('before:render', handleBeforeRender);
    canvas.off('after:render', handleAfterRender);
  };
}
