
/**
 * Health Monitoring Utility
 * Provides application health metrics and diagnostics
 * @module utils/healthMonitoring
 */

import { captureMessage } from './sentryUtils';
import logger from './logger';

// Track application health metrics
interface HealthMetrics {
  // Initialization timestamps
  startTime: number;
  
  // Component load metrics
  componentLoadTimes: Record<string, number>;
  
  // Performance metrics
  performanceMarks: Record<string, number>;
  
  // Error counts by category
  errorCounts: Record<string, number>;
  
  // Initialization statuses
  initialized: Record<string, boolean>;
  
  // Rendering metrics
  renderCounts: Record<string, number>;
  
  // Resource loading status
  resourcesLoaded: Record<string, boolean>;
}

// Global health metrics
const healthMetrics: HealthMetrics = {
  startTime: Date.now(),
  componentLoadTimes: {},
  performanceMarks: {},
  errorCounts: {},
  initialized: {},
  renderCounts: {},
  resourcesLoaded: {}
};

/**
 * Mark a component as loaded
 * @param componentName Name of the component
 */
export function trackComponentLoad(componentName: string): void {
  healthMetrics.componentLoadTimes[componentName] = Date.now();
  
  // Track render count
  healthMetrics.renderCounts[componentName] = 
    (healthMetrics.renderCounts[componentName] || 0) + 1;
  
  // Log first render
  if (healthMetrics.renderCounts[componentName] === 1) {
    logger.info(`Component ${componentName} loaded for the first time`);
  }
}

/**
 * Mark a performance event
 * @param name Name of the performance event
 */
export function markPerformance(name: string): void {
  healthMetrics.performanceMarks[name] = Date.now();
  
  // Also set a performance mark if the API is available
  if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
    try {
      performance.mark(name);
    } catch (e) {
      logger.error(`Error setting performance mark ${name}:`, e);
    }
  }
}

/**
 * Track an error occurrence
 * @param category Error category
 */
export function trackError(category: string): void {
  healthMetrics.errorCounts[category] = 
    (healthMetrics.errorCounts[category] || 0) + 1;
  
  // Report high error counts
  if (healthMetrics.errorCounts[category] === 5) {
    captureMessage(`Multiple errors in category ${category}`, 'health-error-threshold', {
      level: 'warning',
      tags: {
        component: 'healthMonitoring',
        errorCategory: category
      },
      extra: {
        count: healthMetrics.errorCounts[category],
        metrics: getHealthSnapshot()
      }
    });
  }
}

/**
 * Mark a component or system as initialized
 * @param system System or component name
 * @param status Initialization status
 */
export function markInitialized(system: string, status: boolean = true): void {
  healthMetrics.initialized[system] = status;
  
  if (status) {
    logger.info(`System ${system} marked as initialized`);
  } else {
    logger.warn(`System ${system} initialization failed`);
    
    // Report initialization failure
    captureMessage(`Initialization failure: ${system}`, 'init-failure', {
      level: 'error',
      tags: {
        component: 'healthMonitoring',
        system
      }
    });
  }
}

/**
 * Mark a resource as loaded
 * @param resource Resource name
 * @param status Loading status
 */
export function markResourceLoaded(resource: string, status: boolean = true): void {
  healthMetrics.resourcesLoaded[resource] = status;
}

/**
 * Get a snapshot of the health metrics
 * @returns Current health metrics
 */
export function getHealthSnapshot(): any {
  const now = Date.now();
  const uptime = now - healthMetrics.startTime;
  
  return {
    uptime,
    startTime: new Date(healthMetrics.startTime).toISOString(),
    currentTime: new Date(now).toISOString(),
    metrics: {
      ...healthMetrics,
      // Add derived metrics
      componentLoadSummary: Object.entries(healthMetrics.componentLoadTimes).map(([name, time]) => ({
        name,
        loadTime: time - healthMetrics.startTime,
        loadedAt: new Date(time).toISOString()
      })),
      // Calculate initialization completeness
      initializationStatus: Object.entries(healthMetrics.initialized).reduce((acc, [name, status]) => {
        acc[name] = {
          status,
          description: status ? 'Initialized' : 'Failed'
        };
        return acc;
      }, {} as Record<string, any>),
      // Current URL
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }
  };
}

/**
 * Report health metrics to Sentry
 * Called periodically or on severe errors
 */
export function reportHealthMetrics(): void {
  const snapshot = getHealthSnapshot();
  
  // Look for critical issues
  const uninitializedSystems = Object.entries(healthMetrics.initialized)
    .filter(([_, status]) => !status)
    .map(([name]) => name);
  
  const highErrorCategories = Object.entries(healthMetrics.errorCounts)
    .filter(([_, count]) => count >= 5)
    .map(([name, count]) => ({ name, count }));
  
  const hasCriticalIssues = uninitializedSystems.length > 0 || highErrorCategories.length > 0;
  
  // Report to Sentry with appropriate level
  captureMessage(
    hasCriticalIssues 
      ? 'Critical health issues detected' 
      : 'Application health report',
    'health-metrics',
    {
      level: hasCriticalIssues ? 'error' : 'info',
      tags: {
        component: 'healthMonitoring',
        hasCriticalIssues: String(hasCriticalIssues)
      },
      extra: {
        snapshot,
        uninitializedSystems,
        highErrorCategories
      }
    }
  );
}

// Export default health monitoring
export default {
  trackComponentLoad,
  markPerformance,
  trackError,
  markInitialized,
  markResourceLoaded,
  getHealthSnapshot,
  reportHealthMetrics
};
