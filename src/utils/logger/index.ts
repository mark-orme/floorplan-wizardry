
/**
 * Structured logger for application
 * Provides consistent logging with namespace support and no-op in production
 */
import { LogLevel, isLevelEnabled } from "./loggerConfig";

class Logger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  /**
   * Log a debug message
   * Only displayed in development and when debug is enabled
   */
  debug(message: string, context: Record<string, any> = {}): void {
    if (process.env.NODE_ENV === "production") return;
    if (!isLevelEnabled(this.namespace, LogLevel.DEBUG)) return;
    
    console.debug(`[${this.namespace}] ${message}`, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context: Record<string, any> = {}): void {
    if (process.env.NODE_ENV === "production" && 
        !isLevelEnabled(this.namespace, LogLevel.INFO)) return;
    
    console.info(`[${this.namespace}] ${message}`, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context: Record<string, any> = {}): void {
    if (process.env.NODE_ENV === "production" && 
        !isLevelEnabled(this.namespace, LogLevel.WARN)) return;
    
    console.warn(`[${this.namespace}] ${message}`, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: unknown, context: Record<string, any> = {}): void {
    // Errors are always logged, even in production
    console.error(
      `[${this.namespace}] ${message}`, 
      error instanceof Error ? error : context,
      error instanceof Error ? context : {}
    );
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
