
/**
 * Debug utilities
 * @module utils/debugUtils
 */

const throttledLogs: Record<string, { lastTime: number; count: number }> = {};
const LOG_THROTTLE_TIME = 1000; // 1 second

/**
 * Log to console with throttling to prevent spam
 * @param {string} level - Log level (log, warn, error, info)
 * @param {string} key - Unique key for this log type
 * @param {string} message - Log message
 * @param {any[]} args - Additional arguments
 */
export const throttledConsole = (
  level: 'log' | 'warn' | 'error' | 'info',
  key: string,
  message: string,
  ...args: any[]
): void => {
  const now = Date.now();
  
  if (!throttledLogs[key]) {
    throttledLogs[key] = { lastTime: 0, count: 0 };
  }
  
  const logInfo = throttledLogs[key];
  
  // If it's been less than the throttle time since the last log
  if (now - logInfo.lastTime < LOG_THROTTLE_TIME) {
    logInfo.count++;
    return;
  }
  
  // If there were throttled messages, log how many were suppressed
  if (logInfo.count > 0) {
    console[level](`[Throttled] ${logInfo.count} "${key}" messages suppressed`);
    logInfo.count = 0;
  }
  
  // Log the current message
  console[level](`[${key}] ${message}`, ...args);
  logInfo.lastTime = now;
};

/**
 * Log with throttling
 */
export const log = (key: string, message: string, ...args: any[]): void => {
  throttledConsole('log', key, message, ...args);
};

/**
 * Warn with throttling
 */
export const warn = (key: string, message: string, ...args: any[]): void => {
  throttledConsole('warn', key, message, ...args);
};

/**
 * Error with throttling
 */
export const error = (key: string, message: string, ...args: any[]): void => {
  // Never throttle errors
  console.error(`[${key}] ${message}`, ...args);
};

/**
 * Info with throttling
 */
export const info = (key: string, message: string, ...args: any[]): void => {
  throttledConsole('info', key, message, ...args);
};

/**
 * Group console logs for better organization
 * @param {string} name - Group name
 * @param {Function} callback - Function containing logs
 */
export const logGroup = (name: string, callback: () => void): void => {
  console.group(`[${name}]`);
  callback();
  console.groupEnd();
};

/**
 * Time a function execution and log the duration
 * @param {string} name - Timer name
 * @param {Function} callback - Function to time
 * @returns {any} - The function result
 */
export const timeOperation = <T>(name: string, callback: () => T): T => {
  console.time(`[Time] ${name}`);
  const result = callback();
  console.timeEnd(`[Time] ${name}`);
  return result;
};
