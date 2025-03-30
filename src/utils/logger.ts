
/**
 * Logger utility
 * Provides consistent logging across the application
 * @module utils/logger
 */

/**
 * Simple logger for debugging
 */
const logger = {
  /**
   * Log informational message
   * @param {string} message - The message to log
   * @param {any[]} args - Additional arguments
   */
  info: (message: string, ...args: any[]): void => {
    console.info(`[INFO] ${message}`, ...args);
  },
  
  /**
   * Log warning message
   * @param {string} message - The message to log
   * @param {any[]} args - Additional arguments
   */
  warn: (message: string, ...args: any[]): void => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  
  /**
   * Log error message
   * @param {string} message - The message to log
   * @param {any[]} args - Additional arguments
   */
  error: (message: string, ...args: any[]): void => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  /**
   * Log debug message (only in development)
   * @param {string} message - The message to log
   * @param {any[]} args - Additional arguments
   */
  debug: (message: string, ...args: any[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
};

export default logger;
