
/**
 * Performance metrics collection utilities
 * @module utils/performance/collector
 */
import { PerformanceMetrics } from './types';
import { getResourceType } from './resourceUtils';

/**
 * Collect performance metrics from the browser
 */
export const collectPerformanceMetrics = (): PerformanceMetrics => {
  const perfEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintEntries = performance.getEntriesByType('paint');
  const resourceEntries = performance.getEntriesByType('resource');
  
  // Extract paint timing
  const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
  const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
  
  // Process resource stats
  const resourceStats = {
    totalRequests: resourceEntries.length,
    totalSize: resourceEntries.reduce((total, entry) => {
      // Using type assertion with a runtime check for transferSize
      const resourceEntry = entry as PerformanceResourceTiming;
      return total + (resourceEntry.transferSize || 0);
    }, 0),
    byType: {} as Record<string, { count: number, size: number }>
  };
  
  // Group resources by type
  resourceEntries.forEach(entry => {
    const resourceEntry = entry as PerformanceResourceTiming;
    const url = resourceEntry.name;
    const extension = url.split('.').pop()?.split('?')[0] || 'unknown';
    const type = getResourceType(extension);
    
    if (!resourceStats.byType[type]) {
      resourceStats.byType[type] = { count: 0, size: 0 };
    }
    
    resourceStats.byType[type].count += 1;
    resourceStats.byType[type].size += (resourceEntry.transferSize || 0);
  });
  
  return {
    timeToFirstByte: perfEntries.responseStart,
    timeToFirstPaint: firstPaint,
    timeToFirstContentfulPaint: firstContentfulPaint,
    domContentLoaded: perfEntries.domContentLoadedEventEnd,
    domInteractive: perfEntries.domInteractive,
    loadComplete: perfEntries.loadEventEnd,
    resourceStats
  };
};
