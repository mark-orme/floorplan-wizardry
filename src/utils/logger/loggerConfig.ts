
/**
 * Logger Configuration
 * Centralized control for logging behavior across the application
 */

// Log level definitions
export enum LogLevel {
  NONE = 0,    // No logging
  ERROR = 1,   // Only errors
  WARN = 2,    // Errors and warnings
  INFO = 3,    // Errors, warnings, and info
  DEBUG = 4    // All logs
}

// Module-specific log level configuration
export interface ModuleLogConfig {
  level: LogLevel;
  enabled: boolean;
}

// Default configuration
const defaultModuleConfig: ModuleLogConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  enabled: true
};

// Module-specific configurations
const moduleConfigs: Record<string, ModuleLogConfig> = {
  'line-tool': { 
    level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG, 
    enabled: true 
  },
  'grid': { 
    level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.INFO, 
    enabled: true 
  },
  'canvas': { 
    level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.INFO, 
    enabled: true 
  },
  'tools': { 
    level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.INFO, 
    enabled: true 
  }
};

// Get configuration for a specific module
export const getModuleConfig = (namespace: string): ModuleLogConfig => {
  return moduleConfigs[namespace] || defaultModuleConfig;
};

// Check if a log level is enabled for a module
export const isLevelEnabled = (namespace: string, level: LogLevel): boolean => {
  const config = getModuleConfig(namespace);
  return config.enabled && level <= config.level;
};

// Set log level for a specific module
export const setLogLevel = (namespace: string, level: LogLevel): void => {
  if (moduleConfigs[namespace]) {
    moduleConfigs[namespace].level = level;
  } else {
    moduleConfigs[namespace] = { ...defaultModuleConfig, level };
  }
};

// Enable/disable logging for a specific module
export const enableLogging = (namespace: string, enabled: boolean): void => {
  if (moduleConfigs[namespace]) {
    moduleConfigs[namespace].enabled = enabled;
  } else {
    moduleConfigs[namespace] = { ...defaultModuleConfig, enabled };
  }
};

// Global setting to disable all debug logging at once
export const setGlobalDebugLogging = (enabled: boolean): void => {
  Object.keys(moduleConfigs).forEach(namespace => {
    moduleConfigs[namespace].enabled = enabled;
  });
};

// Initialize development helper for console
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__logger = {
    setLevel: setLogLevel,
    enable: enableLogging,
    setGlobalDebug: setGlobalDebugLogging,
    getConfig: getModuleConfig,
    levels: LogLevel
  };
}
