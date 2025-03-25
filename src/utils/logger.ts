
/**
 * Logger utility for consistent logging throughout the application
 * Provides level-based filtering and consistent formatting
 * Also integrates with Sentry for error tracking
 * @module logger
 */

import { captureError, captureMessage } from "./sentryUtils";

/**
 * Available log levels for the logger
 * @typedef {('info'|'warn'|'error'|'debug')} LogLevel
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Configuration of log level priorities
 * Lower numbers have higher priority (will show more logs)
 * @const {Record<string, number>} LOG_LEVEL
 */
const LOG_LEVEL: Record<LogLevel, number> = {
  debug: 0,  // Most verbose
  info: 1,   // Informational
  warn: 2,   // Warnings
  error: 3   // Errors only
};

/**
 * Get current log level from environment or default to 'info' in development and 'error' in production
 * @type {number}
 */
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVEL.error : LOG_LEVEL.debug;

/**
 * Helper to format a timestamp for log messages
 * @returns {string} ISO formatted timestamp
 */
const formattedTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Logger utility interface
 * @interface Logger
 */
interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

/**
 * Logger utility with consistent formatting and level-based filtering
 * Also sends select logs to Sentry in production
 * @type {Logger}
 */
const logger: Logger = {
  /**
   * Log informational message
   * @param {string} message - Main message to log
   * @param {any[]} args - Additional arguments to log
   */
  info(message: string, ...args: any[]): void {
    if (LOG_LEVEL.info >= CURRENT_LOG_LEVEL) {
      console.info(`${formattedTimestamp()} info: ${message}`, ...args);
    }
  },

  /**
   * Log warning message
   * @param {string} message - Main message to log
   * @param {any[]} args - Additional arguments to log
   */
  warn(message: string, ...args: any[]): void {
    if (LOG_LEVEL.warn >= CURRENT_LOG_LEVEL) {
      console.warn(`${formattedTimestamp()} warn: ${message}`, ...args);
      
      // In production, send warnings to Sentry as breadcrumbs
      if (process.env.NODE_ENV === 'production') {
        try {
          captureMessage(message, 'warning', { extra: { args } });
        } catch (e) {
          // Silently fail if Sentry capture fails
        }
      }
    }
  },

  /**
   * Log error message
   * @param {string} message - Main message to log 
   * @param {any[]} args - Additional arguments to log
   */
  error(message: string, ...args: any[]): void {
    if (LOG_LEVEL.error >= CURRENT_LOG_LEVEL) {
      console.error(`${formattedTimestamp()} error: ${message}`, ...args);
      
      // Send errors to Sentry
      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
        try {
          const error = args[0] instanceof Error ? args[0] : new Error(message);
          captureError(error, 'logger', {
            extra: { 
              originalMessage: message,
              args: args.slice(1) // Skip the error object if it was the first arg
            }
          });
        } catch (e) {
          // Silently fail if Sentry capture fails
        }
      }
    }
  },

  /**
   * Log debug message (only in development)
   * @param {string} message - Main message to log
   * @param {any[]} args - Additional arguments to log
   */
  debug(message: string, ...args: any[]): void {
    if (LOG_LEVEL.debug >= CURRENT_LOG_LEVEL && process.env.NODE_ENV === 'development') {
      console.debug(`${formattedTimestamp()} debug: ${message}`, ...args);
    }
  }
};

export default logger;

