
/**
 * Enhanced Logger Utility
 * Provides consistent logging with severity levels, throttling, and environment awareness
 */
import { log, info, warn, error, debug, devLog } from './debugUtils';

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

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
   * Log a debug message (only in development)
   */
  debug(message: string, data?: LogData | any): void {
    // Convert non-object data to LogData format
    const formattedData = this.formatData(data);
    debug(this.namespace, message, formattedData);
  }
  
  /**
   * Log an info message
   */
  info(message: string, data?: LogData | any): void {
    const formattedData = this.formatData(data);
    info(this.namespace, message, formattedData);
  }
  
  /**
   * Log a dev-only message (stripped in production)
   */
  dev(message: string, data?: LogData | any): void {
    const formattedData = this.formatData(data);
    devLog(this.namespace, message, formattedData);
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, data?: LogData | any): void {
    const formattedData = this.formatData(data);
    warn(this.namespace, message, formattedData);
  }
  
  /**
   * Log an error message
   */
  error(message: string, data?: LogData | any): void {
    const formattedData = this.formatData(data);
    error(this.namespace, message, formattedData);
  }
  
  /**
   * Group related logs together
   */
  group(name: string, callback: () => void): void {
    const groupKey = `${this.namespace}:${name}`;
    console.group(`[${groupKey}]`);
    callback();
    console.groupEnd();
  }
  
  /**
   * Time an operation
   */
  time<T>(label: string, operation: () => T): T {
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
