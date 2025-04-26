
/**
 * Logger Utility
 * Provides standardized logging functionality
 * @module utils/logger
 */

const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Get log level from environment or default to INFO
const currentLogLevel = LOG_LEVEL.INFO;

/**
 * Logger interface
 */
interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

/**
 * Create logger instance
 */
const createLogger = (): Logger => {
  return {
    debug: (message: string, ...args: any[]) => {
      if (currentLogLevel <= LOG_LEVEL.DEBUG) {
        console.debug(`[DEBUG] ${message}`, ...args);
      }
    },
    
    info: (message: string, ...args: any[]) => {
      if (currentLogLevel <= LOG_LEVEL.INFO) {
        console.info(`[INFO] ${message}`, ...args);
      }
    },
    
    warn: (message: string, ...args: any[]) => {
      if (currentLogLevel <= LOG_LEVEL.WARN) {
        console.warn(`[WARN] ${message}`, ...args);
      }
    },
    
    error: (message: string, ...args: any[]) => {
      if (currentLogLevel <= LOG_LEVEL.ERROR) {
        console.error(`[ERROR] ${message}`, ...args);
      }
    }
  };
};

const logger = createLogger();

export default logger;
