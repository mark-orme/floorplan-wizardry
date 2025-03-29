
/**
 * Logger utility
 * Provides consistent logging across the application
 * @module utils/logger
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger utility for consistent application logging
 */
const logger = {
  /**
   * Debug level logging
   * Only visible in development
   */
  debug: (...args: any[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}:`, ...args);
    }
  },
  
  /**
   * Info level logging
   * General application information
   */
  info: (...args: any[]): void => {
    console.info(`[INFO] ${new Date().toISOString()}:`, ...args);
  },
  
  /**
   * Warning level logging
   * Potential issues that don't prevent operation
   */
  warn: (...args: any[]): void => {
    console.warn(`[WARN] ${new Date().toISOString()}:`, ...args);
  },
  
  /**
   * Error level logging
   * Critical issues that affect functionality
   */
  error: (...args: any[]): void => {
    console.error(`[ERROR] ${new Date().toISOString()}:`, ...args);
  },
  
  /**
   * Log with specified level
   * @param level - Log level to use
   * @param args - Arguments to log
   */
  log: (level: LogLevel, ...args: any[]): void => {
    switch (level) {
      case 'debug':
        logger.debug(...args);
        break;
      case 'info':
        logger.info(...args);
        break;
      case 'warn':
        logger.warn(...args);
        break;
      case 'error':
        logger.error(...args);
        break;
      default:
        console.log(`[LOG] ${new Date().toISOString()}:`, ...args);
    }
  }
};

export default logger;
