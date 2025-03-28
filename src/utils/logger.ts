
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
    ? LogLevel.ERROR    // Only errors in production
    : LogLevel.WARN;    // WARN level in development (reduced from INFO)

// Track seen messages to avoid duplicates
const seenMessages = new Set<string>();
const MAX_SEEN_MESSAGES = 1000;
const MESSAGE_CACHE_LIFETIME = 5000; // 5 seconds

// Store timestamps for throttled messages
const messageTimestamps = new Map<string, number>();

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
 * Clear the seen messages cache
 */
const clearSeenMessages = (): void => {
  seenMessages.clear();
  messageTimestamps.clear();
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
 * Check if message has been seen recently to avoid duplicates
 * @param {string} level - Log level
 * @param {string} message - Message to check
 * @returns {boolean} Whether the message is a duplicate
 */
const isDuplicateMessage = (level: string, message: string): boolean => {
  const key = `${level}:${message}`;
  const now = Date.now();
  const lastTime = messageTimestamps.get(key) || 0;
  
  // Check if we've seen this message recently
  if (seenMessages.has(key) && now - lastTime < MESSAGE_CACHE_LIFETIME) {
    return true;
  }
  
  // Add to seen messages, manage cache size
  seenMessages.add(key);
  messageTimestamps.set(key, now);
  
  if (seenMessages.size > MAX_SEEN_MESSAGES) {
    // Clean up old entries
    const keysToDelete: string[] = [];
    
    messageTimestamps.forEach((timestamp, msgKey) => {
      if (now - timestamp > MESSAGE_CACHE_LIFETIME) {
        keysToDelete.push(msgKey);
      }
    });
    
    // Delete old entries
    keysToDelete.forEach(key => {
      seenMessages.delete(key);
      messageTimestamps.delete(key);
    });
    
    // If we still have too many entries, remove the oldest ones
    if (seenMessages.size > MAX_SEEN_MESSAGES) {
      const oldestKeys = [...messageTimestamps.entries()]
        .sort((a, b) => a[1] - b[1])
        .slice(0, 100)
        .map(entry => entry[0]);
        
      oldestKeys.forEach(key => {
        seenMessages.delete(key);
        messageTimestamps.delete(key);
      });
    }
  }
  
  return false;
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
    // Don't deduplicate warnings - they're important
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
    // Only log in development and avoid duplicates
    if (process.env.NODE_ENV !== 'development' || !isDuplicateMessage('INFO', message)) {
      console.info(...formatLog('INFO', message, args));
    }
  }
};

/**
 * Log a debug message
 * @param {string} message - Debug message
 * @param {...any} args - Additional arguments
 */
const debug = (message: string, ...args: any[]): void => {
  if (isLevelEnabled(LogLevel.DEBUG)) {
    // Only log in development and avoid duplicates for debug
    if (process.env.NODE_ENV !== 'development' || !isDuplicateMessage('DEBUG', message)) {
      console.debug(...formatLog('DEBUG', message, args));
    }
  }
};

/**
 * Log a detailed trace message
 * @param {string} message - Trace message
 * @param {...any} args - Additional arguments
 */
const trace = (message: string, ...args: any[]): void => {
  if (isLevelEnabled(LogLevel.TRACE)) {
    // Only log in development and avoid duplicates for trace
    if (process.env.NODE_ENV !== 'development' || !isDuplicateMessage('TRACE', message)) {
      console.debug(...formatLog('TRACE', message, args));
    }
  }
};

/**
 * Group related log messages together
 * @param {string} label - Group label
 * @param {Function} logFunction - Function containing grouped logs
 */
const group = (label: string, logFunction: () => void): void => {
  if (isLevelEnabled(LogLevel.DEBUG) && process.env.NODE_ENV === 'development') {
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
  if (isLevelEnabled(LogLevel.DEBUG) && process.env.NODE_ENV === 'development') {
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
  clearSeenMessages,
  levels: LogLevel
};

export default logger;
