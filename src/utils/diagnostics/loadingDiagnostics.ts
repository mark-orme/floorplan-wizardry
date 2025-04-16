
/**
 * Loading Diagnostics Utility
 * Specialized diagnostics for page loading and initialization issues
 * @module utils/diagnostics/loadingDiagnostics
 */

import { captureMessage } from '@/utils/sentryUtils';
import logger from '@/utils/logger';

// Track initialization status of critical systems
const systemStatus: Record<string, boolean> = {};
const systemTimings: Record<string, number> = {};
const startTime = Date.now();

/**
 * Mark a system as initialized
 * @param system System name
 * @param status Whether initialization was successful
 */
export function markSystemInitialized(system: string, status: boolean = true): void {
  systemStatus[system] = status;
  systemTimings[system] = Date.now() - startTime;
  
  // Log to console
  if (status) {
    logger.info(`System '${system}' initialized (${systemTimings[system]}ms)`);
  } else {
    logger.warn(`System '${system}' initialization failed (${systemTimings[system]}ms)`);
  }
  
  // After multiple systems are initialized, report initialization sequence
  if (Object.keys(systemStatus).length >= 3) {
    reportInitializationSequence();
  }
}

/**
 * Check if critical systems are initialized
 * @returns Status object with system initialization state
 */
export function checkCriticalSystems(): { 
  ready: boolean; 
  systems: Record<string, boolean>;
} {
  const criticalSystems = ['react', 'canvas', 'sentry', 'csp'];
  const results: Record<string, boolean> = {};
  
  criticalSystems.forEach(system => {
    results[system] = !!systemStatus[system];
  });
  
  const ready = criticalSystems.every(system => systemStatus[system]);
  
  return {
    ready,
    systems: results
  };
}

/**
 * Report the initialization sequence to Sentry
 */
function reportInitializationSequence(): void {
  // Create a sequence chart of initialization
  const sequence = Object.entries(systemTimings)
    .sort(([, timeA], [, timeB]) => timeA - timeB)
    .map(([system, time], index) => ({
      step: index + 1,
      system,
      timeMs: time,
      status: systemStatus[system] ? 'success' : 'failed'
    }));
  
  // Check for issues in initialization
  const failedSystems = Object.entries(systemStatus)
    .filter(([, status]) => !status)
    .map(([system]) => system);
  
  const hasCriticalFailure = failedSystems.length > 0;
  
  // Report to Sentry
  captureMessage(
    hasCriticalFailure 
      ? `Application initialization failed: ${failedSystems.join(', ')}` 
      : 'Application initialization sequence',
    'app-init-sequence',
    {
      level: hasCriticalFailure ? 'error' : 'info',
      tags: {
        component: 'loading-diagnostics',
        has_failures: String(hasCriticalFailure),
        failure_count: String(failedSystems.length)
      },
      extra: {
        sequence,
        failedSystems,
        totalInitTime: Math.max(...Object.values(systemTimings))
      }
    }
  );
}

/**
 * Collect network diagnostics
 * @returns Network diagnostic information
 */
export function collectNetworkDiagnostics(): Record<string, any> {
  const diagnostics: Record<string, any> = {};
  
  try {
    // Check navigator.connection if available
    if (navigator.connection) {
      const conn = navigator.connection as any;
      diagnostics.connection = {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    
    // Collect resource timing for JS and CSS files
    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Filter for JS and CSS resources
      const criticalResources = resources.filter(res => {
        const url = res.name;
        return url.endsWith('.js') || url.endsWith('.css');
      });
      
      // Get the slowest resources
      const slowestResources = criticalResources
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
        .map(res => ({
          url: res.name,
          duration: Math.round(res.duration),
          size: res.encodedBodySize,
          type: res.initiatorType
        }));
      
      diagnostics.slowestResources = slowestResources;
      
      // Calculate overall stats
      diagnostics.resourceStats = {
        totalJsCount: resources.filter(res => res.name.endsWith('.js')).length,
        totalCssCount: resources.filter(res => res.name.endsWith('.css')).length,
        averageJsDuration: Math.round(
          resources.filter(res => res.name.endsWith('.js'))
            .reduce((sum, res) => sum + res.duration, 0) / 
          (resources.filter(res => res.name.endsWith('.js')).length || 1)
        ),
        averageCssDuration: Math.round(
          resources.filter(res => res.name.endsWith('.css'))
            .reduce((sum, res) => sum + res.duration, 0) /
          (resources.filter(res => res.name.endsWith('.css')).length || 1)
        )
      };
    }
    
    // Check for any 4xx or 5xx responses
    if (window.performance && window.performance.getEntries) {
      try {
        const entries = window.performance.getEntries() as any[];
        const failedResources = entries
          .filter(entry => entry.responseStatus >= 400)
          .map(entry => ({
            url: entry.name,
            status: entry.responseStatus
          }));
        
        if (failedResources.length > 0) {
          diagnostics.failedResources = failedResources;
        }
      } catch (e) {
        diagnostics.entriesError = String(e);
      }
    }
  } catch (e) {
    diagnostics.error = String(e);
  }
  
  return diagnostics;
}

/**
 * Create a loading diagnostics report
 * @returns Comprehensive diagnostic report
 */
export function createLoadingDiagnosticsReport(): Record<string, any> {
  const report = {
    timestamp: new Date().toISOString(),
    systemStatus,
    systemTimings,
    criticalSystemCheck: checkCriticalSystems(),
    networkDiagnostics: collectNetworkDiagnostics(),
    browserInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      url: window.location.href,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        pixelRatio: window.devicePixelRatio
      }
    }
  };
  
  return report;
}

/**
 * Send a diagnostic report to Sentry
 * @param summary Optional summary text
 */
export function reportLoadingDiagnostics(summary?: string): void {
  const report = createLoadingDiagnosticsReport();
  
  captureMessage(
    summary || 'Loading diagnostics report',
    'loading-diagnostics',
    {
      level: report.criticalSystemCheck.ready ? 'info' : 'error',
      tags: {
        component: 'loading-diagnostics',
        all_systems_ready: String(report.criticalSystemCheck.ready)
      },
      extra: {
        report
      }
    }
  );
}

// Export module
export default {
  markSystemInitialized,
  checkCriticalSystems,
  collectNetworkDiagnostics,
  createLoadingDiagnosticsReport,
  reportLoadingDiagnostics
};
