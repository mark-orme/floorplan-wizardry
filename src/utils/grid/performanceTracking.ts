
/**
 * Grid performance tracking
 * @module utils/grid/performanceTracking
 */
import logger from '@/utils/logger';

/**
 * Track grid creation performance
 * @param startTime - Time when grid creation started
 * @param objectCount - Number of grid objects created
 * @returns Performance metrics
 */
export function trackGridCreationPerformance(
  startTime: number,
  objectCount: number
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
  
  logger.debug('Grid creation performance:', metrics);
  return metrics;
}
