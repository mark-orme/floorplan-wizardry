
/**
 * Canvas performance monitoring utilities
 * @module utils/performance/canvasPerformance
 */
import { Canvas as FabricCanvas } from 'fabric';
import { asExtendedCanvas } from '@/types/canvas/ExtendedCanvas';

/**
 * Record rendering time for performance metrics
 * @param canvas Fabric Canvas instance
 */
export function recordRenderTime(canvas: FabricCanvas): void {
  if (!canvas) return;
  
  const extCanvas = asExtendedCanvas(canvas);
  const now = performance.now();
  const lastRenderTime = extCanvas.__lastRenderTime || 0;
  const elapsed = now - lastRenderTime;
  
  // Store rendering metrics
  extCanvas.__lastRenderTime = now;
  extCanvas.__frameCount = (extCanvas.__frameCount || 0) + 1;
  
  // Update performance metrics every second
  if (!extCanvas.__performanceMetrics) {
    extCanvas.__performanceMetrics = {
      fps: 0,
      renderTime: 0,
      objectCount: 0,
      lastUpdate: now
    };
  }
  
  if (now - extCanvas.__performanceMetrics.lastUpdate > 1000) {
    // Calculate FPS
    const fps = extCanvas.__frameCount || 0;
    extCanvas.__frameCount = 0;
    
    // Update metrics
    extCanvas.__performanceMetrics = {
      fps,
      renderTime: elapsed,
      objectCount: canvas.getObjects()?.length || 0,
      lastUpdate: now
    };
  }
}

/**
 * Get current performance metrics from canvas
 * @param canvas Fabric Canvas instance
 * @returns Performance metrics object
 */
export function getPerformanceMetrics(canvas: FabricCanvas) {
  if (!canvas) return null;
  
  const extCanvas = asExtendedCanvas(canvas);
  return extCanvas.__performanceMetrics || {
    fps: 0,
    renderTime: 0,
    objectCount: 0,
    lastUpdate: 0
  };
}
