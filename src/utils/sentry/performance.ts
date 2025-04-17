
/**
 * @deprecated This file has been refactored into separate modules.
 * Import directly from '@/utils/sentry/performance' instead.
 * This file will be removed in a future version.
 */

import { 
  type PerformanceTransaction,
  startPerformanceTransaction,
  finishPerformanceTransaction
} from './performance/core';

import {
  startCanvasTransaction,
  startCanvasTracking
} from './performance/canvas';

import {
  measurePerformance
} from './performance/metrics';

export {
  type PerformanceTransaction,
  startPerformanceTransaction,
  finishPerformanceTransaction,
  startCanvasTransaction, 
  startCanvasTracking,
  measurePerformance
};
