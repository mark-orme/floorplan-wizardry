
/**
 * Grid performance tracking
 * @module utils/grid/performanceTracking
 */
import logger from '@/utils/logger';
import { startCanvasTransaction } from '@/utils/sentry/performance';
import { Canvas as FabricCanvas } from 'fabric';

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
): Record<string, any> {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  const metrics = {
    startTime,
    endTime,
    duration,
    objectCount,
    objectsPerMillisecond: objectCount / duration
  };
  
  // Create a transaction to track the grid creation performance
  const transaction = startCanvasTransaction('grid.creation', canvas, {
    duration,
    objectCount
  });
  transaction.finish('ok');
  
  logger.debug('Grid creation performance:', metrics);
  return metrics;
}
