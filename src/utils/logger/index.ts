
/**
 * Logger Utility
 * Provides consistent logging with severity levels and metadata
 */

// Log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Interface for structured log data
interface LogData {
  [key: string]: any;
}

/**
 * Logger class with severity levels and structured data
 */
class Logger {
  private debugEnabled: boolean;
  
  constructor() {
    this.debugEnabled = process.env.NODE_ENV !== 'production';
  }
  
  /**
   * Log a debug message (only in development)
   */
  debug(message: string, data?: LogData): void {
    if (!this.debugEnabled) return;
    this.log('debug', message, data);
  }
  
  /**
   * Log an info message
   */
  info(message: string, data?: LogData): void {
    this.log('info', message, data);
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, data?: LogData): void {
    this.log('warn', message, data);
  }
  
  /**
   * Log an error message
   */
  error(message: string, data?: LogData): void {
    this.log('error', message, data);
  }
  
  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data: LogData = {}): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };
    
    switch (level) {
      case 'debug':
        console.debug(`${timestamp} debug:`, message, data);
        break;
      case 'info':
        console.info(`${timestamp} info:`, message, data);
        break;
      case 'warn':
        console.warn(`${timestamp} warning:`, message, data);
        break;
      case 'error':
        console.error(`${timestamp} error:`, message, data);
        break;
    }
    
    // In production, we could also send logs to a centralized service
    if (process.env.NODE_ENV === 'production') {
      this.sendToSentry(level, message, data);
    }
  }
  
  /**
   * Send logs to Sentry in production
   */
  private sendToSentry(level: LogLevel, message: string, data: LogData): void {
    // Implement Sentry integration here if needed
    // We already have a separate Sentry utility
    // This is a stub for future implementation
  }
}

// Create and export a singleton instance
const logger = new Logger();
export default logger;
