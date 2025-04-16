
/**
 * Canvas performance monitoring utilities
 * @module utils/canvas/monitoring/performanceMonitoring
 */

import { Canvas as FabricCanvas } from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';

/**
 * Track canvas render performance
 * @param canvas - The Fabric.js canvas instance
 * @param operation - The operation that triggered the render
 */
export const trackCanvasRenderPerformance = (
  canvas: FabricCanvas,
  operation: string
): void => {
  if (!canvas) return;
  
  const startTime = performance.now();
  
  // Set up post-render measurement
  const measureRenderTime = () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Log significant render times (>16ms = below 60fps)
    if (renderTime > 16) {
      console.warn(`Canvas render took ${renderTime.toFixed(2)}ms for ${operation}`);
      
      // Report very slow renders
      if (renderTime > 100) {
        captureMessage(`Slow canvas render: ${renderTime.toFixed(2)}ms`, 'canvas-performance', {
          level: 'warning',
          tags: {
            component: 'Canvas',
            operation,
            performance: 'render'
          },
          extra: {
            renderTime,
            objectCount: canvas.getObjects().length,
            viewportTransform: canvas.viewportTransform,
            timestamp: Date.now()
          }
        });
      }
    }
    
    // Clean up event listener
    canvas.off('after:render', measureRenderTime);
  };
  
  // Listen for render completion
  canvas.on('after:render', measureRenderTime);
};

/**
 * Measure canvas operation performance
 * @param operationName - Name of the operation being measured
 * @param operation - Function to measure
 * @returns Result of the operation
 */
export function measureCanvasOperation<T>(
  operationName: string,
  operation: () => T
): T {
  const startTime = performance.now();
  const result = operation();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Log significant operation times
  if (duration > 50) {
    console.warn(`Canvas operation '${operationName}' took ${duration.toFixed(2)}ms`);
    
    // Report very slow operations
    if (duration > 200) {
      captureMessage(`Slow canvas operation: ${operationName} (${duration.toFixed(2)}ms)`, 'canvas-performance', {
        level: 'warning',
        tags: {
          component: 'Canvas',
          operation: operationName,
          performance: 'operation'
        },
        extra: {
          duration,
          timestamp: Date.now()
        }
      });
    }
  }
  
  return result;
}
