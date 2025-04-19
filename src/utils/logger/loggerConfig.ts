
/**
 * Logger configuration
 * Controls log levels and namespace filtering
 */

// Define log levels
export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4
}

// In-memory log level settings per namespace
const logLevels: Record<string, LogLevel> = {
  app: LogLevel.INFO,
  grid: LogLevel.INFO,
  canvas: LogLevel.INFO,
  lineTool: LogLevel.INFO,
  performance: LogLevel.INFO
};

// Global debug mode override
let globalDebugMode = false;

/**
 * Check if a log level is enabled for a namespace
 * @param namespace - Logger namespace
 * @param level - Log level to check
 * @returns Whether logging at this level is enabled
 */
export function isLevelEnabled(namespace: string, level: LogLevel): boolean {
  // In development or when global debug is on, show everything
  if (globalDebugMode || import.meta.env.DEV) {
    return true;
  }
  
  // In production, only show logs that are at or below the configured level
  const configuredLevel = namespace in logLevels ? logLevels[namespace] : LogLevel.INFO;
  return level <= configuredLevel;
}

/**
 * Set the log level for a namespace
 * @param namespace - Logger namespace
 * @param level - Log level to set
 */
export function setLogLevel(namespace: string, level: LogLevel): void {
  logLevels[namespace] = level;
}

/**
 * Enable or disable all logging for a namespace
 * @param namespace - Logger namespace
 * @param enabled - Whether to enable logging
 */
export function enableNamespace(namespace: string, enabled: boolean): void {
  logLevels[namespace] = enabled ? LogLevel.DEBUG : LogLevel.NONE;
}

/**
 * Set global debug mode (enable all logs)
 * @param enabled - Whether to enable debug mode
 */
export function setGlobalDebug(enabled: boolean): void {
  globalDebugMode = enabled;
}

// Make controls available globally in development for debugging
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).__logger = {
    setLevel: setLogLevel,
    enable: enableNamespace,
    setGlobalDebug
  };
}
