
/**
 * Browser-compatible logger implementation
 * Provides consistent logging without Node.js dependencies
 */

import { LogLevel, isLevelEnabled } from "./loggerConfig";

// Export type for log data
export interface LogData {
  [key: string]: any;
}

class BrowserLogger {
  private namespace: string;

  constructor(namespace = 'app') {
    this.namespace = namespace;
  }

  /**
   * Log a debug message
   * Only displayed in development and when debug is enabled
   */
  debug(message: string, data?: LogData | any): void {
    if (typeof window === 'undefined') return; // SSR check
    if (!isLevelEnabled(this.namespace, LogLevel.DEBUG)) return;
    
    console.debug(`[${this.namespace}] ${message}`, data);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: LogData | any): void {
    if (typeof window === 'undefined') return; // SSR check
    if (!isLevelEnabled(this.namespace, LogLevel.INFO)) return;
    
    console.info(`[${this.namespace}] ${message}`, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: LogData | any): void {
    if (typeof window === 'undefined') return; // SSR check
    if (!isLevelEnabled(this.namespace, LogLevel.WARN)) return;
    
    console.warn(`[${this.namespace}] ${message}`, data);
  }

  /**
   * Log an error message
   */
  error(message: string, data?: LogData | any): void {
    if (typeof window === 'undefined') return; // SSR check
    // Errors are always logged, even in production
    console.error(
      `[${this.namespace}] ${message}`, 
      data instanceof Error ? data : {},
      data instanceof Error ? {} : data
    );
  }
  
  /**
   * Special method for logging canvas errors with better context
   */
  canvasError(message: string, error?: Error, context?: LogData): void {
    if (typeof window === 'undefined') return; // SSR check
    
    const canvasContext = {
      ...context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    };
    
    console.error(
      `[${this.namespace}:canvas] ${message}`,
      error || {},
      canvasContext
    );
  }
  
  /**
   * Create a child logger with a more specific namespace
   */
  child(childNamespace: string): BrowserLogger {
    return new BrowserLogger(`${this.namespace}:${childNamespace}`);
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
export function createLogger(namespace: string): BrowserLogger {
  return new BrowserLogger(namespace);
}

// Default export for general usage
const logger = createLogger("app");
export default logger;
