
/**
 * Enhanced Logger Utility
 * Provides consistent logging with severity levels, throttling, and environment awareness
 */
import { log, info, warn, error, debug, devLog } from './debugUtils';
import { LogLevel, isLevelEnabled } from './logger/loggerConfig';

// Interface for structured log data
export interface LogData {
  [key: string]: any;
}

/**
 * Logger class with severity levels and structured data
 */
class Logger {
  private namespace: string;
  
  constructor(namespace = 'app') {
    this.namespace = namespace;
  }
  
  /**
   * Create a namespaced logger instance
   */
  forNamespace(namespace: string): Logger {
    return new Logger(namespace);
  }
  
  /**
   * Log a debug message (only in development or when explicitly enabled)
   */
  debug(message: string, data?: LogData | any): void {
    if (!isLevelEnabled(this.namespace, LogLevel.DEBUG)) return;
    
    // Convert non-object data to LogData format
    const formattedData = this.formatData(data);
    debug(this.namespace, message, formattedData);
  }
  
  /**
   * Log an info message
   */
  info(message: string, data?: LogData | any): void {
    if (!isLevelEnabled(this.namespace, LogLevel.INFO)) return;
    
    const formattedData = this.formatData(data);
    info(this.namespace, message, formattedData);
  }
  
  /**
   * Log a dev-only message (stripped in production)
   */
  dev(message: string, data?: LogData | any): void {
    if (process.env.NODE_ENV === 'production') return;
    
    const formattedData = this.formatData(data);
    devLog(this.namespace, message, formattedData);
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, data?: LogData | any): void {
    if (!isLevelEnabled(this.namespace, LogLevel.WARN)) return;
    
    const formattedData = this.formatData(data);
    warn(this.namespace, message, formattedData);
  }
  
  /**
   * Log an error message
   */
  error(message: string, data?: LogData | any): void {
    if (!isLevelEnabled(this.namespace, LogLevel.ERROR)) return;
    
    const formattedData = this.formatData(data);
    error(this.namespace, message, formattedData);
  }
  
  /**
   * Special method for logging canvas errors with better context
   */
  canvasError(message: string, errorObj?: Error, context?: LogData): void {
    if (!isLevelEnabled(this.namespace, LogLevel.ERROR)) return;
    
    const canvasContext = {
      ...context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    };
    
    const formattedData = {
      error: errorObj instanceof Error ? {
        message: errorObj.message,
        stack: errorObj.stack,
        name: errorObj.name
      } : {},
      ...canvasContext
    };
    
    // Use the class's error method instead of trying to call the error parameter
    this.error(this.namespace + ':canvas', formattedData);
  }
  
  /**
   * Group related logs together
   */
  group(name: string, callback: () => void): void {
    if (process.env.NODE_ENV === 'production') return;
    
    const groupKey = `${this.namespace}:${name}`;
    console.group(`[${groupKey}]`);
    callback();
    console.groupEnd();
  }
  
  /**
   * Time an operation
   */
  time<T>(label: string, operation: () => T): T {
    if (process.env.NODE_ENV === 'production') return operation();
    
    const timeLabel = `${this.namespace}:${label}`;
    console.time(timeLabel);
    const result = operation();
    console.timeEnd(timeLabel);
    return result;
  }
  
  /**
   * Format log data to ensure it's a proper LogData object
   * @param data Data to format
   * @returns Formatted LogData object
   */
  private formatData(data: any): LogData {
    if (data === undefined || data === null) {
      return {};
    }
    
    if (typeof data === 'object' && !Array.isArray(data)) {
      return data;
    }
    
    // Convert primitive values to an object
    return { value: data };
  }
}

// Create and export a singleton instance
const logger = new Logger();
export default logger;

// Export specific logger instances for common modules
export const gridLogger = logger.forNamespace('grid');
export const canvasLogger = logger.forNamespace('canvas');
export const toolsLogger = logger.forNamespace('tools');
export const lineToolLogger = logger.forNamespace('line-tool');
