
/**
 * Application logging utility
 * Provides consistent logging across the application
 */

// Log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private context: string;
  private enabled: boolean = true;

  constructor(context: string = 'app') {
    this.context = context;
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  /**
   * Log an error message
   */
  error(message: string | Error, ...args: any[]): void {
    const errorMessage = message instanceof Error ? message.message : message;
    const stack = message instanceof Error ? message.stack : undefined;
    
    this.log('error', errorMessage, ...(stack ? [stack, ...args] : args));
  }

  /**
   * Log a canvas error
   */
  canvasError(message: string, ...args: any[]): void {
    this.log('error', `[Canvas] ${message}`, ...args);
  }

  /**
   * Set the context for the logger
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Enable or disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;
    
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, ...args);
        break;
      case 'info':
        console.info(formattedMessage, ...args);
        break;
      case 'warn':
        console.warn(formattedMessage, ...args);
        break;
      case 'error':
        console.error(formattedMessage, ...args);
        break;
    }
  }
  
  // Add static methods
  static debug(message: string, ...args: any[]): void {
    console.debug(`[DEBUG] ${message}`, ...args);
  }

  static info(message: string, ...args: any[]): void {
    console.info(`[INFO] ${message}`, ...args);
  }

  static warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  static error(message: string | Error, ...args: any[]): void {
    const errorMessage = message instanceof Error ? message.message : message;
    console.error(`[ERROR] ${errorMessage}`, ...args);
  }
}

// Create and export default logger instance
export const logger = new Logger();

// Export the Logger class for creating context-specific loggers
export default Logger;

// Export a grid-specific logger
export const gridLogger = new Logger('grid');

// Export a tools-specific logger
export const toolsLogger = new Logger('tools');
