
/**
 * Logger Utility
 * Centralized logging with different log levels and optional metadata
 */

// Define log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Define logger interface
interface Logger {
  debug(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
}

// Create the logger
const logger: Logger = {
  debug(message: string, meta?: Record<string, any>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  },
  
  info(message: string, meta?: Record<string, any>): void {
    console.info(`[INFO] ${message}`, meta);
  },
  
  warn(message: string, meta?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, meta);
  },
  
  error(message: string, meta?: Record<string, any>): void {
    console.error(`[ERROR] ${message}`, meta);
    
    // In production, you might want to send errors to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      // errorMonitoringService.captureException(message, meta);
    }
  }
};

export default logger;
