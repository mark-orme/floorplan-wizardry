
/**
 * Performance Budgets Utility
 * Defines and enforces performance budgets for the application
 */
import type { PerformanceMetrics } from '@/types/core/Performance';

/**
 * Performance budget thresholds
 */
export interface PerformanceBudgets {
  fps: number;
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  maxObjectCount: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
}

/**
 * Default performance budgets
 */
export const DEFAULT_PERFORMANCE_BUDGETS: PerformanceBudgets = {
  fps: 30, // Minimum acceptable FPS
  loadTime: 2000, // Maximum load time in ms
  renderTime: 16, // Maximum render time per frame in ms (60fps)
  memoryUsage: 100 * 1024 * 1024, // Maximum memory usage in bytes (100MB)
  maxObjectCount: 5000, // Maximum number of objects in canvas
  firstPaint: 1000, // Maximum time to first paint in ms
  firstContentfulPaint: 1500, // Maximum time to first contentful paint in ms
  timeToInteractive: 3000, // Maximum time to interactive in ms
};

/**
 * Check if performance metrics meet budget requirements
 * @param metrics Current performance metrics
 * @param budgets Performance budgets
 * @returns Object containing compliance status and violations
 */
export function checkPerformanceBudget(
  metrics: Partial<PerformanceMetrics>,
  budgets: PerformanceBudgets = DEFAULT_PERFORMANCE_BUDGETS
): { complies: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // Check each budget
  if (metrics.fps !== undefined && metrics.fps < budgets.fps) {
    violations.push(`FPS (${metrics.fps}) is below budget (${budgets.fps})`);
  }
  
  if (metrics.loadTime !== undefined && metrics.loadTime > budgets.loadTime) {
    violations.push(`Load time (${metrics.loadTime}ms) exceeds budget (${budgets.loadTime}ms)`);
  }
  
  if (metrics.renderTime !== undefined && metrics.renderTime > budgets.renderTime) {
    violations.push(`Render time (${metrics.renderTime}ms) exceeds budget (${budgets.renderTime}ms)`);
  }
  
  if (metrics.memoryUsage !== undefined && metrics.memoryUsage > budgets.memoryUsage) {
    const memoryMB = Math.round(metrics.memoryUsage / (1024 * 1024));
    const budgetMB = Math.round(budgets.memoryUsage / (1024 * 1024));
    violations.push(`Memory usage (${memoryMB}MB) exceeds budget (${budgetMB}MB)`);
  }
  
  return {
    complies: violations.length === 0,
    violations
  };
}

/**
 * Log performance metrics and budget compliance
 * @param metrics Current performance metrics
 * @param budgets Performance budgets
 */
export function logPerformanceMetrics(
  metrics: Partial<PerformanceMetrics>,
  budgets: PerformanceBudgets = DEFAULT_PERFORMANCE_BUDGETS
): void {
  const { complies, violations } = checkPerformanceBudget(metrics, budgets);
  
  console.group('Performance Metrics');
  console.log(`FPS: ${metrics.fps || 'N/A'}`);
  console.log(`Load Time: ${metrics.loadTime || 'N/A'}ms`);
  console.log(`Render Time: ${metrics.renderTime || 'N/A'}ms`);
  
  if (metrics.memoryUsage !== undefined) {
    const memoryMB = Math.round(metrics.memoryUsage / (1024 * 1024));
    console.log(`Memory Usage: ${memoryMB}MB`);
  } else {
    console.log('Memory Usage: N/A');
  }
  
  console.log(`Budget Compliance: ${complies ? 'Yes ✅' : 'No ❌'}`);
  
  if (violations.length > 0) {
    console.group('Budget Violations');
    violations.forEach(violation => console.warn(violation));
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Create a performance report
 * @param metrics Current performance metrics
 * @param budgets Performance budgets
 * @returns Performance report object
 */
export function createPerformanceReport(
  metrics: Partial<PerformanceMetrics>,
  budgets: PerformanceBudgets = DEFAULT_PERFORMANCE_BUDGETS
): {
  metrics: Partial<PerformanceMetrics>;
  budgets: PerformanceBudgets;
  complies: boolean;
  violations: string[];
  timestamp: string;
} {
  const { complies, violations } = checkPerformanceBudget(metrics, budgets);
  
  return {
    metrics,
    budgets,
    complies,
    violations,
    timestamp: new Date().toISOString()
  };
}

/**
 * Send performance report to server for monitoring
 * @param report Performance report
 * @param endpoint Server endpoint
 */
export async function sendPerformanceReport(
  report: ReturnType<typeof createPerformanceReport>,
  endpoint: string = '/api/performance-report'
): Promise<void> {
  try {
    // Add CSRF protection
    const { addCsrfHeader } = await import('../security/csrfProtection');
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...addCsrfHeader()
      },
      body: JSON.stringify(report)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send performance report: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send performance report:', error);
  }
}
