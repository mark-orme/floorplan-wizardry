/**
 * Logger utility
 * Provides consistent logging across the application with advanced features
 * @module utils/logger
 */

/**
 * Log level definition
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry structure for history
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

// Keep a history of recent logs in memory
const logHistory: LogEntry[] = [];
const MAX_LOG_HISTORY = 100;

// Track message counts for rate limiting
const messageCounter: Record<string, { count: number, lastTimestamp: number }> = {};

/**
 * Add a log entry to history
 * @param {LogEntry} entry - Log entry to add
 */
const addToHistory = (entry: LogEntry): void => {
  logHistory.unshift(entry);
  if (logHistory.length > MAX_LOG_HISTORY) {
    logHistory.pop();
  }
};

/**
 * Check if a message should be rate-limited
 * @param {string} message - Message to check
 * @param {number} period - Rate limiting period in ms
 * @param {number} maxCount - Maximum count in period
 * @returns {boolean} Whether message should be logged
 */
const shouldRateLimit = (message: string, period: number = 5000, maxCount: number = 5): boolean => {
  const now = Date.now();
  const key = message.substring(0, 100); // Use beginning of message as key
  
  if (!messageCounter[key]) {
    messageCounter[key] = { count: 1, lastTimestamp: now };
    return false;
  }
  
  const counter = messageCounter[key];
  
  // Reset counter if period has passed
  if (now - counter.lastTimestamp > period) {
    counter.count = 1;
    counter.lastTimestamp = now;
    return false;
  }
  
  // Increment counter
  counter.count++;
  counter.lastTimestamp = now;
  
  // Rate limit if exceeded max count
  return counter.count > maxCount;
};

/**
 * Format data for logging
 * @param {any} data - Data to format
 * @returns {string} Formatted data
 */
const formatData = (data: any): string => {
  if (data === undefined || data === null) return '';
  
  try {
    if (typeof data === 'object') {
      return JSON.stringify(data);
    }
    return String(data);
  } catch (error) {
    return '[Unserializable data]';
  }
};

/**
 * Advanced logger with history, formatting, and rate limiting
 */
const logger = {
  /**
   * Log informational message
   * @param {string} message - The message to log
   * @param {any} data - Additional data
   */
  info: (message: string, data?: any): void => {
    if (shouldRateLimit(message)) return;
    
    console.info(`[INFO] ${message}`, data);
    
    addToHistory({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data
    });
  },
  
  /**
   * Log warning message
   * @param {string} message - The message to log
   * @param {any} data - Additional data
   */
  warn: (message: string, data?: any): void => {
    if (shouldRateLimit(message)) return;
    
    console.warn(`[WARN] ${message}`, data);
    
    addToHistory({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      data
    });
  },
  
  /**
   * Log error message
   * @param {string} message - The message to log
   * @param {any} data - Additional data
   */
  error: (message: string, data?: any): void => {
    // Never rate-limit errors
    console.error(`[ERROR] ${message}`, data);
    
    addToHistory({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      data
    });
  },
  
  /**
   * Log debug message (only in development)
   * @param {string} message - The message to log
   * @param {any} data - Additional data
   */
  debug: (message: string, data?: any): void => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      if (shouldRateLimit(message, 2000, 10)) return;
      
      console.log(`[DEBUG] ${message}`, data);
      
      addToHistory({
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        data
      });
    }
  },
  
  /**
   * Group related log messages
   * @param {string} name - Group name
   * @param {Function} fn - Function containing logs
   */
  group: (name: string, fn: () => void): void => {
    console.group(`[${name}]`);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  },
  
  /**
   * Time a function execution
   * @param {string} label - Timer label
   * @param {Function} fn - Function to time
   * @returns {T} Result of the function
   */
  time: <T>(label: string, fn: () => T): T => {
    console.time(`[Timer] ${label}`);
    try {
      return fn();
    } finally {
      console.timeEnd(`[Timer] ${label}`);
    }
  },
  
  /**
   * Time an async function execution
   * @param {string} label - Timer label
   * @param {Function} fn - Async function to time
   * @returns {Promise<T>} Result of the function
   */
  timeAsync: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      console.log(`[Timer] ${label}: ${duration.toFixed(2)}ms`);
    }
  },
  
  /**
   * Get recent log history
   * @param {number} limit - Maximum number of logs to return
   * @param {LogLevel[]} levels - Log levels to include
   * @returns {LogEntry[]} Recent logs
   */
  getHistory: (limit: number = MAX_LOG_HISTORY, levels?: LogLevel[]): LogEntry[] => {
    if (!levels) return logHistory.slice(0, limit);
    
    return logHistory
      .filter(entry => levels.includes(entry.level))
      .slice(0, limit);
  },
  
  /**
   * Clear log history
   */
  clearHistory: (): void => {
    logHistory.length = 0;
  }
};

export default logger;
