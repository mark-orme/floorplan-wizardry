
/**
 * Grid performance tracking
 * @module utils/grid/performanceTracking
 */
import logger from '@/utils/logger';
import { startCanvasTransaction } from '@/utils/sentry/performance';
import { Canvas as FabricCanvas } from 'fabric';

// Performance metric record
interface GridPerformanceMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  objectCount: number;
  objectsPerMillisecond: number;
  gridDensity?: number;
  canvasSize?: { width: number; height: number };
}

/**
 * Track grid creation performance
 * @param startTime - Time when grid creation started
 * @param objectCount - Number of grid objects created
 * @param canvas - Fabric canvas instance
 * @returns Performance metrics
 */
export function trackGridCreationPerformance(
  startTime: number,
  objectCount: number,
  canvas: FabricCanvas | null = null
): GridPerformanceMetrics {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  const metrics: GridPerformanceMetrics = {
    startTime,
    endTime,
    duration,
    objectCount,
    objectsPerMillisecond: objectCount / duration
  };
  
  // Add canvas dimensions if available
  if (canvas) {
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    metrics.canvasSize = { width: canvasWidth, height: canvasHeight };
    
    // Calculate grid density (objects per 1000 square pixels)
    if (canvasWidth > 0 && canvasHeight > 0) {
      const canvasArea = canvasWidth * canvasHeight;
      metrics.gridDensity = (objectCount * 1000) / canvasArea;
    }
  }
  
  // Create a transaction to track the grid creation performance
  const transaction = startCanvasTransaction('grid.creation', canvas, {
    duration,
    objectCount
  });
  transaction.finish('ok');
  
  logger.debug('Grid creation performance:', metrics);
  return metrics;
}

/**
 * Track grid rendering performance
 * @param canvas - Canvas instance
 * @param gridType - Type of grid being rendered
 * @returns Render timing information
 */
export function measureGridRenderPerformance(
  canvas: FabricCanvas,
  gridType: string
): Record<string, unknown> {
  if (!canvas) {
    return { error: 'Canvas is null', completed: false };
  }
  
  const startTime = performance.now();
  let objectCount = 0;
  
  try {
    // Force a render
    canvas.requestRenderAll();
    
    // Count grid objects
    objectCount = canvas.getObjects().filter(obj => 
      (obj as { objectType?: string }).objectType === 'grid' || 
      (obj as { isGrid?: boolean }).isGrid === true
    ).length;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    const metrics = {
      gridType,
      renderTime: duration,
      objectCount,
      objectsPerMs: objectCount / Math.max(0.1, duration),
      completed: true
    };
    
    return metrics;
  } catch (error) {
    const endTime = performance.now();
    
    return {
      gridType,
      error: error instanceof Error ? error.message : String(error),
      partialRenderTime: endTime - startTime,
      objectCount,
      completed: false
    };
  }
}
