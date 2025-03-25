
/**
 * Custom logger utility
 * Provides consistent logging with environment-based filtering
 * @module logger
 */

/**
 * Log level enum
 */
export enum LogLevel {
  /** Debug level logs (most verbose) */
  DEBUG = 0,
  
  /** Information level logs */
  INFO = 1,
  
  /** Warning level logs */
  WARN = 2,
  
  /** Error level logs */
  ERROR = 3,
  
  /** No logging */
  NONE = 4
}

/**
 * Default minimum log level based on environment
 */
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
  ? LogLevel.ERROR  // Only show errors in production
  : LogLevel.DEBUG; // Show all logs in development

/**
 * Current minimum log level
 */
let currentLogLevel = DEFAULT_LOG_LEVEL;

/**
 * Set the current log level
 * @param level - The new minimum log level
 */
export const setLogLevel = (level: LogLevel): void => {
  currentLogLevel = level;
};

/**
 * Get the current log level
 * @returns The current minimum log level
 */
export const getLogLevel = (): LogLevel => {
  return currentLogLevel;
};

/**
 * Check if a log level should be displayed
 * @param level - The log level to check
 * @returns Whether the log level should be displayed
 */
const shouldLog = (level: LogLevel): boolean => {
  return level >= currentLogLevel;
};

/**
 * Format current time for log messages
 * @returns Formatted time string
 */
const getTimeString = (): string => {
  return new Date().toISOString();
};

/**
 * Custom debug logger (only in development)
 * @param message - The message to log
 * @param optionalParams - Additional parameters to log
 */
export const debug = (message: any, ...optionalParams: any[]): void => {
  if (shouldLog(LogLevel.DEBUG)) {
    console.debug(`${getTimeString()} debug:`, message, ...optionalParams);
  }
};

/**
 * Custom info logger
 * @param message - The message to log
 * @param optionalParams - Additional parameters to log
 */
export const info = (message: any, ...optionalParams: any[]): void => {
  if (shouldLog(LogLevel.INFO)) {
    console.info(`${getTimeString()} info:`, message, ...optionalParams);
  }
};

/**
 * Custom warning logger
 * @param message - The message to log
 * @param optionalParams - Additional parameters to log
 */
export const warn = (message: any, ...optionalParams: any[]): void => {
  if (shouldLog(LogLevel.WARN)) {
    console.warn(`${getTimeString()} warn:`, message, ...optionalParams);
  }
};

/**
 * Custom error logger (always shown)
 * @param message - The message to log
 * @param optionalParams - Additional parameters to log
 */
export const error = (message: any, ...optionalParams: any[]): void => {
  if (shouldLog(LogLevel.ERROR)) {
    console.error(`${getTimeString()} error:`, message, ...optionalParams);
  }
};

/**
 * Logger object with all methods
 */
const logger = {
  debug,
  info,
  warn,
  error,
  setLogLevel,
  getLogLevel
};

export default logger;
