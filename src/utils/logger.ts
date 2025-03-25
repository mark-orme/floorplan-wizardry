
/**
 * Logger utility for consistent logging throughout the application
 * Provides level-based filtering and consistent formatting
 * @module logger
 */

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
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVEL.error : LOG_LEVEL.info;

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
    }
  },

  /**
   * Log debug message (only in development)
   * @param {string} message - Main message to log
   * @param {any[]} args - Additional arguments to log
   */
  debug(message: string, ...args: any[]): void {
    if (LOG_LEVEL.debug >= CURRENT_LOG_LEVEL) {
      console.debug(`${formattedTimestamp()} debug: ${message}`, ...args);
    }
  }
};

export default logger;
