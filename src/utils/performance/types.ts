
/**
 * Performance metrics type definitions
 * @module utils/performance/types
 */

export interface ResourceStats {
  name: string;
  size: number;
  type: string;
}

export interface ResourceTypeStats {
  count: number;
  size: number;
}

export interface ResourceStatsSummary {
  totalRequests: number;
  totalSize: number;
  byType: Record<string, ResourceTypeStats>;
}

export interface PerformanceMetrics {
  timeToFirstByte: number;
  timeToFirstPaint: number;
  timeToFirstContentfulPaint: number;
  domContentLoaded: number;
  domInteractive: number;
  loadComplete: number;
  resourceStats: ResourceStatsSummary;
}

/**
 * Badge type for performance metrics display
 */
export type BadgeType = 'good' | 'warning' | 'bad';
