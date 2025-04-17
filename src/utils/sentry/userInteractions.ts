
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
  TOOL = 'tool'
}

/**
 * Track a user interaction
 * 
 * @param {string} action - The user action (e.g., "change_tool", "save_canvas")
 * @param {InteractionCategory} category - Category of the action
 * @param {Record<string, unknown>} data - Additional data about the action
 */
export function trackUserInteraction(
  action: string,
  category: InteractionCategory,
  data: Record<string, unknown> = {}
): void {
  if (!isSentryInitialized()) return;
  
  try {
    // Create a breadcrumb for the user action
    Sentry.addBreadcrumb({
      category: `user.${category}`,
      message: action,
      level: 'info',
      data
    });
    
    // Log the interaction
    logger.debug(`User interaction: ${category}.${action}`, data);
  } catch (error) {
    // Don't let tracking errors affect the application
    logger.error('Error tracking user interaction:', error);
  }
}

/**
 * Track tool usage
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
 * Track canvas operations
 * 
 * @param {string} operation - Canvas operation (e.g., "clear", "save", "export")
 * @param {Record<string, unknown>} metadata - Operation metadata
 */
export function trackCanvasOperation(
  operation: string,
  metadata: Record<string, unknown> = {}
): void {
  trackUserInteraction(operation, InteractionCategory.CANVAS, metadata);
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
