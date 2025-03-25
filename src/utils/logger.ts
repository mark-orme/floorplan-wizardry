
/**
 * Logger utility for consistent logging throughout the application
 * @module logger
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// Configure log level based on environment
const LOG_LEVEL: Record<string, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Get current log level from environment or default to 'info' in development and 'error' in production
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVEL.error : LOG_LEVEL.info;

// Helper to format a timestamp
const formattedTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Logger utility with consistent formatting and level-based filtering
 */
const logger = {
  /**
   * Log informational message
   * @param message - Main message to log
   * @param args - Additional arguments to log
   */
  info(message: string, ...args: any[]): void {
    if (LOG_LEVEL.info >= CURRENT_LOG_LEVEL) {
      console.info(`${formattedTimestamp()} info: ${message}`, ...args);
    }
  },

  /**
   * Log warning message
   * @param message - Main message to log
   * @param args - Additional arguments to log
   */
  warn(message: string, ...args: any[]): void {
    if (LOG_LEVEL.warn >= CURRENT_LOG_LEVEL) {
      console.warn(`${formattedTimestamp()} warn: ${message}`, ...args);
    }
  },

  /**
   * Log error message
   * @param message - Main message to log 
   * @param args - Additional arguments to log
   */
  error(message: string, ...args: any[]): void {
    if (LOG_LEVEL.error >= CURRENT_LOG_LEVEL) {
      console.error(`${formattedTimestamp()} error: ${message}`, ...args);
    }
  },

  /**
   * Log debug message (only in development)
   * @param message - Main message to log
   * @param args - Additional arguments to log
   */
  debug(message: string, ...args: any[]): void {
    if (LOG_LEVEL.debug >= CURRENT_LOG_LEVEL) {
      console.debug(`${formattedTimestamp()} debug: ${message}`, ...args);
    }
  }
};

export default logger;
