
/**
 * Enhanced Debug utilities
 * @module utils/debugUtils
 */
import { LogData } from './logger';

// Store for throttled logs
const throttledLogs: Record<string, { lastTime: number; count: number }> = {};
const LOG_THROTTLE_TIME = 1000; // 1 second

// Environment detection
const isProduction = () => process.env.NODE_ENV === 'production';
const isDebugEnabled = () => {
  // Check for debug flags in localStorage or environment variables
  if (typeof window !== 'undefined') {
    return localStorage.getItem('debug-enabled') === 'true' || !isProduction();
  }
  return !isProduction();
};

/**
 * Log to console with throttling to prevent spam
 * @param {string} level - Log level (log, warn, error, info)
 * @param {string} key - Unique key for this log type
 * @param {string} message - Log message
 * @param {LogData} data - Additional data to log
 */
export const throttledConsole = (
  level: 'log' | 'warn' | 'error' | 'info' | 'debug',
  key: string,
  message: string,
  data?: LogData
): void => {
  // Skip non-error logs in production unless explicitly enabled
  if (isProduction() && level !== 'error' && !isDebugEnabled()) {
    return;
  }
  
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
  if (data && Object.keys(data).length > 0) {
    console[level](`[${key}] ${message}`, data);
  } else {
    console[level](`[${key}] ${message}`);
  }
  
  logInfo.lastTime = now;
};

/**
 * Log with throttling
 */
export const log = (key: string, message: string, data?: LogData): void => {
  throttledConsole('log', key, message, data);
};

/**
 * Debug with throttling - only shown in development
 */
export const debug = (key: string, message: string, data?: LogData): void => {
  throttledConsole('debug', key, message, data);
};

/**
 * Warn with throttling
 */
export const warn = (key: string, message: string, data?: LogData): void => {
  throttledConsole('warn', key, message, data);
};

/**
 * Error with throttling
 */
export const error = (key: string, message: string, data?: LogData): void => {
  // Never throttle errors
  if (data && Object.keys(data).length > 0) {
    console.error(`[${key}] ${message}`, data);
  } else {
    console.error(`[${key}] ${message}`);
  }
};

/**
 * Info with throttling
 */
export const info = (key: string, message: string, data?: LogData): void => {
  throttledConsole('info', key, message, data);
};

/**
 * Conditionally log based on environment
 * Only logs in development or when debug is explicitly enabled
 */
export const devLog = (key: string, message: string, data?: LogData): void => {
  if (!isProduction() || isDebugEnabled()) {
    log(key, message, data);
  }
};

/**
 * Group console logs for better organization
 * @param {string} name - Group name
 * @param {Function} callback - Function containing logs
 */
export const logGroup = (name: string, callback: () => void): void => {
  if (isProduction() && !isDebugEnabled()) return;
  
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
  if (isProduction() && !isDebugEnabled()) {
    return callback();
  }
  
  console.time(`[Time] ${name}`);
  const result = callback();
  console.timeEnd(`[Time] ${name}`);
  return result;
};

/**
 * Enable debug logging (can be called from dev tools)
 */
export const enableDebugLogging = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('debug-enabled', 'true');
    console.log('[Debug] Debug logging enabled');
  }
};

/**
 * Disable debug logging (can be called from dev tools)
 */
export const disableDebugLogging = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('debug-enabled', 'false');
    console.log('[Debug] Debug logging disabled');
  }
};

// Expose debug controls globally in development
if (typeof window !== 'undefined' && !isProduction()) {
  (window as any).__debug = {
    enable: enableDebugLogging,
    disable: disableDebugLogging,
    log: log,
    clearLogs: () => console.clear()
  };
}
