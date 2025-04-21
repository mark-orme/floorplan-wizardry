
/**
 * Application logger
 * @module utils/logger
 */

// Log levels in order of increasing verbosity
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'dev';

// Log category for grouping related logs
export type LogCategory = 
  | 'app' 
  | 'canvas' 
  | 'grid' 
  | 'wasm' 
  | 'api' 
  | 'auth' 
  | 'performance';

// Structured log data for consistent error reporting
interface LogData {
  message: string;
  level: LogLevel;
  category?: LogCategory;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

// Configuration for the logger
const logConfig = {
  // Current log level
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  
  // Enable/disable specific categories
  enabledCategories: {
    app: true,
    canvas: true,
    grid: true,
    wasm: true,
    api: true,
    auth: true,
    performance: process.env.NODE_ENV !== 'production'
  },
  
  // Should logs be sent to the server?
  remoteLogging: process.env.NODE_ENV === 'production',
  
  // Should logs include timestamps?
  showTimestamps: true
};

// Map log levels to console methods
const logMethods: Record<LogLevel, keyof typeof console> = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
  dev: 'log'
};

// Map log levels to numeric priority (higher = more severe)
const logLevelPriority: Record<LogLevel, number> = {
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  dev: 10
};

/**
 * Format log data into a string
 * @param data Log data to format
 * @returns Formatted log string
 */
function formatLogMessage(data: LogData): string {
  const parts: string[] = [];
  
  // Add timestamp if enabled
  if (logConfig.showTimestamps) {
    parts.push(`[${data.timestamp}]`);
  }
  
  // Add level
  parts.push(`[${data.level.toUpperCase()}]`);
  
  // Add category if present
  if (data.category) {
    parts.push(`[${data.category}]`);
  }
  
  // Add message
  parts.push(data.message);
  
  return parts.join(' ');
}

/**
 * Check if a log should be processed based on its level and category
 * @param level Log level
 * @param category Log category
 * @returns True if the log should be processed
 */
function shouldLog(level: LogLevel, category?: LogCategory): boolean {
  // Check if the log level is high enough
  if (logLevelPriority[level] < logLevelPriority[logConfig.level as LogLevel]) {
    return false;
  }
  
  // Check if the category is enabled
  if (category && logConfig.enabledCategories[category] === false) {
    return false;
  }
  
  return true;
}

/**
 * Logger implementation
 */
const logger = {
  /**
   * Log an error message
   * @param message Log message
   * @param context Additional context data
   */
  error(message: string, contextOrError?: any, context?: Record<string, any>) {
    // Handle case where contextOrError is an Error
    let error: Error | undefined;
    let actualContext = context || {};
    
    if (contextOrError instanceof Error) {
      error = contextOrError;
    } else if (typeof contextOrError === 'object') {
      actualContext = contextOrError;
    }
    
    this.log('error', message, { ...actualContext, error });
  },
  
  /**
   * Log a warning message
   * @param message Log message
   * @param context Additional context data
   */
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  },
  
  /**
   * Log an info message
   * @param message Log message
   * @param context Additional context data
   */
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  },
  
  /**
   * Log a debug message
   * @param message Log message
   * @param context Additional context data
   */
  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  },
  
  /**
   * Log a development-only message
   * @param message Log message
   * @param context Additional context data
   */
  dev(message: string, context?: Record<string, any>) {
    this.log('dev', message, context);
  },
  
  /**
   * Log a message with the specified level
   * @param level Log level
   * @param message Log message
   * @param context Additional context data
   */
  log(level: LogLevel, message: string, context?: Record<string, any>) {
    const category = context?.category as LogCategory | undefined;
    
    // Check if this log should be processed
    if (!shouldLog(level, category)) {
      return;
    }
    
    // Prepare log data
    const logData: LogData = {
      message,
      level,
      category,
      timestamp: new Date().toISOString(),
      context,
      error: context?.error
    };
    
    // Format the log message
    const formattedMessage = formatLogMessage(logData);
    
    // Log to console - Fix console method calls by using the correct approach
    const methodName = logMethods[level];
    
    if (logData.error) {
      console[methodName](formattedMessage, logData.error);
    } else if (context) {
      console[methodName](formattedMessage, context);
    } else {
      console[methodName](formattedMessage);
    }
    
    // In production, potentially send to a logging service
    if (logConfig.remoteLogging && process.env.NODE_ENV === 'production') {
      // Implementation for remote logging would go here
    }
  }
};

export default logger;
