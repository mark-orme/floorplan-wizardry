
/**
 * User interaction tracking with Sentry
 * @module utils/sentry/userInteractions
 */
import * as Sentry from '@sentry/react';
import { isSentryInitialized } from './core';
import logger from '../logger';

// Action categories for better organization
export enum InteractionCategory {
  DRAWING = 'drawing',
  NAVIGATION = 'navigation',
  SETTINGS = 'settings',
  CANVAS = 'canvas',
  FILE = 'file',
  TOOL = 'tool',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  USER = 'user',
  SYSTEM = 'system'
}

// Interaction severity for filtering important events
export enum InteractionSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Track a user interaction with enhanced metadata
 * 
 * @param {string} action - The user action (e.g., "change_tool", "save_canvas")
 * @param {InteractionCategory} category - Category of the action
 * @param {Record<string, unknown>} data - Additional data about the action
 * @param {InteractionSeverity} severity - Severity level of the interaction
 */
export function trackUserInteraction(
  action: string,
  category: InteractionCategory,
  data: Record<string, unknown> = {},
  severity: InteractionSeverity = InteractionSeverity.INFO
): void {
  if (!isSentryInitialized()) return;
  
  try {
    // Add timing information
    const enrichedData = {
      timestamp: new Date().toISOString(),
      sessionDuration: typeof window !== 'undefined' ? (Date.now() - (window as any).__sessionStartTime || 0) : 0,
      ...data
    };
    
    // Create a breadcrumb for the user action
    Sentry.addBreadcrumb({
      category: `user.${category}`,
      message: action,
      level: severity === InteractionSeverity.ERROR ? 'error' : 
             severity === InteractionSeverity.WARNING ? 'warning' : 'info',
      data: enrichedData
    });
    
    // Create a span for performance tracking if appropriate
    if (category === InteractionCategory.PERFORMANCE) {
      const transaction = Sentry.startTransaction({
        name: `perf.${action}`,
        op: 'measure'
      });
      
      // Store transaction for later completion
      if (typeof window !== 'undefined') {
        (window as any).__sentryTransactions = (window as any).__sentryTransactions || {};
        (window as any).__sentryTransactions[`${category}.${action}`] = transaction;
      }
    }
    
    // Log the interaction
    const logLevel = severity === InteractionSeverity.DEBUG ? 'debug' :
                     severity === InteractionSeverity.INFO ? 'info' :
                     severity === InteractionSeverity.WARNING ? 'warn' : 'error';
    
    logger[logLevel](`User interaction: ${category}.${action}`, enrichedData);
  } catch (error) {
    // Don't let tracking errors affect the application
    logger.error('Error tracking user interaction:', error);
  }
}

/**
 * Complete a performance transaction that was started earlier
 * 
 * @param {string} action - The action name used when starting the transaction
 * @param {string} status - The transaction status ('ok', 'error', etc)
 * @param {Record<string, unknown>} data - Additional data to include
 */
export function completePerformanceTransaction(
  action: string,
  status: 'ok' | 'error' | 'cancelled' = 'ok',
  data: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined' || 
      !(window as any).__sentryTransactions || 
      !(window as any).__sentryTransactions[`${InteractionCategory.PERFORMANCE}.${action}`]) {
    return;
  }
  
  try {
    const transaction = (window as any).__sentryTransactions[`${InteractionCategory.PERFORMANCE}.${action}`];
    
    // Add result data
    transaction.setData('result', {
      status,
      ...data
    });
    
    // Finish the transaction
    transaction.finish();
    
    // Remove from storage
    delete (window as any).__sentryTransactions[`${InteractionCategory.PERFORMANCE}.${action}`];
  } catch (error) {
    logger.error(`Error completing performance transaction for ${action}:`, error);
  }
}

/**
 * Track tool usage with enhanced metadata
 * 
 * @param {string} toolName - Name of the tool being used
 * @param {Record<string, unknown>} settings - Tool settings
 */
export function trackToolUsage(
  toolName: string,
  settings: Record<string, unknown> = {}
): void {
  trackUserInteraction('tool_selected', InteractionCategory.TOOL, {
    tool: toolName,
    ...settings
  });
}

/**
 * Track canvas operations with enhanced metadata
 * 
 * @param {string} operation - Canvas operation (e.g., "clear", "save", "export")
 * @param {Record<string, unknown>} metadata - Operation metadata
 * @param {InteractionSeverity} severity - Severity level of the operation
 */
export function trackCanvasOperation(
  operation: string,
  metadata: Record<string, unknown> = {},
  severity: InteractionSeverity = InteractionSeverity.INFO
): void {
  trackUserInteraction(operation, InteractionCategory.CANVAS, metadata, severity);
}

/**
 * Track user navigation between pages or views
 * 
 * @param {string} from - Source page/view
 * @param {string} to - Destination page/view
 * @param {Record<string, unknown>} metadata - Additional navigation data
 */
export function trackNavigation(
  from: string,
  to: string,
  metadata: Record<string, unknown> = {}
): void {
  trackUserInteraction('navigate', InteractionCategory.NAVIGATION, {
    from,
    to,
    ...metadata
  });
}

/**
 * Track user errors with context
 * 
 * @param {string} errorType - Type of error encountered
 * @param {Error|string} error - Error object or message
 * @param {Record<string, unknown>} context - Error context
 */
export function trackUserError(
  errorType: string,
  error: Error | string,
  context: Record<string, unknown> = {}
): void {
  const errorMsg = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  trackUserInteraction(errorType, InteractionCategory.ERROR, {
    message: errorMsg,
    stack: errorStack,
    ...context
  }, InteractionSeverity.ERROR);
}

/**
 * Create a higher-order function that tracks usage before executing
 * 
 * @param {Function} fn - Function to wrap with tracking
 * @param {string} action - Action name to track
 * @param {InteractionCategory} category - Category of the action
 * @returns {Function} - Wrapped function with tracking
 */
export function withInteractionTracking<T extends (...args: any[]) => any>(
  fn: T,
  action: string,
  category: InteractionCategory
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    // Track the interaction
    trackUserInteraction(action, category, {
      timestamp: new Date().toISOString()
    });
    
    // Execute the original function
    return fn(...args);
  };
}

/**
 * Initialize session timing for accurate duration tracking
 * Should be called as early as possible in app initialization
 */
export function initializeInteractionTracking(): void {
  if (typeof window !== 'undefined') {
    (window as any).__sessionStartTime = Date.now();
    (window as any).__sentryTransactions = {};
  }
}

/**
 * Track feature usage
 * 
 * @param {string} featureName - Name of the feature being used
 * @param {Record<string, unknown>} settings - Feature settings or parameters
 */
export function trackFeatureUsage(
  featureName: string,
  settings: Record<string, unknown> = {}
): void {
  trackUserInteraction('feature_used', InteractionCategory.USER, {
    feature: featureName,
    ...settings
  });
}
