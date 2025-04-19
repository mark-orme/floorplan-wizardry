/**
 * Structured logger for application
 * Provides consistent logging with namespace support and no-op in production
 */
import { LogLevel, isLevelEnabled } from "./loggerConfig";

class Logger {
  private namespace: string;
  private papertrailLogger: winston.Logger | null = null;

  constructor(namespace = 'app') {
    this.namespace = namespace;
    this.initPapertrail();
  }

  private async initPapertrail() {
    if (process.env.VITE_PAPERTRAIL_HOST && process.env.VITE_PAPERTRAIL_PORT) {
      const { createPapertrailTransport } = await import('./papertrailTransport');
      
      this.papertrailLogger = winston.createLogger({
        transports: [
          createPapertrailTransport({
            host: process.env.VITE_PAPERTRAIL_HOST,
            port: Number(process.env.VITE_PAPERTRAIL_PORT),
            hostname: window.location.hostname,
            program: 'canvas-app'
          })
        ]
      });
    }
  }

  /**
   * Log a debug message
   * Only displayed in development and when debug is enabled
   */
  debug(message: string, data?: LogData | any): void {
    if (process.env.NODE_ENV === "production") return;
    if (!isLevelEnabled(this.namespace, LogLevel.DEBUG)) return;
    
    console.debug(`[${this.namespace}] ${message}`, data);
    
    if (this.papertrailLogger) {
      this.papertrailLogger.debug(`[${this.namespace}] ${message}`, data);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, data?: LogData | any): void {
    if (process.env.NODE_ENV === "production" && 
        !isLevelEnabled(this.namespace, LogLevel.INFO)) return;
    
    console.info(`[${this.namespace}] ${message}`, data);
    
    if (this.papertrailLogger) {
      this.papertrailLogger.info(`[${this.namespace}] ${message}`, data);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: LogData | any): void {
    if (process.env.NODE_ENV === "production" && 
        !isLevelEnabled(this.namespace, LogLevel.WARN)) return;
    
    console.warn(`[${this.namespace}] ${message}`, data);
    
    if (this.papertrailLogger) {
      this.papertrailLogger.warn(`[${this.namespace}] ${message}`, data);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, data?: LogData | any): void {
    // Errors are always logged, even in production
    console.error(
      `[${this.namespace}] ${message}`, 
      data instanceof Error ? data : {},
      data instanceof Error ? {} : data
    );
    
    if (this.papertrailLogger) {
      this.papertrailLogger.error(`[${this.namespace}] ${message}`, data);
    }
  }
  
  /**
   * Create a child logger with a more specific namespace
   */
  child(childNamespace: string): Logger {
    return new Logger(`${this.namespace}:${childNamespace}`);
  }
  
  /**
   * Get the logger's namespace
   */
  getNamespace(): string {
    return this.namespace;
  }
}

/**
 * Create a logger for a specific namespace
 */
export function createLogger(namespace: string): Logger {
  return new Logger(namespace);
}

// Pre-configured loggers for common areas
export const lineToolLogger = createLogger("lineTool");
export const gridLogger = createLogger("grid");
export const canvasLogger = createLogger("canvas");
export const perfLogger = createLogger("performance");

// Default export for general usage
const logger = createLogger("app");
export default logger;
