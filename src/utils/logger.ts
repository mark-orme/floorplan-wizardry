
/**
 * Logger Utility
 * Centralized logging with different log levels and optional metadata
 */

// Define log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Define logger metadata structure
export interface LogData {
  timestamp: string;
  context?: string;
  details?: Record<string, any>;
}

// Define logger interface
interface Logger {
  debug(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
  canvasError(message: string, meta?: Record<string, any>): void;
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
  },
  
  canvasError(message: string, meta?: Record<string, any>): void {
    console.error(`[CANVAS ERROR] ${message}`, meta);
  }
};

// Specialized loggers for different components
export const gridLogger = {
  debug: (message: string, meta?: Record<string, any>) => logger.debug(`[GRID] ${message}`, meta),
  info: (message: string, meta?: Record<string, any>) => logger.info(`[GRID] ${message}`, meta),
  warn: (message: string, meta?: Record<string, any>) => logger.warn(`[GRID] ${message}`, meta),
  error: (message: string, meta?: Record<string, any>) => logger.error(`[GRID] ${message}`, meta)
};

export const lineToolLogger = {
  debug: (message: string, meta?: Record<string, any>) => logger.debug(`[LINE] ${message}`, meta),
  info: (message: string, meta?: Record<string, any>) => logger.info(`[LINE] ${message}`, meta),
  warn: (message: string, meta?: Record<string, any>) => logger.warn(`[LINE] ${message}`, meta),
  error: (message: string, meta?: Record<string, any>) => logger.error(`[LINE] ${message}`, meta)
};

export default logger;
