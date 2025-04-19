
/**
 * Browser-compatible logger implementation
 * Provides consistent logging interface without Node.js dependencies
 * @module utils/logger/browserLogger
 */

// Define log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

// Define log data interface for structured logging
export interface LogData {
  [key: string]: any;
}

// Interface for logger instance
export interface Logger {
  debug: (message: string, data?: LogData) => void;
  info: (message: string, data?: LogData) => void;
  warn: (message: string, data?: LogData) => void;
  error: (message: string, data?: LogData) => void;
  log: (level: LogLevel, message: string, data?: LogData) => void;
  canvasError: (message: string, error: Error, context?: LogData) => void;
}

/**
 * Create a logger instance with namespace
 * @param namespace Logger namespace for categorization
 * @returns Logger instance
 */
export function createLogger(namespace: string): Logger {
  // Helper to format log data as string
  const formatData = (data?: LogData): string => {
    if (!data || Object.keys(data).length === 0) return '';
    try {
      return ` ${JSON.stringify(data)}`;
    } catch (e) {
      return ' [Unserializable data]';
    }
  };

  // Get current timestamp in readable format
  const getTimestamp = (): string => {
    return new Date().toISOString();
  };

  // Check if we should show a log based on environment and settings
  const shouldLog = (level: LogLevel): boolean => {
    // In dev, show all logs
    if (import.meta.env.DEV) return true;
    
    // In production, check localStorage for debug settings
    if (typeof window !== 'undefined') {
      try {
        const debugAll = localStorage.getItem('debug-all') === 'true';
        if (debugAll) return true;
        
        const nsDebug = localStorage.getItem(`debug-${namespace}`);
        if (nsDebug === 'true') return true;
        if (nsDebug && !isNaN(parseInt(nsDebug, 10))) {
          return level >= parseInt(nsDebug, 10);
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
    
    // Default behavior in production: only show ERROR and higher
    return level >= LogLevel.ERROR;
  };

  // Create the actual logger methods
  return {
    debug: (message: string, data?: LogData) => {
      if (!shouldLog(LogLevel.DEBUG)) return;
      console.debug(`[${getTimestamp()}] [${namespace}] ${message}${formatData(data)}`);
    },
    
    info: (message: string, data?: LogData) => {
      if (!shouldLog(LogLevel.INFO)) return;
      console.info(`[${getTimestamp()}] [${namespace}] ${message}${formatData(data)}`);
    },
    
    warn: (message: string, data?: LogData) => {
      if (!shouldLog(LogLevel.WARN)) return;
      console.warn(`[${getTimestamp()}] [${namespace}] ${message}${formatData(data)}`);
    },
    
    error: (message: string, data?: LogData) => {
      if (!shouldLog(LogLevel.ERROR)) return;
      console.error(`[${getTimestamp()}] [${namespace}] ${message}${formatData(data)}`);
    },
    
    log: (level: LogLevel, message: string, data?: LogData) => {
      if (!shouldLog(level)) return;
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`[${getTimestamp()}] [${namespace}] ${message}${formatData(data)}`);
          break;
        case LogLevel.INFO:
          console.info(`[${getTimestamp()}] [${namespace}] ${message}${formatData(data)}`);
          break;
        case LogLevel.WARN:
          console.warn(`[${getTimestamp()}] [${namespace}] ${message}${formatData(data)}`);
          break;
        case LogLevel.ERROR:
          console.error(`[${getTimestamp()}] [${namespace}] ${message}${formatData(data)}`);
          break;
      }
    },
    
    canvasError: (message: string, error: Error, context?: LogData) => {
      if (!shouldLog(LogLevel.ERROR)) return;
      
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        ...context
      };
      
      console.error(`[${getTimestamp()}] [${namespace}] CANVAS ERROR: ${message}`, errorDetails);
    }
  };
}
