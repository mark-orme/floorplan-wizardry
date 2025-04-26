
/**
 * Grid error tracking utilities
 * @module utils/grid/gridErrorTracker
 */
import { Canvas } from 'fabric';
import logger from '@/utils/logger';
import { captureMessage } from '@/utils/sentry';

/**
 * Track a grid error that occurred
 * @param message Error message
 * @param category Error category
 * @param data Additional error data
 */
export function trackGridError(
  message: string, 
  category: string,
  data?: Record<string, unknown>
): void {
  // Log the error
  logger.error(`Grid Error [${category}]: ${message}`, data || {});
  
  // Send to Sentry
  captureMessage(message, `grid-error-${category}`, {
    level: 'error',
    tags: {
      category,
      component: 'grid'
    },
    extra: data
  });
}

/**
 * Check canvas health for grid operations
 * @param canvas Canvas to check
 * @returns Canvas health check result
 */
export function checkCanvasHealth(canvas: Canvas | null): {
  canvasValid: boolean;
  issues: string[];
  canvasState?: Record<string, unknown>;
} {
  const issues: string[] = [];
  
  // Check if canvas exists
  if (!canvas) {
    issues.push('Canvas is null or undefined');
    return {
      canvasValid: false,
      issues
    };
  }
  
  const canvasState: Record<string, unknown> = {};
  
  // Check dimensions
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    issues.push(`Invalid canvas dimensions: ${canvas.width}x${canvas.height}`);
    canvasState.dimensions = { width: canvas.width, height: canvas.height };
  }
  
  // Check if essential methods exist
  if (typeof canvas.getObjects !== 'function') {
    issues.push('Canvas is missing getObjects method');
  }
  
  if (typeof canvas.add !== 'function') {
    issues.push('Canvas is missing add method');
  }
  
  if (typeof canvas.remove !== 'function') {
    issues.push('Canvas is missing remove method');
  }
  
  // Check canvas zoom
  try {
    const zoom = canvas.getZoom();
    canvasState.zoom = zoom;
    
    if (zoom <= 0) {
      issues.push(`Invalid zoom level: ${zoom}`);
    }
  } catch (error) {
    issues.push('Error getting canvas zoom');
    canvasState.zoomError = error instanceof Error ? error.message : String(error);
  }
  
  // Record object count
  try {
    canvasState.objectCount = canvas.getObjects().length;
  } catch (error) {
    issues.push('Error getting canvas objects');
    canvasState.objectError = error instanceof Error ? error.message : String(error);
  }
  
  return {
    canvasValid: issues.length === 0,
    issues,
    canvasState
  };
}

/**
 * Track grid operation performance
 * @param operation Operation name
 * @param startTime Start time
 * @param data Additional data
 */
export function trackGridOperation(
  operation: string,
  startTime: number,
  data?: Record<string, unknown>
): void {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  logger.debug(`Grid operation "${operation}" took ${duration.toFixed(2)}ms`, {
    operation,
    duration,
    ...data
  });
  
  // Track slow operations
  if (duration > 100) {
    logger.warn(`Slow grid operation: "${operation}" took ${duration.toFixed(2)}ms`, {
      operation,
      duration,
      ...data
    });
  }
}
