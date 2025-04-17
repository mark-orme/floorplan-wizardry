
/**
 * @deprecated This file has been refactored into separate modules.
 * Import directly from '@/utils/sentry/performance' instead.
 * This file will be removed in a future version.
 */

import { 
  type PerformanceTransaction,
  startPerformanceTransaction,
  finishPerformanceTransaction,
  startCanvasTransaction,
  startCanvasTracking,
  measurePerformance
} from './performance/index';

export {
  type PerformanceTransaction,
  startPerformanceTransaction,
  finishPerformanceTransaction,
  startCanvasTransaction, 
  startCanvasTracking,
  measurePerformance
};
