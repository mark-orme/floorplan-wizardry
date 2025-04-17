
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
interface LogData {
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
  debug(message: string, data?: LogData): void {
    debug(this.namespace, message, data);
  }
  
  /**
   * Log an info message
   */
  info(message: string, data?: LogData): void {
    info(this.namespace, message, data);
  }
  
  /**
   * Log a dev-only message (stripped in production)
   */
  dev(message: string, data?: LogData): void {
    devLog(this.namespace, message, data);
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, data?: LogData): void {
    warn(this.namespace, message, data);
  }
  
  /**
   * Log an error message
   */
  error(message: string, data?: LogData): void {
    error(this.namespace, message, data);
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
}

// Create and export a singleton instance
const logger = new Logger();
export default logger;

// Export specific logger instances for common modules
export const gridLogger = logger.forNamespace('grid');
export const canvasLogger = logger.forNamespace('canvas');
export const toolsLogger = logger.forNamespace('tools');
export const lineToolLogger = logger.forNamespace('line-tool');
