
/**
 * Logger utility for consistent logging across the application
 */

class LoggerClass {
  debug(message: string, ...args: any[]) {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
  
  info(message: string, ...args: any[]) {
    console.info(`[INFO] ${message}`, ...args);
  }
  
  warn(message: string, ...args: any[]) {
    console.warn(`[WARN] ${message}`, ...args);
  }
  
  error(message: string, ...args: any[]) {
    console.error(`[ERROR] ${message}`, ...args);
  }
}

// Create a singleton instance
const logger = new LoggerClass();

// Export both the instance and class for flexibility
export default logger;

// For backward compatibility with code using Logger.info etc.
export const Logger = {
  debug: logger.debug,
  info: logger.info,
  warn: logger.warn,
  error: logger.error
};

// For convenient export by name
export { logger };

// Named grid logger for specialized grid operations
export const gridLogger = {
  debug: (message: string, ...args: any[]) => logger.debug(`[GRID] ${message}`, ...args),
  info: (message: string, ...args: any[]) => logger.info(`[GRID] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => logger.warn(`[GRID] ${message}`, ...args),
  error: (message: string, ...args: any[]) => logger.error(`[GRID] ${message}`, ...args)
};
