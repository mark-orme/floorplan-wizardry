import winston from 'winston';
import { LogLevel, isLevelEnabled } from "./loggerConfig";

// Interface for structured log data
export interface LogData {
  [key: string]: any;
}

class Logger {
  private namespace: string;
  private papertrailLogger: winston.Logger | null = null;

  constructor(namespace = 'app') {
    this.namespace = namespace;
    this.initPapertrail();
  }

  private async initPapertrail() {
    if (process.env.VITE_PAPERTRAIL_HOST && process.env.VITE_PAPERTRAIL_PORT) {
      try {
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
        
        // Log successful Papertrail initialization
        console.info(`[${this.namespace}] Papertrail logging initialized`);
      } catch (error) {
        console.error(`[${this.namespace}] Failed to initialize Papertrail logger:`, error);
      }
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
      this.papertrailLogger.debug(`[${this.namespace}] ${message}`, data ? JSON.stringify(data) : '');
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
      this.papertrailLogger.info(`[${this.namespace}] ${message}`, data ? JSON.stringify(data) : '');
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
      this.papertrailLogger.warn(`[${this.namespace}] ${message}`, data ? JSON.stringify(data) : '');
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
      // Format error objects for Papertrail
      let formattedData = data;
      if (data instanceof Error) {
        formattedData = { 
          message: data.message, 
          stack: data.stack,
          name: data.name
        };
      }
      
      this.papertrailLogger.error(`[${this.namespace}] ${message}`, 
        formattedData ? JSON.stringify(formattedData) : '');
    }
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
    
    // Use the class's error method, passing the full formatted data
    this.error(`${this.namespace}:canvas`, formattedData);
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
