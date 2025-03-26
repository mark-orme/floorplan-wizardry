
/**
 * Logger utility for consistent application logging
 * Provides log level control and formatting
 * @module logger
 */

/**
 * Log levels enum
 * @enum {number}
 */
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * Current log level for the application
 * Can be adjusted at runtime
 * @type {LogLevel}
 */
let currentLogLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN;

/**
 * Configuration for logger
 * @interface LoggerConfig
 */
interface LoggerConfig {
  /** Whether to include timestamps in logs */
  useTimestamps: boolean;
  /** Whether to use colors in console logs */
  useColors: boolean;
  /** Whether to track log counts */
  trackCounts: boolean;
}

/**
 * Logger configuration with default values
 * @type {LoggerConfig}
 */
const config: LoggerConfig = {
  useTimestamps: true,
  useColors: true,
  trackCounts: false
};

/**
 * Counters for each log level
 * Used when trackCounts is enabled
 */
const counts = {
  debug: 0,
  info: 0,
  warn: 0,
  error: 0
};

/**
 * Format a log message with timestamp and prefix
 * @param {string} level - Log level string
 * @param {string} message - Log message
 * @param {any[]} args - Additional arguments
 * @returns {[string, ...any[]]} Formatted message and arguments
 */
const formatMessage = (level: string, message: string, ...args: any[]): [string, ...any[]] => {
  let formattedMessage = message;
  
  // Add timestamp if enabled
  if (config.useTimestamps) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    formattedMessage = `[${timestamp}] ${formattedMessage}`;
  }
  
  // Add level prefix
  formattedMessage = `[${level.toUpperCase()}] ${formattedMessage}`;
  
  return [formattedMessage, ...args];
};

/**
 * Logger object with methods for different log levels
 */
const logger = {
  /**
   * Set the current log level
   * @param {LogLevel} level - New log level
   */
  setLevel(level: LogLevel): void {
    currentLogLevel = level;
  },
  
  /**
   * Get the current log level
   * @returns {LogLevel} Current log level
   */
  getLevel(): LogLevel {
    return currentLogLevel;
  },
  
  /**
   * Update logger configuration
   * @param {Partial<LoggerConfig>} newConfig - New configuration options
   */
  configure(newConfig: Partial<LoggerConfig>): void {
    Object.assign(config, newConfig);
  },
  
  /**
   * Get log counts for each level
   * @returns {Record<string, number>} Log counts
   */
  getCounts(): Record<string, number> {
    return { ...counts };
  },
  
  /**
   * Log a debug message
   * @param {string} message - Message to log
   * @param {...any} args - Additional arguments
   */
  debug(message: string, ...args: any[]): void {
    if (currentLogLevel <= LogLevel.DEBUG) {
      if (config.trackCounts) counts.debug++;
      console.debug(...formatMessage('debug', message, ...args));
    }
  },
  
  /**
   * Log an info message
   * @param {string} message - Message to log
   * @param {...any} args - Additional arguments
   */
  info(message: string, ...args: any[]): void {
    if (currentLogLevel <= LogLevel.INFO) {
      if (config.trackCounts) counts.info++;
      console.info(...formatMessage('info', message, ...args));
    }
  },
  
  /**
   * Log a warning message
   * @param {string} message - Message to log
   * @param {...any} args - Additional arguments
   */
  warn(message: string, ...args: any[]): void {
    if (currentLogLevel <= LogLevel.WARN) {
      if (config.trackCounts) counts.warn++;
      console.warn(...formatMessage('warn', message, ...args));
    }
  },
  
  /**
   * Log an error message
   * @param {string} message - Message to log
   * @param {...any} args - Additional arguments
   */
  error(message: string, ...args: any[]): void {
    if (currentLogLevel <= LogLevel.ERROR) {
      if (config.trackCounts) counts.error++;
      console.error(...formatMessage('error', message, ...args));
    }
  },
  
  /**
   * Group log messages into a collapsible section
   * @param {string} label - Group label
   * @param {LogLevel} level - Log level
   */
  group(label: string, level: LogLevel = LogLevel.DEBUG): void {
    if (currentLogLevel <= level) {
      console.group(label);
    }
  },
  
  /**
   * Group log messages into a collapsed section
   * @param {string} label - Group label
   * @param {LogLevel} level - Log level
   */
  groupCollapsed(label: string, level: LogLevel = LogLevel.DEBUG): void {
    if (currentLogLevel <= level) {
      console.groupCollapsed(label);
    }
  },
  
  /**
   * End the current log group
   * @param {LogLevel} level - Log level
   */
  groupEnd(level: LogLevel = LogLevel.DEBUG): void {
    if (currentLogLevel <= level) {
      console.groupEnd();
    }
  }
};

// Export default logger and log level enum
export default logger;
export { LogLevel };
