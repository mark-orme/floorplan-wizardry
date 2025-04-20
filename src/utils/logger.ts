/**
 * Logger Utility
 * Centralized logging with different log levels and optional metadata
 */
import { config } from './logger/config';
import * as Sentry from '@sentry/react';

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

// Helper to check if logging should happen based on level
const shouldLog = (level: LogLevel): boolean => {
  const levels: Record<string, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  
  const configLevel = levels[config.level] || 1;
  return levels[level] >= configLevel;
};

// Helper to format log data
const formatMeta = (meta?: Record<string, any>): string => {
  if (!meta) return '';
  try {
    return JSON.stringify(meta);
  } catch (err) {
    return '[Unserializable metadata]';
  }
};

// Create the logger
const logger: Logger = {
  debug(message: string, meta?: Record<string, any>): void {
    if (!shouldLog('debug')) return;
    
    if (config.enableConsole) {
      console.debug(`[DEBUG] ${message}`, meta);
    }
    
    // In development, we don't send debug logs to Sentry or Papertrail
  },
  
  info(message: string, meta?: Record<string, any>): void {
    if (!shouldLog('info')) return;
    
    if (config.enableConsole) {
      console.info(`[INFO] ${message}`, meta);
    }
    
    if (config.enableSentry && process.env.NODE_ENV === 'production') {
      Sentry.addBreadcrumb({
        category: 'info',
        message,
        data: meta,
        level: 'info'
      });
    }
    
    // Papertrail would be initialized here in production
  },
  
  warn(message: string, meta?: Record<string, any>): void {
    if (!shouldLog('warn')) return;
    
    if (config.enableConsole) {
      console.warn(`[WARN] ${message}`, meta);
    }
    
    if (config.enableSentry) {
      Sentry.addBreadcrumb({
        category: 'warning',
        message,
        data: meta,
        level: 'warning'
      });
    }
    
    // Papertrail logging for warnings in production
  },
  
  error(message: string, meta?: Record<string, any>): void {
    if (!shouldLog('error')) return;
    
    if (config.enableConsole) {
      console.error(`[ERROR] ${message}`, meta);
    }
    
    if (config.enableSentry) {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: meta
      });
    }
    
    // Papertrail logging for errors in production
  },
  
  canvasError(message: string, meta?: Record<string, any>): void {
    // Canvas errors are important, so we always log them with error level
    this.error(`[CANVAS] ${message}`, meta);
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

export const canvasLogger = {
  debug: (message: string, meta?: Record<string, any>) => logger.debug(`[CANVAS] ${message}`, meta),
  info: (message: string, meta?: Record<string, any>) => logger.info(`[CANVAS] ${message}`, meta),
  warn: (message: string, meta?: Record<string, any>) => logger.warn(`[CANVAS] ${message}`, meta),
  error: (message: string, meta?: Record<string, any>) => logger.error(`[CANVAS] ${message}`, meta)
};

export const performanceLogger = {
  debug: (message: string, meta?: Record<string, any>) => logger.debug(`[PERF] ${message}`, meta),
  info: (message: string, meta?: Record<string, any>) => logger.info(`[PERF] ${message}`, meta),
  warn: (message: string, meta?: Record<string, any>) => logger.warn(`[PERF] ${message}`, meta),
  error: (message: string, meta?: Record<string, any>) => logger.error(`[PERF] ${message}`, meta)
};

// Function to enable debug logging during runtime
export const enableDebugLogging = (): void => {
  (config as any).level = 'debug';
  logger.info('Debug logging enabled');
};

// Function to disable debug logging during runtime
export const disableDebugLogging = (): void => {
  (config as any).level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  logger.info('Debug logging reset to default');
};

// Expose debug controls globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__logger = {
    enableDebug: enableDebugLogging,
    disableDebug: disableDebugLogging,
    log: logger
  };
}

export default logger;
