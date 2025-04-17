
/**
 * Logger configuration
 * Controls logging levels and namespaces
 */

// Define log levels
export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4
}

// Store for log level configuration
interface LoggerConfig {
  global: LogLevel;
  namespaces: Record<string, LogLevel>;
  enabled: Record<string, boolean>;
}

// Default configuration
const config: LoggerConfig = {
  global: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  namespaces: {},
  enabled: {}
};

/**
 * Check if a specific log level is enabled for a namespace
 * @param namespace The logging namespace
 * @param level The log level to check
 * @returns Whether the log level is enabled
 */
export function isLevelEnabled(namespace: string, level: LogLevel): boolean {
  // Check if namespace is explicitly disabled
  if (config.enabled[namespace] === false) {
    return false;
  }
  
  // Get namespace-specific level or fall back to global
  const namespaceLevel = config.namespaces[namespace] ?? config.global;
  
  // Enable if requested level is less than or equal to configured level
  return level <= namespaceLevel;
}

/**
 * Set log level for a specific namespace
 * @param namespace The logging namespace
 * @param level The log level to set
 */
export function setNamespaceLevel(namespace: string, level: LogLevel): void {
  config.namespaces[namespace] = level;
  config.enabled[namespace] = true;
}

/**
 * Completely enable or disable a namespace
 * @param namespace The logging namespace
 * @param enabled Whether to enable the namespace
 */
export function setNamespaceEnabled(namespace: string, enabled: boolean): void {
  config.enabled[namespace] = enabled;
}

/**
 * Set global log level
 * @param level The log level to set globally
 */
export function setGlobalLevel(level: LogLevel): void {
  config.global = level;
}

/**
 * Enable or disable all debug logging
 * @param enabled Whether to enable all debug logging
 */
export function setGlobalDebug(enabled: boolean): void {
  config.global = enabled ? LogLevel.DEBUG : LogLevel.INFO;
}

// Expose configuration controls globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__logger = {
    setLevel: setNamespaceLevel,
    enable: setNamespaceEnabled,
    setGlobalLevel,
    setGlobalDebug,
    LogLevel
  };
}
