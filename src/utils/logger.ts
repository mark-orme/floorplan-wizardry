
/**
 * Logging utility module
 * Provides consistent logging functionality throughout the application
 * @module logger
 */

/**
 * Log levels enumeration
 * Defines the available logging levels in order of importance
 * @enum {number}
 */
enum LogLevel {
  NONE = 0,   // No logging
  ERROR = 1,  // Errors only
  WARN = 2,   // Errors and warnings
  INFO = 3,   // Errors, warnings, and information
  DEBUG = 4,  // All logging including debug
  TRACE = 5   // Detailed tracing (most verbose)
}

/**
 * Current log level
 * Set based on environment and user preferences
 * @type {LogLevel}
 */
let currentLogLevel: LogLevel = 
  process.env.NODE_ENV === 'production' 
    ? LogLevel.ERROR    // Only errors in production (reduced from WARN)
    : LogLevel.INFO;    // Reduced from DEBUG to INFO in development

/**
 * Check if a specific log level is currently enabled
 * @param {LogLevel} level - The log level to check
 * @returns {boolean} Whether the level is enabled
 */
const isLevelEnabled = (level: LogLevel): boolean => {
  return level <= currentLogLevel;
};

/**
 * Set the current log level
 * @param {LogLevel|string} level - The log level to set
 */
const setLogLevel = (level: LogLevel | string): void => {
  if (typeof level === 'string') {
    // Convert string to enum value
    const levelMap: Record<string, LogLevel> = {
      'none': LogLevel.NONE,
      'error': LogLevel.ERROR,
      'warn': LogLevel.WARN,
      'info': LogLevel.INFO,
      'debug': LogLevel.DEBUG,
      'trace': LogLevel.TRACE,
    };
    
    currentLogLevel = levelMap[level.toLowerCase()] ?? LogLevel.INFO;
  } else {
    currentLogLevel = level;
  }
  
  // Log the level change (except in NONE mode)
  if (currentLogLevel > LogLevel.NONE && process.env.NODE_ENV === 'development') {
    console.log(`[Logger] Log level set to: ${LogLevel[currentLogLevel]}`);
  }
};

/**
 * Format log messages with consistent structure
 * @param {string} level - Log level name
 * @param {string} message - Main log message
 * @param {any[]} args - Additional arguments to log
 * @returns {[string, ...any[]]} Formatted message and arguments
 */
const formatLog = (level: string, message: string, args: any[]): [string, ...any[]] => {
  const timestamp = new Date().toISOString().slice(11, 19); // HH:MM:SS
  const formattedMessage = `[${timestamp}] [${level}] ${message}`;
  
  return [formattedMessage, ...args];
};

/**
 * Log an error message
 * @param {string} message - Error message
 * @param {...any} args - Additional arguments
 */
const error = (message: string, ...args: any[]): void => {
  if (isLevelEnabled(LogLevel.ERROR)) {
    console.error(...formatLog('ERROR', message, args));
  }
};

/**
 * Log a warning message
 * @param {string} message - Warning message
 * @param {...any} args - Additional arguments
 */
const warn = (message: string, ...args: any[]): void => {
  if (isLevelEnabled(LogLevel.WARN)) {
    console.warn(...formatLog('WARN', message, args));
  }
};

/**
 * Log an informational message
 * @param {string} message - Info message
 * @param {...any} args - Additional arguments
 */
const info = (message: string, ...args: any[]): void => {
  if (isLevelEnabled(LogLevel.INFO)) {
    console.info(...formatLog('INFO', message, args));
  }
};

/**
 * Log a debug message
 * @param {string} message - Debug message
 * @param {...any} args - Additional arguments
 */
const debug = (message: string, ...args: any[]): void => {
  if (isLevelEnabled(LogLevel.DEBUG)) {
    console.debug(...formatLog('DEBUG', message, args));
  }
};

/**
 * Log a detailed trace message
 * @param {string} message - Trace message
 * @param {...any} args - Additional arguments
 */
const trace = (message: string, ...args: any[]): void => {
  if (isLevelEnabled(LogLevel.TRACE)) {
    console.debug(...formatLog('TRACE', message, args));
  }
};

/**
 * Group related log messages together
 * @param {string} label - Group label
 * @param {Function} logFunction - Function containing grouped logs
 */
const group = (label: string, logFunction: () => void): void => {
  if (isLevelEnabled(LogLevel.DEBUG)) {
    console.group(`[Group] ${label}`);
    try {
      logFunction();
    } finally {
      console.groupEnd();
    }
  } else {
    // Execute without grouping if debug not enabled
    logFunction();
  }
};

/**
 * Measure execution time of a function
 * @param {string} label - Label for the measurement
 * @param {Function} fn - Function to measure
 * @returns The return value of the measured function
 */
const time = <T>(label: string, fn: () => T): T => {
  if (isLevelEnabled(LogLevel.DEBUG)) {
    console.time(`[Time] ${label}`);
    try {
      return fn();
    } finally {
      console.timeEnd(`[Time] ${label}`);
    }
  } else {
    // Execute without timing if debug not enabled
    return fn();
  }
};

/**
 * Logger object with all available methods
 */
const logger = {
  error,
  warn,
  info,
  debug,
  trace,
  group,
  time,
  setLogLevel,
  isLevelEnabled,
  levels: LogLevel
};

export default logger;
